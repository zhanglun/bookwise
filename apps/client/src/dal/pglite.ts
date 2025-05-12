import { and, desc, eq, gt, gte, inArray, like, lt, lte, SQL } from 'drizzle-orm';
import { drizzleDB } from '@/db';
import {
  authors,
  bookAuthors,
  bookCaches,
  bookCovers,
  bookPublishers,
  books,
  covers,
  publishers,
} from '@/db/schema';
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
        bookCovers: {
          with: {
            cover: true,
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

  async saveBookAndRelations(model: BookMetadata, cover: string): Promise<BookResItem> {
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

      let author = await drizzleDB
        .select()
        .from(authors)
        .where(eq(authors.name, model.authors as string))
        .then((rows) => rows[0]);

      if (!author) {
        [author] = await drizzleDB
          .insert(authors)
          .values({
            name: model.authors as string,
          })
          .returning();
        if (!author) {
          throw new Error('创建作者失败');
        }
      }

      let publisher = await drizzleDB
        .select()
        .from(publishers)
        .where(eq(publishers.name, model.publisher as string))
        .then((rows) => rows[0]);

      if (!publisher) {
        [publisher] = await drizzleDB
          .insert(publishers)
          .values({
            name: model.publisher as string,
          })
          .returning();
        if (!publisher) {
          throw new Error('创建出版社失败');
        }
      }

      const bookAuthorResult = await drizzleDB
        .insert(bookAuthors)
        .values({
          book_uuid: newBook.uuid,
          author_uuid: author.uuid,
        })
        .returning();
      if (!bookAuthorResult || bookAuthorResult.length === 0) {
        throw new Error('建立书籍作者关联失败');
      }

      const bookPublisherResult = await drizzleDB
        .insert(bookPublishers)
        .values({
          book_uuid: newBook.uuid,
          publisher_uuid: publisher.uuid,
        })
        .returning();
      if (!bookPublisherResult || bookPublisherResult.length === 0) {
        throw new Error('建立书籍出版社关联失败');
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
