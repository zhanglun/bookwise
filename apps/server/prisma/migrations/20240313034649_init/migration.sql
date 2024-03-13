-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "spine_index" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "spine_name" TEXT NOT NULL DEFAULT '';
