import { ViewerSidebar } from "./Sidebar";
import { useBearStore } from "@/store";
import { BookResItem } from "@/interface/book";
import { useEffect, useState, useCallback } from "react";
import { dal } from "@/dal";
import { EpubViewer } from "./Epub";
import { TocItem } from "./Toc";
import { useParams } from "react-router-dom";

export const Viewer = () => {
  const { uuid } = useParams();
  const [book, setBook] = useState<BookResItem | null>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const leftSidebarExpanded = useBearStore(
    (state) => state.leftSidebarExpanded
  );

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

  return (
    <div className="grid-in-main-view h-full overflow-hidden">
      <div className="h-full grid grid-cols-[minmax(240px,240px)_minmax(400px,1fr)_minmax(280px,320px)]">
        {leftSidebarExpanded && (
          <div className="grid-in-left-sidebar overflow-hidden border-r">
            <ViewerSidebar book={book} toc={toc} />
          </div>
        )}
        <div className="flex flex-col min-h-0">
          {/* <div className="bg-cell rounded-lg h-full"> */}
          <EpubViewer bookUuid={uuid} onTocUpdate={handleTocUpdate} />
          {/* </div> */}
        </div>
        <div className="border-l border-[var(--gray-5)] flex flex-col min-h-0">
          {/* <InfoPanel data={selectItem} /> */}
        </div>
      </div>
    </div>
  );
};
