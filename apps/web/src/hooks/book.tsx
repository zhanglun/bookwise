import { RouteConfig } from "@/config";
import { dal } from "@/dal";
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

  async function activateBook(book_uuid: string) {
    await drizzleDB
      .update(bookCaches)
      .set({ is_active: 0 })
      .where(ne(bookCaches.book_uuid, book_uuid));

    await drizzleDB
      .update(bookCaches)
      .set({ is_active: 1 })
      .where(eq(bookCaches.book_uuid, book_uuid));
  }

  async function removeBookCache(book_uuid: string) {
    console.log(
      "🚀 ~ file: book.tsx:48 ~ removeBookCache ~ book_uuid:",
      book_uuid
    );

    let idx = -1;
    const newCaches = store.bookCaches.filter((item, i) => {
      if (item.book_uuid === book_uuid) {
        idx = i;
        return false;
      }
      return true;
    });

    if (idx < 0) return;

    const next = store.bookCaches[idx + 1] || store.bookCaches[idx - 1];

    store.updateBookCaches(newCaches);

    const res = await dal.removeBookCache(book_uuid);
    console.log("🚀 ~ file: book.tsx:75 ~ removeBookCache ~ res:", res);

    if (next && next.book_uuid) {
      navigate(`/viewer/${next.book_uuid}`);
    } else {
      navigate(RouteConfig.HOME);
    }
  }

  return {
    openBook,
    activateBook,
    removeBookCache,
  };
};
