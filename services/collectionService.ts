"use server";

import { prisma } from "@/utils/prisma";
import { Result } from "@/types/shared";

import { generateUniqueSlug, mapZodErrors } from "@/utils/utilities";
import { fetchUserById } from "./userService";
import {
  Collection,
  CollectionSchema,
  User,
  KeywordSchema,
  VideoSchema,
} from "../prisma/generated/zod";
import { ZodError } from "zod";

export async function createCollection(
  _prevState: Result<Collection>,
  formData: FormData
): Promise<Result<Collection>> {
  try {
    const collectionName = formData.get("collectionName")?.toString();
    const userId = formData.get("userId")?.toString();
    const channelId = formData.get("channelId")?.toString(); // Using channelId from form, not handle
    const keywordsString = formData.get("keywords")?.toString();
    const videosString = formData.get("videos")?.toString();

    if (
      !userId ||
      !collectionName ||
      !channelId ||
      !keywordsString ||
      !videosString
    ) {
      return {
        success: false,
        errors: [
          {
            field: "general",
            message: `Missing required collection data.`,
          },
        ],
      };
    }

    const keywords: string[] = JSON.parse(keywordsString) as string[];
    const videos: {
      title: string;
      url: string;
      description: string;
      thumbnailUrl: string;
      publishedAt?: string | null;
    }[] = JSON.parse(videosString);

    const parsedData = CollectionSchema.safeParse({
      name: collectionName,
      userId,
      channelId,
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

    return await prisma.$transaction(async (tx) => {
      const newCollection: Collection = await tx.collection.create({
        data: {
          name: parsedData.data.name,
          slug,
          userId: parsedData.data.userId,
          channelId: parsedData.data.channelId,
        },
      });

      if (keywords && keywords.length > 0) {
        for (const keywordText of keywords) {
          if (!keywordText) continue;
          const parsedKeyword = KeywordSchema.safeParse({ text: keywordText });
          if (!parsedKeyword.success) {
            console.error(
              "Keyword validation error during collection creation:",
              parsedKeyword.error
            );
            continue; // Skip invalid keywords, or handle error as needed
          }

          let keyword = await tx.keyword.findUnique({
            where: { text: parsedKeyword.data.text },
          });

          if (!keyword) {
            keyword = await tx.keyword.create({
              data: { text: parsedKeyword.data.text },
            });
          }

          await tx.collectionKeyword.create({
            data: {
              collectionId: newCollection.id,
              keywordId: keyword.id,
            },
          });
        }
      }

      if (videos && videos.length > 0) {
        for (const videoInput of videos) {
          const parsedVideo = VideoSchema.safeParse({
            title: videoInput.title,
            url: videoInput.url,
            description: videoInput.description,
            thumbnailUrl: videoInput.thumbnailUrl,
            publishedAt: videoInput.publishedAt
              ? new Date(videoInput.publishedAt)
              : null,
            channelId: parsedData.data.channelId, // Assuming channelId is consistent for videos in collection
          });

          if (!parsedVideo.success) {
            console.error(
              "Video validation error during collection creation:",
              parsedVideo.error
            );
            continue; // Skip invalid videos, or handle error as needed
          }

          let video = await tx.video.findUnique({
            where: { url: parsedVideo.data.url },
          });

          if (!video) {
            video = await tx.video.create({
              data: {
                title: parsedVideo.data.title,
                url: parsedVideo.data.url,
                description: parsedVideo.data.description,
                thumbnailUrl: parsedVideo.data.thumbnailUrl,
                publishedAt: parsedVideo.data.publishedAt,
                channelId: parsedVideo.data.channelId,
              },
            });
          }

          await tx.collectionVideo.create({
            data: {
              collectionId: newCollection.id,
              videoId: video.id,
            },
          });
        }
      }

      return { success: true, data: newCollection };
    });
  } catch (error) {
    console.error("Error creating collection:", error);
    if (error instanceof ZodError) {
      return { success: false, errors: mapZodErrors(error.errors) };
    }
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
    const collection = await prisma.collection.findUniqueOrThrow({
      where: { id: collectionId },
      include: {
        collectionKeywords: {
          include: {
            keyword: true,
          },
        },
        collectionVideos: {
          include: {
            video: true,
          },
        },
      },
    });

    return { success: true, data: collection };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error getting collection by ID:", error);
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
    const collection = await prisma.collection.findUniqueOrThrow({
      where: { slug: collectionSlug },
      include: {
        collectionKeywords: {
          include: {
            keyword: true,
          },
        },
        collectionVideos: {
          include: {
            video: true,
          },
        },
      },
    });

    return { success: true, data: collection };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error getting collection by slug:", error);
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
      // Changed to findFirstOrThrow as it's expected to return one or error
      where: { userId: userId },
      include: {
        collectionKeywords: {
          include: {
            keyword: true,
          },
        },
        collectionVideos: {
          include: {
            video: true,
          },
        },
      },
    });

    return { success: true, data: collection };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error getting collection by user ID:", error);
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
      include: {
        collectionKeywords: {
          include: {
            keyword: true,
          },
        },
        collectionVideos: {
          include: {
            video: true,
          },
        },
      },
    });

    return { success: true, data: collections };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error getting collections by user ID:", error);
    return {
      success: false,
      errors: [
        { field: "general", message: "Failed to get collections by user id." },
      ],
    };
  }
}

export async function updateCollection(
  collectionId: string,
  name: string
): Promise<Result<Collection>> {
  try {
    const parsedData = CollectionSchema.partial().safeParse({ name }); // Allow partial update and validate only name
    if (!parsedData.success) {
      return { success: false, errors: mapZodErrors(parsedData.error.errors) };
    }

    const collection = await prisma.collection.update({
      where: { id: collectionId },
      data: parsedData.data, // Use validated data
      include: {
        collectionKeywords: {
          include: {
            keyword: true,
          },
        },
        collectionVideos: {
          include: {
            video: true,
          },
        },
      },
    });

    return { success: true, data: collection };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating collection:", error);
    if (error instanceof ZodError) {
      return { success: false, errors: mapZodErrors(error.errors) };
    }
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
      include: {
        collectionKeywords: {
          include: {
            keyword: true,
          },
        },
        collectionVideos: {
          include: {
            video: true,
          },
        },
      },
    });

    return { success: true, data: collection };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error deleting collection:", error);
    return {
      success: false,
      errors: [{ field: "general", message: "Failed to delete collection." }],
    };
  }
}
