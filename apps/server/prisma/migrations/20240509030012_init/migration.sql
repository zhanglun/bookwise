-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "rights" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "subject" SET DEFAULT '',
ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "contributor" SET DEFAULT '',
ALTER COLUMN "source" SET DEFAULT '',
ALTER COLUMN "page_count" SET DEFAULT 0,
ALTER COLUMN "isbn" SET DEFAULT '',
ALTER COLUMN "path" SET DEFAULT '';
