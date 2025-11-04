/*
  Warnings:

  - You are about to drop the column `duration` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `fileSize` on the `resources` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."resources" DROP COLUMN "duration",
DROP COLUMN "fileSize";
