// app/actions/collection.ts
"use server";

import {
  createCollectionService,
  deleteCollectionService,
  updateCollectionService,
} from "@/services/collectionService";
import { Result } from "@/types/shared";
import type { CollectionWithRelations } from "@/services/collectionService";
import { z } from "zod";
import { videoSchema } from "@/utils/zodSchemas";

export async function createCollectionAction(
  prevState: Result<CollectionWithRelations>,
  formData: FormData
): Promise<Result<CollectionWithRelations>> {
  // Basic presence checks (optional, but recommended)

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
  // Parse keywords and videos (assuming they are JSON strings)
  let keywords: string[] = [];
  try {
    keywords = JSON.parse(keywordsString);
    if (!Array.isArray(keywords)) {
      throw new Error("Keywords must be an array");
    }
  } catch (_) {
    // Use _ to ignore the error object
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

  let videos: z.infer<typeof videoSchema>[] = []; // Use the videoSchema
  try {
    videos = JSON.parse(videosString);
    if (!Array.isArray(videos)) {
      throw new Error("Videos must be an array");
    }
  } catch (_) {
    // Use _ to ignore the error object
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
  ); // Delegate to the service function
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
  // Parse keywords and videos (assuming they are JSON strings)
  let keywords: string[] | undefined;
  if (keywordsString) {
    try {
      keywords = JSON.parse(keywordsString);
      if (!Array.isArray(keywords)) {
        throw new Error("Keywords must be an array");
      }
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
    } catch (_) {
      // Use _ to ignore the error
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
  return updateCollectionService(
    collectionId,
    collectionName,
    keywords,
    videos
  );
}

export async function doDeleteCollectionAction(
  prevState: Result<CollectionWithRelations>, // Correct type
  formData: FormData
): Promise<Result<CollectionWithRelations>> {
  // Correct type
  const collectionId = formData.get("collectionId")?.toString();

  if (!collectionId) {
    return {
      success: false,
      errors: [{ field: "general", message: "Collection ID is required." }],
    };
  }

  return deleteCollectionService(collectionId); // Await the result
}
