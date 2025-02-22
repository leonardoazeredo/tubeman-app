import { prisma } from "@/utils/prisma";
import { Result } from "@/types/shared";
import { Collection } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/client";

export async function createCollection(
  userId: string,
  name: string,
  channelId: string,
  keywords: string[]
): Promise<Result<Collection>> {
  try {
    const newCollection = await prisma.collection.create({
      data: {
        userId,
        name,
        channelId,
        keywords,
        videos: [], // Initially empty videos array
      },
    });
    return { success: true, data: newCollection };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating collection:", error);
    return {
      success: false,
      errors: [{ field: "general", message: "Failed to create collection." }],
    };
  }
}

export async function getCollectionById(
  collectionId: string
): Promise<Result<Collection>> {
  try {
    const collection = await prisma.collection.findFirstOrThrow({
      where: { id: collectionId },
    });

    return { success: true, data: collection };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error getting collection:", error);
    return {
      success: false,
      errors: [
        { field: "general", message: "Failed to get collection by id." },
      ],
    };
  }
}

export async function getCollectionByUserId(
  userId: string
): Promise<Result<Collection>> {
  try {
    const collection = await prisma.collection.findFirstOrThrow({
      where: { userId: userId },
    });

    return { success: true, data: collection };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error getting collection:", error);
    return {
      success: false,
      errors: [
        { field: "general", message: "Failed to get collection by user id." },
      ],
    };
  }
}

export async function updateCollection(
  collectionId: string,
  name?: string,
  keywords?: string[],
  videos?: InputJsonValue[]
): Promise<Result<Collection>> {
  try {
    const collection = await prisma.collection.update({
      where: { id: collectionId },
      data: { name, keywords, videos },
    });

    return { success: true, data: collection };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error getting collection:", error);
    return {
      success: false,
      errors: [{ field: "general", message: "Failed to update collection." }],
    };
  }
}

export async function deleteCollection(
  collectionId: string
): Promise<Result<Collection>> {
  try {
    const collection = await prisma.collection.findFirstOrThrow({
      where: { id: collectionId },
    });

    return { success: true, data: collection };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error getting collection:", error);
    return {
      success: false,
      errors: [{ field: "general", message: "Failed to delete collection." }],
    };
  }
}
