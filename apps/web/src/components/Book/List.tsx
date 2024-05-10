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
    <div className="py-2 grid gap-3 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 grid-rows-1">
      <Spinner loading={loading} />
      {data.map((book) => {
        return (
          <BookContextMenu>
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
