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
      throw new Error("Invalid email"); // Specifically throw "Invalid email"
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
  password: string
): Promise<Result<DbUser>> {
  try {
    if (!email || !password) {
      console.error("createUser: Email and password are required");
      const error: ValidationError = {
        field: "general",
        message: "Email and password are required.",
      };
      return { success: false, errors: [error] };
    }

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      console.error(`createUser: User with email ${email} already exists`);
      const error: ValidationError = {
        field: "email",
        message: "Email already in use.",
      };
      return { success: false, errors: [error] };
    }
    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    console.log(`createUser: User created successfully with email: ${email}`);
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
