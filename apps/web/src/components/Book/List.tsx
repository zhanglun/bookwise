import { BookResItem } from "@/interface/book";
import { BookContextMenu } from "./Menu";
import { Book } from ".";
import { useBook } from "@/hooks/book";
import { Spinner } from "@radix-ui/themes";

export interface BookListProps {
  data: BookResItem[];
  loading: boolean;
}

export const BookList = (props: BookListProps) => {
  const { data, loading } = props;
  const { navigateToRead } = useBook();

  return (
    <div className="py-2 grid gap-3 grid-cols-[repeat(auto-fill,minmax(204px,1fr))] grid-rows-1">
      <Spinner loading={loading} />
      {data.map((book) => {
        return (
          <BookContextMenu book={book}>
            <Book
              key={book.id}
              data={book}
              onClick={() => navigateToRead(book.id)}
            />
          </BookContextMenu>
        );
      })}
    </div>
  );
};
