/*
  Warnings:

  - You are about to drop the column `fileSize` on the `transparency_documents` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `transparency_documents` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `transparency_documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."transparency_documents" DROP COLUMN "fileSize",
DROP COLUMN "fileType",
DROP COLUMN "year";
