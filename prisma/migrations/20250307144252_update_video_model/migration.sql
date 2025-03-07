/*
  Warnings:

  - You are about to drop the column `thumbnailUrl` on the `Video` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `Video` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.

*/
-- CreateEnum
CREATE TYPE "LiveBroadcastContent" AS ENUM ('live', 'none', 'upcoming');

-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "channelAvatarUrl" SET DATA TYPE VARCHAR(1023);

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "thumbnailUrl",
ADD COLUMN     "categoryId" VARCHAR(255),
ADD COLUMN     "defaultAudioLanguage" VARCHAR(255),
ADD COLUMN     "defaultLanguage" VARCHAR(255),
ADD COLUMN     "liveBroadcastContent" "LiveBroadcastContent" NOT NULL DEFAULT 'none',
ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "title" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" SET DATA TYPE VARCHAR(5000);

-- CreateTable
CREATE TABLE "Thumbnail" (
    "id" TEXT NOT NULL,
    "videoId" UUID NOT NULL,
    "url" VARCHAR(1023) NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "imageType" VARCHAR(255) NOT NULL,

    CONSTRAINT "Thumbnail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Thumbnail" ADD CONSTRAINT "Thumbnail_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
