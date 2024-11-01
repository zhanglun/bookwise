DO $$ BEGIN
 CREATE TYPE "public"."format" AS ENUM('EPUB', 'PDF', 'MOBI', 'TEXT', 'UNKNOWN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authors" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar DEFAULT '',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "book_authors" (
	"book_uuid" uuid,
	"author_uuid" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "book_caches" (
	"book_uuid" uuid,
	"is_active" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "book_publishers" (
	"book_uuid" uuid,
	"publisher_uuid" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "books" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(256) DEFAULT '',
	"identifier" varchar(256) DEFAULT '',
	"subject" varchar(256) DEFAULT '',
	"description" text DEFAULT '',
	"contributor" varchar(256) DEFAULT '',
	"source" varchar(256) DEFAULT '',
	"format" "format",
	"page_count" integer,
	"isbn" varchar(20),
	"path" varchar(256),
	"publish_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"language_uuid" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "languages" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50),
	"code" varchar(10)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "publishers" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar DEFAULT '',
	"address" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_authors" ADD CONSTRAINT "book_authors_book_uuid_books_uuid_fk" FOREIGN KEY ("book_uuid") REFERENCES "public"."books"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_authors" ADD CONSTRAINT "book_authors_author_uuid_authors_uuid_fk" FOREIGN KEY ("author_uuid") REFERENCES "public"."authors"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_caches" ADD CONSTRAINT "book_caches_book_uuid_books_uuid_fk" FOREIGN KEY ("book_uuid") REFERENCES "public"."books"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_publishers" ADD CONSTRAINT "book_publishers_book_uuid_books_uuid_fk" FOREIGN KEY ("book_uuid") REFERENCES "public"."books"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_publishers" ADD CONSTRAINT "book_publishers_publisher_uuid_publishers_uuid_fk" FOREIGN KEY ("publisher_uuid") REFERENCES "public"."publishers"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "books" ADD CONSTRAINT "books_language_uuid_languages_uuid_fk" FOREIGN KEY ("language_uuid") REFERENCES "public"."languages"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
