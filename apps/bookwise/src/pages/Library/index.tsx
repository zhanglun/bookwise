import { BookPlus } from "lucide-react";
import { Book } from "@/components/Book";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectFromDisk } from "@/hooks/useBook";
import { useEffect, useState } from "react";
import { request } from "@/helpers/request";
import { BookResItem } from "@/interface/book";
import { Cover } from "@/components/Book/Cover";
import clsx from "clsx";
import { BookSideDetail } from "./BookSideDetail";

export const Library = () => {
  const [files, openFileDialog] = useSelectFromDisk();
  const [bookList, setBookList] = useState<any>([]);
  const [currentBook, setCurrentBook] = useState<BookResItem>(
    {} as BookResItem
  );

  const handleBookClick = (book: BookResItem) => {
    console.log(book);
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
      setBookList(res.data);
    });
  }, []);

  return (
    <div className="flex justify-center h-full">
      <div className="h-full grid grid-flow-row gap-3 overflow-y-scroll max-w-5xl px-4 flex-1 sm:px-4">
        <div>
          <div className="px-3 pt-7 pb-2 text-2xl font-bold text-stone-900">
            Library
          </div>
          <div className="px-3 py-3 space-x-3">
            <div
              className="border border-stone-200 rounded-lg pl-6 py-3 w-[340px] flex items-center space-x-3 hover:bg-stone-100"
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
          <div className={clsx("sm:grid-cols-3 sm:gap-x-5 sm:gap-y-7", "px-3 py-2 grid lg:grid-cols-5 lg:gap-x-9 lg:gap-y-14")}>
            {bookList.map((book: any) => {
              return (
                <Book
                  key={book.id}
                  data={book}
                  onCoverClick={handleBookClick}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="px-4 pt-20 sm:w-[280px]">
        <BookSideDetail data={currentBook} />
      </div>
    </div>
  );
};
