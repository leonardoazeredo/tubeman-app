/*
  Warnings:

  - You are about to drop the column `channelAvatarUrl` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `keywords` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `videos` on the `Collection` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_email_userName_idx";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "channelAvatarUrl",
DROP COLUMN "keywords",
DROP COLUMN "videos";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userName" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Channel" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "channelId" VARCHAR(255) NOT NULL,
    "channelAvatarUrl" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "userId" UUID,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "url" VARCHAR(1023) NOT NULL,
    "description" VARCHAR(1023) NOT NULL,
    "thumbnailUrl" VARCHAR(1023) NOT NULL,
    "publishedAt" TIMESTAMPTZ(6),
    "channelId" VARCHAR(255) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionKeyword" (
    "collectionId" UUID NOT NULL,
    "keywordId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionKeyword_pkey" PRIMARY KEY ("collectionId","keywordId")
);

-- CreateTable
CREATE TABLE "CollectionVideo" (
    "collectionId" UUID NOT NULL,
    "videoId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionVideo_pkey" PRIMARY KEY ("collectionId","videoId")
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" UUID NOT NULL,
    "text" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_channelId_key" ON "Channel"("channelId");

-- CreateIndex
CREATE INDEX "Channel_channelId_idx" ON "Channel"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "Video_url_key" ON "Video"("url");

-- CreateIndex
CREATE INDEX "Video_channelId_idx" ON "Video"("channelId");

-- CreateIndex
CREATE INDEX "Video_url_idx" ON "Video"("url");

-- CreateIndex
CREATE INDEX "CollectionKeyword_keywordId_idx" ON "CollectionKeyword"("keywordId");

-- CreateIndex
CREATE INDEX "CollectionVideo_videoId_idx" ON "CollectionVideo"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_text_key" ON "Keyword"("text");

-- CreateIndex
CREATE INDEX "Collection_userId_idx" ON "Collection"("userId");

-- CreateIndex
CREATE INDEX "Collection_channelId_idx" ON "Collection"("channelId");

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionKeyword" ADD CONSTRAINT "CollectionKeyword_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionKeyword" ADD CONSTRAINT "CollectionKeyword_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionVideo" ADD CONSTRAINT "CollectionVideo_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionVideo" ADD CONSTRAINT "CollectionVideo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
