import { fetchUserByEmail } from "@/services/userService";
import { DbCollection, DbUser } from "@/types/db";
import { ValidationError } from "@/types/shared";
import * as bcrypt from "bcryptjs-react";
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

export async function generateUniqueSlug(
  collectionName: string,
  userId: string,
  userName: string,
  retryCount: number = 0
): Promise<string> {
  const baseSlug = slugify(collectionName, { lower: true });
  let slug = baseSlug;

  if (retryCount > 0) {
    slug = `${baseSlug}-${retryCount}`;
  }

  const existingCollection: DbCollection | null =
    await prisma.collection.findFirst({
      where: {
        slug,
        userId,
      },
    });

  if (!existingCollection) {
    return slug;
  } else {
    return generateUniqueSlug(collectionName, userId, userName, retryCount + 1);
  }
}
