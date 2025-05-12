CREATE TABLE IF NOT EXISTS "book_covers" (
	"book_uuid" uuid,
	"cover_uuid" uuid
);
--> statement-breakpoint
ALTER TABLE "covers" DROP CONSTRAINT "covers_book_uuid_books_uuid_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_covers" ADD CONSTRAINT "book_covers_book_uuid_books_uuid_fk" FOREIGN KEY ("book_uuid") REFERENCES "public"."books"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_covers" ADD CONSTRAINT "book_covers_cover_uuid_covers_uuid_fk" FOREIGN KEY ("cover_uuid") REFERENCES "public"."covers"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "covers" DROP COLUMN IF EXISTS "book_uuid";