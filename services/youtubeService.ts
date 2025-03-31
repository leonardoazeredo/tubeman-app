"use server";

import { youtube_v3 } from "@googleapis/youtube";
import { Result, Video, ValidationError } from "@/types/shared";
import { scrapeSearchParamsSchema } from "@/utils/zodSchemas";
import { mapZodErrors } from "@/utils/utilities";

// Initialize the YouTube Data API v3 client
const youtube = new youtube_v3.Youtube({
  auth: process.env.YOUTUBE_API_KEY,
  apiVersion: "v3",
});

// --- Helper Functions ---

/**
 * Checks if a text contains at least one of the specified keywords (case-insensitive, whole word).
 * Uses regular expressions with word boundaries to avoid partial matches.
 *
 * @param text - The text to search within (e.g., video title + description).
 * @param keywordsArray - An array of keywords to look for.
 * @returns True if at least one keyword is found, false otherwise.
 */
function containsKeywords(text: string, keywordsArray: string[]): boolean {
  // 1. Handle edge cases: no text or no keywords means no match.
  if (!text || keywordsArray.length === 0) {
    return false;
  }
  const lowerText = text.toLowerCase(); // Convert text to lowercase for case-insensitive search.

  // 2. Iterate through each keyword.
  return keywordsArray.some((keyword) => {
    // 2a. Skip empty keywords if they somehow exist in the array.
    if (!keyword) return false;
    // 2b. Escape any special regex characters within the keyword itself.
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // 2c. Create a regex to match the keyword as a whole word, case-insensitively (handled by lowercasing text).
    const regex = new RegExp(`\\b${escapedKeyword.toLowerCase()}\\b`);
    // 2d. Test if the regex matches the lowercase text.
    return regex.test(lowerText);
  }); // Return true if any keyword matches.
}

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
    // 1. Sanitize handle for API (remove leading '@').
    const handleForApi = channelHandle.replace(/^@/, "");

    // 2. Attempt to find channel using the `forUsername` parameter.
    const response = await youtube.channels.list({
      part: ["id", "snippet"],
      forUsername: handleForApi,
      maxResults: 1,
    });

    // 3. Process successful `forUsername` result.
    if (response.data.items && response.data.items.length > 0) {
      const item = response.data.items[0];
      const channelId = item.id ?? null;
      // Extract best available thumbnail URL.
      const channelAvatarUrl =
        item.snippet?.thumbnails?.high?.url ??
        item.snippet?.thumbnails?.medium?.url ??
        item.snippet?.thumbnails?.default?.url ??
        null;
      return { channelId, channelAvatarUrl };
    } else {
      // 4. If `forUsername` fails, attempt fallback using general search.
      console.warn(
        `No channel found via forUsername for handle: ${channelHandle}`
      );
      const searchResponse = await youtube.search.list({
        part: ["snippet"],
        q: channelHandle, // Use the handle as a search query.
        type: ["channel"], // Limit search to channels.
        maxResults: 1,
      });

      // 5. Process successful search fallback result.
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
    // 6. If both methods fail, return nulls.
    return { channelId: null, channelAvatarUrl: null };
  } catch (error: unknown) {
    // 7. Catch any API errors during the process.
    console.error(
      `Error fetching channel data for handle "${channelHandle}":`,
      error
    );
    return { channelId: null, channelAvatarUrl: null }; // Return nulls on error.
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
    // 1. Search for a channel using the handle as a query.
    const response = await youtube.search.list({
      part: ["snippet"],
      type: ["channel"],
      q: channelHandle.replace(/^@/, ""), // Sanitize handle.
      maxResults: 1,
    });

    // 2. Extract channel ID from the first result if found.
    if (response.data.items && response.data.items.length > 0) {
      const channelId = response.data.items[0].snippet?.channelId;
      return channelId || null;
    } else {
      // 3. Return null if no channel is found.
      return null;
    }
  } catch (error) {
    // 4. Catch API errors.
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

  // 1. Prepare keyword list for client-side filtering.
  const keywordsArray = keywords.split(" ").filter((k) => k.length > 0);

  try {
    // 2. Call YouTube Search API.
    const response = await youtube.search.list({
      part: ["snippet"],
      channelId: channelId,
      q: keywords, // API relevance search using keywords.
      type: ["video"],
      maxResults: 25, // Fetch a reasonable number for update checks.
      order: "date", // Prioritize newer videos.
      publishedAfter: publishedAfterISO, // API-level date filtering.
    });

    // 3. Handle API returning no items successfully.
    if (!response.data.items || response.data.items.length === 0) {
      console.log(
        `YouTube Service: No new items found via API for channel ${channelId}.`
      );
      return { success: true, data: [] };
    }

    // 4. Map API results to the shared `Video` type.
    const mappedVideos = response.data.items.map((item): Video | null => {
      const videoId = item.id?.videoId;
      const snippet = item.snippet;

      // 4a. Validate essential data points from the API response.
      if (!videoId || !snippet || !snippet.title || !snippet.publishedAt) {
        console.warn(
          "Skipping video item due to missing id, snippet, title, or publishedAt:",
          item.id
        );
        return null; // Mark for filtering.
      }
      // 4b. Validate and create Date object.
      const publishedDate = new Date(snippet.publishedAt);
      if (isNaN(publishedDate.getTime())) {
        console.warn(
          `Skipping video item due to invalid publishedAt date: ${snippet.publishedAt}`,
          item.id
        );
        return null; // Mark for filtering.
      }

      // 4c. Create the Video object conforming to the shared interface.
      return {
        id: videoId,
        title: snippet.title,
        url: videoId, // Store YouTube ID in 'url' field.
        description: snippet.description || "",
        thumbnailUrl:
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          snippet.thumbnails?.default?.url ||
          "",
        publishedAt: publishedDate,
      };
    });

    // 5. Perform client-side filtering:
    const videos: Video[] = mappedVideos.filter((video): video is Video => {
      // 5a. Remove items marked as null during mapping.
      if (video === null) return false;
      // 5b. Apply strict keyword filtering on title and description.
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
    // 6. Return success result with the filtered videos.
    return { success: true, data: videos };
  } catch (error: unknown) {
    // 7. Catch and handle potential errors.
    console.error(
      `Error fetching YouTube videos for channel ${channelId}:`,
      error
    );

    let message = "Failed to fetch videos from YouTube API."; // Default error message.

    // 7a. Attempt to extract a more specific error message using type narrowing.
    if (typeof error === "object" && error !== null) {
      if ("code" in error && typeof error.code === "number") {
        // Google API error structure
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
        // Standard JS Error
        message = error.message;
      }
    } else if (typeof error === "string") {
      // Plain string error
      message = error;
    }

    // 7b. Format and return the error result.
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
    // 1. Validate input parameters using Zod schema.
    const parsed = scrapeSearchParamsSchema.safeParse({
      channelHandle,
      keywords,
    });
    if (!parsed.success) {
      return { success: false, errors: mapZodErrors(parsed.error.errors) };
    }
    const { channelHandle: validHandle, keywords: validKeywords } = parsed.data;

    // 2. Prepare keyword list for client-side filtering.
    const keywordsArray = validKeywords.split(" ").filter((k) => k.length > 0);

    // 3. Get Channel ID and Avatar URL using the handle.
    const { channelId, channelAvatarUrl } = await getChannelDataFromHandle(
      validHandle
    );

    // 4. Handle channel not found error.
    if (!channelId) {
      return {
        success: false,
        errors: [
          { field: "channelHandle", message: "Channel not found via handle." },
        ],
      };
    }
    // 5. Handle missing avatar URL (log warning but continue).
    if (!channelAvatarUrl) {
      console.warn(
        `Channel avatar URL not found for handle: ${validHandle}. Proceeding without it.`
      );
    }

    // 6. Call YouTube Search API for initial video fetch.
    const response = await youtube.search.list({
      part: ["snippet"],
      channelId: channelId,
      q: validKeywords, // API relevance search.
      type: ["video"],
      maxResults: 10, // Limit initial fetch count.
      order: "date", // Consider 'relevance' depending on desired initial view.
    });

    // 7. Handle successful API call with no items found.
    if (!response.data.items || response.data.items.length === 0) {
      return {
        success: true,
        data: { videos: [], channelAvatarUrl: channelAvatarUrl || "" },
      };
    }

    // 8. Map API results to the shared `Video` type.
    const mappedVideos = response.data.items.map((item): Video | null => {
      const videoId = item.id?.videoId;
      const snippet = item.snippet;

      // 8a. Validate essential data.
      if (!videoId || !snippet || !snippet.title || !snippet.publishedAt) {
        console.warn(
          "Skipping initial video item due to missing data:",
          item.id
        );
        return null;
      }
      // 8b. Validate and create Date object.
      const publishedDate = new Date(snippet.publishedAt);
      if (isNaN(publishedDate.getTime())) {
        console.warn(
          `Skipping initial video item due to invalid date: ${snippet.publishedAt}`,
          item.id
        );
        return null;
      }

      // 8c. Create Video object.
      return {
        id: videoId,
        title: snippet.title,
        url: videoId, // Store YouTube ID in 'url' field.
        description: snippet.description || "",
        thumbnailUrl:
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          snippet.thumbnails?.default?.url ||
          "",
        publishedAt: publishedDate,
      };
    });

    // 9. Perform client-side filtering for nulls and keywords.
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
    // 10. Return success result with filtered videos and avatar URL.
    return {
      success: true,
      data: { videos: videoDetails, channelAvatarUrl: channelAvatarUrl || "" },
    };
  } catch (error: unknown) {
    // 11. Catch and handle potential errors.
    console.error(
      `Error in getVideosDataService for handle "${channelHandle}":`,
      error
    );

    let message =
      "An unexpected error occurred while fetching initial video data.";
    // 11a. Extract specific error message using type narrowing.
    if (typeof error === "object" && error !== null) {
      if (error instanceof Error) {
        message = error.message;
      }
      // Add more specific checks (e.g., Zod errors if they could slip through)
    } else if (typeof error === "string") {
      message = error;
    }

    // 11b. Format and return error result.
    const errors: ValidationError[] = [{ field: "general", message }];
    return { success: false, errors };
  }
}
