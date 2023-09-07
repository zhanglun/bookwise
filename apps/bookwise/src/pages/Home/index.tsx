import { BookPlus } from "lucide-react";
import { Book } from "@/components/Book";
import { useEffect, useState } from "react";
import { request } from "@/helpers/request";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [recentlyAdd, setRecentlyAdd] = useState([]);
  const [recentlyReading, setRecentlyReading] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    request
      .get("/books", {
        data: {
          sort: "created_at:desc",
        },
      })
      .then((res) => {
        const { items, total } = res.data;

        setRecentlyAdd(items);
      });
    request
      .get("/books/recently-reading", {
        data: {
          sort: "created_at:desc",
        },
      })
      .then((res) => {
        const items = res.data;

        setRecentlyReading(items);
      });
  }, []);

  return (
    <div className="shadow-lg rounded-lg overflow-hidden bg-white h-full grid grid-flow-row gap-3 overflow-y-scroll px-4 sm:px-4">
      <div className="px-3 pt-7 pb-2 text-2xl font-bold text-stone-900">
        Home
      </div>
      <div className="px-3 py-3 space-x-3">
        <div className="border border-stone-200 rounded-lg pl-6 py-3 w-[340px] flex items-center space-x-3 hover:bg-stone-100">
          <BookPlus size={20} className="text-indigo-500" />
          <div className="grid grid-flow-row">
            <span className="text-sm font-bold text-stone-700">New Book</span>
            <span className="text-[10px] text-stone-500">
              Start reading a new book
            </span>
          </div>
        </div>
      </div>
      <div className="px-3 pt-5 pb-2 text-xl font-bold text-stone-900">
        Recently added
      </div>
      <div className="px-3 py-2 grid grid-cols-[repeat(auto-fill,minmax(208px,1fr))] sm:gap-x-1 sm:gap-y-7 xl:gap-x-3 xl:gap-y-9">
        {recentlyAdd.map((book: any) => {
          return (
            <Book
              key={book.id}
              data={book}
              onClick={() => navigate(`/reader/${book.id}`)}
            />
          );
        })}
      </div>
      <div className="px-3 pt-5 pb-2 text-xl font-bold text-stone-900">
        Recently reading
      </div>
      <div className="px-3 py-2 grid grid-cols-[repeat(auto-fill,minmax(208px,1fr))] sm:gap-x-1 sm:gap-y-7 xl:gap-x-3 xl:gap-y-9">
        {recentlyReading.map((book: any) => {
          return (
            <Book
              key={book.id}
              data={book}
              onClick={() => navigate(`/reader/${book.id}`)}
            />
          );
        })}
      </div>
    </div>
  );
};
