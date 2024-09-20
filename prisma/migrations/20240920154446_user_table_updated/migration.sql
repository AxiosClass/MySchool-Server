/*
  Warnings:

  - Added the required column `updateAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
ALTER COLUMN "joinedAt" SET DEFAULT CURRENT_TIMESTAMP;
