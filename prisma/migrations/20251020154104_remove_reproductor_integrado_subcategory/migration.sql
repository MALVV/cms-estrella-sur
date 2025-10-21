/*
  Warnings:

  - The values [REPRODUCTOR_INTEGRADO] on the enum `ResourceSubcategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ResourceSubcategory_new" AS ENUM ('VIDEOS', 'AUDIOS', 'BIBLIOTECA_DIGITAL', 'GUIAS_DESCARGABLES', 'MANUALES');
ALTER TABLE "public"."resources" ALTER COLUMN "subcategory" TYPE "public"."ResourceSubcategory_new" USING ("subcategory"::text::"public"."ResourceSubcategory_new");
ALTER TYPE "public"."ResourceSubcategory" RENAME TO "ResourceSubcategory_old";
ALTER TYPE "public"."ResourceSubcategory_new" RENAME TO "ResourceSubcategory";
DROP TYPE "public"."ResourceSubcategory_old";
COMMIT;
