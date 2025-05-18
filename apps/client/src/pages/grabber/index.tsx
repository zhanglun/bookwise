import { useEffect, useState } from 'react';
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

  const getList = async () => {
    const list = await dal.getBooks({});
    setBooks(list);
  };

  const handleFileSelect = async (files: File[]) => {
    const body = await processFiles(files);

    body.forEach(async (book) => {
      const res = await dal.saveBookAndRelations(book.metadata, book.cover);
      console.log('🚀 ~ body.forEach ~ res:', res);
    });

    // TODO: search book metadata
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

  return (
    <div>
      <FileUploader onFileSelect={handleFileSelect} />
    </div>
  );
};
