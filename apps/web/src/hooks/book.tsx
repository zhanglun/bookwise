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

  async function openBook(book_id: number, book_title: string) {
    navigate(`/viewer/${book_id}`);

    const idx = store.bookCaches.findIndex((item) => item.book_id === book_id);

    if (idx > -1) {
      store.bookCaches[idx].is_active = 1;
      return;
    } else {
      store.bookCaches.push({
        book_id,
        book_title,
        is_active: 1,
      });
    }

    store.updateBookCaches([...store.bookCaches]);

    const [book] = await drizzleDB
      .select()
      .from(bookCaches)
      .where(eq(bookCaches.book_id, book_id));

    if (!book) {
      const a = await drizzleDB.insert(bookCaches).values({
        book_id,
        is_active: 1,
      });
      console.log("🚀 ~ file: book.tsx:30 ~ a ~ a:", a);
    }

    await activateBook(book_id);
  }

  async function activateBook(bookId: number) {
    await drizzleDB
      .update(bookCaches)
      .set({ is_active: 0 })
      .where(ne(bookCaches.book_id, bookId));

    await drizzleDB
      .update(bookCaches)
      .set({ is_active: 1 })
      .where(eq(bookCaches.book_id, bookId));
  }

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Remove a book from the cache.
   * @param bookId The book ID to remove.
   */
  /******  8954fcfa-0373-46d3-b505-ca6eca3c44a2  *******/

  async function removeBookCache(bookId: number) {
    console.log("🚀 ~ file: book.tsx:48 ~ removeBookCache ~ bookId:", bookId);
    const res = await drizzleDB
      .delete(bookCaches)
      .where(eq(bookCaches.book_id, bookId));
    console.log("🚀 ~ file: book.tsx:50 ~ removeBookCache ~ res:", res);
  }

  return {
    openBook,
    activateBook,
    removeBookCache,
  };
};
