import { useCallback, useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { useParams } from 'react-router-dom';
import { dal } from '@/dal';
import { BookResItem } from '@/interface/book';
import { currentDetailUuidAtom } from './atoms/detail-atoms';
import { EpubViewer } from './epub';
import { ViewerHeader } from './header';
import { useDetail } from './hooks/use-detail';
import { PdfViewer } from './Pdf';
import { ViewerSidebar } from './sidebar';
import { TocItem } from './toc';
import classes from './viewer.module.css';

export const Viewer = () => {
  const { uuid } = useParams();
  const setCurrentUuid = useSetAtom(currentDetailUuidAtom);

  const { data: book, isLoading, isError, error } = useDetail();

  console.log('🚀 ~ Viewer ~ res:', book);

  useEffect(() => {
    if (uuid) {
      setCurrentUuid(uuid);
    }

    // 清理函数
    return () => {
      setCurrentUuid(null);
    };
  }, [uuid, setCurrentUuid]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!book) {
    return <div>No data found</div>;
  }

  if (!uuid || !book) {
    return null;
  }

  const renderViewer = () => {
    const props = {
      bookUuid: uuid,
      // onTocUpdate: handleTocUpdate,
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
      <ViewerHeader book={book} />
      {/* <div className={classes.sidebar}>
        <ViewerSidebar book={book} toc={toc} />
      </div> */}
      <div className={classes.main}>
        <div className="h-full">{renderViewer()}</div>
      </div>
      {/* <div className={classes.rightSide}>right</div> */}
    </div>
  );
};
