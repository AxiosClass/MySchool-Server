-- AlterTable
ALTER TABLE "students" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
