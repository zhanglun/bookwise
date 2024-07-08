import { NavLink } from "react-router-dom";
import {
  DashboardIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { CategoryFilter } from "./category/CategoryFilter";
import { RouteConfig } from "@/config";
import clsx from "clsx";
import { Uploader } from "./Uploader";
import { BookResItem } from "@/interface/book";
import { useBearStore } from "@/store";

export const Sidebar = () => {
  const store = useBearStore((state) => ({
    addBooks: state.addBooks,
  }));
  function createRouteClassName(isActive: boolean) {
    return clsx(
      "flex items-center gap-3 py-2 px-2 font-bold text-[var(--gray-11)] hover:text-[var(--gray-12)]",
      {
        "text-[var(--gray-12)]": isActive,
      }
    );
  }

  function handleUploadSuccessCallback(book: BookResItem) {
    store.addBooks([book]);
  }

  return (
    <div className="h-full w-[320px] flex flex-col gap-2 grid-in-left-sidebar min-h-0">
      <div className="bg-cell text-cell-foreground rounded-md px-3 py-2">
        <NavLink
          to={RouteConfig.HOME}
          className={({ isActive }) => createRouteClassName(isActive)}
        >
          <HomeIcon width={20} height={20} />
          <span>Home</span>
        </NavLink>
        <NavLink
          to={RouteConfig.SEARCH}
          className={({ isActive }) => createRouteClassName(isActive)}
        >
          <MagnifyingGlassIcon width={20} height={20} />
          <span>Search</span>
        </NavLink>
      </div>
      <div className="flex-1 flex flex-col bg-cell text-cell-foreground rounded-md min-h-0">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3 py-1 px-2 font-bold text-gray-11 hover:text-gray-12">
            <DashboardIcon width={20} height={20} />
            <span>Library</span>
          </div>
          <div className="px-1 flex items-center">
            <Uploader onSuccess={handleUploadSuccessCallback} />
          </div>
        </div>
        <CategoryFilter />
      </div>
    </div>
  );
};
