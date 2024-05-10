import { useEffect, useState } from "react";
import { request } from "@/helpers/request";
import { Heading, Separator, Text } from "@radix-ui/themes";
import { BookList } from "@/components/Book/List";

export const Home = () => {
  const [recentlyAdd, setRecentlyAdd] = useState([]);
  const [recentlyReading, setRecentlyReading] = useState([]);
  const [readingLoading, setReadingLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(true);

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
      <BookList data={recentlyReading} loading={readingLoading} />
      <Separator className="w-full my-6" />
      <div className="pt-5 pb-2 flex justify-between">
        <Heading size="5">Recently added</Heading>
        <Text
          color="gray"
          className="text-sm font-medium cursor-auto hover:underline hover:cursor-pointer"
        >
          Show all
        </Text>
      </div>
      <BookList data={recentlyAdd} loading={addLoading} />
    </div>
  );
};
