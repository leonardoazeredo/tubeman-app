// collectionService.test.ts
import {
  createCollection,
  getCollectionById,
  getCollectionByUserId,
  getCollectionsByUserId,
  updateCollection,
  deleteCollection,
} from "./collectionService";
import { prisma } from "@/utils/prisma";
import { Result } from "@/types/shared";
import { DbCollection } from "@/types/db";
import { InputJsonValue } from "@prisma/client/runtime/library";

// Mock prisma
jest.mock("@/utils/prisma", () => ({
  prisma: {
    collection: {
      create: jest.fn(),
      findFirstOrThrow: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("collectionService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockCollection1 = {
    id: "test-collection-id",
    userId: "test-user-id",
    name: "Test Collection",
    channelId: "UCtestChannelId",
    keywords: ["keyword1", "keyword2"],
    videos: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCollection2 = {
    id: "test-collection-id-2",
    userId: "test-user-id",
    name: "Test Collection 2",
    channelId: "UCtestChannelId2",
    keywords: ["keyword3", "keyword4"],
    videos: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("createCollection", () => {
    it("should successfully create a collection", async () => {
      (prisma.collection.create as jest.Mock).mockResolvedValue(
        mockCollection1
      );

      const formData = new FormData();
      formData.append("userId", "test-user-id");
      formData.append("collectionName", "Test Collection");
      formData.append("channelHandle", "testChannelHandle"); // Removed "@" to match service logic
      formData.append("keywords", JSON.stringify(["keyword1", "keyword2"]));
      formData.append("videos", JSON.stringify([]));

      const result = await createCollection(
        { success: true, data: {} as DbCollection } as Result<DbCollection>,
        formData
      );

      expect(prisma.collection.create).toHaveBeenCalledWith({
        data: {
          userId: "test-user-id",
          name: "Test Collection",
          channelId: "testChannelHandle", // Expecting "testChannelHandle"
          keywords: ["keyword1", "keyword2"],
          videos: [],
        },
      });
      expect(result).toEqual({ success: true, data: mockCollection1 });
    });

    it("should return an error if required data is missing in formData", async () => {
      const formData = new FormData(); // Missing required data

      const result = await createCollection(
        { success: true, data: {} as DbCollection } as Result<DbCollection>,
        formData
      );

      expect(prisma.collection.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        errors: [
          { field: "general", message: "Missing required collection data." },
        ],
      });
    });

    it("should return an error if prisma.collection.create throws an error", async () => {
      (prisma.collection.create as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const formData = new FormData();
      formData.append("userId", "test-user-id");
      formData.append("collectionName", "Test Collection");
      formData.append("channelHandle", "testChannelHandle"); // Removed "@" to match service logic
      formData.append("keywords", JSON.stringify(["keyword1", "keyword2"]));
      formData.append("videos", JSON.stringify([]));

      const result = await createCollection(
        { success: true, data: {} as DbCollection } as Result<DbCollection>,
        formData
      );

      expect(prisma.collection.create).toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        errors: [{ field: "general", message: "Failed to create collection." }],
      });
    });
  });

  describe("getCollectionById", () => {
    it("should successfully get a collection by id", async () => {
      (prisma.collection.findFirstOrThrow as jest.Mock).mockResolvedValue(
        mockCollection1
      );

      const result = await getCollectionById("test-collection-id");

      expect(prisma.collection.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: "test-collection-id" },
      });
      expect(result).toEqual({ success: true, data: mockCollection1 });
    });

    it("should return an error if prisma.collection.findFirstOrThrow throws an error", async () => {
      (prisma.collection.findFirstOrThrow as jest.Mock).mockRejectedValue(
        new Error("Collection not found")
      );

      const result = await getCollectionById("non-existent-id");

      expect(prisma.collection.findFirstOrThrow).toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        errors: [
          { field: "general", message: "Failed to get collection by id." },
        ],
      });
    });
  });

  describe("getCollectionByUserId", () => {
    it("should successfully get a collection by userId", async () => {
      (prisma.collection.findFirstOrThrow as jest.Mock).mockResolvedValue(
        mockCollection1
      );

      const result = await getCollectionByUserId("test-user-id");

      expect(prisma.collection.findFirstOrThrow).toHaveBeenCalledWith({
        where: { userId: "test-user-id" },
      });
      expect(result).toEqual({ success: true, data: mockCollection1 });
    });

    it("should return an error if prisma.collection.findFirstOrThrow throws an error", async () => {
      (prisma.collection.findFirstOrThrow as jest.Mock).mockRejectedValue(
        new Error("Collection not found")
      );

      const result = await getCollectionByUserId("non-existent-user-id");

      expect(prisma.collection.findFirstOrThrow).toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        errors: [
          { field: "general", message: "Failed to get collection by user id." },
        ],
      });
    });
  });
  describe("getCollectionsByUserId", () => {
    it("should successfully get collections by userId", async () => {
      const mockCollections = [mockCollection1, mockCollection2];
      (prisma.collection.findMany as jest.Mock).mockResolvedValue(
        mockCollections
      );

      const result = await getCollectionsByUserId("test-user-id");

      expect(prisma.collection.findMany).toHaveBeenCalledWith({
        where: { userId: "test-user-id" },
      });
      expect(result).toEqual({ success: true, data: mockCollections });
    });

    it("should return an error if prisma.collection.findMany throws an error", async () => {
      (prisma.collection.findMany as jest.Mock).mockRejectedValue(
        new Error("Collections not found")
      );

      const result = await getCollectionsByUserId("non-existent-user-id");

      expect(prisma.collection.findMany).toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        errors: [
          { field: "general", message: "Failed to get collection by user id." },
        ],
      });
    });
  });

  describe("updateCollection", () => {
    it("should successfully update a collection", async () => {
      const mockUpdatedCollection = {
        id: "test-collection-id",
        userId: "test-user-id",
        name: "Updated Collection Name",
        channelId: "UCupdatedChannelId",
        keywords: ["updatedKeyword"],
        videos: [{ title: "Updated Video" }] as InputJsonValue[],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.collection.update as jest.Mock).mockResolvedValue(
        mockUpdatedCollection
      );

      const result = await updateCollection(
        "test-collection-id",
        "Updated Collection Name",
        ["updatedKeyword"],
        [{ title: "Updated Video" }] as InputJsonValue[]
      );

      expect(prisma.collection.update).toHaveBeenCalledWith({
        where: { id: "test-collection-id" },
        data: {
          name: "Updated Collection Name",
          keywords: ["updatedKeyword"],
          videos: [{ title: "Updated Video" }],
        },
      });
      expect(result).toEqual({ success: true, data: mockUpdatedCollection });
    });

    it("should return an error if prisma.collection.update throws an error", async () => {
      (prisma.collection.update as jest.Mock).mockRejectedValue(
        new Error("Update failed")
      );

      const result = await updateCollection(
        "test-collection-id",
        "Updated Name"
      );

      expect(prisma.collection.update).toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        errors: [{ field: "general", message: "Failed to update collection." }],
      });
    });
  });

  describe("deleteCollection", () => {
    it("should successfully delete a collection", async () => {
      (prisma.collection.delete as jest.Mock).mockResolvedValue(
        mockCollection1
      );
      (prisma.collection.findFirstOrThrow as jest.Mock).mockResolvedValue(
        mockCollection1
      );

      const result = await deleteCollection("test-collection-id");

      expect(prisma.collection.delete).toHaveBeenCalledWith({
        where: { id: "test-collection-id" },
      });
      expect(result).toEqual({ success: true, data: mockCollection1 });
    });

    it("should return an error if prisma.collection.delete throws an error", async () => {
      (prisma.collection.delete as jest.Mock).mockRejectedValue(
        new Error("Delete failed")
      );
      (prisma.collection.findFirstOrThrow as jest.Mock).mockRejectedValue(
        new Error("Not found")
      );

      const result = await deleteCollection("test-collection-id");

      expect(prisma.collection.delete).toHaveBeenCalled();
      expect(result).toEqual({
        success: false,
        errors: [{ field: "general", message: "Failed to delete collection." }],
      });
    });
  });
});
