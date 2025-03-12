// app/actions/getVideosData.ts
"use server";

import { getVideosDataService } from "@/services/youtubeService";
import { Result, Video } from "@/types/shared";

export async function getVideosData(
  prevState: Result<{ videos: Video[]; channelAvatarUrl: string }>,
  formData: FormData
): Promise<Result<{ videos: Video[]; channelAvatarUrl: string }>> {
  return getVideosDataService(formData);
}
