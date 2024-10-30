import { BookResItem } from "@/interface/book";
import { useBook } from "@/hooks/book";
import { Book } from "./";

export interface BookListProps {
  data: BookResItem[];
}

export const BookList = (props: BookListProps) => {
  const { data } = props;
  const { openBook } = useBook();

  return (
    <div className="py-2 grid items-end gap-x-4 gap-y-12 grid-cols-[repeat(auto-fill,minmax(144px,1fr))] grid-rows-1">
      {data.map((book) => {
        return (
          <Book
            key={book.uuid}
            data={book}
            onClick={() => openBook(book.uuid, book.title)}
          />
        );
      })}
    </div>
  );
};
