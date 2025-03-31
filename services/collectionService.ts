"use server";

import { prisma } from "@/utils/prisma";
import { mapZodErrors, generateUniqueSlug } from "@/utils/utilities";
import { Result, Video as SharedVideoType } from "@/types/shared"; // Use alias for imported Video type
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
    // 1. Attempt to find the collection by ID or throw an error if not found.
    const collection = await prisma.collection.findFirstOrThrow({
      where: { id: collectionId },
      include: {
        // Eager load related data.
        channel: true,
        collectionKeywords: {
          include: { keyword: true },
        },
        collectionVideos: {
          include: { video: true },
          orderBy: { video: { publishedAt: "desc" } }, // Order videos by publish date
        },
      },
    });
    // 2. Return success result with the found collection data.
    return { success: true, data: collection };
  } catch (error) {
    // 3. Catch potential errors (e.g., Prisma's RecordNotFound error).
    console.error(`Error getting collection by ID ${collectionId}:`, error);
    // 4. Return failure result with a generic error message.
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
    // 1. Attempt to find the collection by slug or throw an error if not found.
    const collection = await prisma.collection.findFirstOrThrow({
      where: { slug: collectionSlug },
      include: {
        // Eager load related data.
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
    // 2. Return success result with the found collection data.
    return { success: true, data: collection };
  } catch (error) {
    // 3. Catch potential errors.
    console.error(`Error getting collection by slug ${collectionSlug}:`, error);
    // 4. Return failure result.
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
    // 1. Attempt to find the first collection for the user or throw if none exists.
    const collection = await prisma.collection.findFirstOrThrow({
      where: { userId: userId },
      include: {
        // Eager load related data.
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
    // 2. Return success result.
    return { success: true, data: collection };
  } catch (error) {
    // 3. Catch potential errors.
    console.error(`Error getting collection by user ID ${userId}:`, error);
    // 4. Return failure result.
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
    // 1. Find all collections matching the user ID.
    const collections = await prisma.collection.findMany({
      where: { userId: userId },
      include: {
        // Eager load related data for each collection.
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
        // Optional: Order the list of collections.
        createdAt: "desc",
      },
    });
    // 2. Return success result with the array of collections.
    return { success: true, data: collections };
  } catch (error: unknown) {
    // Catch unknown for better type safety.
    // 3. Catch potential errors.
    console.error(`Error getting collections for user ID ${userId}:`, error);
    // 4. Return failure result.
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
  // Removed 'videos' parameter
): Promise<Result<CollectionWithRelations>> {
  // 1. Validate the input data using the *updated* Zod schema (which should not include 'videos').
  //    Ensure `updateCollectionSchema` in `utils/zodSchemas.ts` is modified accordingly.
  const validationResult = updateCollectionSchema.safeParse({
    collectionId,
    collectionName,
    keywords,
    // videos: undefined, // Explicitly undefined or removed from schema
  });

  // 2. Return validation errors if validation fails.
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

  // 3. Proceed if validation passes.
  try {
    // 3a. Prepare the data object for the Prisma update operation.
    const updateData: Prisma.CollectionUpdateInput = {};
    let newSlug: string | null = null; // Variable to hold the potential new slug

    // 3b. Handle name and slug update *if* collectionName is provided.
    if (validationResult.data.collectionName !== undefined) {
      const name = validationResult.data.collectionName;
      updateData.name = name;

      // --- Regenerate Slug ---
      // 3b.i. Need user context to generate a user-unique slug. Fetch the collection first.
      const currentCollection = await prisma.collection.findUnique({
        where: { id: collectionId },
        select: { userId: true }, // Only need userId
      });

      if (!currentCollection) {
        throw new Error(
          `Collection with ID ${collectionId} not found for slug update.`
        );
      }

      // 3b.ii. Fetch the user (assuming username is needed by generateUniqueSlug)
      const user = await fetchUserById(currentCollection.userId);
      if (!user || !user.userName) {
        // Handle case where user or username is missing - perhaps skip slug update or throw error
        console.warn(
          `User or username not found for user ID ${currentCollection.userId}, skipping slug update.`
        );
      } else {
        // 3b.iii. Generate the new unique slug. This function handles uniqueness checks.
        newSlug = await generateUniqueSlug(
          name,
          currentCollection.userId,
          user.userName
        );
        if (!newSlug) {
          // Handle slug generation failure (should be unlikely if generateUniqueSlug is robust)
          console.error(
            `Failed to generate a unique slug for collection ${collectionId} with new name "${name}"`
          );
          // Decide: continue without slug update, or return an error? Let's continue for now.
        } else {
          updateData.slug = newSlug; // Add the new slug to the update payload
          console.log(
            `Generated new slug "${newSlug}" for collection ${collectionId}`
          );
        }
      }
    }

    // 3c. Handle keyword updates: delete existing, create new.
    if (validationResult.data.keywords !== undefined) {
      console.log(`Updating keywords for collection ${collectionId}`);
      updateData.collectionKeywords = {
        deleteMany: {}, // Delete all existing keyword links for this collection.
        create: validationResult.data.keywords.map((keywordText) => ({
          // Create new links.
          keyword: {
            // Connect to or create the keyword itself.
            connectOrCreate: {
              where: { text: keywordText },
              create: { text: keywordText },
            },
          },
        })),
      };
    }

    // 3d. Video update logic is REMOVED.

    // 3e. Perform the update operation in the database.
    console.log(
      `Performing update for collection ${collectionId} with data:`,
      updateData
    );
    const updatedCollection = await prisma.collection.update({
      where: { id: validationResult.data.collectionId },
      data: updateData,
      include: {
        // Include relations in the returned object.
        channel: true,
        collectionKeywords: { include: { keyword: true } },
        collectionVideos: {
          include: { video: true },
          orderBy: { video: { publishedAt: "desc" } },
        },
      },
    });
    console.log(`Successfully updated collection ${collectionId}`);

    // 3f. Return success result with updated collection.
    return { success: true, data: updatedCollection };
  } catch (error: unknown) {
    // Catch unknown
    // 4. Catch database errors during update or slug generation steps.
    console.error(`Error updating collection ${collectionId}:`, error);
    let message = "Failed to update collection.";
    // Handle specific Prisma errors if needed (e.g., P2025 RecordNotFound if the initial fetch fails)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      message = `Collection with ID ${collectionId} not found during update process.`;
    } else if (error instanceof Error) {
      message = error.message;
    }
    // 5. Return failure result.
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
  // 1. Validate the input collection ID.
  const validationResult = deleteCollectionSchema.safeParse({ collectionId });

  // 2. Return validation errors if invalid.
  if (!validationResult.success) {
    return {
      success: false,
      errors: mapZodErrors(validationResult.error.errors),
    };
  }
  // 3. Proceed with deletion.
  try {
    // 3a. Delete the collection, including relations in the return value (for confirmation).
    const collection = await prisma.collection.delete({
      where: { id: validationResult.data.collectionId },
      include: {
        channel: true,
        collectionKeywords: { include: { keyword: true } },
        collectionVideos: { include: { video: true } },
      },
    });
    // 3b. Return success result with the data of the deleted collection.
    return { success: true, data: collection };
  } catch (error) {
    // 4. Catch database errors during deletion.
    console.error(`Error deleting collection ${collectionId}:`, error);
    let message = "Failed to delete collection";
    if (error instanceof Error) {
      message = error.message;
    }
    // 5. Return failure result.
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
  // Ensure z.infer<typeof videoSchema> aligns with SharedVideoType and structure needed below
  videos: z.infer<typeof videoSchema>[]
): Promise<Result<CollectionWithRelations>> {
  try {
    // 1. Perform initial validation (excluding channelId).
    const preValidatedData = createCollectionSchema
      .omit({ channelId: true }) // channelId is fetched later
      .safeParse({
        userId,
        collectionName,
        channelHandle,
        keywords,
        videos,
        channelAvatarUrl,
      });

    // 2. Return if initial validation fails.
    if (!preValidatedData.success) {
      return {
        success: false,
        errors: mapZodErrors(preValidatedData.error.errors),
      };
    }

    // 3. Fetch the actual YouTube channel ID using the handle.
    // Note: getChannelId might involve an API call.
    const channelId = await getChannelId(preValidatedData.data.channelHandle);
    // 4. Return error if channel ID couldn't be found.
    if (!channelId) {
      return {
        success: false,
        errors: [
          { field: "channelHandle", message: "YouTube channel not found." },
        ],
      };
    }

    // 5. Perform final validation including the fetched channelId.
    const validatedData = createCollectionSchema.safeParse({
      userId: preValidatedData.data.userId,
      collectionName: preValidatedData.data.collectionName,
      channelHandle: preValidatedData.data.channelHandle, // Keep handle for channel name default
      channelId, // Include fetched ID
      keywords: preValidatedData.data.keywords,
      videos: preValidatedData.data.videos,
      channelAvatarUrl: preValidatedData.data.channelAvatarUrl,
    });

    // 6. Return if final validation fails.
    if (!validatedData.success) {
      return {
        success: false,
        errors: mapZodErrors(validatedData.error.errors),
      };
    }

    // 7. Fetch user data (needed for slug generation).
    const user = await fetchUserById(validatedData.data.userId);
    // 8. Return error if user data is invalid.
    if (!user || !user.userName) {
      return {
        success: false,
        errors: [{ field: "general", message: "Invalid user data." }],
      };
    }

    // 9. Generate a unique slug for the collection within the user's scope.
    const slug = await generateUniqueSlug(
      validatedData.data.collectionName,
      user.id,
      user.userName
    );
    // 10. Return error if slug generation fails.
    if (!slug) {
      return {
        success: false,
        errors: [{ field: "general", message: "Could not generate a slug." }],
      };
    }

    // 11. Upsert the Channel information in the database.
    // Ensures the channel exists and is associated with the user (if not already).
    await prisma.channel.upsert({
      where: { channelId: validatedData.data.channelId },
      update: {
        // If channel exists, update avatar, user link, and name (if needed).
        channelAvatarUrl: validatedData.data.channelAvatarUrl,
        userId: user.id,
        name: validatedData.data.channelHandle, // Use handle as name for consistency
      },
      create: {
        // If channel doesn't exist, create it.
        channelId: validatedData.data.channelId,
        name: validatedData.data.channelHandle,
        channelAvatarUrl: validatedData.data.channelAvatarUrl,
        userId: user.id,
      },
    });

    // 12. Create the new Collection record along with initial relations.
    const newCollection = await prisma.collection.create({
      data: {
        userId: validatedData.data.userId,
        name: validatedData.data.collectionName,
        channelId: validatedData.data.channelId, // Use the validated channelId.
        slug, // Use the generated unique slug.
        // 12a. Create keyword associations.
        collectionKeywords: {
          create: validatedData.data.keywords.map((keywordText) => ({
            keyword: {
              // Connect or create the Keyword record.
              connectOrCreate: {
                where: { text: keywordText },
                create: { text: keywordText },
              },
            },
          })),
        },
        // 12b. Create video associations.
        // Assumes `videos` array has structure { id: YT_ID, title: ..., url: YT_ID, ... }
        // and Video schema has `url @unique` storing YT_ID.
        collectionVideos: {
          create: validatedData.data.videos.map((video) => ({
            video: {
              // Connect or create the Video record.
              connectOrCreate: {
                where: { url: video.url }, // Find video by unique YT ID in 'url' field.
                create: {
                  // Data to create the video if it doesn't exist.
                  // id (UUID) is auto-generated.
                  title: video.title,
                  url: video.url, // Store YT ID in url field.
                  thumbnailUrl: video.thumbnailUrl,
                  description: video.description,
                  channelId: validatedData.data.channelId, // Link to the correct channel.
                  publishedAt: video.publishedAt, // Assumes video object has this Date property.
                },
              },
            },
          })),
        },
      },
      // 12c. Include all relations in the returned object.
      include: {
        channel: true,
        collectionKeywords: { include: { keyword: true } },
        collectionVideos: {
          include: { video: true },
          orderBy: { video: { publishedAt: "desc" } },
        },
      },
    });

    // 13. Return success result with the newly created collection.
    return { success: true, data: newCollection };
  } catch (error) {
    // 14. Catch any errors during the process.
    console.error("Error creating collection:", error);
    let message = "Failed to create collection.";
    if (error instanceof Error) {
      message = error.message;
    }
    // 15. Return failure result.
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
  // Define collection variable in outer scope for potential use in error handling
  let collection:
    | (Prisma.CollectionGetPayload<{
        include: {
          channel: true; // Need channelId
          collectionKeywords: { include: { keyword: true } }; // Need keywords
        };
      }> & { newestVideoPublishedAt?: Date | null })
    | null = null; // Include timestamp field

  try {
    // 1. Fetch essential collection data needed for API call and filtering.
    collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        channel: true,
        collectionKeywords: { include: { keyword: true } },
      },
    });

    // 2. Handle collection not found.
    if (!collection) {
      console.warn(
        `updateSingleCollectionVideos: Collection with ID ${collectionId} not found.`
      );
      return {
        success: false,
        errors: [{ field: "collectionId", message: "Collection not found." }],
      };
    }

    // 3. Call YouTube Service to get potentially new videos since the last check.
    const apiResult = await fetchVideosPublishedAfter(
      collection.channel.channelId,
      collection.collectionKeywords.map((ck) => ck.keyword.text).join(" "),
      collection.newestVideoPublishedAt?.toISOString() // Use timestamp for efficient fetching
    );

    // 4. Handle YouTube API errors reported by the service.
    if (!apiResult.success) {
      console.error(
        `updateSingleCollectionVideos: YouTube API fetch failed for collection ${collectionId}:`,
        apiResult.errors
      );
      return { success: false, errors: apiResult.errors };
    }
    // Type guard ensures data exists if success is true
    const potentialNewVideos: SharedVideoType[] = apiResult.data;

    // 5. Determine which fetched videos are *actually* new to *this* specific collection.
    // 5a. Get internal UUIDs of videos already linked to this collection.
    const existingVideoInternalIdsInCollection = new Set(
      await prisma.collectionVideo
        .findMany({
          where: { collectionId: collection.id },
          select: { videoId: true }, // These are the internal UUIDs of your Video table
        })
        .then((results) => results.map((r) => r.videoId))
    );

    // 5b. Check which potential new videos already exist in the DB (by YT ID in 'url')
    //     and map their YT ID ('url') to their internal UUID ('id').
    const existingVideosMap = new Map(
      await prisma.video
        .findMany({
          where: { url: { in: potentialNewVideos.map((v) => v.id) } }, // Check against YT IDs in `url` field
          select: { id: true, url: true }, // Select internal UUID (id) and YT ID (url)
        })
        .then((videos) => videos.map((v) => [v.url, v.id])) // Map url (YT ID) -> id (Internal UUID)
    );

    // 5c. Filter the potential videos: keep if YT ID not in DB map OR internal UUID not linked here.
    const actualNewVideos = potentialNewVideos.filter((video) => {
      const internalVideoUUID = existingVideosMap.get(video.id);
      if (!internalVideoUUID) return true; // Not in DB at all = new.
      return !existingVideoInternalIdsInCollection.has(internalVideoUUID); // In DB, but not linked = new for this collection.
    });

    const newVideoCount = actualNewVideos.length;

    // 6. If no genuinely new videos were found after filtering.
    if (newVideoCount === 0) {
      console.log(
        `updateSingleCollectionVideos: No new videos found for collection ${collectionId} after filtering.`
      );
      // 6a. Just update the `lastCheckedAt` timestamp for the collection.
      const updatedCollection = await prisma.collection.update({
        where: { id: collectionId },
        data: { lastCheckedAt: new Date() },
        include: {
          // Include all relations for consistent return type.
          channel: true,
          collectionKeywords: { include: { keyword: true } },
          collectionVideos: {
            include: { video: true },
            orderBy: { video: { publishedAt: "desc" } },
          },
        },
      });
      // 6b. Return success with the current (timestamp-updated) collection state.
      return { success: true, data: updatedCollection };
    }

    console.log(
      `updateSingleCollectionVideos: Found ${newVideoCount} new videos to process for collection ${collectionId}.`
    );

    // --- Processing found new videos ---

    // 7. Prepare Video Upsert operations and track the latest publish date.
    const videoUpsertPromises: Prisma.PrismaPromise<SharedVideoType>[] = []; // Use specific type
    let latestPublishedDateInBatch = collection.newestVideoPublishedAt;

    for (const video of actualNewVideos) {
      // 7a. Add upsert operation for each new video (find by unique YT ID in 'url').
      videoUpsertPromises.push(
        prisma.video.upsert({
          where: { url: video.id }, // Find video by YT ID stored in 'url' field
          update: {
            // Data to update if video already exists in DB.
            title: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            publishedAt: video.publishedAt,
          },
          create: {
            // Data to create if video is new to the DB.
            url: video.id, // Store YT ID in 'url' field.
            title: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            publishedAt: video.publishedAt, // Assumes Video interface provides this correctly
            channelId: collection.channel.channelId, // Link to the correct channel.
            // id (UUID PK) is auto-generated by Prisma/DB.
          },
        })
      );

      // 7b. Update the latest publish date seen in this batch.
      if (
        video.publishedAt &&
        (!latestPublishedDateInBatch ||
          video.publishedAt > latestPublishedDateInBatch)
      ) {
        latestPublishedDateInBatch = video.publishedAt;
      }
    }

    // 8. Prepare the Collection timestamp update operation.
    const collectionTimestampUpdatePromise = prisma.collection.update({
      where: { id: collectionId },
      data: {
        newestVideoPublishedAt: latestPublishedDateInBatch, // Store latest video date found.
        lastCheckedAt: new Date(), // Update last checked time.
      },
    });

    // 9. Execute the first transaction: Upsert Videos and Update Collection Timestamps.
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
      // 9a. Handle errors during this first transaction (e.g., unique constraint violations).
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
      // 9b. Return failure result.
      return { success: false, errors: [{ field: "database", message }] };
    }

    // --- Linking Phase ---

    // 10. Fetch the internal UUIDs for all newly added/updated videos using their YT IDs ('url').
    const relevantYoutubeIds = actualNewVideos.map((v) => v.id);
    const videosWithInternalIds = await prisma.video.findMany({
      where: { url: { in: relevantYoutubeIds } },
      select: { id: true, url: true }, // Get internal UUID 'id' and YT ID 'url'.
    });

    // 11. Create a map from YT ID ('url') to internal UUID ('id').
    const youtubeIdToInternalIdMap = new Map(
      videosWithInternalIds.map((v) => [v.url, v.id])
    );

    // 12. Prepare link creation operations (CollectionVideo entries).
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

    // 12d. Filter out any nulls and assert the correct PrismaPromise type.
    const filteredPromises = linkCreatePromisesMaybeNull.filter(Boolean);
    const linkCreatePromises =
      filteredPromises as Prisma.PrismaPromise<unknown>[];

    // 13. Execute the second transaction: Create CollectionVideo links.
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
        // 13a. Handle errors specifically during the linking phase (e.g., P2002 if somehow link already exists).
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
        // 13b. Return failure, indicating linking failed.
        return {
          success: false,
          errors: [{ field: "linking", message }],
          // No data is returned on this specific failure as per Result<T> definition
        };
      }
    } else {
      console.log(
        `updateSingleCollectionVideos: No new video links to create for collection ${collectionId}.`
      );
    }

    // 14. Fetch the final, fully updated state of the collection.
    console.log(
      `updateSingleCollectionVideos: Fetching final state for collection ${collectionId}`
    );
    const finalCollectionState = await getCollectionById(collectionId); // Use helper function

    // 15. Handle potential errors fetching the final state.
    if (!finalCollectionState.success) {
      console.error(
        `updateSingleCollectionVideos: Failed to fetch final state for collection ${collectionId} after updates.`
      );
      // Return the error from getCollectionById or a generic one
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
    // 16. Return success with the final collection data.
    return { success: true, data: finalCollectionState.data };
  } catch (error: unknown) {
    // 17. Catch any unhandled errors during the entire process.
    console.error(
      `Unhandled error updating collection ${collectionId}:`,
      error
    );
    let message = "Failed to update collection videos.";
    if (error instanceof Error) {
      message = error.message;
    }
    // 18. Return general failure result.
    return { success: false, errors: [{ field: "general", message }] };
  }
}
