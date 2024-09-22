/*
  Warnings:

  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_admittedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classId_fkey";

-- DropTable
DROP TABLE "Student";

-- CreateTable
CREATE TABLE "students" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthId" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "parents" JSONB NOT NULL,
    "guardian" JSONB NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "admittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" JSONB NOT NULL,
    "admittedByUserId" TEXT NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classId_fkey" FOREIGN KEY ("classId") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_admittedByUserId_fkey" FOREIGN KEY ("admittedByUserId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
