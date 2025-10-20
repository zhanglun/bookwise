import { relations } from 'drizzle-orm';
import {
  customType,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

const bytea = customType<{ data: Uint8Array; notNull: false; default: false }>({
  dataType() {
    return 'bytea';
  },
  // 将 JS 的 Uint8Array 转换为 PGlite 的 BYTEA 格式（ArrayBuffer）
  toDriver: (value: Uint8Array) => {
    return value;
  },
  // 从 PGlite 读取时，将 ArrayBuffer 转换回 Uint8Array
  fromDriver: (value: ArrayBuffer | unknown) => {
    return new Uint8Array(value as ArrayBuffer);
  },
});

// Enums
export const bookFormatEnum = pgEnum('format', ['EPUB', 'PDF', 'MOBI', 'TEXT', 'UNKNOWN']);

// Tables
export const languages = pgTable('languages', {
  uuid: uuid('uuid').defaultRandom().notNull().primaryKey(),
  name: varchar('name', { length: 50 }),
  code: varchar('code', { length: 10 }),
});

export const authors = pgTable('authors', {
  uuid: uuid('uuid').defaultRandom().notNull().primaryKey(),
  name: varchar('name').default(''),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
});

export const publishers = pgTable('publishers', {
  uuid: uuid('uuid').defaultRandom().notNull().primaryKey(),
  name: varchar('name').default(''),
  address: varchar('address', { length: 255 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
});

export const covers = pgTable('covers', {
  uuid: uuid('uuid').defaultRandom().notNull().primaryKey(),
  data: bytea('data'),
});

export const blobs = pgTable('blobs', {
  uuid: uuid('uuid').defaultRandom().notNull().primaryKey(),
  data: bytea('data'),
});

export const books = pgTable('books', {
  uuid: uuid('uuid').defaultRandom().notNull().primaryKey(),
  title: varchar('title', { length: 256 }).default(''),
  identifier: varchar('identifier', { length: 256 }).default(''),
  subject: varchar('subject', { length: 256 }).default(''),
  description: text('description').default(''),
  contributor: varchar('contributor', { length: 256 }).default(''),
  source: varchar('source', { length: 256 }).default(''),
  format: bookFormatEnum('format'),
  page_count: integer('page_count'),
  isbn: varchar('isbn', { length: 20 }),
  path: varchar('path', { length: 256 }),
  publish_at: timestamp('publish_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
});

export const bookCovers = pgTable('book_covers', {
  book_uuid: uuid('book_uuid').references(() => books.uuid),
  cover_uuid: uuid('cover_uuid').references(() => covers.uuid),
});

export const bookBlobs = pgTable('book_blobs', {
  book_uuid: uuid('book_uuid').references(() => books.uuid),
  blob_uuid: uuid('blob_uuid').references(() => blobs.uuid),
});

export const bookAuthors = pgTable('book_authors', {
  book_uuid: uuid('book_uuid').references(() => books.uuid),
  author_uuid: uuid('author_uuid').references(() => authors.uuid),
});

export const bookPublishers = pgTable('book_publishers', {
  book_uuid: uuid('book_uuid').references(() => books.uuid),
  publisher_uuid: uuid('publisher_uuid').references(() => publishers.uuid),
});

export const bookLanguages = pgTable('book_languages', {
  book_uuid: uuid('book_uuid').references(() => books.uuid),
  language_uuid: uuid('language_uuid').references(() => languages.uuid),
});

export const booksRelations = relations(books, ({ one, many }) => ({
  bookLanguages: one(bookLanguages, {
    fields: [books.uuid],
    references: [bookLanguages.book_uuid],
  }),
  bookAuthors: many(bookAuthors),
  bookPublishers: many(bookPublishers),
  bookCovers: one(bookCovers),
}));

export const bookLanguagesRelations = relations(bookLanguages, ({ one }) => ({
  book: one(books, {
    fields: [bookLanguages.book_uuid],
    references: [books.uuid],
  }),
  language: one(languages, {
    fields: [bookLanguages.language_uuid],
    references: [languages.uuid],
  }),
}));

export const bookCoversRelations = relations(bookCovers, ({ one }) => ({
  book: one(books, {
    fields: [bookCovers.book_uuid],
    references: [books.uuid],
  }),
  cover: one(covers, {
    fields: [bookCovers.cover_uuid],
    references: [covers.uuid],
  }),
}));

export const bookAuthorsRelations = relations(bookAuthors, ({ one }) => ({
  book: one(books, {
    fields: [bookAuthors.book_uuid],
    references: [books.uuid],
  }),
  author: one(authors, {
    fields: [bookAuthors.author_uuid],
    references: [authors.uuid],
  }),
}));

export const bookPublishersRelations = relations(bookPublishers, ({ one }) => ({
  book: one(books, {
    fields: [bookPublishers.book_uuid],
    references: [books.uuid],
  }),
  publisher: one(publishers, {
    fields: [bookPublishers.publisher_uuid],
    references: [publishers.uuid],
  }),
}));

export const bookCaches = pgTable('book_caches', {
  book_uuid: uuid('book_uuid').references(() => books.uuid),
  is_active: integer('is_active').default(0),
});
