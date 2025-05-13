CREATE TABLE IF NOT EXISTS "book_languages" (
	"book_uuid" uuid,
	"language_uuid" uuid
);
--> statement-breakpoint
ALTER TABLE "books" DROP CONSTRAINT "books_language_uuid_languages_uuid_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_languages" ADD CONSTRAINT "book_languages_book_uuid_books_uuid_fk" FOREIGN KEY ("book_uuid") REFERENCES "public"."books"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_languages" ADD CONSTRAINT "book_languages_language_uuid_languages_uuid_fk" FOREIGN KEY ("language_uuid") REFERENCES "public"."languages"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "books" DROP COLUMN IF EXISTS "language_uuid";