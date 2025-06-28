import { memo, useState } from 'react';
import { BookmarkIcon, HighlighterIcon, NotebookPen, TableOfContents } from 'lucide-react';
import { SegmentedControl } from '@mantine/core';
import { Cover } from '@/components/Book/Cover';
import { BookResItem } from '@/interface/book';
import { Toc, TocItem } from './toc';

interface ViewerSidebarProps {
  book: BookResItem;
  toc: TocItem[];
}

export const ViewerSidebar = memo(({ book, toc }: ViewerSidebarProps) => {
  const [segmented, setSegmented] = useState('toc');

  const handleTocItemClick = () => {};

  return (
    <div>
      <div>
        <Cover book={book} />
        <span>{book.title}</span>
      </div>
      <div>
        <SegmentedControl
          defaultValue={segmented}
          radius="large"
          onChange={(v) => {
            setSegmented(v);
          }}
          style={{ width: '100%' }}
          data={[
            {
              value: 'toc',
              // label: <TableOfContents size={14} />,
              label: '目录',
            },
            {
              value: 'bookmark',
              // label: <BookmarkIcon size={14} />,
              label: '书签',
            },
            {
              value: 'notes',
              // label: <NotebookPen size={12} />,
              label: '笔记',
            },
            // {
            //   value: 'hightligher',
            //   label: <HighlighterIcon size={13} />,
            // },
          ]}
        />
      </div>
      {segmented === 'toc' && <Toc items={toc} onItemClick={handleTocItemClick} />}
      {segmented === 'bookmark' && <div>TODO: bookmark</div>}
      {segmented === 'notes' && <div>TODO: notes</div>}
      {segmented === '' && <div>TODO: hightligher</div>}
    </div>
  );
});

ViewerSidebar.displayName = 'ViewerSidebar';
