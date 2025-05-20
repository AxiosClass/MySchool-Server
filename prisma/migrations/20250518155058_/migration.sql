-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('PDF', 'IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "educational_materials" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileType" "MaterialType" NOT NULL,
    "publicId" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "educational_materials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "educational_materials" ADD CONSTRAINT "educational_materials_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
