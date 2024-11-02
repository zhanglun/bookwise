import { useEffect, useState } from "react";
import { useBearStore } from "@/store";
import { BookResItem } from "@/interface/book"
import { LibraryToolbar } from "./LibraryToolbar";
import { DataTable } from "./DataTable";
import { InfoPanel } from "./InfoPanel";

export const Library = () => {
  const store  = useBearStore((state) => ({
    books: state.books,
    getBooks: state.getBooks,

  }))

  const [selectItem, setSelectItem] = useState<BookResItem | null>(null);

  function handleRowClick(row) {
    setSelectItem(row);
  }

  useEffect(() => {
    store.getBooks({})
  }, [])

  return (
    <div className="grid-in-main-view px-4 sm:px-4">
      <div className="h-full grid grid-cols-[160px_1fr_320px]">
        <div className="border-r border-[var(--gray-5)]"></div>
        <div className="flex flex-col">
          <LibraryToolbar />
          <div className="flex-1 border-t border-[var(--gray-5)]">
            <DataTable data={store.books} onRowClick={handleRowClick} />
          </div>
        </div>
        <div className="border-l border-[var(--gray-5)]">
          <InfoPanel data={selectItem}/>
        </div>
      </div>
    </div>
  );
};
