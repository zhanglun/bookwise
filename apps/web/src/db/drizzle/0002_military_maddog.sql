CREATE TABLE IF NOT EXISTS "book_cache" (
	"book_id" integer,
	"is_active" integer DEFAULT 0
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_cache" ADD CONSTRAINT "book_cache_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
