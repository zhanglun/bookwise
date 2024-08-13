import clsx from "clsx";
import { TopBar } from "./Epub/TopBar";
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
    <div
      className={clsx("text-foreground bg-app w-full h-full p-2 grid gap-2", {
        "grid-areas-view  grid-cols-[280px_1fr] grid-rows-[34px_auto]":
          store.leftSidebarExpanded,
        "grid-areas-hide-left-sidebar-view grid-rows-[34px_auto]":
          !store.leftSidebarExpanded,
      })}
    >
      <div className="grid-in-top-bar">
        <TopBar />
      </div>
      {store.leftSidebarExpanded && (
        <div className="grid-in-left-toc">
          <ViewerSidebar
            book={book}
            navigation={navigation}
            metadata={metadata}
          />
        </div>
      )}
      <div className="grid-in-content">
        <div className="bg-cell rounded-lg">{area}</div>
      </div>
    </div>
  );
};
