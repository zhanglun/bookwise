import { eq, ne } from 'drizzle-orm';
import { useNavigate } from 'react-router-dom';
import { dal } from '@/dal';
import { drizzleDB } from '@/db';
import { bookCaches } from '@/db/schema';
import { RouteConfig } from '@/Router';

export const useBook = () => {
  const navigate = useNavigate();

  async function openBook(book_uuid: string) {
    // navigate(`/viewer/${book_uuid}`);
    window.open(`/viewer/${book_uuid}`, '_blank');
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
    console.log('🚀 ~ file: book.tsx:48 ~ removeBookCache ~ book_uuid:', book_uuid);

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
    console.log('🚀 ~ file: book.tsx:75 ~ removeBookCache ~ res:', res);

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
