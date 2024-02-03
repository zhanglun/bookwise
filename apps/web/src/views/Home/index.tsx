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
        params: {
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
