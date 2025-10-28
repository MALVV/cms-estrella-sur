-- CreateTable
CREATE TABLE "public"."volunteer_applications" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "areaOfInterest" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "experience" TEXT,
    "driveLink" TEXT,
    "documents" TEXT,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "volunteer_applications_pkey" PRIMARY KEY ("id")
);
