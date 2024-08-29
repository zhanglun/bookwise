import { BookList } from "@/components/Book/List";
import { LayoutToolbar } from "@/components/LayoutToolbar";
import { useBearStore } from "@/store";
import { Heading } from "@radix-ui/themes";
import { useEffect } from "react";

export const Reading = () => {
  const store = useBearStore((state) => ({
    loadingRecentlyReading: state.loadingRecentlyReading,
    recentlyReadingList: state.recentlyReadingList,
    getRecentReadingList: state.getRecentReadingList,
  }));

  useEffect(() => {
    store.getRecentReadingList();
  }, []);

  return (
    <div className=" h-full px-4 sm:px-4">
      <div className="pt-5 pb-2 flex justify-between">
        <Heading size="5">Reading</Heading>
        <LayoutToolbar />
      </div>
      <BookList
        data={store.recentlyReadingList}
        loading={store.loadingRecentlyReading}
      />
    </div>
  );
};
