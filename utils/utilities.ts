import { fetchUserByEmail } from "@/services/userService";
import { DbUser } from "@/types/db";
import { ValidationError } from "@/types/shared";
import bcrypt from "bcryptjs";
import { ZodIssue, ZodObject } from "zod";

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

// Reusable validateField function
export const validateField = <Schema extends ZodObject<any>>(
  schema: Schema,
  fieldName: string,
  value: string,
  allValues: Record<string, string> // Pass all form values for context-dependent validation if needed
): string | undefined => {
  const result = schema.safeParse({ ...allValues, [fieldName]: value }); // Merge field value with all values for validation context
  if (!result.success) {
    const fieldError = result.error.formErrors.fieldErrors[fieldName]?.[0];
    return fieldError;
  }
  return undefined; // No error
};
