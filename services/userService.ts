import { DbUser } from "@/types/db";
import { prisma } from "@/utils/prisma";
import { hashPassword } from "@/utils/utilities";

export async function fetchUserByEmail(email: string): Promise<DbUser | null> {
  try {
    if (!email) {
      console.error("Invalid email provided:", email);
      throw new Error("Invalid email");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      console.log(`Fetched user with email`);
    } else {
      console.warn(`No user found with email`);
    }

    return user;
  } catch (error) {
    console.error(`Error fetching user with email:`, error);
    throw new Error("Failed to fetch user");
  }
}

export async function createUser(
  email: string,
  password: string
): Promise<DbUser | null> {
  try {
    if (!email || !password) {
      console.error("Invalid input provided:", {
        email,
        password,
      });
      return null;
    }

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return null;
    }
    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}
