-- CreateEnum
CREATE TYPE "TermStatus" AS ENUM ('PENDING', 'ONGOING', 'ENDED');

-- CreateTable
CREATE TABLE "terms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "status" "TermStatus" NOT NULL DEFAULT 'PENDING',
    "classSubjects" JSONB NOT NULL,
    "StudentClass" JSONB NOT NULL,

    CONSTRAINT "terms_pkey" PRIMARY KEY ("id")
);
