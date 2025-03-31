"use server";

import { youtube_v3 } from "@googleapis/youtube";
import { Result, Video, ValidationError } from "@/types/shared";
import { scrapeSearchParamsSchema } from "@/utils/zodSchemas";
import { containsKeywords, mapZodErrors } from "@/utils/utilities";

// Initialize the YouTube Data API v3 client
const youtube = new youtube_v3.Youtube({
  auth: process.env.YOUTUBE_API_KEY,
  apiVersion: "v3",
});

/**
 * Attempts to fetch Channel ID and high-resolution Avatar URL based on a channel handle (username).
 * Includes a fallback mechanism using general search if `forUsername` fails.
 * Note: The `forUsername` parameter in the YouTube API can sometimes be less reliable than direct ID lookups.
 *
 * @param channelHandle - The YouTube channel handle (e.g., "@channelname" or "channelname").
 * @returns A promise resolving to an object containing the channelId and channelAvatarUrl (or nulls if not found or on error).
 */
async function getChannelDataFromHandle(
  channelHandle: string
): Promise<{ channelId: string | null; channelAvatarUrl: string | null }> {
  try {
    const handleForApi = channelHandle.replace(/^@/, "");

    const response = await youtube.channels.list({
      part: ["id", "snippet"],
      forUsername: handleForApi,
      maxResults: 1,
    });

    if (response.data.items && response.data.items.length > 0) {
      const item = response.data.items[0];
      const channelId = item.id ?? null;

      const channelAvatarUrl =
        item.snippet?.thumbnails?.high?.url ??
        item.snippet?.thumbnails?.medium?.url ??
        item.snippet?.thumbnails?.default?.url ??
        null;
      return { channelId, channelAvatarUrl };
    } else {
      console.warn(
        `No channel found via forUsername for handle: ${channelHandle}`
      );
      const searchResponse = await youtube.search.list({
        part: ["snippet"],
        q: channelHandle,
        type: ["channel"],
        maxResults: 1,
      });

      if (searchResponse.data.items && searchResponse.data.items.length > 0) {
        const searchItem = searchResponse.data.items[0];
        const channelId = searchItem.snippet?.channelId ?? null;
        const channelAvatarUrl =
          searchItem.snippet?.thumbnails?.high?.url ??
          searchItem.snippet?.thumbnails?.medium?.url ??
          searchItem.snippet?.thumbnails?.default?.url ??
          null;
        console.log(
          `Found channel via search fallback for handle: ${channelHandle}`
        );
        return { channelId, channelAvatarUrl };
      }
    }

    return { channelId: null, channelAvatarUrl: null };
  } catch (error: unknown) {
    console.error(
      `Error fetching channel data for handle "${channelHandle}":`,
      error
    );
    return { channelId: null, channelAvatarUrl: null };
  }
}

/**
 * Fetches a Channel ID using the YouTube search API based on a handle.
 * This is generally less reliable than `getChannelDataFromHandle` which uses `forUsername` first.
 * Consider using only as a fallback if needed.
 *
 * @param channelHandle - The YouTube channel handle (e.g., "@channelname" or "channelname").
 * @returns A promise resolving to the channel ID string or null if not found or on error.
 */
export async function getChannelId(
  channelHandle: string
): Promise<string | null> {
  try {
    const response = await youtube.search.list({
      part: ["snippet"],
      type: ["channel"],
      q: channelHandle.replace(/^@/, ""),
      maxResults: 1,
    });

    if (response.data.items && response.data.items.length > 0) {
      const channelId = response.data.items[0].snippet?.channelId;
      return channelId || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      `Error fetching channel ID via search for "${channelHandle}":`,
      error
    );
    return null;
  }
}

// --- Exported Service Functions ---

/**
 * Fetches videos published after a certain date for a given channel and keywords from the YouTube API.
 * It first uses the API's relevance search (`q` parameter) and then performs a stricter
 * client-side filtering to ensure results contain at least one keyword in the title or description.
 *
 * @param channelId - The ID of the YouTube channel to search within.
 * @param keywords - A space-separated string of keywords to search for.
 * @param publishedAfterISO - An optional ISO 8601 date string. Only videos published after this date will be returned by the API.
 * @returns A promise resolving to a Result object containing an array of matching Video objects on success, or errors on failure.
 */
export async function fetchVideosPublishedAfter(
  channelId: string,
  keywords: string,
  publishedAfterISO?: string
): Promise<Result<Video[]>> {
  console.log(
    `YouTube Service: Fetching for Channel: ${channelId}, Keywords: "${keywords}", After: ${
      publishedAfterISO || "N/A"
    }`
  );

  const keywordsArray = keywords.split(" ").filter((k) => k.length > 0);

  try {
    const response = await youtube.search.list({
      part: ["snippet"],
      channelId: channelId,
      q: keywords,
      type: ["video"],
      maxResults: 25,
      order: "date",
      publishedAfter: publishedAfterISO,
    });

    if (!response.data.items || response.data.items.length === 0) {
      console.log(
        `YouTube Service: No new items found via API for channel ${channelId}.`
      );
      return { success: true, data: [] };
    }

    const mappedVideos = response.data.items.map((item): Video | null => {
      const videoId = item.id?.videoId;
      const snippet = item.snippet;

      if (!videoId || !snippet || !snippet.title || !snippet.publishedAt) {
        console.warn(
          "Skipping video item due to missing id, snippet, title, or publishedAt:",
          item.id
        );
        return null;
      }

      const publishedDate = new Date(snippet.publishedAt);
      if (isNaN(publishedDate.getTime())) {
        console.warn(
          `Skipping video item due to invalid publishedAt date: ${snippet.publishedAt}`,
          item.id
        );
        return null;
      }

      return {
        id: videoId,
        title: snippet.title,
        url: videoId,
        description: snippet.description || "",
        thumbnailUrl:
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          snippet.thumbnails?.default?.url ||
          "",
        publishedAt: publishedDate,
      };
    });

    const videos: Video[] = mappedVideos.filter((video): video is Video => {
      if (video === null) return false;

      return containsKeywords(
        `${video.title} ${video.description}`,
        keywordsArray
      );
    });

    console.log(
      `YouTube Service: Found ${
        response.data.items.length
      } potential videos, filtered to ${
        videos.length
      } matching keywords [${keywordsArray.join(", ")}].`
    );

    return { success: true, data: videos };
  } catch (error: unknown) {
    console.error(
      `Error fetching YouTube videos for channel ${channelId}:`,
      error
    );

    let message = "Failed to fetch videos from YouTube API.";

    if (typeof error === "object" && error !== null) {
      if ("code" in error && typeof error.code === "number") {
        message = `YouTube API Error (Code: ${error.code})`;
        if (
          "errors" in error &&
          Array.isArray(error.errors) &&
          error.errors.length > 0
        ) {
          const firstError = error.errors[0];
          if (
            typeof firstError === "object" &&
            firstError !== null &&
            "message" in firstError &&
            typeof firstError.message === "string"
          ) {
            message = `YouTube API Error: ${firstError.message} (Code: ${error.code})`;
          }
        } else if ("message" in error && typeof error.message === "string") {
          message = `${error.message} (Code: ${error.code})`;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
    } else if (typeof error === "string") {
      message = error;
    }

    const errors: ValidationError[] = [{ field: "youtubeApi", message }];
    return { success: false, errors };
  }
}

/**
 * Fetches initial video data (up to 10 videos) and channel information for creating a new collection.
 * Uses channel handle to find the channel, then searches for videos based on keywords.
 * Performs strict client-side filtering on keywords in title/description.
 *
 * @param channelHandle - The YouTube channel handle (e.g., "@channelname").
 * @param keywords - A space-separated string of keywords.
 * @returns A promise resolving to a Result object containing videos and avatar URL on success, or errors on failure.
 */
export async function getVideosDataService(
  channelHandle: string,
  keywords: string
): Promise<Result<{ videos: Video[]; channelAvatarUrl: string }>> {
  try {
    const parsed = scrapeSearchParamsSchema.safeParse({
      channelHandle,
      keywords,
    });
    if (!parsed.success) {
      return { success: false, errors: mapZodErrors(parsed.error.errors) };
    }
    const { channelHandle: validHandle, keywords: validKeywords } = parsed.data;

    const keywordsArray = validKeywords.split(" ").filter((k) => k.length > 0);

    const { channelId, channelAvatarUrl } = await getChannelDataFromHandle(
      validHandle
    );

    if (!channelId) {
      return {
        success: false,
        errors: [
          { field: "channelHandle", message: "Channel not found via handle." },
        ],
      };
    }

    if (!channelAvatarUrl) {
      console.warn(
        `Channel avatar URL not found for handle: ${validHandle}. Proceeding without it.`
      );
    }

    const response = await youtube.search.list({
      part: ["snippet"],
      channelId: channelId,
      q: validKeywords,
      type: ["video"],
      maxResults: 10,
      order: "date",
    });

    if (!response.data.items || response.data.items.length === 0) {
      return {
        success: true,
        data: { videos: [], channelAvatarUrl: channelAvatarUrl || "" },
      };
    }

    const mappedVideos = response.data.items.map((item): Video | null => {
      const videoId = item.id?.videoId;
      const snippet = item.snippet;

      if (!videoId || !snippet || !snippet.title || !snippet.publishedAt) {
        console.warn(
          "Skipping initial video item due to missing data:",
          item.id
        );
        return null;
      }

      const publishedDate = new Date(snippet.publishedAt);
      if (isNaN(publishedDate.getTime())) {
        console.warn(
          `Skipping initial video item due to invalid date: ${snippet.publishedAt}`,
          item.id
        );
        return null;
      }

      return {
        id: videoId,
        title: snippet.title,
        url: videoId,
        description: snippet.description || "",
        thumbnailUrl:
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          snippet.thumbnails?.default?.url ||
          "",
        publishedAt: publishedDate,
      };
    });

    const videoDetails: Video[] = mappedVideos.filter(
      (video): video is Video => {
        if (video === null) return false;
        return containsKeywords(
          `${video.title} ${video.description}`,
          keywordsArray
        );
      }
    );

    console.log(
      `YouTube Service Initial Fetch: Found ${
        response.data.items.length
      } potential videos, filtered to ${
        videoDetails.length
      } matching keywords [${keywordsArray.join(", ")}].`
    );

    return {
      success: true,
      data: { videos: videoDetails, channelAvatarUrl: channelAvatarUrl || "" },
    };
  } catch (error: unknown) {
    console.error(
      `Error in getVideosDataService for handle "${channelHandle}":`,
      error
    );

    let message =
      "An unexpected error occurred while fetching initial video data.";

    if (typeof error === "object" && error !== null) {
      if (error instanceof Error) {
        message = error.message;
      }
    } else if (typeof error === "string") {
      message = error;
    }

    const errors: ValidationError[] = [{ field: "general", message }];
    return { success: false, errors };
  }
}
