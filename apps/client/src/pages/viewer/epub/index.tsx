import { memo } from 'react';
import { Renderer } from './renderer';

export const EpubViewer = memo(({ book }) => {
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
