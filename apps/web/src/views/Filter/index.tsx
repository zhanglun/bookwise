import { Book } from "@/components/Book";
import { BookList } from "@/components/Book/List";
import { request } from "@/helpers/request";
import { useBook } from "@/hooks/book";
import { AuthorResItem, BookResItem, PublisherResItem } from "@/interface/book";
import { Heading, Spinner } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const Filter = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState<AuthorResItem>();
  const [publisher, setPublisher] = useState<PublisherResItem>();
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

  function getPublisherDetail(publisher_id: string) {
    return request.get(`/publishers/${publisher_id}`).then(({ data }) => {
      setPublisher(data);
      return Promise.resolve();
    });
  }

  useEffect(() => {
    const author_id = searchParams.get("author_id") || undefined;
    const publisher_id = searchParams.get("publisher_id") || undefined;
    const language_id = searchParams.get("language_id") || undefined;

    const fns = [];

    if (author_id) {
      setLoading(true);
      setBooks([]);

      fns.push(
        getFilterList({
          filter: [`author_id:eq:${author_id}`],
        }),
        getAuthorDetail(author_id)
      );
    }

    if (publisher_id) {
      setLoading(true);
      setBooks([]);

      fns.push(
        getFilterList({
          filter: [`publisher_id:eq:${publisher_id}`],
        }),
        getPublisherDetail(publisher_id)
      );
    }

    if (language_id) {
      setLoading(true);
      setBooks([]);

      fns.push(
        getFilterList({
          filter: [`language_id:eq:${language_id}`],
        })
      );
    }

    Promise.all(fns).then(() => {
      setLoading(false);
    });
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
