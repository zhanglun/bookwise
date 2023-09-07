import { ArrowDownWideNarrow, ArrowUpWideNarrow, BookPlus, ChevronDown, Plus } from "lucide-react";
import { Book } from "@/components/Book";
import { useSelectFromDisk } from "@/hooks/useBook";
import { useEffect, useState } from "react";
import { request } from "@/helpers/request";
import { BookResItem } from "@/interface/book";
import clsx from "clsx";
import { BookSideDetail } from "./BookSideDetail";
import { Button } from "@/components/ui/button";
import { BookFilter } from "@/pages/Library/BookFilter";
import { useNavigate } from "react-router-dom";

export const Library = () => {
  const navigate = useNavigate();
  const [files, openFileDialog] = useSelectFromDisk();
  const [bookList, setBookList] = useState<any>([]);
  const [currentBook, setCurrentBook] = useState<BookResItem>(
    {} as BookResItem
  );

  const handleBookClick = (book: BookResItem) => {
    setCurrentBook(book);
  };

  useEffect(() => {
    if (files.length) {
      const formData = new FormData();

      for (const file of files) {
        formData.append("files", file);
        console.log("🚀 ~ file: index.tsx:16 ~ useEffect ~ file:", file);
      }

      console.log("🚀 ~ file: index.tsx:13 ~ useEffect ~ formData:", formData);

      request
        .post("/books/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          console.log("🚀 ~ file: index.tsx:25 ~ useEffect ~ res:", res);
        });
    }
  }, [files]);

  useEffect(() => {
    request.get("/books").then((res) => {
      console.log("🚀 ~ file: index.tsx:34 ~ request.get ~ res:", res);
      const { items, total } = res.data;

      setBookList(items);
    });
  }, []);

  return (
    <div className="bg-white flex h-full overflow-hidden rounded-lg">
      <div className="flex-1 h-full grid grid-flow-row gap-3 overflow-y-scroll px-4 sm:px-4">
        <div>
          <div className="px-3 pt-7 pb-2 text-2xl font-bold text-stone-900">
            Library
          </div>
          <div className="px-3 py-3 space-x-3">
            <div
              className="border border-stone-200 rounded-lg pl-6 py-3 w-[340px] flex items-center space-x-3 hover:bg-stone-100 cursor-pointer"
              onClick={() => openFileDialog()}
            >
              <BookPlus size={20} className="text-indigo-500" />
              <div className="grid grid-flow-row">
                <span className="text-sm font-bold text-stone-700">
                  New Book
                </span>
                <span className="text-[10px] text-stone-500">
                  Start reading a new book
                </span>
              </div>
            </div>
          </div>
          <div className="px-3 py-2"></div>
          <div className="px-3 py-2 flex justify-between">
            <BookFilter />
            <div>
              <Button variant="ghost" size="sm">
                <span className="flex items-center gap-1 mr-1">
                  {/* desc */}
                  <ArrowDownWideNarrow size="16"/>
                  {/* asc */}
                  <ArrowUpWideNarrow size={16} />
                  Author
                </span>
                <ChevronDown size="16"/>
              </Button>
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
      <div className="px-4 pt-4 w-[290px]">
        <BookSideDetail data={currentBook} />
      </div>
    </div>
  );
};
