-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "lastCheckedAt" TIMESTAMPTZ(6),
ADD COLUMN     "newestVideoPublishedAt" TIMESTAMPTZ(6);
