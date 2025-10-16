import { memo, useState } from 'react';
import { SegmentedControl } from '@mantine/core';
import { BookResItem } from '@/interface/book';
import { Toc, TocItem } from './toc';

interface ViewerSidebarProps {
  book: BookResItem;
  toc: TocItem[];
}

export const ViewerSidebar = memo(({ book, toc }: ViewerSidebarProps) => {
  const [segmented, setSegmented] = useState('toc');

  return (
    <div className="h-full flex flex-col">
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
              label: '目录',
            },
            {
              value: 'bookmark',
              label: '书签',
            },
            {
              value: 'notes',
              label: '笔记',
            },
          ]}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        {segmented === 'toc' && <Toc items={toc} />}
        {segmented === 'bookmark' && <div className="p-4">TODO: bookmark</div>}
        {segmented === 'notes' && <div className="p-4">TODO: notes</div>}
      </div>
    </div>
  );
});

ViewerSidebar.displayName = 'ViewerSidebar';
