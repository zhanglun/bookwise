import { and, eq, gt, gte, like, lt, lte, or } from "drizzle-orm";
import { drizzleDB } from "@/db";
import { DataSource, QueryBookFilter, UploadFileBody } from "./type";
import {
  books,
  authors,
  publishers,
  bookAuthors,
  bookPublishers,
} from "@/db/schema";
import { AuthorResItem, BookRequestItem, BookResItem } from "@/interface/book";

export class PGLiteDataSource implements DataSource {
  async uploadFile(body: UploadFileBody) {
    console.log("🚀 ~ PGLiteDataSource ~ uploadFile ~ body:", body);
    await window.electronAPI?.uploadFile(body);
  }

  async getBooks(filter: QueryBookFilter): Promise<BookResItem[]> {
    console.log(
      "🚀 ~ file: pglite.ts:14 ~ PGLiteDataSource ~ getBooks ~ filter:",
      filter
    );
    // let whereClause = undefined;

    // const conditions: any[] = []; // Array to hold individual conditions

    // if (filter.id) {
    //   conditions.push(eq(books.id, filter.id));
    // }

    // if (filter.title) {
    //   conditions.push(like(books.title, `%${filter.title}%`)); // Case-insensitive LIKE
    // }

    // if (filter.author) {
    //   conditions.push(like(books.author, `%${filter.author}%`));
    // }

    // if (filter.publishedAt) {
    //   if (typeof filter.publishedAt === "object") {
    //     const dateFilter = filter.publishedAt;
    //     if (dateFilter.gt)
    //       conditions.push(gt(books.publishedAt, dateFilter.gt));
    //     if (dateFilter.lt)
    //       conditions.push(lt(books.publishedAt, dateFilter.lt));
    //     if (dateFilter.gte)
    //       conditions.push(gte(books.publishedAt, dateFilter.gte));
    //     if (dateFilter.lte)
    //       conditions.push(lte(books.publishedAt, dateFilter.lte));
    //   } else {
    //     conditions.push(eq(books.publishedAt, filter.publishedAt));
    //   }
    // }
    const records = await drizzleDB.select().from(books);

    return records as unknown as BookResItem[];
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

  async getAuthors(): Promise<AuthorResItem[]> {
    const records = await drizzleDB.select().from(authors);

    return records as unknown as AuthorResItem[];
  }
}
