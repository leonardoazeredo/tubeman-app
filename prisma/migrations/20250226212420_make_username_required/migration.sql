/*
  Warnings:

  - Made the column `userName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/

-- Data Migration - Example: Set userName to email prefix for existing users (adapt as needed)
UPDATE "User"
SET "userName" = SUBSTRING(email FROM '^([^@]+)'); -- Example: Extract part before "@" in email

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userName" SET NOT NULL;

