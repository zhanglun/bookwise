import { useEffect, useState } from "react";
import { useBearStore } from "@/store";
import { BookResItem } from "@/interface/book";
import { LibraryToolbar } from "./LibraryToolbar";
import { DataTable } from "./DataTable";
import { InfoPanel } from "./InfoPanel";

export const Library = () => {
  const store = useBearStore((state) => ({
    books: state.books,
    getBooks: state.getBooks,
  }));

  const [selectItem, setSelectItem] = useState<BookResItem | null>(null);

  function handleRowClick(row: BookResItem) {
    setSelectItem(row);
  }

  useEffect(() => {
    store.getBooks({});
  }, []);

  return (
    <div className="grid-in-main-view h-full overflow-hidden">
      <div className="h-full grid grid-cols-[minmax(160px,160px)_minmax(400px,1fr)_minmax(280px,320px)]">
        <div className="border-r border-[var(--gray-5)] overflow-auto">
          {/* Sidebar content */}
        </div>
        <div className="flex flex-col min-h-0">
          <div className="border-b border-border shrink-0">
            <LibraryToolbar />
          </div>
          <div className="flex-1 overflow-auto min-h-0">
            <DataTable data={store.books} onRowClick={handleRowClick} />
          </div>
        </div>
        <div className="border-l border-[var(--gray-5)] flex flex-col min-h-0">
          <InfoPanel data={selectItem} />
        </div>
      </div>
    </div>
  );
};
