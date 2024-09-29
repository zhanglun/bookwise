ALTER TABLE "books" ALTER COLUMN "source" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "path" varchar(256);