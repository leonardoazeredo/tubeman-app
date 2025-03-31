"use server";

import { signInSchema, signUpSchema } from "@/utils/zodSchemas";
import { validatePassword, validateUser } from "@/utils/utilities";
import { DbUser } from "@/types/db";
import { Result, ValidationError } from "@/types/shared";
import { signIn, signOut } from "@/auth";
import { fetchUserByEmail, createUser } from "@/services/userService";
import { redirect } from "next/navigation";

export async function doSignUp(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _state: any,
  formData: FormData
): Promise<Result<null>> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const userName = formData.get("user-name") as string;

    const validation = signUpSchema.safeParse({ userName, email, password });
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

    const creationResult: Result<DbUser> = await createUser(
      email,
      password,
      userName
    );
    if (!creationResult.success) {
      return {
        success: false,
        errors: creationResult.errors,
      };
    }

    return { success: true, data: null };
  } catch (error) {
    console.error("Signup error:", error);
    let message = "An unexpected error occurred during signup.";
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, errors: [{ field: "general", message }] };
  }
}

export async function doSignIn(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _prevState: any,
  formData: FormData
): Promise<Result<null>> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validation = signInSchema.safeParse({ email, password });
    if (!validation.success) {
      const errors: ValidationError[] = Object.entries(
        validation.error.flatten().fieldErrors
      ).flatMap(([field, messages]) =>
        messages.map((message) => ({ field, message }))
      );
      return { success: false, errors };
    }

    const { email: validatedEmail, password: validatedPassword } =
      validation.data;

    const user: DbUser | null = await validateUser(validatedEmail);

    if (!user || !(await validatePassword(validatedPassword, user.password))) {
      const error: ValidationError = {
        field: "general",
        message: "Invalid credentials",
      };
      return { success: false, errors: [error] };
    }

    await signIn("credentials", {
      redirect: false,
      email: validatedEmail,
      password: validatedPassword,
    });

    return { success: true, data: null };
  } catch (error) {
    console.error("Sign-in error:", error);
    let message = "An unexpected error occurred during sign-in.";
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, errors: [{ field: "general", message }] };
  }
}

export async function doSignOut() {
  try {
    await signOut();
    redirect("/");
  } catch (error) {
    console.error("Sign out failed:", error);
  }
}
