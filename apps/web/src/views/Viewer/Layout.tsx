import { ViewerSidebar } from "./Sidebar";
import { useBearStore } from "@/store";
import { BookResItem } from "@/interface/book";
import Navigation from "epubjs/types/navigation";
import { PackagingMetadataObject } from "epubjs/types/packaging";

export interface ViewerLayoutProps {
  book: BookResItem;
  toc: React.ReactNode;
  area: React.ReactNode;
  navigation?: Navigation;
  metadata?: PackagingMetadataObject;
}

export const ViewerLayout = ({
  book,
  navigation,
  metadata,
  area,
}: ViewerLayoutProps) => {
  const store = useBearStore((state) => ({
    leftSidebarExpanded: state.leftSidebarExpanded,
    updateLeftSidebarExpanded: state.updateLeftSidebarExpanded,
  }));

  return (
    <>
      {store.leftSidebarExpanded && (
        <div className="grid-in-left-sidebar overflow-hidden">
          <ViewerSidebar
            book={book}
            navigation={navigation}
            metadata={metadata}
          />
        </div>
      )}
      <div className="grid-in-main-view">
        <div className="bg-cell rounded-lg">{area}</div>
      </div>
    </>
  );
};
