import { drizzleDB } from "@/db";
import { bookCaches } from "@/db/schema";
import { useBearStore } from "@/store";
import { eq, ne } from "drizzle-orm";
import { useNavigate } from "react-router-dom";

export const useBook = () => {
  const navigate = useNavigate();
  const store = useBearStore((state) => ({
    bookCaches: state.bookCaches,
    updateBookCaches: state.updateBookCaches,
    getBookCachesRefresh: state.getBookCachesRefresh,
  }));

  async function openBook(book_uuid: string, book_title: string) {
    navigate(`/viewer/${book_uuid}`);

    const idx = store.bookCaches.findIndex(
      (item) => item.book_uuid === book_uuid
    );

    if (idx > -1) {
      store.bookCaches[idx].is_active = 1;
      return;
    } else {
      store.bookCaches.push({
        book_uuid,
        book_title,
        is_active: 1,
      });
    }

    store.updateBookCaches([...store.bookCaches]);

    const [book] = await drizzleDB
      .select()
      .from(bookCaches)
      .where(eq(bookCaches.book_uuid, book_uuid));

    if (!book) {
      const a = await drizzleDB.insert(bookCaches).values({
        book_uuid,
        is_active: 1,
      });
      console.log("🚀 ~ file: book.tsx:30 ~ a ~ a:", a);
    }

    await activateBook(book_uuid);
  }

  async function activateBook(bookUuid: string) {
    await drizzleDB
      .update(bookCaches)
      .set({ is_active: 0 })
      .where(ne(bookCaches.book_uuid, bookUuid));

    await drizzleDB
      .update(bookCaches)
      .set({ is_active: 1 })
      .where(eq(bookCaches.book_uuid, bookUuid));
  }

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Remove a book from the cache.
   * @param bookUuid The book ID to remove.
   */
  /******  8954fcfa-0373-46d3-b505-ca6eca3c44a2  *******/

  async function removeBookCache(bookUuid: string) {
    console.log(
      "🚀 ~ file: book.tsx:48 ~ removeBookCache ~ bookUuid:",
      bookUuid
    );
    const res = await drizzleDB
      .delete(bookCaches)
      .where(eq(bookCaches.book_uuid, bookUuid));
    console.log("🚀 ~ file: book.tsx:50 ~ removeBookCache ~ res:", res);
  }

  return {
    openBook,
    activateBook,
    removeBookCache,
  };
};
