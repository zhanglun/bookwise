import { useEffect, useState } from 'react';
import { IconLayoutSidebarRight, IconLayoutSidebarRightExpand } from '@tabler/icons-react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { BookList } from '@/components/Book';
import { dal } from '@/dal';
import { useBook } from '@/hooks/book';
import { BookResItem } from '@/interface/book';
import { InfoPanel } from './info-panel';
import { LibraryToolbar } from './library-toolbar';
import { MetaModal } from './meta-modal/meta-modal';
import classes from './library.module.css';

export const Library = () => {
  const { openBook } = useBook();
  const [selectItem, setSelectItem] = useState<BookResItem>();
  const [books, setBooks] = useState<BookResItem[]>([]);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [editingBook, setEditingBook] = useState<BookResItem | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const getList = async () => {
    const list = await dal.getBooks({});
    setBooks(list);
  };

  function handleRowClick(row: BookResItem) {
    setSelectItem(row);
    setIsPanelOpen(true);
  }

  function handleRowDoubleClick(row: BookResItem) {
    openBook(row.uuid);
  }

  function handleClosePanel() {
    setIsPanelOpen(false);
    setSelectItem(undefined);
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
        <LibraryToolbar onUploadComplete={getList}>
          <Tooltip label={isPanelOpen ? '关闭详情面板' : '打开详情面板'}>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              disabled={!selectItem}
            >
              {isPanelOpen ? (
                <IconLayoutSidebarRight size="1.2rem" />
              ) : (
                <IconLayoutSidebarRightExpand size="1.2rem" />
              )}
            </ActionIcon>
          </Tooltip>
        </LibraryToolbar>
        <div className={classes.bookListContainer}>
          <BookList
            data={books}
            selectedBook={selectItem}
            onRowClick={handleRowClick}
            onRowDoubleClick={handleRowDoubleClick}
            onRead={openBook}
            onEdit={(book) => {
              setEditingBook(book);
              setDrawerOpened(true);
            }}
          />
        </div>
      </div>
      <div
        className={`${classes.rightSide} ${isPanelOpen ? classes.rightSideOpen : classes.rightSideClosed}`}
      >
        <InfoPanel
          data={selectItem}
          isOpen={isPanelOpen}
          onClose={handleClosePanel}
          onRead={openBook}
        />
      </div>
      <MetaModal
        isOpen={drawerOpened}
        setIsOpen={() => setDrawerOpened(false)}
        data={editingBook}
      />
    </div>
  );
};
