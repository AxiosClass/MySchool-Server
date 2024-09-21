-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'PENDING');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT', 'MODERATOR', 'STUDENT', 'TEACHER');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('ADMIN', 'ACCOUNTANT', 'MODERATOR', 'TEACHER', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "role" "UserRole" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "needPasswordChange" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "staff" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nid" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL,
    "designation" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "education" JSONB,
    "role" "StaffRole" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_classes" (
    "name" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "subject_classes_pkey" PRIMARY KEY ("name","classId")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_teachers" (
    "teacherId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "subject" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_nid_key" ON "staff"("nid");

-- CreateIndex
CREATE UNIQUE INDEX "staff_phone_key" ON "staff"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "subject_teachers_subject_key" ON "subject_teachers"("subject");

-- AddForeignKey
ALTER TABLE "subject_classes" ADD CONSTRAINT "subject_classes_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "staff"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_teachers" ADD CONSTRAINT "subject_teachers_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "staff"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_teachers" ADD CONSTRAINT "subject_teachers_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
