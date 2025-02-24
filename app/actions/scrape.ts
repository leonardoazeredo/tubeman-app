// ../tubeman-app/app/actions/scrape.ts
"use server";

import { Result, Video } from "@/types/shared";
import { mapZodErrors } from "@/utils/utilities";
import { scrapeSearchParamsSchema } from "@/utils/zodSchemas";
import { youtube_v3 } from "@googleapis/youtube";

// Initialize YouTube API client (outside the function for efficiency - if possible in server actions, or initialize per action call)
const youtube = new youtube_v3.Youtube({
  auth: process.env.YOUTUBE_API_KEY,
  apiVersion: "v3",
});

async function getChannelIdFromHandle(
  channelHandle: string
): Promise<string | null> {
  try {
    const response = await youtube.channels.list({
      part: ["id"],
      forUsername: channelHandle, // Note: 'forUsername' uses the *handle*
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[0].id || null;
    } else {
      return null; // Channel not found for this handle
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching channel ID from handle:", error);
    return null;
  }
}

export async function scrapeVideos(
  _state: Result<Video[]>,
  formData: FormData
): Promise<Result<Video[]>> {
  try {
    const channelHandle = formData.get("channelHandle")?.toString();
    const keywords = formData.get("keywords")?.toString();

    if (!channelHandle || !keywords) {
      return {
        success: false,
        errors: [
          {
            field: "general",
            message: "Channel handle and keywords are required.",
          },
        ],
      };
    }

    const parsed = scrapeSearchParamsSchema.safeParse({
      channelHandle,
      keywords,
    });

    if (!parsed.success) {
      return { success: false, errors: mapZodErrors(parsed.error.errors) };
    }

    const { channelHandle: validHandle, keywords: validKeywords } = parsed.data;

    const channelId = await getChannelIdFromHandle(validHandle);
    if (!channelId) {
      return {
        success: false,
        errors: [{ field: "channelHandle", message: "Channel not found." }],
      };
    }

    const response = await youtube.search.list({
      part: ["snippet"], // We need snippet for title, description, thumbnails
      channelId: channelId,
      q: validKeywords,
      type: ["video"], // We only want videos
      maxResults: 10, // Adjust as needed, API allows up to 50
    });

    if (!response.data.items) {
      return { success: true, data: [] }; // No videos found, return empty array
    }

    const videoDetails: Video[] = response.data.items
      .map((item) => {
        const snippet = item.snippet;
        if (!snippet || !item.id?.videoId) {
          return null; // Skip items without snippet or videoId
        }

        return {
          id: item.id.videoId,
          title: snippet.title || "No Title",
          description: snippet.description || "No Description",
          thumbnailUrl:
            snippet.thumbnails?.high?.url ||
            snippet.thumbnails?.medium?.url ||
            snippet.thumbnails?.default?.url ||
            "", // Get highest quality thumbnail available
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        } as Video;
      })
      .filter(Boolean) as Video[]; // Filter out null values from map

    return { success: true, data: videoDetails };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Caught exception in scrapeVideos (API):", error);
    let message =
      "An unexpected error occurred while fetching videos from YouTube API.";

    if (error.response) {
      // YouTube API error (e.g., quota exceeded, invalid API key)
      message = `YouTube API error: ${error.response.data.error.message} (Status ${error.response.status})`;
      if (error.response.status === 404) {
        message = "Channel not found."; // Specific 404 handling if needed, though channel ID resolution should handle this
      } else if (error.response.status === 403) {
        message = "YouTube API Quota Exceeded or API key issue.";
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    return { success: false, errors: [{ field: "general", message }] };
  }
}
