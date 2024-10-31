import { BookResItem } from "@/interface/book";
import { useBook } from "@/hooks/book";
import { Book } from "./";
import { useBearStore } from "@/store";
import clsx from "clsx";
import { ListView } from "./ListView";

export interface BookListProps {
  data: BookResItem[];
}

export const BookList = (props: BookListProps) => {
  const { data } = props;
  const store = useBearStore((state) => ({
    layoutView: state.layoutView,
  }));
  const { openBook } = useBook();

  const layoutViewClass = {
    grid: "grid-cols-[repeat(auto-fill,minmax(144px,1fr))] grid-rows-1 gap-y-12 ",
    list: "grid-rows-1 grid-cols-1 divide-y divide-[var(--gray-a4)]",
  };

  return (
    <div
      className={clsx(
        "py-2 grid items-end gap-x-4",
        layoutViewClass[store.layoutView]
      )}
    >
      {store.layoutView === "grid" &&
        data.map((book) => {
          return (
            <Book
              key={book.uuid}
              data={book}
              onClick={() => openBook(book.uuid, book.title)}
            />
          );
        })}
      {store.layoutView === "list" &&
        data.map((book) => {
          return (
            <Book
              viewType="list"
              key={book.uuid}
              data={book}
              onClick={() => openBook(book.uuid, book.title)}
            />
          );
        })}
      {store.layoutView === "table" && <ListView data={data} />}
    </div>
  );
};
