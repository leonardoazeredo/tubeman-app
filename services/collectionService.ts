"use server";

import { prisma } from "@/utils/prisma";
import { mapZodErrors, generateUniqueSlug } from "@/utils/utilities";
import { Result } from "@/types/shared";

import { Collection } from "../prisma/generated/zod";
import { fetchUserById } from "./userService";
import {
  createCollectionSchema,
  deleteCollectionSchema,
  updateCollectionSchema,
} from "@/utils/zodSchemas";

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
      include: {
        collectionKeywords: {
          include: { keyword: true },
        },
        collectionVideos: {
          include: { video: true },
        },
      },
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

export async function updateCollectionService(
  collectionId: string,
  collectionName: string
): Promise<Result<Collection>> {
  const validationResult = updateCollectionSchema.safeParse({
    collectionId,
    collectionName,
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: mapZodErrors(validationResult.error.errors),
    };
  }

  try {
    const collection = await prisma.collection.update({
      where: { id: validationResult.data.collectionId },
      data: { name: validationResult.data.collectionName },
      include: {
        channel: true,
        collectionKeywords: { include: { keyword: true } },
        collectionVideos: { include: { video: true } },
      },
    });
    return { success: true, data: collection };
  } catch (error) {
    console.error("Error updating collection name:", error);
    let message = "Failed to update collection name.";
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, errors: [{ field: "general", message }] };
  }
}

export async function deleteCollectionService(
  collectionId: string
): Promise<Result<Collection>> {
  const validationResult = deleteCollectionSchema.safeParse({ collectionId });

  if (!validationResult.success) {
    return {
      success: false,
      errors: mapZodErrors(validationResult.error.errors),
    };
  }

  try {
    const collection = await prisma.collection.delete({
      where: { id: validationResult.data.collectionId },
      include: {
        channel: true,
        collectionKeywords: { include: { keyword: true } },
        collectionVideos: { include: { video: true } },
      },
    });

    return { success: true, data: collection };
  } catch (error) {
    console.error("Error deleting collection:", error);
    let message = "Failed to delete collection";
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, errors: [{ field: "general", message }] };
  }
}

export async function createCollectionService(
  collectionName: string,
  userId: string,
  channelHandle: string,
  channelAvatarUrl: string,
  keywords: string,
  videos: string
): Promise<Result<Collection>> {
  try {
    const validatedData = createCollectionSchema.safeParse({
      userId,
      collectionName,
      channelHandle,
      channelAvatarUrl,
      keywords: JSON.parse(keywords || "[]"),
      videos: JSON.parse(videos || "[]"),
    });

    if (!validatedData.success) {
      return {
        success: false,
        errors: mapZodErrors(validatedData.error.errors),
      };
    }

    const user = await fetchUserById(validatedData.data.userId);
    if (!user || !user.userName) {
      return {
        success: false,
        errors: [{ field: "general", message: "Invalid user data." }],
      };
    }

    const slug = await generateUniqueSlug(
      validatedData.data.collectionName,
      user.id,
      user.userName
    );
    if (!slug) {
      return {
        success: false,
        errors: [{ field: "general", message: "Could not generate a slug." }],
      };
    }

    // Upsert the Channel
    await prisma.channel.upsert({
      where: { channelId: validatedData.data.channelHandle },
      update: {
        channelAvatarUrl: validatedData.data.channelAvatarUrl,
        userId: user.id,
      },
      create: {
        channelId: validatedData.data.channelHandle,
        name: validatedData.data.channelHandle, // Using channelHandle as name
        channelAvatarUrl: validatedData.data.channelAvatarUrl,
        userId: user.id,
      },
    });

    // Create the Collection with includes
    const newCollection = await prisma.collection.create({
      data: {
        userId: validatedData.data.userId,
        name: validatedData.data.collectionName,
        channelId: validatedData.data.channelHandle,
        slug,
        collectionKeywords: {
          create: validatedData.data.keywords.map((keywordText) => ({
            keyword: {
              connectOrCreate: {
                where: { text: keywordText },
                create: { text: keywordText },
              },
            },
          })),
        },
        collectionVideos: {
          create: validatedData.data.videos.map((video) => ({
            video: {
              connectOrCreate: {
                where: { id: video.id },
                create: {
                  id: video.id,
                  title: video.title,
                  url: video.url,
                  thumbnailUrl: video.thumbnailUrl,
                  description: video.description,
                  channelId: validatedData.data.channelHandle,
                },
              },
            },
          })),
        },
      },
      include: {
        channel: true,
        collectionKeywords: { include: { keyword: true } },
        collectionVideos: { include: { video: true } },
      },
    });

    return { success: true, data: newCollection };
  } catch (error) {
    console.error("Error creating collection:", error);
    let message = "Failed to create collection.";
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, errors: [{ field: "general", message }] };
  }
}
