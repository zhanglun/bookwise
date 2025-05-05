import { useEffect, useState } from 'react';
import { dal } from '@/dal';
import { LibraryToolbar } from './LibraryToolbar';

export const Library = () => {
  const getList = async () => {
    const list = await dal.getBooks({});
    console.log('🚀 ~ getList ~ list:', list);
  };

  useEffect(() => {
    const get = async () => {
      await getList();
    };
    get();
  }, []);
  return (
    <div className="grid-in-main-view h-full overflow-hidden">
      <div className="h-full grid grid-cols-[minmax(160px,160px)_minmax(400px,1fr)_minmax(280px,320px)]">
        <div className="border-r border-[var(--gray-5)] overflow-auto">{/* Sidebar content */}</div>
        <div className="flex flex-col min-h-0">
          <div className="border-b border-border shrink-0">
            <LibraryToolbar />
          </div>
          <div className="flex-1 overflow-auto min-h-0"></div>
        </div>
        <div className="border-l border-[var(--gray-5)] flex flex-col min-h-0"></div>
      </div>
    </div>
  );
};
