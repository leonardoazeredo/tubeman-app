-- AlterTable
ALTER TABLE "Keyword" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Collection_slug_idx" ON "Collection"("slug");

-- CreateIndex
CREATE INDEX "CollectionKeyword_collectionId_idx" ON "CollectionKeyword"("collectionId");

-- CreateIndex
CREATE INDEX "CollectionVideo_collectionId_idx" ON "CollectionVideo"("collectionId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_userName_idx" ON "User"("userName");
