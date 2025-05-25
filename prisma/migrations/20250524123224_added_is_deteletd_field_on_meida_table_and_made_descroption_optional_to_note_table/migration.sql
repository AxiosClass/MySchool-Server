-- AlterTable
ALTER TABLE "media" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "notes" ALTER COLUMN "description" DROP NOT NULL;
