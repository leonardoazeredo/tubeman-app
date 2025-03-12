import { Video } from "@/prisma/generated/zod";
import { Result } from "@/types/shared";
import { mapZodErrors } from "@/utils/utilities";
import { scrapeSearchParamsSchema } from "@/utils/zodSchemas";
import { youtube_v3 } from "@googleapis/youtube";

const youtube = new youtube_v3.Youtube({
  auth: process.env.YOUTUBE_API_KEY,
  apiVersion: "v3",
});

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
    console.log(response);

    if (response.data.items && response.data.items.length > 0) {
      const channelId = response.data.items[0].snippet?.channelId;
      return channelId || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching channel ID:", error);
    return null;
  }
}

async function getChannelDataFromHandle(
  channelHandle: string
): Promise<{ channelId: string; channelAvatarUrl: string }> {
  let channelId = "";
  let channelAvatarUrl = "";
  try {
    const response = await youtube.channels.list({
      part: ["id", "snippet"],
      forUsername: channelHandle,
    });

    if (response.data.items && response.data.items.length > 0) {
      channelId = response.data.items[0].id ?? "";
      channelAvatarUrl =
        response.data.items[0].snippet?.thumbnails?.high?.url ?? "";
    }
    return { channelId, channelAvatarUrl };
  } catch (error) {
    console.error("Error fetching channel ID from handle:", error);
    return { channelId, channelAvatarUrl };
  }
}

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

    const { channelId, channelAvatarUrl } = await getChannelDataFromHandle(
      validHandle
    );
    if (!channelId) {
      return {
        success: false,
        errors: [{ field: "channelHandle", message: "Channel not found." }],
      };
    }
    if (!channelAvatarUrl) {
      return {
        success: false,
        errors: [
          {
            field: "channelAvatarUrl",
            message: "Channel avatar URL not found.",
          },
        ],
      };
    }

    const response = await youtube.search.list({
      part: ["snippet"],
      channelId: channelId,
      q: validKeywords,
      type: ["video"],
      maxResults: 10,
    });

    if (!response.data.items) {
      return {
        success: false,
        errors: [{ field: "videoSearchResponse", message: "No video Found" }],
      };
    }

    const videoDetails: Video[] = response.data.items
      .map((item) => {
        const snippet = item.snippet;
        if (!snippet || !item.id?.videoId) {
          return null;
        }

        return {
          id: item.id.videoId,
          title: snippet.title || "No Title",
          description: snippet.description || "No Description",
          thumbnailUrl:
            snippet.thumbnails?.high?.url ||
            snippet.thumbnails?.medium?.url ||
            snippet.thumbnails?.default?.url ||
            "",
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        } as Video;
      })
      .filter(Boolean) as Video[];

    return {
      success: true,
      data: {
        videos: videoDetails,
        channelAvatarUrl,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Caught exception in getVideosData (API):", error);
    let message =
      "An unexpected error occurred while fetching videos from YouTube API.";

    if (error.response) {
      message = `YouTube API error: ${error.response.data.error.message} (Status ${error.response.status})`;
      if (error.response.status === 404) {
        message = "Channel not found.";
      } else if (error.response.status === 403) {
        message = "YouTube API Quota Exceeded or API key issue.";
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    return { success: false, errors: [{ field: "general", message }] };
  }
}
