import { and, eq, gt, gte, like, lt, lte, or } from "drizzle-orm";
import { drizzleDB } from "@/db";
import { DataSource, QueryBookFilter, UploadFileBody } from "./type";
import { books } from "@/db/schema";
import { BookResItem } from "@/interface/book";

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

    return records;
  }
}
