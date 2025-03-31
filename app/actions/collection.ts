"use server";

import {
  createCollectionService,
  deleteCollectionService,
  updateCollectionService,
  updateSingleCollectionVideos,
} from "@/services/collectionService";
import { Result } from "@/types/shared";
import type { CollectionWithRelations } from "@/services/collectionService";
import { z } from "zod";
import { videoSchema } from "@/utils/zodSchemas";

export async function createCollectionAction(
  prevState: Result<CollectionWithRelations>,
  formData: FormData
): Promise<Result<CollectionWithRelations>> {
  const collectionName = formData.get("collectionName")?.toString();
  const userId = formData.get("userId")?.toString();
  const channelHandle = formData.get("channelHandle")?.toString();
  const keywordsString = formData.get("keywords")?.toString();
  const videosString = formData.get("videos")?.toString();
  const channelAvatarUrl = formData.get("channelAvatarUrl")?.toString();

  if (
    !userId ||
    !collectionName ||
    !channelHandle ||
    !keywordsString ||
    !videosString ||
    !channelAvatarUrl
  ) {
    return {
      success: false,
      errors: [{ field: "general", message: "Missing required fields." }],
    };
  }

  let keywords: string[] = [];
  try {
    keywords = JSON.parse(keywordsString || "[]");
    if (!Array.isArray(keywords)) {
      throw new Error("Keywords must be an array");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return {
      success: false,
      errors: [
        {
          field: "keywords",
          message: "Invalid keywords format. Must be a JSON array of strings.",
        },
      ],
    };
  }

  let videos: z.infer<typeof videoSchema>[] = [];
  try {
    videos = JSON.parse(videosString || "[]");
    if (!Array.isArray(videos)) {
      throw new Error("Videos must be an array");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return {
      success: false,
      errors: [
        {
          field: "videos",
          message: "Invalid videos format.  Must be a JSON array.",
        },
      ],
    };
  }

  return createCollectionService(
    userId,
    collectionName,
    channelHandle,
    channelAvatarUrl,
    keywords,
    videos
  );
}

export async function updateCollectionAction(
  prevState: Result<CollectionWithRelations>,
  formData: FormData
): Promise<Result<CollectionWithRelations>> {
  const collectionName = formData.get("collectionName")?.toString();
  const collectionId = formData.get("collectionId")?.toString();
  const keywordsString = formData.get("keywords")?.toString();
  const videosString = formData.get("videos")?.toString();
  if (!collectionId) {
    return {
      success: false,
      errors: [{ field: "general", message: "Collection ID is required." }],
    };
  }

  let keywords: string[] | undefined;
  if (keywordsString) {
    try {
      keywords = JSON.parse(keywordsString);
      if (!Array.isArray(keywords)) {
        throw new Error("Keywords must be an array");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      // Use _ to ignore the error
      return {
        success: false,
        errors: [
          {
            field: "keywords",
            message:
              "Invalid keywords format. Must be a JSON array of strings.",
          },
        ],
      };
    }
  }

  let videos: z.infer<typeof videoSchema>[] | undefined;
  if (videosString) {
    try {
      videos = JSON.parse(videosString);
      if (!Array.isArray(videos)) {
        throw new Error("Videos must be an array");
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        errors: [
          {
            field: "videos",
            message: "Invalid videos format.  Must be a JSON array.",
          },
        ],
      };
    }
  }
  return updateCollectionService(collectionId, collectionName, keywords);
}

export async function doDeleteCollectionAction(
  prevState: Result<CollectionWithRelations>,
  formData: FormData
): Promise<Result<CollectionWithRelations>> {
  const collectionId = formData.get("collectionId")?.toString();

  if (!collectionId) {
    return {
      success: false,
      errors: [{ field: "general", message: "Collection ID is required." }],
    };
  }

  return deleteCollectionService(collectionId);
}

export async function checkForUpdatesAction(
  prevState: Result<CollectionWithRelations>,
  formData: FormData
): Promise<Result<CollectionWithRelations>> {
  const collectionId = formData.get("collectionId")?.toString();

  if (!collectionId) {
    return {
      success: false,
      errors: [{ field: "collectionId", message: "Collection ID is missing." }],
    };
  }

  return updateSingleCollectionVideos(collectionId);
}
