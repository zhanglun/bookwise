import { desc, eq, gt, gte, like, lt, lte, SQL } from "drizzle-orm";
import { drizzleDB } from "@/db";
import {
  BookQueryRecord,
  DataSource,
  QueryBookFilter,
  UploadFileBody,
} from "./type";
import {
  books,
  authors,
  publishers,
  bookAuthors,
  bookPublishers,
  bookCaches,
} from "@/db/schema";
import { AuthorResItem, BookRequestItem, BookResItem } from "@/interface/book";

export class PGLiteDataSource implements DataSource {
  async uploadFile(files: UploadFileBody[]) {
    window.electronAPI?.uploadFile(files);
  }

  async getBooks(filter: QueryBookFilter): Promise<BookResItem[]> {
    console.log(
      "🚀 ~ file: pglite.ts:14 ~ PGLiteDataSource ~ getBooks ~ filter:",
      filter
    );

    const conditions: SQL<unknown>[] = []; // Array to hold individual conditions

    if (filter.uuid) {
      conditions.push(eq(books.uuid, filter.uuid));
    }

    if (filter.title) {
      conditions.push(like(books.title, `%${filter.title}%`)); // Case-insensitive LIKE
    }

    // if (filter.author) {
    //   conditions.push(like(books.author, `%${filter.author}%`));
    // }

    if (filter.publish_at) {
      if (typeof filter.publish_at === "object") {
        const dateFilter = filter.publish_at;
        if (dateFilter.gt) conditions.push(gt(books.publish_at, dateFilter.gt));
        if (dateFilter.lt) conditions.push(lt(books.publish_at, dateFilter.lt));
        if (dateFilter.gte)
          conditions.push(gte(books.publish_at, dateFilter.gte));
        if (dateFilter.lte)
          conditions.push(lte(books.publish_at, dateFilter.lte));
      } else {
        conditions.push(eq(books.publish_at, filter.publish_at));
      }
    }

    console.log(
      "🚀 ~ file: pglite.ts:63 ~ PGLiteDataSource ~ getBooks ~ conditions:",
      conditions
    );
    //const records = await drizzleDB
    //  .select()
    //  .from(books)
    //  .where(and(...conditions))
    //  .orderBy(desc(books.created_at));

    const records: BookQueryRecord[] = await drizzleDB.query.books.findMany({
      //where: and(...conditions),
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
      temp.publishers = (temp.bookPublishers || []).map(
        (item) => item.publisher
      );

      delete temp.bookPublishers;
      delete temp.bookAuthors;

      result.push(temp);
    }

    return result as unknown as BookResItem[];
  }

  async getBookByUuid(uuid: string): Promise<BookResItem> {
    const record = await drizzleDB
      .select()
      .from(books)
      .where(eq(books.uuid, uuid));

    return record[0] as unknown as BookResItem;
  }

  async saveBookAndRelations(model: BookRequestItem): Promise<BookResItem> {
    const res = await drizzleDB.transaction(async (tx) => {
      const [newBook] = await tx
        .insert(books)
        .values({ ...model })
        .returning();

      if (!newBook) {
        throw new Error("插入书籍失败");
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
        throw new Error("插入作者或出版社失败");
      }

      return newBook;
    });

    return res as unknown as BookResItem;
  }

  async removeBookCache(bookUuid: string) {
    await drizzleDB
      .delete(bookCaches)
      .where(eq(bookCaches.book_uuid, bookUuid));
  }

  async getAuthors(): Promise<AuthorResItem[]> {
    const records = await drizzleDB.select().from(authors);

    console.log(records);

    return records as unknown as AuthorResItem[];
  }

  async updateBook(model: { uuid: string } & Partial<BookRequestItem>) {
    console.log(
      "🚀 ~ file: pglite.ts:177 ~ PGLiteDataSource ~ updateBook ~ model:",
      model
    );
    return drizzleDB.update(books).set(model).where(eq(books.uuid, model.uuid));
  }
}
