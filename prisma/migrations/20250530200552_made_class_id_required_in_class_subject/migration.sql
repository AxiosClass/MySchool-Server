/*
  Warnings:

  - Made the column `classId` on table `class_subjects` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "class_subjects" DROP CONSTRAINT "class_subjects_classId_fkey";

-- AlterTable
ALTER TABLE "class_subjects" ALTER COLUMN "classId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
