import { useEffect, useState } from 'react';
import { DataTable } from '@/components/Table';
import { dal } from '@/dal';
import { BookResItem } from '@/interface/book';
import { InfoPanel } from './InfoPanel';
import { LibraryToolbar } from './LibraryToolbar';
import { MetaModal } from './meta-modal/meta-modal';
import classes from './library.module.css';

export const Library = () => {
  const [selectItem, setSelectItem] = useState<BookResItem>();
  const [books, setBooks] = useState<BookResItem[]>([]);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [editingBook, setEditingBook] = useState<BookResItem>();
  const getList = async () => {
    const list = await dal.getBooks({});
    setBooks(list);
  };

  function handleRowClick(row: BookResItem) {
    setSelectItem(row);
  }

  function handleRowDoubleClick(row: BookResItem) {
    console.log('🚀 ~ handleRowDoubleClick ~ row:', row);
    // openBook(row.uuid, row.title);
  }

  useEffect(() => {
    const get = async () => {
      await getList();
    };
    get();
  }, []);
  return (
    <div className={classes.main}>
      <div className={classes.content}>
        <LibraryToolbar />
        <div className="flex-1 overflow-auto min-h-0">
          <DataTable
            data={books}
            onRowClick={handleRowClick}
            onRowDoubleClick={handleRowDoubleClick}
            onEdit={(book) => {
              setEditingBook(book);
              setDrawerOpened(true);
            }}
          />
        </div>
      </div>
      <div className={classes.rightSide}>
        <InfoPanel data={selectItem} />
      </div>
      <MetaModal
        isOpen={drawerOpened}
        setIsOpen={() => setDrawerOpened(false)}
        data={editingBook}
      />
    </div>
  );
};
