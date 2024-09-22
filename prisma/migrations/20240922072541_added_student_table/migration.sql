-- DropIndex
DROP INDEX "subject_teachers_subject_key";

-- AlterTable
ALTER TABLE "subject_teachers" ADD CONSTRAINT "subject_teachers_pkey" PRIMARY KEY ("teacherId", "sectionId", "subject");

-- CreateTable
CREATE TABLE "Student" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthId" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "parents" JSONB NOT NULL,
    "guading" JSONB NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,
    "admittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" JSONB NOT NULL,
    "admittedByUserId" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_admittedByUserId_fkey" FOREIGN KEY ("admittedByUserId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
