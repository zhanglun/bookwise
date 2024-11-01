
import { BookList } from "@/components/Book/List";
import { useBearStore } from "@/store";
import { useEffect } from "react";

export const List = () => {
  const store = useBearStore((state) => ({
    books: state.books,
    getBooks: state.getBooks,
  }));

  useEffect(() => {
    store.getBooks({});
  }, []);

  return (
    <div className="h-full -mr-2">
      <BookList data={store.books} />
    </div>
  );
};
