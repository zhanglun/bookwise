import { BookResItem } from "@/interface/book";
import { db } from "@/store/db";
import { useNavigate } from "react-router-dom";

export const useBook = () => {
  const navigate = useNavigate();

  async function openBook(bookRes: BookResItem) {
    await db.bookCached.where({ isActive: 1 }).modify({ isActive: 0 });
    const book = await db.bookCached.get({ book_id: bookRes.id });

    if (book) {
      await db.bookCached.update(bookRes.id, { isActive: 1 });
      navigate(`/viewer/${book.id}`);
    } else {
      await db.bookCached.add({
        book_id: bookRes.id,
        title: bookRes.title,
        isActive: 1,
      });
    }
    navigate(`/viewer/${bookRes.id}`);
  }

  async function activateBook(bookId: number) {
    await db.bookCached.where({ isActive: 1 }).modify({ isActive: 0 });
    const book = await db.bookCached.get({ book_id: bookId });

    if (book) {
      await db.bookCached.update(bookId, { isActive: 1 });
      navigate(`/viewer/${bookId}`);
    }
  }

  return {
    openBook,
    activateBook,
  };
};
