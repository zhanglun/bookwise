import { drizzleDB } from "./db";
import ePub, { Book } from "epubjs";
import {
  authors,
  bookAuthors,
  bookPublishers,
  books,
  publishers,
} from "./db/schema";
import { useBearStore } from "./store";

export function initListeners() {
  const store = useBearStore.getState();

  window.addEventListener("DOMContentLoaded", () => {
    console.log(
      "🚀 ~ file: listener.ts:6 ~ window.addEventListener ~ DOMContentLoaded:"
    );

    window.electronAPI.onReadLocalFileSuccess(async (_e, args) => {
      console.log(
        "🚀 ~ file: listener.ts:17 ~ window.electronAPI.onReadLocalFileSuccess ~ args:",
        args
      );
      const book = ePub(args);
      console.log(
        "🚀 ~ file: listener.ts:26 ~ window.electronAPI.onReadLocalFileSuccess ~ book:",
        book
      );
    });

    window.electronAPI.onUploadFileSuccess(async (event, args) => {
      const record = await drizzleDB.select().from(books);

      console.log(
        "🚀 ~ file: listener.ts:13 ~ window.electronAPI.onUploadFile ~ record:",
        record
      );

      const { model } = args;
      try {
        await drizzleDB.transaction(async (tx) => {
          const [newBook] = await tx
            .insert(books)
            .values({ ...model })
            .returning();

          if (!newBook) {
            console.error("插入书籍失败");
            return null;
          }

          console.log(
            "🚀 ~ file: listener.ts:33 ~ awaitdrizzleDB.transaction ~ newBook:",
            newBook
          );

          const [author] = await tx
            .insert(authors)
            .values({
              name: model.authors,
            })
            .onConflictDoNothing()
            .returning();
          const [publisher] = await tx
            .insert(publishers)
            .values({
              name: model.publisher,
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
          }
        });
      } catch (error) {
        console.error("保存书籍出错:", error);
        throw error;
      }
    });

    window.electronAPI.onUpdateServerStatus((event, args) => {
      console.log(
        "🚀 ~ file: listener.ts:26 ~ window.electronAPI.onUpdateServerStatus ~ args:",
        args
      );
    });
  });
}
