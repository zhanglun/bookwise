import { Book } from "@/components/Book";
import { BookList } from "@/components/Book/List";
import { request } from "@/helpers/request";
import { useBook } from "@/hooks/book";
import { AuthorResItem, BookResItem } from "@/interface/book";
import { Heading, Spinner } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const Filter = () => {
  const [searchParams] = useSearchParams();
  const { navigateToRead } = useBook();
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState<AuthorResItem>();
  const [books, setBooks] = useState<BookResItem[]>([]);

  function getFilterList(params = {}) {
    return request
      .get("/books", {
        params,
      })
      .then(({ data }) => {
        const { items } = data;

        setBooks(items);

        return Promise.resolve();
      });
  }

  function getAuthorDetail(author_id: string) {
    return request.get(`/authors/${author_id}`).then(({ data }) => {
      setAuthor(data);
      return Promise.resolve();
    });
  }

  useEffect(() => {
    const author_id = searchParams.get("author_id") || undefined;
    if (author_id) {
      setLoading(true);

      Promise.all([
        getFilterList({
          filter: [`author_id:eq:${author_id}`],
        }),
        getAuthorDetail(author_id),
      ]).then(() => {
        setLoading(false);
      });
      setBooks([]);
    }
  }, [searchParams]);

  return (
    <div className=" bg-cell h-full px-4 sm:px-4">
      <Spinner loading={loading} />
      {!loading && (
        <>
          <div className="pt-6 pb-2">
            <Heading size="7">{author?.name}</Heading>
          </div>
          <BookList data={books} loading={loading} />
        </>
      )}
    </div>
  );
};
