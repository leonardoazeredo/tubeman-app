import { createUser, fetchUserByEmail } from "@/services/userService";
import { signUpSchema } from "@/utils/zodSchemas";

export async function doSignUp(
  _state: never,
  formData: FormData
): Promise<Result<null>> {
  try {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Received sign-up data:", { username, email, password });

    const validation = signUpSchema.safeParse({ username, email, password });
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      console.error("Validation errors:", errors);
      return { success: false, errors };
    }

    const existingUser = await fetchUserByEmail(email);
    if (existingUser) {
      const error = { field: "email", message: "Email is already in use." };
      console.error("User already exists:", error);
      return { success: false, errors: [error] };
    }

    // Pass the *plain* password to createUser
    const user = await createUser(email, password);
    if (!user) {
      return {
        success: false,
        errors: [{ field: "general", message: "Failed to create user." }],
      };
    }

    console.log("User created successfully:", { username, email });
    return { success: true, data: null };
  } catch (error) {
    console.error("Caught exception in doSignUp:", error);
    let message = "An unexpected error occurred during signup.";
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, errors: [{ field: "general", message }] };
  }
}
