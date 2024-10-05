ALTER TABLE "book_cache" RENAME TO "book_caches";--> statement-breakpoint
ALTER TABLE "book_caches" DROP CONSTRAINT "book_cache_book_id_books_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_caches" ADD CONSTRAINT "book_caches_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
