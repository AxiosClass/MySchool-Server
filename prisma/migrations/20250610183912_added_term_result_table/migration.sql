-- CreateTable
CREATE TABLE "term_results" (
    "termId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "marks" JSONB NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "term_results_termId_studentId_key" ON "term_results"("termId", "studentId");

-- AddForeignKey
ALTER TABLE "term_results" ADD CONSTRAINT "term_results_termId_fkey" FOREIGN KEY ("termId") REFERENCES "terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "term_results" ADD CONSTRAINT "term_results_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
