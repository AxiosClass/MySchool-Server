/*
  Warnings:

  - You are about to drop the column `role` on the `staffs` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `teachers` table. All the data in the column will be lost.
  - Added the required column `role` to the `admins` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT');

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "role" "AdminRole" NOT NULL;

-- AlterTable
ALTER TABLE "staffs" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "role";

-- DropEnum
DROP TYPE "StaffRole";
