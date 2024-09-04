import { BookResItem } from "@/interface/book";
import { db } from "@/store/db";
import { Book } from "epubjs";
import { useNavigate } from "react-router-dom";

export const useBook = () => {
  const navigate = useNavigate();

  // function navigateToRead(id: string | number) {
  //   navigate(`/viewer/${id}`);
  // }

  async function navigateToRead(bookRes: BookResItem) {
    console.log("🚀 ~ navigateToRead ~ bookRes:", bookRes);
    const book = await db.bookCached.get(bookRes.id);

    if (book) {
      navigate(`/viewer/${book.id}`);
    } else {
      await db.bookCached
        .add({
          book_id: bookRes.id,
          title: bookRes.title,
        })
        .then(() => {
          navigate(`/viewer/${bookRes.id}`);
        })
        .catch((err) => {
          console.log("🚀 ~ navigateToRead ~ err:", err.name);
        });
    }
  }

  return {
    navigateToRead,
  };
};
