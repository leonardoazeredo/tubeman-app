"use server";

import { prisma } from "@/utils/prisma";
import { Result } from "@/types/shared";
import { InputJsonValue } from "@prisma/client/runtime/client";

import { generateUniqueSlug, mapZodErrors } from "@/utils/utilities";
import { fetchUserById } from "./userService";
import { Collection, CollectionSchema, User } from "../prisma/generated/zod";

export async function createCollection(
  _prevState: Result<Collection>,
  formData: FormData
): Promise<Result<Collection>> {
  try {
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
        errors: [
          {
            field: "general",
            message: `Missing required collection data.${userId}, ${collectionName}, ${channelHandle}, ${keywordsString}, ${videosString}, ${channelAvatarUrl}`,
          },
        ],
      };
    }
    console.log(
      userId,
      collectionName,
      channelHandle,
      keywordsString,
      videosString,
      channelAvatarUrl
    );
    const keywords = JSON.parse(keywordsString) as string[];
    const videos = JSON.parse(videosString);
    const channelId = channelHandle.replace(/^@/, "");

    const parsedData = CollectionSchema.safeParse({
      name: collectionName,
      userId,
      channelId,
      keywords,
      videos,
      channelAvatarUrl,
    });

    if (!parsedData.success) {
      return { success: false, errors: mapZodErrors(parsedData.error.errors) };
    }

    const user: User | null = await fetchUserById(userId);

    if (!user || !user.userName) {
      return {
        success: false,
        errors: [{ field: "general", message: "Invalid user data." }],
      };
    }
    const slug = await generateUniqueSlug(
      collectionName,
      user.id,
      user.userName
    );
    if (!slug) {
      return {
        success: false,
        errors: [{ field: "general", message: "Could not generate a slug." }],
      };
    }
    const newCollection: Collection = await prisma.collection.create({
      data: {
        ...parsedData.data, // Use the validated and transformed data
        slug,
      },
    });

    // const newCollection: Collection = await prisma.collection.create({
    //   data: {
    //     userId,
    //     name: collectionName,
    //     channelId,
    //     keywords,
    //     videos: videos,
    //     slug,
    //     channelAvatarUrl,
    //   },
    // });
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
export async function getCollectionBySlug(
  collectionSlug: string
): Promise<Result<Collection>> {
  try {
    const collection = await prisma.collection.findFirstOrThrow({
      where: { slug: collectionSlug },
    });

    return { success: true, data: collection };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error getting collection:", error);
    return {
      success: false,
      errors: [
        { field: "general", message: "Failed to get collection by slug." },
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
export async function getCollectionsByUserId(
  userId: string
): Promise<Result<Collection[]>> {
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
