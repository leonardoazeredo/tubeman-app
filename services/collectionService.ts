"use server";

import { prisma } from "@/utils/prisma";
import { mapZodErrors, generateUniqueSlug } from "@/utils/utilities";
import { Result } from "@/types/shared";

import { fetchUserById } from "./userService";
import {
  createCollectionSchema,
  deleteCollectionSchema,
  updateCollectionSchema,
  videoSchema,
} from "@/utils/zodSchemas";
import { Prisma } from "@prisma/client";
import { getChannelId } from "./youtubeService";
import { z } from "zod";

export type CollectionWithRelations = Prisma.CollectionGetPayload<{
  include: {
    channel: true;
    collectionKeywords: { include: { keyword: true } };
    collectionVideos: { include: { video: true } };
  };
}>;

export async function getCollectionById(
  collectionId: string
): Promise<Result<CollectionWithRelations>> {
  try {
    const collection = await prisma.collection.findFirstOrThrow({
      where: { id: collectionId },
      include: {
        channel: true,
        collectionKeywords: {
          include: { keyword: true },
        },
        collectionVideos: {
          include: { video: true },
        },
      },
    });

    return { success: true, data: collection };
  } catch (error) {
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
): Promise<Result<CollectionWithRelations>> {
  try {
    const collection = await prisma.collection.findFirstOrThrow({
      where: { slug: collectionSlug },
      include: {
        channel: true,
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
  } catch (error) {
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
): Promise<Result<CollectionWithRelations>> {
  try {
    const collection = await prisma.collection.findFirstOrThrow({
      where: { userId: userId },
      include: {
        channel: true,
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
  } catch (error) {
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
): Promise<Result<CollectionWithRelations[]>> {
  try {
    const collections = await prisma.collection.findMany({
      where: { userId: userId },
      include: {
        channel: true,
        collectionKeywords: {
          include: { keyword: true },
        },
        collectionVideos: {
          include: { video: true },
        },
      },
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

export async function createCollectionService(
  userId: string,
  collectionName: string,
  channelHandle: string,
  channelAvatarUrl: string,
  keywords: string[],
  videos: z.infer<typeof videoSchema>[]
): Promise<Result<CollectionWithRelations>> {
  try {
    const channelId = await getChannelId(channelHandle);
    if (!channelId) {
      return {
        success: false,
        errors: [
          { field: "channelHandle", message: "YouTube channel not found." },
        ],
      };
    }

    const validatedData = createCollectionSchema.safeParse({
      userId,
      collectionName,
      channelId,
      keywords,
      videos,
      channelAvatarUrl,
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

    const channel = await prisma.channel.upsert({
      where: { channelId: validatedData.data.channelId },
      update: {
        channelAvatarUrl: validatedData.data.channelAvatarUrl,
        userId: user.id,
        name: channelHandle,
      },
      create: {
        channelId: validatedData.data.channelId,
        name: channelHandle,
        channelAvatarUrl: validatedData.data.channelAvatarUrl,
        userId: user.id,
      },
    });

    const newCollection = await prisma.collection.create({
      data: {
        userId: validatedData.data.userId,
        name: validatedData.data.collectionName,
        channelId: validatedData.data.channelId,
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
                  channelId: validatedData.data.channelId,
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

export async function updateCollectionService(
  collectionId: string,
  collectionName?: string,
  keywords?: string[],
  videos?: z.infer<typeof videoSchema>[]
): Promise<Result<CollectionWithRelations>> {
  const validationResult = updateCollectionSchema.safeParse({
    collectionId,
    collectionName,
    keywords,
    videos,
  });

  if (!validationResult.success) {
    return {
      success: false,
      errors: mapZodErrors(validationResult.error.errors),
    };
  }

  try {
    const updateData: Prisma.CollectionUpdateInput = {};

    if (validationResult.data.collectionName !== undefined) {
      updateData.name = validationResult.data.collectionName;
    }

    if (validationResult.data.keywords !== undefined) {
      updateData.collectionKeywords = {
        deleteMany: {},
        create: validationResult.data.keywords.map((keywordText) => ({
          keyword: {
            connectOrCreate: {
              where: { text: keywordText },
              create: { text: keywordText },
            },
          },
        })),
      };
    }

    if (validationResult.data.videos !== undefined) {
      updateData.collectionVideos = {
        deleteMany: {},
        create: validationResult.data.videos.map((video) => ({
          video: {
            connectOrCreate: {
              where: { id: video.id },
              create: {
                id: video.id,
                title: video.title,
                url: video.url,
                thumbnailUrl: video.thumbnailUrl,
                description: video.description,
                channelId: collectionId,
              },
            },
          },
        })),
      };
    }
    const collection = await prisma.collection.update({
      where: { id: validationResult.data.collectionId },
      data: updateData,
      include: {
        channel: true,
        collectionKeywords: { include: { keyword: true } },
        collectionVideos: { include: { video: true } },
      },
    });
    return { success: true, data: collection };
  } catch (error) {
    console.error("Error updating collection:", error);
    let message = "Failed to update collection.";
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, errors: [{ field: "general", message }] };
  }
}

export async function deleteCollectionService(
  collectionId: string
): Promise<Result<CollectionWithRelations>> {
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
