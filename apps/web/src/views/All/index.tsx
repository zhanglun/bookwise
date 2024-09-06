import { BookList } from "@/components/Book/List";
import { LayoutToolbar } from "@/components/LayoutToolbar";
import { request } from "@/helpers/request";
import { BookResItem } from "@/interface/book";
import { Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";

export const All = () => {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<BookResItem[]>([]);

  function getFilterList(params = {}) {
    setLoading(true);
    return request
      .get("/books", {
        params,
      })
      .then(({ data }) => {
        const { items } = data;

        setBooks(items);

        return Promise.resolve();
      })
      .finally(() => {
        setLoading(false);
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
      <BookList data={books} loading={loading} />
    </div>
  );
};
