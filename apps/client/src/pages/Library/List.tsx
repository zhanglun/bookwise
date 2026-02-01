
import { BookList } from "@/components/Book";
import { dal } from '@/dal';
import { useBook } from '@/hooks/book';
import { BookResItem } from '@/interface/book';
import { MetaModal } from './meta-modal/meta-modal';
import { useState, useEffect } from "react";

export const List = () => {
  const { openBook } = useBook();
  const [books, setBooks] = useState<BookResItem[]>([]);
  const [selectItem, setSelectItem] = useState<BookResItem>();
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [editingBook, setEditingBook] = useState<BookResItem | null>(null);

  const getList = async () => {
    const list = await dal.getBooks({});
    setBooks(list);
  };

  function handleRowClick(row: BookResItem) {
    setSelectItem(row);
  }

  function handleRowDoubleClick(row: BookResItem) {
    openBook(row.uuid);
  }

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="h-full -mr-2">
      <BookList
        data={books}
        onRowClick={handleRowClick}
        onRowDoubleClick={handleRowDoubleClick}
        onEdit={(book) => {
          setEditingBook(book);
          setDrawerOpened(true);
        }}
      />
      <MetaModal
        isOpen={drawerOpened}
        setIsOpen={() => setDrawerOpened(false)}
        data={editingBook}
      />
    </div>
  );
};
