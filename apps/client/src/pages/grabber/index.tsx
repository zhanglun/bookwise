import { useEffect, useState } from 'react';
import { Grid } from '@mantine/core';
import { toast } from 'sonner';
import { DataTable } from '@/components/Table';
import { dal } from '@/dal';
import { processFiles } from '@/helpers/uploader';
import { BookResItem } from '@/interface/book';
import { BookForm } from './components/BookForm';
import { FileUploader } from './components/FileUploader';
import { InfoPanel } from './InfoPanel';
import { LibraryToolbar } from './LibraryToolbar';
import classes from './grabber.module.css';

export const Grabber = () => {
  const [selectItem, setSelectItem] = useState<BookResItem>();
  const [books, setBooks] = useState<BookResItem[]>([]);
  const [bookData, setBookData] = useState<Partial<BookResItem>>();
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [editingBook, setEditingBook] = useState<BookResItem>();
  const [collapsed, setCollapsed] = useState(!drawerOpened);

  const getList = async () => {
    const list = await dal.getBooks({});
    setBooks(list);
  };

  const handleFileSelect = async (files: File[]) => {
    try {
      const body = await processFiles(files);
      const total = body.length;
      let successCount = 0;

      toast.promise(
        (async () => {
          for (const book of body) {
            const coverBuffer = book.cover ? Uint8Array.from(atob(book.cover), c => c.charCodeAt(0)) : null;
            const fileBuffer = typeof book.buffer === 'string'
              ? Uint8Array.from(atob(book.buffer), c => c.charCodeAt(0))
              : new Uint8Array(book.buffer as ArrayBuffer);

            await dal.saveBookAndRelations(book.metadata, fileBuffer, coverBuffer);
            successCount++;
          }

          await getList();
        })(),
        {
          loading: `正在上传 ${total} 本书籍...`,
          success: `${total} 本书籍上传成功`,
          error: '上传失败，请重试',
        }
      );
    } catch (error) {
      console.error('上传失败:', error);
      toast.error(`上传失败: ${(error as Error).message}`);
    }
  };

  const handleBookDataChange = (data: Partial<BookResItem>) => {
    setBookData((prev) => ({ ...prev, ...data }));
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

  const handleEdit = (book: BookResItem) => {
    setEditingBook(book);
    setDrawerOpened(true);
    setCollapsed(false);
  };

  const handleDownload = async (book: BookResItem) => {
    // TODO: 实现下载功能
    console.log('下载图书:', book);
  };

  return (
    <div className={classes.container}>
      <Grid gutter={0}>
        <Grid.Col span={collapsed ? 13 : 9}>
          <FileUploader onFileSelect={handleFileSelect} />
          <div className={classes.fileList}>
            <h2 className={classes.fileListTitle}>已上传的文件</h2>
            <DataTable
              data={books}
              onRowClick={handleRowClick}
              onRowDoubleClick={handleRowDoubleClick}
              onEdit={handleEdit}
              onDownload={handleDownload}
            />
          </div>
        </Grid.Col>
      </Grid>
    </div>
  );
};
