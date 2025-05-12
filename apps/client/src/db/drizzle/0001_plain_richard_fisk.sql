CREATE TABLE IF NOT EXISTS "covers" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_uuid" uuid,
	"data" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "covers" ADD CONSTRAINT "covers_book_uuid_books_uuid_fk" FOREIGN KEY ("book_uuid") REFERENCES "public"."books"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
