import { prisma } from "@/utils/prisma";
import { Result } from "@/types/shared";
import { InputJsonValue } from "@prisma/client/runtime/client";
import { DbCollection } from "@/types/db";

export async function createCollection(
  _prevState: Result<DbCollection>,
  formData: FormData
): Promise<Result<DbCollection>> {
  try {
    const name = formData.get("collectionName")?.toString();
    const userId = formData.get("userId")?.toString();
    const channelHandle = formData.get("channelHandle")?.toString();
    const keywordsString = formData.get("keywords")?.toString();
    const videosString = formData.get("videos")?.toString();

    if (
      !userId ||
      !name ||
      !channelHandle ||
      !keywordsString ||
      !videosString
    ) {
      return {
        success: false,
        errors: [
          {
            field: "general",
            message: `Missing required collection data.${userId}, ${name}, ${channelHandle}, ${keywordsString}, ${videosString}`,
          },
        ],
      };
    }
    console.log(userId, name, channelHandle, keywordsString, videosString);
    const keywords = JSON.parse(keywordsString) as string[];
    const videos = JSON.parse(videosString) as InputJsonValue[];
    const channelId = channelHandle.replace(/^@/, "");

    if (!Array.isArray(keywords) || !Array.isArray(videos)) {
      return {
        success: false,
        errors: [
          { field: "general", message: "Invalid keywords or videos data." },
        ],
      };
    }

    const newCollection = await prisma.collection.create({
      data: {
        userId,
        name,
        channelId,
        keywords,
        videos: videos,
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
): Promise<Result<DbCollection>> {
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
): Promise<Result<DbCollection>> {
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
export async function getCollectionsByUserId(
  userId: string
): Promise<Result<DbCollection[]>> {
  try {
    const collections = await prisma.collection.findMany({
      where: { userId: userId },
    });

    return { success: true, data: collections };
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
): Promise<Result<DbCollection>> {
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
): Promise<Result<DbCollection>> {
  try {
    const collection = await prisma.collection.delete({
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
