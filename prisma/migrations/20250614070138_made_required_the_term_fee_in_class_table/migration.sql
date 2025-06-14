/*
  Warnings:

  - Made the column `termFee` on table `classes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "classes" ALTER COLUMN "termFee" SET NOT NULL;
