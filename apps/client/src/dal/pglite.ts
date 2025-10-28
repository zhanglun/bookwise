import { and, desc, eq, gt, gte, inArray, like, lt, lte, SQL } from 'drizzle-orm';
import { drizzleDB } from '@/db';
import {
  authors,
  blobs,
  bookAuthors,
  bookBlobs,
  bookCaches,
  bookCovers,
  bookPublishers,
  books,
  covers,
  languages,
  publishers,
} from '@/db/schema';
import {
  AuthorResItem,
  BookMetadata,
  BookResItem,
  LanguageResItem,
  PublisherResItem,
} from '@/interface/book';
import { BookQueryRecord, CoverQueryRecord, DataSource, QueryBookFilter } from './type';

export class PGLiteDataSource implements DataSource {
  async getBooks(filter: QueryBookFilter): Promise<BookResItem[]> {
    const conditions: SQL<unknown>[] = []; // Array to hold individual conditions

    if (filter.uuid) {
      conditions.push(eq(books.uuid, filter.uuid));
    }

    const records: BookQueryRecord[] = await drizzleDB.query.books.findMany({
      where: and(...conditions),
      orderBy: [desc(books.created_at)],
      with: {
        bookLanguages: {
          with: {
            language: true,
          },
        },
        bookAuthors: {
          with: {
            author: true,
          },
        },
        bookPublishers: {
          with: {
            publisher: true,
          },
        },
      },
    });

    const bookUuids = records.map((item) => item.uuid);
    const coverRecords = await drizzleDB
      .select({
        bookUuid: bookCovers.book_uuid,
        cover: covers,
      })
      .from(bookCovers)
      .innerJoin(covers, eq(bookCovers.cover_uuid, covers.uuid))
      .where(inArray(bookCovers.book_uuid, bookUuids));

    const coverMap = new Map<string, CoverQueryRecord>();

    for (const record of coverRecords) {
      coverMap.set(record.bookUuid as string, record.cover);
    }

    const result = [];

    for (const record of records) {
      record.authors = (record.bookAuthors || []).map((item) => item.author);
      record.publishers = (record.bookPublishers || []).map((item) => item.publisher);
      record.cover = coverMap.get(record.uuid) as CoverQueryRecord;

      delete record.bookPublishers;
      delete record.bookAuthors;

      result.push(record);
    }

    return result as unknown as BookResItem[];
  }

  async getBookByUuid(uuid: string): Promise<BookResItem> {
    const record = await drizzleDB.select().from(books).where(eq(books.uuid, uuid));

    if (record[0]) {
      const coverRecords = await drizzleDB
        .select({
          bookUuid: bookCovers.book_uuid,
          cover: covers,
        })
        .from(bookCovers)
        .innerJoin(covers, eq(bookCovers.cover_uuid, covers.uuid))
        .where(eq(bookCovers.book_uuid, record[0].uuid));

      if (coverRecords[0]) {
        record[0].cover = coverRecords[0]?.cover || null;
      }
    }

    return record[0] as unknown as BookResItem;
  }

  async getBookBlob(uuid: string): Promise<ArrayBuffer | null> {
    const record = await drizzleDB.select().from(bookBlobs).where(eq(bookBlobs.book_uuid, uuid));

    if (record.length === 0) {
      return null;
    }

    const file = await drizzleDB
      .select()
      .from(blobs)
      .where(eq(blobs.uuid, record[0].blob_uuid as string));

    return file[0] as unknown as ArrayBuffer;
  }

  async saveBookAndRelations(
    model: BookMetadata,
    file: Uint8Array,
    cover: Uint8Array | null
  ): Promise<BookResItem> {
    if (!file) {
      throw new Error('文件不存在');
    }

    try {
      const [newBook] = await drizzleDB
        .insert(books)
        .values({ ...model })
        .returning();

      if (!newBook) {
        throw new Error('插入书籍失败');
      }

      const coverRecord = await drizzleDB
        .insert(covers)
        .values({
          data: cover,
        })
        .returning();

      await drizzleDB
        .insert(bookCovers)
        .values({
          book_uuid: newBook.uuid,
          cover_uuid: coverRecord[0]?.uuid || '',
        })
        .returning();

      const blobRecord = await drizzleDB.insert(blobs).values({ data: file }).returning();

      await drizzleDB
        .insert(bookBlobs)
        .values({
          book_uuid: newBook.uuid,
          blob_uuid: blobRecord[0]?.uuid || '',
        })
        .returning();

      if (model.authors.length) {
        const existingAuthors = await drizzleDB
          .select()
          .from(authors)
          .where(inArray(authors.name, model.authors as string[]));
        const existingNames = new Set(existingAuthors.map((a) => a.name));

        const newAuthorNames = (model.authors as string[]).filter(
          (name) => !existingNames.has(name)
        );

        if (newAuthorNames.length > 0) {
          const insertAuthorResult = await drizzleDB
            .insert(authors)
            .values(newAuthorNames.map((name) => ({ name })))
            .returning({ uuid: authors.uuid, name: authors.name });
          const authorUuids = insertAuthorResult.map((a) => a.uuid);

          if (authorUuids.length > 0) {
            const bookAuthorValues = authorUuids.map((uuid) => ({
              book_uuid: newBook.uuid,
              author_uuid: uuid,
            }));
            const bookAuthorResult = await drizzleDB
              .insert(bookAuthors)
              .values(bookAuthorValues)
              .returning();
            if (!bookAuthorResult || bookAuthorResult.length === 0) {
              throw new Error('建立书籍作者关联失败');
            }
          }
        }
      }

      if (model.publishers.length) {
        const existingPublishers = await drizzleDB
          .select()
          .from(publishers)
          .where(inArray(publishers.name, model.publishers as string[]));
        const existingNames = new Set(existingPublishers.map((p) => p.name));

        const newPublisherNames = (model.publishers as string[]).filter(
          (name) => !existingNames.has(name)
        );

        if (newPublisherNames.length > 0) {
          const insertPublishers = await drizzleDB
            .insert(publishers)
            .values(newPublisherNames.map((name) => ({ name })))
            .returning({ uuid: publishers.uuid, name: publishers.name });

          const publisherUuids = insertPublishers.map((p) => p.uuid);

          if (publisherUuids.length > 0) {
            const bookPublisherValues = publisherUuids.map((uuid) => ({
              book_uuid: newBook.uuid,
              publisher_uuid: uuid,
            }));
            const bookPublisherResult = await drizzleDB
              .insert(bookPublishers)
              .values(bookPublisherValues)
              .returning();
            if (!bookPublisherResult || bookPublisherResult.length === 0) {
              throw new Error('建立书籍出版社关联失败');
            }
          }
        }
      }

      return newBook as unknown as BookResItem;
    } catch (error) {
      console.error('保存书籍及相关数据时发生错误:', error);
      throw error;
    }
  }

  async removeBookCache(bookUuid: string) {
    await drizzleDB.delete(bookCaches).where(eq(bookCaches.book_uuid, bookUuid));
  }

  async getAuthors(): Promise<AuthorResItem[]> {
    const records = await drizzleDB.select().from(authors);

    return records as unknown as AuthorResItem[];
  }

  async getPublishers(): Promise<PublisherResItem[]> {
    const records = await drizzleDB.select().from(publishers);

    return records as unknown as PublisherResItem[];
  }

  async getLanguages(): Promise<LanguageResItem[]> {
    const records = await drizzleDB.select().from(languages);

    return records as unknown as LanguageResItem[];
  }

  async updateBook(
    model: { uuid: string } & Partial<BookMetadata> & {
        author_uuids: string[];
        publisher_uuids: string[];
      }
  ) {
    console.log('🚀 ~ file: pglite.ts:177 ~ PGLiteDataSource ~ updateBook ~ model:', model);
    const book = await drizzleDB.query.books.findFirst({
      where: eq(books.uuid, model.uuid),
    });

    if (!book) {
      return {
        error: 'BookNotFoundError',
        message: `Book with uuid ${model.uuid} not found`,
      };
    }

    if (model.author_uuids) {
      const values = model.author_uuids.map((uuid) => {
        return {
          author_uuid: uuid,
          book_uuid: model.uuid,
        };
      });

      await drizzleDB.delete(bookAuthors).where(eq(bookAuthors.book_uuid, model.uuid));
      await drizzleDB.insert(bookAuthors).values(values);
    }

    if (model.publisher_uuids) {
      const values = model.publisher_uuids.map((uuid) => {
        return {
          publisher_uuid: uuid,
          book_uuid: model.uuid,
        };
      });

      await drizzleDB.delete(bookPublishers).where(eq(bookPublishers.book_uuid, model.uuid));
      await drizzleDB.insert(bookPublishers).values(values);
    }

    console.log('🚀 ~ PGLiteDataSource ~ model:', model);
    return drizzleDB.update(books).set(model).where(eq(books.uuid, model.uuid));
  }
}
