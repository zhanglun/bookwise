import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { dal } from '@/dal';
import { BookResItem } from '@/interface/book';
import { EpubViewer } from './Epub';
import { PdfViewer } from './Pdf';
import { ViewerSidebar } from './Sidebar';
import { TocItem } from './Toc';

export const Viewer = () => {
  const { uuid } = useParams();
  const [book, setBook] = useState<BookResItem | null>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const leftSidebarExpanded = false;

  useEffect(() => {
    if (uuid) {
      dal.getBookByUuid(uuid).then(setBook);
    }
  }, [uuid]);

  const handleTocUpdate = useCallback((tocItems: TocItem[]) => {
    setToc(tocItems);
  }, []);

  if (!uuid || !book) {
    return null;
  }

  const renderViewer = () => {
    const props = {
      bookUuid: uuid,
      onTocUpdate: handleTocUpdate,
    };

    switch (book.format.toLowerCase()) {
      case 'pdf':
        return <PdfViewer {...props} />;
      case 'epub':
        return <EpubViewer {...props} />;
      default:
        return <div>Unsupported file type: {book.format}</div>;
    }
  };

  return (
    <div className="grid-in-main-view h-full overflow-hidden">
      <div className="h-full grid grid-cols-[minmax(240px,240px)_minmax(400px,1fr)_minmax(280px,320px)]">
        {leftSidebarExpanded && (
          <div className="grid-in-left-sidebar overflow-hidden border-r">
            <ViewerSidebar book={book} toc={toc} />
          </div>
        )}
        <div className="flex flex-col min-h-0">{renderViewer()}</div>
        <div className="border-l border-[var(--gray-5)] flex flex-col min-h-0">
          {/* <InfoPanel data={selectItem} /> */}
        </div>
      </div>
    </div>
  );
};
