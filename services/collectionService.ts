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
    // Get the *actual* channel ID from the YouTube API.
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

    // Upsert the Channel (using the correct channelId)
    const channel = await prisma.channel.upsert({
      where: { channelId: validatedData.data.channelId }, // Use the CORRECT channelId
      update: {
        channelAvatarUrl: validatedData.data.channelAvatarUrl, // Update avatar URL
        userId: user.id, // Ensure correct user association
        name: channelHandle,
      },
      create: {
        channelId: validatedData.data.channelId, // Use the CORRECT channelId
        name: channelHandle, // Use channel handle for consistency
        channelAvatarUrl: validatedData.data.channelAvatarUrl,
        userId: user.id,
      },
    });

    // Create the Collection (using the correct channelId)
    const newCollection = await prisma.collection.create({
      data: {
        userId: validatedData.data.userId,
        name: validatedData.data.collectionName,
        channelId: validatedData.data.channelId, // Use the CORRECT channelId
        slug,
        // channelAvatarUrl: validatedData.data.channelAvatarUrl, // Add missing field
        collectionKeywords: {
          // Create CollectionKeyword entries.
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
          // Create CollectionVideo entries
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
                  channelId: validatedData.data.channelId, //CORRECT channelId
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
  collectionName?: string, // Optional now
  keywords?: string[], // Optional
  videos?: z.infer<typeof videoSchema>[] // Optional
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
    // Create updateData object dynamically
    const updateData: Prisma.CollectionUpdateInput = {};

    if (validationResult.data.collectionName !== undefined) {
      updateData.name = validationResult.data.collectionName;
    }

    // Handle keywords update if provided
    if (validationResult.data.keywords !== undefined) {
      updateData.collectionKeywords = {
        deleteMany: {}, // Delete existing keywords
        create: validationResult.data.keywords.map((keywordText) => ({
          // Recreate with new
          keyword: {
            connectOrCreate: {
              where: { text: keywordText },
              create: { text: keywordText },
            },
          },
        })),
      };
    }
    // Handle video update if provided
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
                channelId: collectionId, //ChannelId is needed.
              },
            },
          },
        })),
      };
    }
    const collection = await prisma.collection.update({
      where: { id: validationResult.data.collectionId },
      data: updateData, // Dynamic data
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
        // Include for consistency, even though it's being deleted
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
