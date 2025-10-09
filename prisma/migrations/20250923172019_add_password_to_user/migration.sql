/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "password" TEXT NOT NULL DEFAULT 'temp_password';

-- Update existing users with a temporary password (they will need to reset it)
UPDATE "public"."users" SET "password" = '$2b$12$temp.hash.for.existing.users' WHERE "password" = 'temp_password';

-- Remove the default value
ALTER TABLE "public"."users" ALTER COLUMN "password" DROP DEFAULT;
