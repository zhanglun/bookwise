import { useEffect } from "react";
import { Heading, Separator, Text } from "@radix-ui/themes";
import { BookList } from "@/components/Book/List";
import { useBearStore } from "@/store";

export const Home = () => {
  const store = useBearStore((state) => ({
    loadingRecentlyReading: state.loadingRecentlyReading,
    recentlyReadingList: state.recentlyReadingList,
    loadingRecentlyAdd: state.loadingRecentlyAdd,
    recentlyAddList: state.recentlyAddList,
    initBookSliceData: state.initBookSliceData,
    currentEditingBook: state.currentEditingBook,
  }));

  useEffect(() => {
    store.initBookSliceData();
  }, []);

  useEffect(() => {}, []);

  return (
    <div className="bg-cell h-full px-4 sm:px-4">
      <div className="pt-5 pb-2 flex justify-between">
        <Heading size="5">Recently reading</Heading>
        <Text
          color="gray"
          className="text-sm font-medium cursor-auto hover:underline hover:cursor-pointer"
        >
          Show all
        </Text>
      </div>
      <BookList data={store.recentlyReadingList} loading={store.loadingRecentlyReading} />
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
      <BookList data={store.recentlyAddList} loading={store.loadingRecentlyAdd} />
    </div>
  );
};
