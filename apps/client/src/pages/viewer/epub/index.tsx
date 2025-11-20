import { memo } from 'react';
import { Renderer } from '@/renderer/renderer';
import { Book } from '@/renderer/types';

export const EpubViewer = memo(
  ({ book, onRelocate }: { book: Book; onRelocate: (location: { index: number }) => void }) => {
    return (
      <>
        <Renderer book={book} onRelocate={onRelocate} />
      </>
    );
  }
);

EpubViewer.displayName = 'EpubViewer';
