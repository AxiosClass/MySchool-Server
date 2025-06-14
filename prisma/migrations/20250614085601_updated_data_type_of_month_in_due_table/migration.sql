/*
  Warnings:

  - The `month` column on the `dues` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "dues" DROP COLUMN "month",
ADD COLUMN     "month" INTEGER;
