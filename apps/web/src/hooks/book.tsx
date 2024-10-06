import { drizzleDB } from "@/db";
import { bookCaches } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import { useNavigate } from "react-router-dom";

export const useBook = () => {
  const navigate = useNavigate();

  async function openBook(book_id: number) {
    navigate(`/viewer/${book_id}`);

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

  return {
    openBook,
    activateBook,
  };
};
