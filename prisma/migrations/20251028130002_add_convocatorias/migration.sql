-- CreateEnum
CREATE TYPE "public"."ConvocatoriaStatus" AS ENUM ('DRAFT', 'ACTIVE', 'UPCOMING', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('PENDING', 'REVIEWING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."convocatorias" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "objectives" JSONB NOT NULL,
    "responsibilities" JSONB NOT NULL,
    "qualifications" JSONB NOT NULL,
    "benefits" JSONB NOT NULL,
    "requirements" JSONB NOT NULL,
    "documents" JSONB NOT NULL,
    "status" "public"."ConvocatoriaStatus" NOT NULL DEFAULT 'DRAFT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "convocatorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."convocatorias_applications" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "driveLink" TEXT,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "convocatoriaId" TEXT NOT NULL,

    CONSTRAINT "convocatorias_applications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."convocatorias" ADD CONSTRAINT "convocatorias_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."convocatorias_applications" ADD CONSTRAINT "convocatorias_applications_convocatoriaId_fkey" FOREIGN KEY ("convocatoriaId") REFERENCES "public"."convocatorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;
