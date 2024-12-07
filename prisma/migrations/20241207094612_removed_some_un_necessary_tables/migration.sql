/*
  Warnings:

  - You are about to drop the `expense_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `expenses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `salaries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staffs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "salaries" DROP CONSTRAINT "salaries_staffId_fkey";

-- DropForeignKey
ALTER TABLE "salaries" DROP CONSTRAINT "salaries_teacherId_fkey";

-- DropTable
DROP TABLE "expense_categories";

-- DropTable
DROP TABLE "expenses";

-- DropTable
DROP TABLE "salaries";

-- DropTable
DROP TABLE "staffs";

-- DropEnum
DROP TYPE "SalaryType";
