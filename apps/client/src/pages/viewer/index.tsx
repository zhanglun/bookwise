import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { dal } from '@/dal';
import { BookResItem } from '@/interface/book';
import { EpubViewer } from './epub';
import { ViewerHeader } from './header';
import { PdfViewer } from './Pdf';
import { ViewerSidebar } from './sidebar';
import { TocItem } from './toc';
import classes from './viewer.module.css';

export const Viewer = () => {
  const { uuid } = useParams();
  const [book, setBook] = useState<BookResItem | null>(null);
  const [toc, setToc] = useState<TocItem[]>([]);

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
    <div className={classes.layout}>
      <div className={classes.header}>
        <ViewerHeader book={book} />
      </div>
      <div className={classes.sidebar}>{/* <ViewerSidebar book={book} toc={toc} /> */}</div>
      <div className={classes.main}>
        <div className="h-full">{renderViewer()}</div>
      </div>
      <div className={classes.rightSide}>right</div>
    </div>
  );
};
