-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "subjectId" TEXT;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
