import "@testing-library/jest-dom";
import { fetchUserByEmail, createUser } from "./userService";
import { prisma } from "@/utils/prisma";
import { hashPassword } from "@/utils/utilities";
import { DbUser } from "@/types/db";

jest.mock("@/utils/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));
jest.mock("@/utils/utilities", () => ({
  hashPassword: jest.fn(),
  validatePassword: jest.fn(),
  validateUser: jest.fn(),
}));

describe("userService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchUserByEmail", () => {
    it("should successfully fetch a user by email", async () => {
      const mockUser: DbUser = {
        id: "user-id-1",
        email: "test@example.com",
        password: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as DbUser;

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const email = "test@example.com";
      const user = await fetchUserByEmail(email);

      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(user).toEqual(mockUser);
    });

    it("should return null if no user is found with the provided email", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const email = "nonexistent@example.com";
      const user = await fetchUserByEmail(email);

      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(user).toBeNull();
    });

    it("should throw a 'Database error' if prisma.user.findUnique throws a database connection error", async () => {
      const errorMessage = "Database error";
      const mockPrismaError = new Error("Prisma database error");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockPrismaError as any).code = "ECONNREFUSED";
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(mockPrismaError);

      const email = "test@example.com";
      await expect(fetchUserByEmail(email)).rejects.toThrow(errorMessage);
      await expect(fetchUserByEmail(email)).rejects.toThrow(Error);
    });

    it("should throw a 'Failed to fetch user' error if prisma.user.findUnique throws a generic Prisma error", async () => {
      const errorMessage = "Failed to fetch user";
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(
        new Error("Generic Prisma error")
      );
      const email = "test@example.com";
      await expect(fetchUserByEmail(email)).rejects.toThrow(errorMessage);
    });

    it("should throw an 'Invalid email' error if email is not provided", async () => {
      const errorMessage = "Invalid email";
      await expect(fetchUserByEmail("")).rejects.toThrow(errorMessage);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(fetchUserByEmail(undefined as any)).rejects.toThrow(
        errorMessage
      );
      await expect(fetchUserByEmail("")).rejects.toThrow(Error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(fetchUserByEmail(undefined as any)).rejects.toThrow(Error);
    });
  });

  describe("createUser", () => {
    it("should successfully create a new user", async () => {
      const mockHashedPassword = "mockHashedPassword";
      (hashPassword as jest.Mock).mockResolvedValue(mockHashedPassword);

      const mockNewUser: DbUser = {
        id: "new-user-id",
        email: "newuser@example.com",
        password: mockHashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as DbUser;
      (prisma.user.create as jest.Mock).mockResolvedValue(mockNewUser);
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

      const email = "newuser@example.com";
      const password = "password123";

      const result = await createUser(email, password);

      expect(hashPassword).toHaveBeenCalledTimes(1);
      expect(hashPassword).toHaveBeenCalledWith(password);
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: email,
          password: mockHashedPassword,
        },
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockNewUser);
      } else {
        fail("createUser should have been successful but it was not.");
      }
    });

    it("should return error result if email or password is not provided", async () => {
      const resultWithoutEmail = await createUser("", "password123");
      expect(resultWithoutEmail.success).toBe(false);
      if (!resultWithoutEmail.success) {
        expect(resultWithoutEmail.errors).toEqual([
          { field: "general", message: "Email and password are required." },
        ]);
      } else {
        fail("createUser should have returned an error but it did not.");
      }

      const resultWithoutPassword = await createUser("test@example.com", "");
      expect(resultWithoutPassword.success).toBe(false);
      if (!resultWithoutPassword.success) {
        expect(resultWithoutPassword.errors).toEqual([
          { field: "general", message: "Email and password are required." },
        ]);
      } else {
        fail("createUser should have returned an error but it did not.");
      }
    });

    it("should return error result if a user with the provided email already exists", async () => {
      const existingUser: DbUser = {
        id: "existing-user-id",
        email: "existing@example.com",
        password: "someHashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as DbUser;
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(existingUser);

      const email = "existing@example.com";
      const password = "password123";

      const result = await createUser(email, password);

      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toEqual([
          { field: "email", message: "Email already in use." },
        ]);
      } else {
        fail("createUser should have returned an error but it did not.");
      }
    });

    it("should return error result if prisma.user.create throws an error", async () => {
      const errorMessage = "Database error during user creation";
      (prisma.user.create as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue("mockHashedPassword");

      const email = "newuser@example.com";
      const password = "password123";

      const result = await createUser(email, password);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toEqual([
          { field: "general", message: "Failed to create user." },
        ]);
      } else {
        fail("createUser should have returned an error but it did not.");
      }
    });
  });
});
