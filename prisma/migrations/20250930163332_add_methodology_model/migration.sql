-- CreateEnum
CREATE TYPE "public"."MethodologyCategory" AS ENUM ('EDUCACION', 'SALUD', 'SOCIAL', 'AMBIENTAL');

-- CreateTable
CREATE TABLE "public"."methodologies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "ageGroup" TEXT NOT NULL,
    "category" "public"."MethodologyCategory" NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "implementation" TEXT NOT NULL,
    "results" TEXT NOT NULL,
    "methodology" TEXT,
    "resources" TEXT,
    "evaluation" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "methodologies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."methodologies" ADD CONSTRAINT "methodologies_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
