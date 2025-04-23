-- AlterTable
ALTER TABLE "students" ADD COLUMN     "needPasswordChange" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "needPasswordChange" BOOLEAN NOT NULL DEFAULT true;
