import { NavLink } from "react-router-dom";
import {
  CheckCircledIcon,
  DashboardIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { RouteConfig } from "@/config";
import clsx from "clsx";
import { Uploader } from "./Uploader";
import { BookResItem } from "@/interface/book";
import { useBearStore } from "@/store";
import { BookIcon, BookOpenIcon } from "lucide-react";

export const Sidebar = () => {
  const store = useBearStore((state) => ({
    addBooks: state.addBooks,
  }));
  function createRouteClassName(isActive: boolean) {
    return clsx(
      "flex items-center gap-2 px-3 h-8 text-sm text-[var(--gray-11)] hover:text-[var(--black-12)] hover:bg-[var(--black-a2)] rounded-lg",
      {
        "text-[var(--gray-12)] bg-[var(--gray-a3)] hover:bg-[var(--gray-3)!important]":
          isActive,
      }
    );
  }

  function handleUploadSuccessCallback(book: BookResItem) {
    store.addBooks([book]);
  }

  return (
    <div className="h-full w-[240px] pt-5 flex flex-col grid-in-left-sidebar min-h-0">
      <NavLink
        to={RouteConfig.HOME}
        className={({ isActive }) => createRouteClassName(isActive)}
      >
        <HomeIcon width={18} height={16} />
        <span>Home</span>
      </NavLink>
      {/* <NavLink
        to={RouteConfig.SEARCH}
        className={({ isActive }) => createRouteClassName(isActive)}
      >
        <MagnifyingGlassIcon width={18} height={16} />
        <span>Search</span>
      </NavLink> */}
      <div className="flex-1 flex flex-col rounded-md min-h-0">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-3 py-1 font-bold text-gray-11 hover:text-gray-12">
            <DashboardIcon width={18} height={16} />
            <span>Library</span>
          </div>
          <div className="px-1 flex items-center">
            <Uploader onSuccess={handleUploadSuccessCallback} />
          </div>
        </div>
        <NavLink
          to={RouteConfig.ALL}
          className={({ isActive }) => createRouteClassName(isActive)}
        >
          <BookIcon width={18} height={16} />
          <span>All Books</span>
        </NavLink>
        <NavLink
          to={RouteConfig.READING}
          className={({ isActive }) => createRouteClassName(isActive)}
        >
          <BookOpenIcon width={18} height={16} />
          <span>Reading</span>
        </NavLink>
        <NavLink
          to={RouteConfig.FINISHED}
          className={({ isActive }) => createRouteClassName(isActive)}
        >
          <CheckCircledIcon width={18} height={16} />
          <span>Finished</span>
        </NavLink>
      </div>
    </div>
  );
};
