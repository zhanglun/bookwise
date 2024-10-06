import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  varchar,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// declaring enum in database
export const bookFormatEnum = pgEnum("format", [
  "EPUB",
  "PDF",
  "MOBI",
  "TEXT",
  "UNKNOWN",
]);

export const books = pgTable("books", {
  uuid: uuid("uuid").defaultRandom().notNull().primaryKey(),
  title: varchar("title", { length: 256 }).unique().default(""),
  identifier: varchar("identifier", { length: 256 }).default(""),
  subject: varchar("subject", { length: 256 }).default(""),
  description: text("description").default(""),
  contributor: varchar("contributor", { length: 256 }).default(""),
  source: varchar("source", { length: 256 }).default(""),
  format: bookFormatEnum("format"),
  page_count: integer("page_count"),
  isbn: varchar("isbn", { length: 20 }),
  path: varchar("path", { length: 256 }),
  publish_at: timestamp("publish_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
  language_uuid: uuid("language_uuid").references(() => languages.uuid),
  // additional_infos         BookAdditionalInfo?
  // notes                    Note[]
});

export const authors = pgTable("authors", {
  uuid: uuid("uuid").defaultRandom().notNull().primaryKey(),
  name: varchar("name").default(""),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

export const bookAuthors = pgTable("book_authors", {
  book_uuid: uuid("book_uuid").references(() => books.uuid),
  author_uuid: uuid("author_uuid").references(() => authors.uuid),
});

export const publishers = pgTable("publishers", {
  uuid: uuid("uuid").defaultRandom().notNull().primaryKey(),
  name: varchar("name").default(""),
  address: varchar("address", { length: 255 }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

export const languages = pgTable("languages", {
  uuid: uuid("uuid").defaultRandom().notNull().primaryKey(),
  name: varchar("name", { length: 50 }),
  code: varchar("code", { length: 10 }),
});

export const bookRelations = relations(books, ({ many, one }) => ({
  bookAuthors: many(bookAuthors),
  bookPublishers: many(bookPublishers),
  language: one(languages),
}));

export const bookPublishers = pgTable("book_publishers", {
  book_uuid: uuid("book_uuid").references(() => books.uuid),
  publisher_uuid: uuid("publisher_uuid").references(() => publishers.uuid),
});

export const bookCaches = pgTable("book_caches", {
  book_uuid: uuid("book_uuid").references(() => books.uuid),
  is_active: integer("is_active").default(0),
})
