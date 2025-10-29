import { useEffect, useState } from 'react';
import { makeBook } from 'foliate-js/view.js';
import { useAtom, useSetAtom } from 'jotai';
import { useParams } from 'react-router-dom';
import { currentDetailUuidAtom, tocItemsAtom } from './atoms/detail-atoms';
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
    detail: { data: detail, isLoading, isError, error },
    blob: { data: blob },
  } = useDetail();
  const [, setTocItems] = useAtom(tocItemsAtom);
  const [book, setBook] = useState();

  useEffect(() => {
    if (uuid) {
      setCurrentUuid(uuid);
    }

    // 清理函数
    return () => {
      setCurrentUuid(null);
    };
  }, [uuid, setCurrentUuid]);

  useEffect(() => {
    (async () => {
      if (blob && blob.data && detail) {
        const f = new File([blob.data], detail.title);
        const book = await makeBook(f);

        setTocItems(book.toc);
        setBook(book);
      }
    })();
  }, [blob, detail]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!detail) {
    return <div>No data found</div>;
  }

  if (!uuid || !blob) {
    return null;
  }

  console.log('🚀 ~ Viewer ~ detail:', detail);
  console.log('🚀 ~ Viewer ~ book:', book);

  const renderViewer = () => {
    switch (detail.format.toLowerCase()) {
      case 'pdf':
        return <PdfViewer book={book} />;
      case 'epub':
        return <EpubViewer book={book} />;
      default:
        return <div>Unsupported file type: {detail.format}</div>;
    }
  };

  return (
    <div className={classes.layout}>
      <ViewerHeader book={detail} />
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
