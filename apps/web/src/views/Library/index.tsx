import { useEffect } from "react";
import { useBearStore } from "@/store";
import { LibraryToolbar } from "./LibraryToolbar";
import { DataTable } from "./DataTable";

export const Library = () => {
  const store  = useBearStore((state) => ({
    books: state.books,
    getBooks: state.getBooks,
  }))


  function handleRowClick(row) {
    console.log(row)
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
        <div className="border-l border-[var(--gray-5)]"></div>
      </div>
    </div>
  );
};
