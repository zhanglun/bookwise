import { Book } from "@/components/Book";
import { useEffect, useState } from "react";
import { request } from "@/helpers/request";
import { useNavigate } from "react-router-dom";
import { BookResItem } from "@/interface/book.ts";

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

        console.log("total", total);
        console.log("items", items);

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

  useEffect(() => {}, []);

  function test() {
    const selection = window.getSelection();
    console.log(selection);
  }

  return (
    <div className="shadow-lg rounded-lg overflow-hidden bg-white h-full grid grid-flow-row gap-3 overflow-y-auto px-4 sm:px-4">
      <div className="px-3 pt-5 pb-2 text-xl font-bold text-stone-900">
        Recently added
      </div>
      <ol className="px-3 py-2 flex flex-row gap-4">
        {recentlyAdd.map((book: any) => {
          return (
            <li>
              <Book
                key={book.id}
                data={book}
                onClick={() => navigate(`/viewer/${book.id}`)}
              />
            </li>
          );
        })}
      </ol>
      <div className="px-3 pt-5 pb-2 text-xl font-bold text-stone-900">
        Recently reading
      </div>
      <div className="">
        <ol className="px-3 py-2 flex flex-row gap-4">
          {recentlyReading.map((book: BookResItem) => {
            return (
              <li>
                <Book
                  key={book.id}
                  data={book}
                  onClick={() => navigate(`/viewer/${book.id}`)}
                />
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};
