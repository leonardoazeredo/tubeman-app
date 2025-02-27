import { fetchUserByEmail } from "@/services/userService";
import { DbCollection, DbUser } from "@/types/db";
import {
  YtInitialData,
  Tab,
  SectionContent,
  ItemContent,
  VideoRenderer,
} from "@/types/scraper";
import { ValidationError, Video } from "@/types/shared";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import { ZodIssue, ZodObject } from "zod";
import { prisma } from "./prisma";

export async function validateUser(email: string): Promise<DbUser | null> {
  const user = await fetchUserByEmail(email);
  if (user) {
    return user;
  }

  return null;
}

export async function validatePassword(
  inputPassword: string,
  hashedPassword: string
): Promise<boolean> {
  console.log("Validating password...", inputPassword, hashedPassword);
  const isValid = await bcrypt.compare(inputPassword, hashedPassword);
  console.log("Password is Valid? ", isValid);
  return isValid;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export const mapZodErrors = (zodErrors: ZodIssue[]): ValidationError[] => {
  return zodErrors.map((error) => ({
    field: error.path.join("."),
    message: error.message,
  }));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateField = <Schema extends ZodObject<any>>(
  schema: Schema,
  fieldName: string,
  value: string,
  allValues: Record<string, string>
): string | undefined => {
  const result = schema.safeParse({ ...allValues, [fieldName]: value });
  if (!result.success) {
    const fieldError = result.error.formErrors.fieldErrors[fieldName]?.[0];
    return fieldError;
  }
  return undefined;
};

export function extractVideoDetails(data: YtInitialData): Video[] {
  const videoDetails: Video[] = [];

  data.contents?.twoColumnBrowseResultsRenderer?.tabs?.forEach((tab: Tab) => {
    tab.expandableTabRenderer?.content?.sectionListRenderer?.contents?.forEach(
      (sectionContent: SectionContent) => {
        sectionContent.itemSectionRenderer?.contents?.forEach(
          (itemContent: ItemContent) => {
            const video: VideoRenderer | undefined = itemContent.videoRenderer;
            if (video) {
              const title = video.title?.runs?.[0]?.text ?? "Untitled";
              const description =
                video.descriptionSnippet?.runs?.[0]?.text ?? "";
              const thumbnailUrl = getLargestThumbnailUrl(
                video.thumbnail?.thumbnails ?? []
              );

              videoDetails.push({
                id: video.videoId ?? "",
                title,
                description,
                thumbnailUrl,
                url: `https://www.youtube.com/watch?v=${video.videoId}`,
              });
            }
          }
        );
      }
    );
  });

  return videoDetails;
}
//bring back getLargestThumbnail
export function getLargestThumbnailUrl(
  thumbnails: Array<{ url: string; width: number; height: number }>
): string {
  if (!thumbnails || thumbnails.length === 0) return "";

  return thumbnails.reduce((largest, current) => {
    const largestArea = largest.width * largest.height;
    const currentArea = current.width * current.height;
    return currentArea > largestArea ? current : largest;
  }).url;
}

export async function generateUniqueSlug(
  collectionName: string,
  userId: string,
  userName: string,
  retryCount: number = 0
): Promise<string> {
  const baseSlug = slugify(collectionName, { lower: true });
  let slug = baseSlug;

  if (retryCount > 0) {
    slug = `${baseSlug}-${retryCount}`; // Append retry count if not the first attempt
  }

  // Check if a collection with this slug already exists for the user
  const existingCollection: DbCollection | null =
    await prisma.collection.findFirst({
      where: {
        slug,
        userId, // Scope uniqueness check to the user
      },
    });

  if (!existingCollection) {
    return slug; // Slug is unique for this user
  } else {
    // Slug is not unique, retry with incremented retryCount
    return generateUniqueSlug(collectionName, userId, userName, retryCount + 1); // Recursive call
  }
}
