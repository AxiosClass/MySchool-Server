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

-- CreateIndex
CREATE UNIQUE INDEX "staff_nid_key" ON "staff"("nid");
