import { and, desc, eq, gt, gte, inArray, like, lt, lte, SQL } from 'drizzle-orm';
import { drizzleDB } from '@/db';
import { authors, bookAuthors, bookCaches, bookPublishers, books, publishers } from '@/db/schema';
import { AuthorResItem, BookMetadata, BookResItem } from '@/interface/book';
import { BookQueryRecord, DataSource, QueryBookFilter, UploadFileBody } from './type';

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
        language: true,
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

    const result = [];

    for (const record of records) {
      const temp = { ...record };

      temp.authors = (temp.bookAuthors || []).map((item) => item.author);
      temp.publishers = (temp.bookPublishers || []).map((item) => item.publisher);

      delete temp.bookPublishers;
      delete temp.bookAuthors;

      result.push(temp);
    }

    return result as unknown as BookResItem[];
  }

  async getBookByUuid(uuid: string): Promise<BookResItem> {
    const record = await drizzleDB.select().from(books).where(eq(books.uuid, uuid));

    return record[0] as unknown as BookResItem;
  }

  async saveBookAndRelations(model: BookMetadata): Promise<BookResItem> {
    const res = await drizzleDB.transaction(async (tx) => {
      const [newBook] = await tx
        .insert(books)
        .values({ ...model })
        .returning();

      if (!newBook) {
        throw new Error('插入书籍失败');
      }

      const [author] = await tx
        .insert(authors)
        .values({
          name: model.authors as string,
        })
        .onConflictDoNothing()
        .returning();
      const [publisher] = await tx
        .insert(publishers)
        .values({
          name: model.publisher as string,
        })
        .onConflictDoNothing()
        .returning();

      if (newBook && author && publisher) {
        await tx.insert(bookAuthors).values({
          book_uuid: newBook.uuid,
          author_uuid: author.uuid,
        });
        await tx.insert(bookPublishers).values({
          book_uuid: newBook.uuid,
          publisher_uuid: publisher.uuid,
        });
      } else {
        tx.rollback();
        throw new Error('插入作者或出版社失败');
      }

      console.log('🚀 ~ PGLiteDataSource ~ res ~ newBook:', newBook);
      return newBook;
    });

    return res as unknown as BookResItem;
  }

  async removeBookCache(bookUuid: string) {
    await drizzleDB.delete(bookCaches).where(eq(bookCaches.book_uuid, bookUuid));
  }

  async getAuthors(): Promise<AuthorResItem[]> {
    const records = await drizzleDB.select().from(authors);

    return records as unknown as AuthorResItem[];
  }

  async updateBook(
    model: { uuid: string } & Partial<BookMetadata> & {
        author_uuids: string[];
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

    return drizzleDB.update(books).set(model).where(eq(books.uuid, model.uuid));
  }
}
