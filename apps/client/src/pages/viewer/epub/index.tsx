/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Book, NavItem } from 'epubjs';
import { makeBook, View } from 'foliate-js/view.js';
import { useAtom } from 'jotai';
import { Button, Loader, ScrollArea } from '@mantine/core';
import { dal } from '@/dal';
import { BookResItem } from '@/interface/book';
import { TocItem } from '../toc';
import { currentTocItemAtom } from './epub-atom';
import { Renderer } from './renderer';

export interface EpubViewerProps {
  bookUuid: string;
  onTocUpdate?: (items: TocItem[]) => void;
}

export const EpubViewer = memo(({ bookUuid, onTocUpdate }: EpubViewerProps) => {
  const [currentTocItem] = useAtom(currentTocItemAtom);
  const [book, setBook] = useState<Book>();
  const [_bookDetail, setBookDetail] = useState<BookResItem>({} as BookResItem);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  // 将 epub 的 NavItem 转换为通用的 TocItem
  const convertNavItemsToTocItems = (navItems: NavItem[]): TocItem[] => {
    return navItems.map((item) => ({
      label: item.label,
      href: item.href,
      subitems: item.subitems ? convertNavItemsToTocItems(item.subitems) : undefined,
    }));
  };

  useEffect(() => {
    if (book?.navigation) {
      const tocItems = convertNavItemsToTocItems(book.navigation.toc);
      onTocUpdate?.(tocItems);
    }
  }, [book?.navigation, onTocUpdate]);

  const getBookDetail = useCallback(() => {
    return dal.getBookByUuid(bookUuid).then((data) => {
      setBookDetail(data);
      return data;
    });
  }, [bookUuid]);

  const getBookBlob = useCallback(() => {
    return dal.getBookBlob(bookUuid).then((data) => {
      console.log('🚀 ~ returndal.getBookBlob ~ data:', data);
      return data;
    });
  }, [bookUuid]);

  useEffect(() => {
    if (bookUuid) {
      Promise.all([getBookDetail(), getBookBlob()]).then(async ([_bookDetail, record]) => {
        if (record && record.data) {
          const f = new File([record.data], _bookDetail.title);
          const book = await makeBook(f);
          console.log('🚀 ~ book:', book);
          setBook(book);
          onTocUpdate?.(book.toc);
        }
      });
    }
  }, [bookUuid]);

  return (
    <div className="h-full flex flex-col">
      {/* 可视区域 - 盛满剩余高度并可滚动 */}
      <div className="flex-1 min-h-0">
        {/* <ScrollArea
          id="canvasRoot"
          type="hover"
          ref={scrollAreaRef}
          className="h-full relative"
          classNames={{
            root: 'h-full relative',
            viewport: 'viewport',
          }}
        >
          {loading && (
            <div className="absolute z-40 top-6 right-6 bottom-6 left-6 bg-cell flex items-center justify-center rounded-lg">
              <Loader size="3" />
            </div>
          )}
        </ScrollArea> */}
        <Renderer book={book} />
      </div>
    </div>
  );
});

EpubViewer.displayName = 'EpubViewer';
