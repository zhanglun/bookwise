import { useEffect } from "react";
import { Heading, ScrollArea, Separator } from "@radix-ui/themes";
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

  return (
    <ScrollArea className="rounded-lg">
      <div className="h-full px-4 sm:px-4">
        <div className="py-2 flex justify-between">
          <Heading size="5">Recently reading</Heading>
        </div>
        <BookList
          data={store.recentlyReadingList}
          loading={store.loadingRecentlyReading}
        />
        <Separator className="w-full my-6" />
        <div className="py-2 flex justify-between">
          <Heading size="5">Recently added</Heading>
        </div>
        <BookList
          data={store.recentlyAddList}
          loading={store.loadingRecentlyAdd}
        />
      </div>
    </ScrollArea>
  );
};
