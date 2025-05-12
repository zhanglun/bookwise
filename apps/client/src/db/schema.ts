import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

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
  data: text('data').notNull().default(''),
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
  language_uuid: uuid('language_uuid').references(() => languages.uuid),
});

export const bookAuthors = pgTable('book_authors', {
  book_uuid: uuid('book_uuid').references(() => books.uuid),
  author_uuid: uuid('author_uuid').references(() => authors.uuid),
});

export const bookPublishers = pgTable('book_publishers', {
  book_uuid: uuid('book_uuid').references(() => books.uuid),
  publisher_uuid: uuid('publisher_uuid').references(() => publishers.uuid),
});

// Relations
export const booksRelations = relations(books, ({ one, many }) => ({
  language: one(languages, {
    fields: [books.language_uuid],
    references: [languages.uuid],
  }),
  bookAuthors: many(bookAuthors, {
    fields: [books.uuid],
    references: [bookAuthors.book_uuid],
  }),
  bookPublishers: many(bookPublishers, {
    fields: [books.uuid],
    references: [bookPublishers.book_uuid],
  }),
}));

export const languagesRelations = relations(languages, ({ many }) => ({
  books: many(books, {
    fields: [languages.uuid],
    references: [books.language_uuid],
  }),
}));

export const authorsRelations = relations(authors, ({ many }) => ({
  bookAuthors: many(bookAuthors, {
    fields: [authors.uuid],
    references: [bookAuthors.author_uuid],
  }),
}));

export const publishersRelations = relations(publishers, ({ many }) => ({
  bookPublishers: many(bookPublishers, {
    fields: [publishers.uuid],
    references: [bookPublishers.publisher_uuid],
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
