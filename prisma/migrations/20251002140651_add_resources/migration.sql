-- CreateEnum
CREATE TYPE "public"."ResourceCategory" AS ENUM ('CENTRO_MULTIMEDIA', 'PUBLICACIONES');

-- CreateEnum
CREATE TYPE "public"."ResourceSubcategory" AS ENUM ('VIDEOS', 'AUDIOS', 'REPRODUCTOR_INTEGRADO', 'BIBLIOTECA_DIGITAL', 'GUIAS_DESCARGABLES', 'MANUALES');

-- CreateTable
CREATE TABLE "public"."resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "fileType" TEXT,
    "category" "public"."ResourceCategory" NOT NULL,
    "subcategory" "public"."ResourceSubcategory",
    "thumbnailUrl" TEXT,
    "duration" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."resources" ADD CONSTRAINT "resources_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
