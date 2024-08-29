import { BookList } from "@/components/Book/List";
import { request } from "@/helpers/request";
import { BookResItem } from "@/interface/book";
import { Heading, Spinner } from "@radix-ui/themes";
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
    <div className=" bg-cell h-full px-4 sm:px-4">
      <Spinner loading={loading} />
      {!loading && (
        <>
          <div className="pt-6 pb-2">
            <Heading size="7">All</Heading>
          </div>
          <BookList data={books} loading={loading} />
        </>
      )}
    </div>
  );
};
