import { Book } from "@/components/Book";
import { useEffect, useState } from "react";
import { request } from "@/helpers/request";
import { useNavigate } from "react-router-dom";
import { BookResItem } from "@/interface/book.ts";
import { Separator } from "@radix-ui/themes";

export const Home = () => {
  const [recentlyAdd, setRecentlyAdd] = useState([]);
  const [recentlyReading, setRecentlyReading] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    request
      .get("/books/recently-add", {
        params: {
          sort: "created_at:desc",
        },
      })
      .then((res) => {
        const items = res.data;

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

  return (
    <div className="rounded-lg overflow-hidden bg-cell text-cell-foreground h-full grid grid-flow-row gap-3 overflow-y-auto px-4 sm:px-4">
      <div className="px-3 pt-5 pb-2 text-xl font-bold">Recently reading</div>
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
      <Separator className="w-full"/>
      <div className="px-3 pt-5 pb-2 text-xl font-bold ">Recently added</div>
      <ol className="px-3 py-2 flex flex-row gap-4">
        {recentlyAdd.map((book: BookResItem) => {
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
  );
};
