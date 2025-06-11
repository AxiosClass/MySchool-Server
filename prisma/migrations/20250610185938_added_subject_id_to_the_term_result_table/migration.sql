/*
  Warnings:

  - A unique constraint covering the columns `[termId,studentId,subjectId]` on the table `term_results` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subjectId` to the `term_results` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "term_results_termId_studentId_key";

-- AlterTable
ALTER TABLE "term_results" ADD COLUMN     "subjectId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "term_results_termId_studentId_subjectId_key" ON "term_results"("termId", "studentId", "subjectId");

-- AddForeignKey
ALTER TABLE "term_results" ADD CONSTRAINT "term_results_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
