/*
  Warnings:

  - You are about to drop the column `accountAccess` on the `staffs` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `staffs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "staffs" DROP COLUMN "accountAccess",
DROP COLUMN "password",
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "students" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "teachers" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
