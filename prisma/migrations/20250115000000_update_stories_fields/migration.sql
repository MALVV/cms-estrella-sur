-- AlterTable
ALTER TABLE "stories" ADD COLUMN "content" TEXT NOT NULL DEFAULT '';
ALTER TABLE "stories" ADD COLUMN "summary" TEXT NOT NULL DEFAULT '';

-- Update existing records to copy description to content and summary
UPDATE "stories" SET "content" = "description", "summary" = LEFT("description", 200) WHERE "description" IS NOT NULL;

-- Drop the old description column
ALTER TABLE "stories" DROP COLUMN "description";
