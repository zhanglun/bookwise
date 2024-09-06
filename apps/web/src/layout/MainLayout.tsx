import { Sidebar } from "@/layout/Sidebar";
import { useBearStore } from "@/store";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  const store = useBearStore((state) => ({
    leftSidebarExpanded: state.leftSidebarExpanded,
    updateLeftSidebarExpanded: state.updateLeftSidebarExpanded,
  }));
  return (
    <>
      {store.leftSidebarExpanded && (
        <div className="grid-in-left-sidebar overflow-hidden">
          <Sidebar />
        </div>
      )}
      <div className="grid-in-main-view overflow-hidden">
        <Outlet />
      </div>
    </>
  );
};
