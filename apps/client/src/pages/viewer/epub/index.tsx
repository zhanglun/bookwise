import { memo, useEffect, useState } from 'react';
import { Book, NavItem } from 'epubjs';
import { makeBook } from 'foliate-js/view.js';
import { useAtom } from 'jotai';
import { tocItemsAtom } from '../atoms/detail-atoms';
import { useDetail } from '../hooks/use-detail';
import { TocItem } from '../toc';
import { Renderer } from './renderer';

export interface EpubViewerProps {
  onTocUpdate?: (items: TocItem[]) => void;
}

export const EpubViewer = memo(({ onTocUpdate }: EpubViewerProps) => {
  const {
    detail: { data: detail },
    blob: { data: blob },
  } = useDetail();
  const [, setTocItems] = useAtom(tocItemsAtom);
  const [book, setBook] = useState<Book>();

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

  useEffect(() => {
    (async () => {
      if (blob && blob.data && detail) {
        const f = new File([blob.data], detail.title);
        const book = await makeBook(f);

        setTocItems(book.toc);
        setBook(book);
      }
    })();
  }, [blob, detail]);

  return (
    <div className="h-full flex flex-col">
      {/* 可视区域 - 盛满剩余高度并可滚动 */}
      <div className="flex-1 min-h-0">
        <Renderer book={book} />
      </div>
    </div>
  );
});

EpubViewer.displayName = 'EpubViewer';
