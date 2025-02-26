"use server";

import { DbUser } from "@/types/db";
import { prisma } from "@/utils/prisma";
import { hashPassword } from "@/utils/utilities";
import { Result, ValidationError } from "@/types/shared";

export async function fetchUserByEmail(email: string): Promise<DbUser | null> {
  try {
    if (!email) {
      console.error("fetchUserByEmail: Invalid email provided:", email);
      throw new Error("Invalid email");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      console.log(`fetchUserByEmail: User found with email: ${email}`);
    } else {
      console.log(`fetchUserByEmail: No user found with email: ${email}`);
    }

    return user;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      `fetchUserByEmail: Error fetching user with email: ${email}`,
      error
    );
    if (error.message === "Invalid email") {
      throw new Error("Invalid email");
    } else if (
      error.code === "ECONNREFUSED" ||
      error.code === "P2003" ||
      error.code === "P2006"
    ) {
      throw new Error("Database error");
    } else {
      throw new Error("Failed to fetch user");
    }
  }
}

export async function fetchUserById(userId: string): Promise<DbUser | null> {
  try {
    if (!userId) {
      console.error("fetchUserById: Invalid email provided:", userId);
      throw new Error("Invalid user ID");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (user) {
      console.log(`fetchUserById: User found with ID: ${userId}`);
    } else {
      console.log(`fetchUserById: No user found with ID: ${userId}`);
    }

    return user;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      `fetchUserById: Error fetching user with ID: ${userId}`,
      error
    );
    if (error.message === "Invalid ID") {
      throw new Error("Invalid ID");
    } else if (
      error.code === "ECONNREFUSED" ||
      error.code === "P2003" ||
      error.code === "P2006"
    ) {
      throw new Error("Database error");
    } else {
      throw new Error("Failed to fetch user");
    }
  }
}

export async function createUser(
  email: string,
  password: string,
  userName: string
): Promise<Result<DbUser>> {
  try {
    if (!email || !password || !userName) {
      console.error("createUser: User Name, email and password are required");
      const error: ValidationError = {
        field: "general",
        message: "User name, email and password are required.",
      };
      return { success: false, errors: [error] };
    }

    const existingUser = await prisma.user.findFirst({
      where: { userName, email },
    });

    if (existingUser) {
      console.error(
        `createUser: User with email ${email} or ${userName} already exists`
      );
      const error: ValidationError = {
        field: "email",
        message: "Email already in use.",
      };
      return { success: false, errors: [error] };
    }
    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        userName: userName,
        email: email,
        password: hashedPassword,
      },
    });

    console.log(
      `createUser: User created successfully with email: ${email} and User Name: ${userName}`
    );
    return { success: true, data: newUser };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("createUser: Failed to create user", error);
    let message = "Failed to create user.";
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "P2003" ||
      error.code === "P2006"
    ) {
      message = "Database error";
    }
    const generalError: ValidationError = { field: "general", message };
    return { success: false, errors: [generalError] };
  }
}
