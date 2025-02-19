import { createUser, fetchUserByEmail } from "@/services/userService";
import { DbUser } from "@/types/db";
import { Result, ValidationError } from "@/types/shared";
import { signUpSchema } from "@/utils/zodSchemas";

export async function doSignUp(
  _state: never,
  formData: FormData
): Promise<Result<null>> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validation = signUpSchema.safeParse({ email, password });
    if (!validation.success) {
      const errors: ValidationError[] = Object.entries(
        validation.error.flatten().fieldErrors
      ).flatMap(([field, messages]) =>
        messages.map((message) => ({ field, message }))
      );
      return { success: false, errors };
    }

    const existingUser = await fetchUserByEmail(email);
    if (existingUser) {
      const error = { field: "email", message: "Email is already in use." };
      return { success: false, errors: [error] };
    }

    // Pass the *plain* password to createUser
    const creationResult: Result<DbUser> = await createUser(email, password);
    if (!creationResult.success) {
      return {
        success: false,
        errors: creationResult.errors,
      };
    }

    return { success: true, data: null };
  } catch (error) {
    let message = "An unexpected error occurred during signup.";
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, errors: [{ field: "general", message }] };
  }
}
