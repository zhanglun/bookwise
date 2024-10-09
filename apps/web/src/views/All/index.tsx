import { BookList } from "@/components/Book/List";
import { LayoutToolbar } from "@/components/LayoutToolbar";
import { dal } from "@/dal";
import { BookResItem } from "@/interface/book";
import { Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";

export const All = () => {
  const [books, setBooks] = useState<BookResItem[]>([]);

  function getFilterList() {
    return dal.getBooks({}).then((books) => {
      setBooks(books);
      return Promise.resolve();
    });
  }

  useEffect(() => {
    getFilterList();
  }, []);

  return (
    <div className="h-full px-4 sm:px-4">
      <div className="py-2 flex justify-between">
        <Heading size="5">All</Heading>
        <LayoutToolbar />
      </div>
      <BookList data={books} />
    </div>
  );
};
