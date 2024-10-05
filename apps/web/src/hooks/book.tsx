import { drizzleDB } from "@/db";
import { bookCaches, books } from "@/db/schema";
import { BookResItem } from "@/interface/book";
import { useBearStore } from "@/store";
import { eq, ne } from "drizzle-orm";
import { useNavigate } from "react-router-dom";

export const useBook = () => {
  const store = useBearStore((state) => ({
    bookCaches: state.bookCaches,
    updateBookCache: state.updateBookCache,
  }));
  const navigate = useNavigate();

  async function openBook(bookRes: BookResItem) {
    navigate(`/viewer/${bookRes.id}`);

    const [book] = await drizzleDB
      .select()
      .from(bookCaches)
      .where(eq(bookCaches.book_id, bookRes.id));

    if (!book) {
      const a = await drizzleDB.insert(bookCaches).values({
        book_id: bookRes.id,
        is_active: 1,
      });
      console.log("🚀 ~ file: book.tsx:30 ~ a ~ a:", a);
    }

    await activateBook(bookRes.id);
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

  return {
    openBook,
    activateBook,
  };
};
