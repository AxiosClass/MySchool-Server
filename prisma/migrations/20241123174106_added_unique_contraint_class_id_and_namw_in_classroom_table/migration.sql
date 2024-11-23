/*
  Warnings:

  - A unique constraint covering the columns `[classId,name]` on the table `classrooms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "classrooms_classId_name_key" ON "classrooms"("classId", "name");
