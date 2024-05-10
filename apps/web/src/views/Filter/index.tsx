import { Book } from "@/components/Book";
import { request } from "@/helpers/request";
import { useBook } from "@/hooks/book";
import { AuthorResItem, BookResItem } from "@/interface/book";
import { Heading, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const Filter = () => {
  const [searchParams] = useSearchParams();
  const { navigateToRead } = useBook();
  const [author, setAuthor] = useState<AuthorResItem>();
  const [books, setBooks] = useState<BookResItem[]>([]);
  const [total, setTotal] = useState(0);

  function getFilterList(params: any) {
    request
      .get("/books", {
        params,
      })
      .then(({ data }) => {
        const { total, items } = data;

        setTotal(total);
        setBooks(items);
      });
  }

  function getAuthorDetail(author_id: string) {
    request.get(`/authors/${author_id}`).then(({ data }) => {
      setAuthor(data);
    });
  }

  useEffect(() => {
    const author_id = searchParams.get("author_id") || undefined;
    if (author_id) {
      console.log("%c Line:10 🍻 location", "color:#42b983", searchParams);

      getFilterList({
        filter: [`author_id:eq:${author_id}`],
      });

      getAuthorDetail(author_id);
    }
  }, [searchParams]);

  return (
    <div className=" bg-cell h-full px-4 sm:px-4">
      <Heading size="5">{author?.name}</Heading>
      <div className="py-2 grid gap-3 grid-cols-4 grid-rows-1">
        {books.map((book: BookResItem) => {
          return (
            <Book
              key={book.id}
              data={book}
              onClick={() => navigateToRead(book.id)}
            />
          );
        })}
      </div>
    </div>
  );
};
