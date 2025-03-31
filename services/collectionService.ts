"use server";

import { prisma } from "@/utils/prisma";
import {
  mapZodErrors,
  generateUniqueSlug,
  containsKeywords,
} from "@/utils/utilities";
import { Result, Video as SharedVideoType } from "@/types/shared";
import { fetchUserById } from "./userService";
import {
  createCollectionSchema,
  deleteCollectionSchema,
  updateCollectionSchema,
  videoSchema,
} from "@/utils/zodSchemas";
import { Prisma } from "@prisma/client";
import { fetchVideosPublishedAfter, getChannelId } from "./youtubeService";
import { z } from "zod";
import { fetchRecentVideosFromRSS } from "./rssService";

/**
 * Type definition for a Collection object including its relations:
 * - channel: The associated Channel object.
 * - collectionKeywords: Join table entries linking to Keyword objects.
 * - collectionVideos: Join table entries linking to Video objects.
 */
export type CollectionWithRelations = Prisma.CollectionGetPayload<{
  include: {
    channel: true;
    collectionKeywords: { include: { keyword: true } };
    collectionVideos: { include: { video: true } };
  };
}>;

/**
 * Fetches a single collection by its unique ID, including related channel, keywords, and videos.
 *
 * @param collectionId - The UUID of the collection to fetch.
 * @returns A promise resolving to a Result object containing the CollectionWithRelations on success, or errors on failure.
 */
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
          orderBy: { video: { publishedAt: "desc" } },
        },
      },
    });

    return { success: true, data: collection };
  } catch (error) {
    console.error(`Error getting collection by ID ${collectionId}:`, error);

    return {
      success: false,
      errors: [
        { field: "general", message: "Failed to get collection by id." },
      ],
    };
  }
}

/**
 * Fetches a single collection by its unique slug, including related channel, keywords, and videos.
 *
 * @param collectionSlug - The unique slug of the collection to fetch.
 * @returns A promise resolving to a Result object containing the CollectionWithRelations on success, or errors on failure.
 */
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
          orderBy: { video: { publishedAt: "desc" } },
        },
      },
    });

    return { success: true, data: collection };
  } catch (error) {
    console.error(`Error getting collection by slug ${collectionSlug}:`, error);

    return {
      success: false,
      errors: [
        { field: "general", message: "Failed to get collection by slug." },
      ],
    };
  }
}

/**
 * Fetches the first collection associated with a specific user ID.
 * Includes related channel, keywords, and videos.
 * Note: This fetches only *one* collection. Use `getCollectionsByUserId` for all collections.
 *
 * @param userId - The UUID of the user whose collection is to be fetched.
 * @returns A promise resolving to a Result object containing the CollectionWithRelations on success, or errors on failure.
 * @deprecated Consider if fetching *all* collections via `getCollectionsByUserId` is more appropriate.
 */
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
          orderBy: { video: { publishedAt: "desc" } },
        },
      },
    });

    return { success: true, data: collection };
  } catch (error) {
    console.error(`Error getting collection by user ID ${userId}:`, error);

    return {
      success: false,
      errors: [
        { field: "general", message: "Failed to get collection by user id." },
      ],
    };
  }
}

/**
 * Fetches all collections associated with a specific user ID.
 * Includes related channel, keywords, and videos for each collection.
 *
 * @param userId - The UUID of the user whose collections are to be fetched.
 * @returns A promise resolving to a Result object containing an array of CollectionWithRelations on success, or errors on failure.
 */
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
          orderBy: { video: { publishedAt: "desc" } },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: collections };
  } catch (error: unknown) {
    console.error(`Error getting collections for user ID ${userId}:`, error);

    let message = "Failed to get collections by user id.";
    if (error instanceof Error) message = error.message;
    return {
      success: false,
      errors: [{ field: "general", message }],
    };
  }
}

/**
 * Updates an existing collection's name and/or associated keywords.
 * If the name is updated, it also attempts to regenerate and update the slug, ensuring uniqueness.
 * Performs validation using an updated Zod schema (excluding videos) before attempting database update.
 * Note: This function replaces all existing keywords with the provided ones if keywords are supplied.
 *
 * @param collectionId - The UUID of the collection to update.
 * @param collectionName - Optional new name for the collection.
 * @param keywords - Optional array of keyword strings to associate with the collection (replaces existing).
 * @returns A promise resolving to a Result object containing the updated CollectionWithRelations on success, or errors on failure.
 */
export async function updateCollectionService(
  collectionId: string,
  collectionName?: string,
  keywords?: string[]
): Promise<Result<CollectionWithRelations>> {
  const validationResult = updateCollectionSchema.safeParse({
    collectionId,
    collectionName,
    keywords,
  });

  if (!validationResult.success) {
    console.log(
      "Validation failed for updateCollectionService:",
      validationResult.error.flatten()
    );
    return {
      success: false,
      errors: mapZodErrors(validationResult.error.errors),
    };
  }
  console.log(
    "Validation successful for updateCollectionService:",
    validationResult.data
  );

  try {
    const updateData: Prisma.CollectionUpdateInput = {};
    let newSlug: string | null = null;

    if (validationResult.data.collectionName !== undefined) {
      const name = validationResult.data.collectionName;
      updateData.name = name;

      const currentCollection = await prisma.collection.findUnique({
        where: { id: collectionId },
        select: { userId: true },
      });

      if (!currentCollection) {
        throw new Error(
          `Collection with ID ${collectionId} not found for slug update.`
        );
      }

      const user = await fetchUserById(currentCollection.userId);
      if (!user || !user.userName) {
        console.warn(
          `User or username not found for user ID ${currentCollection.userId}, skipping slug update.`
        );
      } else {
        newSlug = await generateUniqueSlug(
          name,
          currentCollection.userId,
          user.userName
        );
        if (!newSlug) {
          console.error(
            `Failed to generate a unique slug for collection ${collectionId} with new name "${name}"`
          );
        } else {
          updateData.slug = newSlug;
          console.log(
            `Generated new slug "${newSlug}" for collection ${collectionId}`
          );
        }
      }
    }

    if (validationResult.data.keywords !== undefined) {
      console.log(`Updating keywords for collection ${collectionId}`);
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

    console.log(
      `Performing update for collection ${collectionId} with data:`,
      updateData
    );
    const updatedCollection = await prisma.collection.update({
      where: { id: validationResult.data.collectionId },
      data: updateData,
      include: {
        channel: true,
        collectionKeywords: { include: { keyword: true } },
        collectionVideos: {
          include: { video: true },
          orderBy: { video: { publishedAt: "desc" } },
        },
      },
    });
    console.log(`Successfully updated collection ${collectionId}`);

    return { success: true, data: updatedCollection };
  } catch (error: unknown) {
    console.error(`Error updating collection ${collectionId}:`, error);
    let message = "Failed to update collection.";

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      message = `Collection with ID ${collectionId} not found during update process.`;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return { success: false, errors: [{ field: "general", message }] };
  }
}

/**
 * Deletes a collection by its unique ID.
 * Performs validation using Zod schema before attempting deletion.
 * Note: Related CollectionKeyword and CollectionVideo entries are typically deleted automatically
 * due to cascading deletes defined in the Prisma schema.
 *
 * @param collectionId - The UUID of the collection to delete.
 * @returns A promise resolving to a Result object containing the deleted CollectionWithRelations on success, or errors on failure.
 */
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
    console.error(`Error deleting collection ${collectionId}:`, error);
    let message = "Failed to delete collection";
    if (error instanceof Error) {
      message = error.message;
    }

    return { success: false, errors: [{ field: "general", message }] };
  }
}

/**
 * Creates a new collection for a user based on a channel handle, keywords, and initial videos.
 * Fetches channel ID, generates a unique slug, upserts channel and video data, and links everything.
 *
 * @param userId - The UUID of the user creating the collection.
 * @param collectionName - The desired name for the new collection.
 * @param channelHandle - The YouTube channel handle (e.g., "@channelname").
 * @param channelAvatarUrl - The URL of the channel's avatar.
 * @param keywords - An array of keyword strings.
 * @param videos - An array of initial video objects (matching Zod schema, assumed SharedVideoType structure).
 * @returns A promise resolving to a Result object containing the newly created CollectionWithRelations on success, or errors on failure.
 */
export async function createCollectionService(
  userId: string,
  collectionName: string,
  channelHandle: string,
  channelAvatarUrl: string,
  keywords: string[],

  videos: z.infer<typeof videoSchema>[]
): Promise<Result<CollectionWithRelations>> {
  try {
    const preValidatedData = createCollectionSchema
      .omit({ channelId: true })
      .safeParse({
        userId,
        collectionName,
        channelHandle,
        keywords,
        videos,
        channelAvatarUrl,
      });

    if (!preValidatedData.success) {
      return {
        success: false,
        errors: mapZodErrors(preValidatedData.error.errors),
      };
    }

    const channelId = await getChannelId(preValidatedData.data.channelHandle);

    if (!channelId) {
      return {
        success: false,
        errors: [
          { field: "channelHandle", message: "YouTube channel not found." },
        ],
      };
    }

    const validatedData = createCollectionSchema.safeParse({
      userId: preValidatedData.data.userId,
      collectionName: preValidatedData.data.collectionName,
      channelHandle: preValidatedData.data.channelHandle,
      channelId,
      keywords: preValidatedData.data.keywords,
      videos: preValidatedData.data.videos,
      channelAvatarUrl: preValidatedData.data.channelAvatarUrl,
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

    await prisma.channel.upsert({
      where: { channelId: validatedData.data.channelId },
      update: {
        channelAvatarUrl: validatedData.data.channelAvatarUrl,
        userId: user.id,
        name: validatedData.data.channelHandle,
      },
      create: {
        channelId: validatedData.data.channelId,
        name: validatedData.data.channelHandle,
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
                where: { url: video.url },
                create: {
                  title: video.title,
                  url: video.url,
                  thumbnailUrl: video.thumbnailUrl,
                  description: video.description,
                  channelId: validatedData.data.channelId,
                  publishedAt: video.publishedAt,
                },
              },
            },
          })),
        },
      },

      include: {
        channel: true,
        collectionKeywords: { include: { keyword: true } },
        collectionVideos: {
          include: { video: true },
          orderBy: { video: { publishedAt: "desc" } },
        },
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

/**
 * Fetches new videos for a specific collection from YouTube since the last check
 * (based on `newestVideoPublishedAt`) and adds them to the collection in the database.
 * Assumes Video.url stores the unique YouTube video ID.
 * Performs client-side keyword filtering on fetched videos via youtubeService.
 * Handles video upserts and linking to the collection transactionally.
 *
 * @param collectionId - The UUID of the collection to update.
 * @returns A promise resolving to a Result object containing the updated CollectionWithRelations on success, or errors on failure.
 */
export async function updateSingleCollectionVideos(
  collectionId: string
): Promise<Result<CollectionWithRelations>> {
  let collection:
    | (Prisma.CollectionGetPayload<{
        include: {
          channel: true;
          collectionKeywords: { include: { keyword: true } };
        };
      }> & { newestVideoPublishedAt?: Date | null })
    | null = null;

  try {
    collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        channel: true,
        collectionKeywords: { include: { keyword: true } },
      },
    });

    if (!collection) {
      console.warn(
        `updateSingleCollectionVideos: Collection with ID ${collectionId} not found.`
      );
      return {
        success: false,
        errors: [{ field: "collectionId", message: "Collection not found." }],
      };
    }

    const apiResult = await fetchVideosPublishedAfter(
      collection.channel.channelId,
      collection.collectionKeywords.map((ck) => ck.keyword.text).join(" "),
      collection.newestVideoPublishedAt?.toISOString()
    );

    if (!apiResult.success) {
      console.error(
        `updateSingleCollectionVideos: YouTube API fetch failed for collection ${collectionId}:`,
        apiResult.errors
      );
      return { success: false, errors: apiResult.errors };
    }

    const potentialNewVideos: SharedVideoType[] = apiResult.data;

    const existingVideoInternalIdsInCollection = new Set(
      await prisma.collectionVideo
        .findMany({
          where: { collectionId: collection.id },
          select: { videoId: true },
        })
        .then((results) => results.map((r) => r.videoId))
    );

    const existingVideosMap = new Map(
      await prisma.video
        .findMany({
          where: { url: { in: potentialNewVideos.map((v) => v.id) } },
          select: { id: true, url: true },
        })
        .then((videos) => videos.map((v) => [v.url, v.id]))
    );

    const actualNewVideos = potentialNewVideos.filter((video) => {
      const internalVideoUUID = existingVideosMap.get(video.id);
      if (!internalVideoUUID) return true;
      return !existingVideoInternalIdsInCollection.has(internalVideoUUID);
    });

    const newVideoCount = actualNewVideos.length;

    if (newVideoCount === 0) {
      console.log(
        `updateSingleCollectionVideos: No new videos found for collection ${collectionId} after filtering.`
      );

      const updatedCollection = await prisma.collection.update({
        where: { id: collectionId },
        data: { lastCheckedAt: new Date() },
        include: {
          channel: true,
          collectionKeywords: { include: { keyword: true } },
          collectionVideos: {
            include: { video: true },
            orderBy: { video: { publishedAt: "desc" } },
          },
        },
      });

      return { success: true, data: updatedCollection };
    }

    console.log(
      `updateSingleCollectionVideos: Found ${newVideoCount} new videos to process for collection ${collectionId}.`
    );

    const videoUpsertPromises: Prisma.PrismaPromise<SharedVideoType>[] = [];
    let latestPublishedDateInBatch = collection.newestVideoPublishedAt;

    for (const video of actualNewVideos) {
      videoUpsertPromises.push(
        prisma.video.upsert({
          where: { url: video.id },
          update: {
            title: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            publishedAt: video.publishedAt,
          },
          create: {
            url: video.id,
            title: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            publishedAt: video.publishedAt,
            channelId: collection.channel.channelId,
          },
        })
      );

      if (
        video.publishedAt &&
        (!latestPublishedDateInBatch ||
          video.publishedAt > latestPublishedDateInBatch)
      ) {
        latestPublishedDateInBatch = video.publishedAt;
      }
    }

    const collectionTimestampUpdatePromise = prisma.collection.update({
      where: { id: collectionId },
      data: {
        newestVideoPublishedAt: latestPublishedDateInBatch,
        lastCheckedAt: new Date(),
      },
    });

    try {
      console.log(
        `updateSingleCollectionVideos: Starting transaction 1 for collection ${collectionId} (Upsert ${videoUpsertPromises.length} videos, Update timestamp)`
      );
      await prisma.$transaction([
        ...videoUpsertPromises,
        collectionTimestampUpdatePromise,
      ]);
      console.log(
        `updateSingleCollectionVideos: Transaction 1 successful for collection ${collectionId}`
      );
    } catch (upsertError) {
      console.error(
        `Error during video upsert/timestamp transaction for collection ${collectionId}:`,
        upsertError
      );
      let message = "Failed during video processing.";
      if (
        upsertError instanceof Prisma.PrismaClientKnownRequestError &&
        upsertError.code === "P2002"
      ) {
        message =
          "Database constraint violation during video update/create (e.g., duplicate URL).";
      } else if (upsertError instanceof Error) {
        message = upsertError.message;
      }

      return { success: false, errors: [{ field: "database", message }] };
    }

    const relevantYoutubeIds = actualNewVideos.map((v) => v.id);
    const videosWithInternalIds = await prisma.video.findMany({
      where: { url: { in: relevantYoutubeIds } },
      select: { id: true, url: true },
    });

    const youtubeIdToInternalIdMap = new Map(
      videosWithInternalIds.map((v) => [v.url, v.id])
    );

    const linkCreatePromisesMaybeNull = actualNewVideos.map((video) => {
      const internalId = youtubeIdToInternalIdMap.get(video.id);
      if (!internalId) {
        console.warn(
          `Could not find internal ID for YT video ID ${video.id} (in url field) after upsert.`
        );
        return null;
      }
      return prisma.collectionVideo.create({
        data: {
          collectionId: collectionId,
          videoId: internalId,
        },
      });
    });

    const filteredPromises = linkCreatePromisesMaybeNull.filter(Boolean);
    const linkCreatePromises =
      filteredPromises as Prisma.PrismaPromise<unknown>[];

    if (linkCreatePromises.length > 0) {
      try {
        console.log(
          `updateSingleCollectionVideos: Starting transaction 2 for collection ${collectionId} (Create ${linkCreatePromises.length} links)`
        );
        await prisma.$transaction(linkCreatePromises);
        console.log(
          `updateSingleCollectionVideos: Transaction 2 successful for collection ${collectionId}`
        );
      } catch (linkError) {
        console.error(
          `Error creating video links for collection ${collectionId}:`,
          linkError
        );
        let message = "Failed to link some videos to the collection.";
        if (
          linkError instanceof Prisma.PrismaClientKnownRequestError &&
          linkError.code === "P2002"
        ) {
          message = "Attempted to link an already linked video.";
        } else if (linkError instanceof Error) {
          message = linkError.message;
        }

        return {
          success: false,
          errors: [{ field: "linking", message }],
        };
      }
    } else {
      console.log(
        `updateSingleCollectionVideos: No new video links to create for collection ${collectionId}.`
      );
    }

    console.log(
      `updateSingleCollectionVideos: Fetching final state for collection ${collectionId}`
    );
    const finalCollectionState = await getCollectionById(collectionId);

    if (!finalCollectionState.success) {
      console.error(
        `updateSingleCollectionVideos: Failed to fetch final state for collection ${collectionId} after updates.`
      );

      return {
        success: false,
        errors: finalCollectionState.errors ?? [
          {
            field: "general",
            message: "Failed to fetch updated collection state.",
          },
        ],
      };
    }

    console.log(
      `Successfully processed ${newVideoCount} new videos for collection ${collectionId}.`
    );

    return { success: true, data: finalCollectionState.data };
  } catch (error: unknown) {
    console.error(
      `Unhandled error updating collection ${collectionId}:`,
      error
    );
    let message = "Failed to update collection videos.";
    if (error instanceof Error) {
      message = error.message;
    }

    return { success: false, errors: [{ field: "general", message }] };
  }
}

/**
 * Fetches recent videos *only* via RSS feed for a specific collection,
 * filters them by keywords and existing videos in the collection,
 * and adds any new, relevant videos to the database.
 *
 * @param collectionId - The UUID of the collection to update.
 * @returns A promise resolving to a Result object containing the updated CollectionWithRelations on success, or errors on failure.
 */
export async function updateSingleCollectionVideosFromRSS(
  collectionId: string
): Promise<Result<CollectionWithRelations>> {
  let collection:
    | (Prisma.CollectionGetPayload<{
        include: {
          channel: true;
          collectionKeywords: { include: { keyword: true } };
        };
      }> & { newestVideoPublishedAt?: Date | null })
    | null = null;

  try {
    collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        channel: true,
        collectionKeywords: { include: { keyword: true } },
      },
    });

    if (!collection) {
      console.warn(
        `updateSingleCollectionVideosFromRSS: Collection with ID ${collectionId} not found.`
      );
      return {
        success: false,
        errors: [{ field: "collectionId", message: "Collection not found." }],
      };
    }

    const rssResult = await fetchRecentVideosFromRSS(collection.channel.name);

    if (!rssResult.success) {
      return { success: false, errors: rssResult.errors };
    }
    const potentialNewVideos: SharedVideoType[] = rssResult.data;

    const existingVideoInternalIdsInCollection = new Set(
      await prisma.collectionVideo
        .findMany({
          where: { collectionId: collection.id },
          select: { videoId: true },
        })
        .then((results) => results.map((r) => r.videoId))
    );

    const existingVideosMap = new Map(
      await prisma.video
        .findMany({
          where: { url: { in: potentialNewVideos.map((v) => v.id) } },
          select: { id: true, url: true },
        })
        .then((videos) => videos.map((v) => [v.url, v.id]))
    );

    const keywordsArray = collection.collectionKeywords
      .map((ck) => ck.keyword.text)
      .filter((k) => k);
    const actualNewVideos = potentialNewVideos.filter((video) => {
      const internalVideoUUID = existingVideosMap.get(video.id);
      const alreadyLinked =
        internalVideoUUID &&
        existingVideoInternalIdsInCollection.has(internalVideoUUID);
      if (alreadyLinked) return false;

      const hasKeywords = containsKeywords(
        `${video.title} ${video.description}`,
        keywordsArray
      );
      if (!hasKeywords) return false;

      return true;
    });

    const newVideoCount = actualNewVideos.length;

    if (newVideoCount === 0) {
      console.log(
        `updateSingleCollectionVideosFromRSS: No new videos found for collection ${collectionId} after filtering.`
      );

      const updatedCollection = await prisma.collection.update({
        where: { id: collectionId },
        data: { lastCheckedAt: new Date() },
        include: {
          channel: true,
          collectionKeywords: { include: { keyword: true } },
          collectionVideos: {
            include: { video: true },
            orderBy: { video: { publishedAt: "desc" } },
          },
        },
      });

      return { success: true, data: updatedCollection };
    }

    console.log(
      `updateSingleCollectionVideosFromRSS: Found ${newVideoCount} new videos to process for collection ${collectionId}.`
    );

    const videoUpsertPromises: Prisma.PrismaPromise<SharedVideoType>[] = [];
    let latestPublishedDateInBatch = collection.newestVideoPublishedAt;

    for (const video of actualNewVideos) {
      videoUpsertPromises.push(
        prisma.video.upsert({
          where: { url: video.id },
          update: {
            title: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            publishedAt: video.publishedAt,
          },
          create: {
            url: video.id,
            title: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            publishedAt: video.publishedAt,
            channelId: collection.channel.channelId,
          },
        })
      );

      if (
        video.publishedAt &&
        (!latestPublishedDateInBatch ||
          video.publishedAt > latestPublishedDateInBatch)
      ) {
        latestPublishedDateInBatch = video.publishedAt;
      }
    }

    const collectionTimestampUpdatePromise = prisma.collection.update({
      where: { id: collectionId },
      data: {
        newestVideoPublishedAt: latestPublishedDateInBatch,
        lastCheckedAt: new Date(),
      },
    });

    try {
      console.log(
        `updateSingleCollectionVideosFromRSS: Starting transaction 1 for collection ${collectionId} (Upsert ${videoUpsertPromises.length} videos, Update timestamp)`
      );
      await prisma.$transaction([
        ...videoUpsertPromises,
        collectionTimestampUpdatePromise,
      ]);
      console.log(
        `updateSingleCollectionVideosFromRSS: Transaction 1 successful for collection ${collectionId}`
      );
    } catch (upsertError) {
      console.error(
        `Error during video upsert/timestamp transaction for collection ${collectionId}:`,
        upsertError
      );
      let message = "Failed during video processing.";
      if (
        upsertError instanceof Prisma.PrismaClientKnownRequestError &&
        upsertError.code === "P2002"
      ) {
        message =
          "Database constraint violation during video update/create (e.g., duplicate URL).";
      } else if (upsertError instanceof Error) {
        message = upsertError.message;
      }

      return { success: false, errors: [{ field: "database", message }] };
    }

    const relevantYoutubeIds = actualNewVideos.map((v) => v.id);
    const videosWithInternalIds = await prisma.video.findMany({
      where: { url: { in: relevantYoutubeIds } },
      select: { id: true, url: true },
    });

    const youtubeIdToInternalIdMap = new Map(
      videosWithInternalIds.map((v) => [v.url, v.id])
    );

    const linkCreatePromisesMaybeNull = actualNewVideos.map((video) => {
      const internalId = youtubeIdToInternalIdMap.get(video.id);
      if (!internalId) {
        console.warn(
          `Could not find internal ID for YT video ID ${video.id} (in url field) after upsert.`
        );
        return null;
      }
      return prisma.collectionVideo.create({
        data: {
          collectionId: collectionId,
          videoId: internalId,
        },
      });
    });

    const filteredPromises = linkCreatePromisesMaybeNull.filter(Boolean);
    const linkCreatePromises =
      filteredPromises as Prisma.PrismaPromise<unknown>[];

    if (linkCreatePromises.length > 0) {
      try {
        console.log(
          `updateSingleCollectionVideosFromRSS: Starting transaction 2 for collection ${collectionId} (Create ${linkCreatePromises.length} links)`
        );
        await prisma.$transaction(linkCreatePromises);
        console.log(
          `updateSingleCollectionVideosFromRSS: Transaction 2 successful for collection ${collectionId}`
        );
      } catch (linkError) {
        console.error(
          `Error creating video links for collection ${collectionId}:`,
          linkError
        );
        let message = "Failed to link some videos to the collection.";
        if (
          linkError instanceof Prisma.PrismaClientKnownRequestError &&
          linkError.code === "P2002"
        ) {
          message = "Attempted to link an already linked video.";
        } else if (linkError instanceof Error) {
          message = linkError.message;
        }

        return {
          success: false,
          errors: [{ field: "linking", message }],
        };
      }
    } else {
      console.log(
        `updateSingleCollectionVideosFromRSS: No new video links to create for collection ${collectionId}.`
      );
    }

    console.log(
      `updateSingleCollectionVideosFromRSS: Fetching final state for collection ${collectionId}`
    );
    const finalCollectionState = await getCollectionById(collectionId);

    if (!finalCollectionState.success) {
      console.error(
        `updateSingleCollectionVideosFromRSS: Failed to fetch final state for collection ${collectionId} after updates.`
      );

      return {
        success: false,
        errors: finalCollectionState.errors ?? [
          {
            field: "general",
            message: "Failed to fetch updated collection state.",
          },
        ],
      };
    }

    console.log(
      `Successfully processed ${newVideoCount} new videos for collection ${collectionId}.`
    );

    return { success: true, data: finalCollectionState.data };
  } catch (error: unknown) {
    console.error(
      `Unhandled error updating collection ${collectionId}:`,
      error
    );
    let message = "Failed to update collection videos.";
    if (error instanceof Error) {
      message = error.message;
    }

    return { success: false, errors: [{ field: "general", message }] };
  }
}
