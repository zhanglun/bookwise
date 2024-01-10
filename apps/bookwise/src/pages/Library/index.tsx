import { ArrowDownWideNarrow, ArrowUpWideNarrow, BookPlus, ChevronDown, Plus } from "lucide-react";
import { Book } from "@/components/Book";
import { useEffect, useState } from "react";
import { request } from "@/helpers/request";
import { BookResItem } from "@/interface/book";
import clsx from "clsx";
import { BookSideDetail } from "./BookSideDetail";
import { Button } from "@/components/ui/button";
import { Index } from "@/pages/Library/BookFilter";
import { useNavigate } from "react-router-dom";
import { BookSorter } from "@/pages/Library/BookSorter";

export const Library = () => {
  const navigate = useNavigate();
  const [bookList, setBookList] = useState<any>([]);
  const [currentBook, setCurrentBook] = useState<BookResItem>(
    {} as BookResItem
  );

  function getBookList(params: any) {
    request.get("/books", {
      params
    }).then((res) => {
      console.log("🚀 ~ file: index.tsx:34 ~ request.get ~ res:", res);
      const { items, total } = res.data;

      setBookList(items);
    });
  }

  const handleBookClick = (book: BookResItem) => {
    setCurrentBook(book);
  };

  function handleSort(field: string, sort: string) {
    console.log('field', field)
    console.log('sort', sort)
    getBookList({
      sort: `${field}:${sort}`
    })
  }

  useEffect(() => {
    getBookList({});
  }, []);

  return (
    <div className="bg-white flex h-full overflow-hidden rounded-lg">
      <div className="flex-1 h-full grid grid-flow-row gap-3 overflow-y-scroll px-4 sm:px-4">
        <div>
          <div className="px-3 pt-7 pb-2 text-2xl font-bold text-stone-900">
            Library
          </div>
          <div className="px-3 py-2"></div>
          <div className="px-3 py-2 flex justify-between">
            <Index />
            <div>
              <BookSorter onChange={handleSort}/>
            </div>
          </div>
          <div
            className={clsx(
              "px-3 py-2 grid grid-cols-[repeat(auto-fill,minmax(208px,1fr))]",
              "sm:gap-x-1 sm:gap-y-7",
              "xl:gap-x-3 xl:gap-y-9"
            )}
          >
            {bookList.map((book: any) => {
              return (
                <Book
                  key={book.id}
                  data={book}
                  onClick={() => navigate(`/reader/${book.id}`)}
                  onHover={handleBookClick}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
