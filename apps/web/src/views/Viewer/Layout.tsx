import { useBearStore } from "@/store";
import { TopBar } from "./Epub/TopBar";
import clsx from "clsx";

export interface ViewerLayoutProps {
  toc: React.ReactNode;
  area: React.ReactNode;
}

export const ViewerLayout = ({ toc, area }: ViewerLayoutProps) => {
  const store = useBearStore((state) => ({
    leftSidebarExpanded: state.leftSidebarExpanded,
    updateLeftSidebarExpanded: state.updateLeftSidebarExpanded,
  }));

  return (
    <div
      className={clsx("text-foreground bg-app w-full h-full p-2 grid gap-2", {
        "grid-areas-view  grid-cols-[auto_1fr] grid-rows-[34px_auto]":
          store.leftSidebarExpanded,
        "grid-areas-hide-left-sidebar-view grid-rows-[38px_auto]":
          !store.leftSidebarExpanded,
      })}
    >
      <div className="grid-in-top-bar">
        <TopBar />
      </div>
      {store.leftSidebarExpanded && (
        <div className="grid-in-left-toc">{toc}</div>
      )}
      <div className="grid-in-content">
        <div className="bg-cell rounded-lg">{area}</div>
      </div>
    </div>
  );
};
