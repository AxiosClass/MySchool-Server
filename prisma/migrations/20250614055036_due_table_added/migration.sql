-- CreateEnum
CREATE TYPE "DueType" AS ENUM ('ADMISSION_FEE', 'MONTHLY_FEE', 'TERM_FEE', 'OTHERS');

-- CreateTable
CREATE TABLE "dues" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "termId" TEXT,
    "type" "DueType" NOT NULL,
    "year" TEXT NOT NULL,
    "month" TEXT,
    "amount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dues_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dues" ADD CONSTRAINT "dues_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dues" ADD CONSTRAINT "dues_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dues" ADD CONSTRAINT "dues_termId_fkey" FOREIGN KEY ("termId") REFERENCES "terms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
