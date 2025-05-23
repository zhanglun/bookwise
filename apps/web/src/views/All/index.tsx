import { BookList } from "@/components/Book/List";
import { LayoutToolbar } from "@/components/LayoutToolbar";
import { useBearStore } from "@/store";
import { Heading, ScrollArea } from "@radix-ui/themes";
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
    <div className="h-full -mr-2">
      <ScrollArea className="h-full px-4">
        <LayoutToolbar />
        <BookList data={store.books} />
      </ScrollArea>
    </div>
  );
};
