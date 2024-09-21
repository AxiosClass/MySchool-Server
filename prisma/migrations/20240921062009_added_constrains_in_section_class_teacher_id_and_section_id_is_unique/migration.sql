/*
  Warnings:

  - A unique constraint covering the columns `[teacherId,classId]` on the table `sections` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sections_teacherId_classId_key" ON "sections"("teacherId", "classId");
