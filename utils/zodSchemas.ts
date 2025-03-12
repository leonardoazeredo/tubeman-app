import { array, object, string, z } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required!" }).email({
    message: "Invalid email address",
  }),
  password: string({ required_error: "Password is required!" })
    .min(12, { message: "Password must be more than 12 characters" })
    .max(32, { message: "Password must be less than 32 characters" }),
});

export const signUpSchema = object({
  userName: string({ required_error: "User Name is required!" })
    .min(6, "User Name must be at least 6 characters long")
    .max(255, "User Name is too long."),
  email: string({ required_error: "Email is required!" }).email(
    "Invalid email address"
  ),
  password: string({ required_error: "Password is required!" })
    .min(12, "Password must be at least 12 characters long.")
    .max(32, "Password must be at most 32 characters long."),
});

export const scrapeSearchParamsSchema = object({
  channelHandle: string()
    .nonempty("Channel handle is required.")
    .trim()
    .transform((value) => value.replace(/\s+/g, "").replace(/^@/, "")),
  keywords: string()
    .nonempty("Keywords are required.")
    .trim()
    .transform((value: string) => value.replace(/[\s,.;|]+/g, " ").trim()),
});

// --- Zod Schemas ---
export const videoSchema = object({
  id: string(),
  title: string(),
  url: string(),
  thumbnailUrl: string(),
  description: string(),
});

export const createCollectionSchema = object({
  userId: string().uuid("Invalid user ID format"),
  collectionName: string()
    .min(1, "Collection name is required")
    .max(255, "Collection name is too long"),
  channelId: string().min(1, "Channel ID is required"),
  keywords: array(
    string().min(1, "Keyword cannot be empty").max(255, "Keyword is too long")
  ),
  videos: array(videoSchema),
  channelAvatarUrl: string().url("Invalid channel avatar URL format"),
});

export const updateCollectionSchema = object({
  collectionId: string().uuid("Invalid collection ID format"),
  collectionName: string()
    .min(1, "Collection name is required")
    .max(255, "Collection name is too long")
    .optional(),
  keywords: array(
    string().min(1, "Keyword cannot be empty").max(255, "Keyword is too long")
  ).optional(),
  videos: array(videoSchema).optional(),
});

export const deleteCollectionSchema = object({
  collectionId: string().uuid("Invalid collection ID format"),
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
