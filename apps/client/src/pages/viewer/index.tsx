import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useParams } from 'react-router-dom';
import { currentDetailUuidAtom } from './atoms/detail-atoms';
import { EpubViewer } from './epub';
import { ViewerHeader } from './header';
import { useDetail } from './hooks/use-detail';
import { PdfViewer } from './pdf';
// import { ViewerSidebar } from './sidebar';
import classes from './viewer.module.css';

export const Viewer = () => {
  const { uuid } = useParams();
  const setCurrentUuid = useSetAtom(currentDetailUuidAtom);

  const {
    detail: { data: book, isLoading, isError, error },
  } = useDetail();

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
    switch (book.format.toLowerCase()) {
      case 'pdf':
        return <PdfViewer />;
      case 'epub':
        return <EpubViewer />;
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
