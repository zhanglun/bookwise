import { BookResItem } from "@/interface/book";
import { BookContextMenu } from "./Menu";
import { useBook } from "@/hooks/book";
import { Spinner } from "@radix-ui/themes";
import { Book } from "./";

export interface BookListProps {
  data: BookResItem[];
  loading: boolean;
}

export const BookList = (props: BookListProps) => {
  const { data, loading } = props;
  const { navigateToRead } = useBook();

  return (
    <div className="py-2 grid items-end gap-x-4 gap-y-12 grid-cols-[repeat(auto-fill,minmax(144px,1fr))] grid-rows-1">
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
