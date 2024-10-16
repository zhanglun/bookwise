import { BookList } from "@/components/Book/List";
import { LayoutToolbar } from "@/components/LayoutToolbar";
import { useBearStore } from "@/store";
import { Heading } from "@radix-ui/themes";
import { useEffect } from "react";

export const All = () => {
  const store = useBearStore((state) => ({
    books: state.books,
    getBooks: state.getBooks,
  }));

  useEffect(() => {
    store.getBooks({});
  }, []);

  return (
    <div className="h-full px-4 sm:px-4">
      <div className="py-2 flex justify-between">
        <Heading size="5">All</Heading>
      </div>
      <LayoutToolbar />
      <BookList data={store.books} />
    </div>
  );
};
