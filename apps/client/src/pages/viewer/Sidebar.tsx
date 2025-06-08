import { memo, useState } from 'react';
import { BookmarkIcon, HighlighterIcon, NotebookPen, TableOfContents } from 'lucide-react';
import { SegmentedControl } from '@mantine/core';
import { Cover } from '@/components/Book/Cover';
import { BookResItem } from '@/interface/book';
import { Toc, TocItem } from './Toc';

interface ViewerSidebarProps {
  book: BookResItem;
  toc: TocItem[];
}

export const ViewerSidebar = memo(({ book, toc }: ViewerSidebarProps) => {
  const [segmented, setSegmented] = useState('toc');

  const handleTocItemClick = (item: TocItem) => {};

  return (
    <div className="h-full flex flex-col w-[240px]">
      <div className="h-[70px] py-2 px-3 shrink-0 grow-0 flex gap-2 relative border-b border-gray-7">
        <Cover book={book} className="w-[48px]" />
        <span className="text-sm font-bold overflow-hidden whitespace-nowrap text-ellipsis">
          {book.title}
        </span>
      </div>
      <SegmentedControl
        defaultValue={segmented}
        size="1"
        radius="large"
        onChange={(v) => {
          setSegmented(v);
        }}
        className="my-2 shrink-0 grow-0"
        data={[
          {
            value: 'toc',
            label: <TableOfContents size={14} />,
          },
          {
            value: 'bookmark',
            label: <BookmarkIcon size={14} />,
          },
          {
            value: 'notes',
            label: <NotebookPen size={12} />,
          },
          {
            value: 'hightligher',
            label: <HighlighterIcon size={13} />,
          },
        ]}
      />
    </div>
  );
});

ViewerSidebar.displayName = 'ViewerSidebar';
