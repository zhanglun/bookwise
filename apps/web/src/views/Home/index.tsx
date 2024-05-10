import { Book } from "@/components/Book";
import { useEffect, useState } from "react";
import { request } from "@/helpers/request";
import { BookResItem } from "@/interface/book.ts";
import { Heading, Separator, Spinner, Text } from "@radix-ui/themes";
import { BookContextMenu } from "@/components/BookContextMenu";
import { useBook } from "@/hooks/book";

export const Home = () => {
  const [recentlyAdd, setRecentlyAdd] = useState([]);
  const [recentlyReading, setRecentlyReading] = useState([]);
  const [readingLoading, setReadingLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(true);
  const { navigateToRead } = useBook();

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
        setReadingLoading(false);
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
        setAddLoading(false);
      });
  }, []);

  useEffect(() => {}, []);

  return (
    <div className=" bg-cell h-full px-4 sm:px-4">
      <div className="pt-5 pb-2 flex justify-between">
        <Heading size="5">Recently reading</Heading>
        <Text
          color="gray"
          className="text-sm font-medium cursor-auto hover:underline hover:cursor-pointer"
        >
          Show all
        </Text>
      </div>
      <div className="py-2 grid gap-3 grid-cols-4 grid-rows-1">
        <Spinner loading={readingLoading} />
        {recentlyReading.map((book: BookResItem) => {
          return (
            <BookContextMenu>
              <Book
                key={book.id}
                data={book}
                onClick={() => navigateToRead(book.id)}
              />
            </BookContextMenu>
          );
        })}
      </div>
      <Separator className="w-full" />
      <div className="pt-5 pb-2 flex justify-between">
        <Heading size="5">Recently added</Heading>
        <Text
          color="gray"
          className="text-sm font-medium cursor-auto hover:underline hover:cursor-pointer"
        >
          Show all
        </Text>
      </div>
      <div className="py-2 grid gap-3 grid-cols-4 grid-rows-1">
        <Spinner loading={addLoading} />
        {recentlyAdd.map((book: BookResItem) => {
          return (
            <Book
              key={book.id}
              data={book}
              onClick={() => navigateToRead(book.id)}
            />
          );
        })}
      </div>
    </div>
  );
};
