"use server";

import { getVideosDataService } from "@/services/youtubeService";
import { Result, Video } from "@/types/shared";

export async function getVideosDataAction(
  prevState: Result<{ videos: Video[]; channelAvatarUrl: string }>,
  formData: FormData
): Promise<Result<{ videos: Video[]; channelAvatarUrl: string }>> {
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

  return getVideosDataService(channelHandle, keywords);
}
