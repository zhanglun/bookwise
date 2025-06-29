import { memo } from 'react';
import { ScrollArea } from '@mantine/core';
import { TocItem } from '../toc';

export interface PdfViewerProps {
  bookUuid: string;
  onTocUpdate?: (items: TocItem[]) => void;
}

export const PdfViewer = memo(({ bookUuid, onTocUpdate: _onTocUpdate }: PdfViewerProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <div>PDF Viewer - {bookUuid}</div>
        <div>TODO: Implement PDF viewer</div>
      </div>
    </ScrollArea>
  );
});

PdfViewer.displayName = 'PdfViewer';
