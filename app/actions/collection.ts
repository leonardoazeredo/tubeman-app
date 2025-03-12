"use server";

import {
  createCollectionService,
  deleteCollectionService,
  updateCollectionService,
} from "@/services/collectionService";
import { Result } from "@/types/shared";
import { Collection } from "@prisma/client";

export async function createCollectionAction(
  prevState: Result<Collection>,
  formData: FormData
): Promise<Result<Collection>> {
  const collectionName = formData.get("collectionName")?.toString();
  const userId = formData.get("userId")?.toString();
  const channelHandle = formData.get("channelHandle")?.toString();
  const keywords = formData.get("keywords")?.toString();
  const videos = formData.get("videos")?.toString();
  const channelAvatarUrl = formData.get("channelAvatarUrl")?.toString();

  if (
    !collectionName ||
    !userId ||
    !channelHandle ||
    !keywords ||
    !videos ||
    !channelAvatarUrl
  ) {
    return {
      success: false,
      errors: [{ field: "general", message: "Missing required fields." }],
    };
  }

  return createCollectionService(
    collectionName,
    userId,
    channelHandle,
    keywords,
    videos,
    channelAvatarUrl
  );
}

export async function updateCollectionAction(
  prevState: Result<Collection>,
  formData: FormData
): Promise<Result<Collection>> {
  const collectionName = formData.get("collectionName")?.toString();
  const collectionId = formData.get("collectionId")?.toString();

  if (!collectionName || !collectionId) {
    return {
      success: false,
      errors: [
        { field: "general", message: "Collection name and ID are required." },
      ],
    };
  }

  return updateCollectionService(collectionName, collectionId);
}

export async function deleteCollectionAction(
  prevState: Result<Collection>,
  formData: FormData
): Promise<Result<Collection>> {
  const collectionId = formData.get("collectionId")?.toString();

  if (!collectionId) {
    return {
      success: false,
      errors: [{ field: "general", message: "Collection ID is required." }],
    };
  }

  return await deleteCollectionService(collectionId);
}
