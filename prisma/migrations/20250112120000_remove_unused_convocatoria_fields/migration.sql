/*
  Warnings:

  - You are about to drop the column `benefits` on the `convocatorias` table. All the data in the column will be lost.
  - You are about to drop the column `objectives` on the `convocatorias` table. All the data in the column will be lost.
  - You are about to drop the column `qualifications` on the `convocatorias` table. All the data in the column will be lost.
  - You are about to drop the column `responsibilities` on the `convocatorias` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."convocatorias" DROP COLUMN "benefits",
DROP COLUMN "objectives",
DROP COLUMN "qualifications",
DROP COLUMN "responsibilities";

