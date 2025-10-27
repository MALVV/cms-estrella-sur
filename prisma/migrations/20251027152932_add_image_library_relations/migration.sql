-- AlterTable
ALTER TABLE "public"."image_library" ADD COLUMN     "methodologyId" TEXT,
ADD COLUMN     "projectId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."image_library" ADD CONSTRAINT "image_library_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."image_library" ADD CONSTRAINT "image_library_methodologyId_fkey" FOREIGN KEY ("methodologyId") REFERENCES "public"."methodologies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
