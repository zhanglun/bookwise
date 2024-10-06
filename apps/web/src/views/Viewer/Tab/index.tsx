import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Cross2Icon, FileIcon, HomeIcon } from "@radix-ui/react-icons";
import { useBook } from "@/hooks/book";
import { RouteConfig } from "@/config";

import "./index.css";
import { useBearStore } from "@/store";

export const ViewTab = React.memo(() => {
  const store = useBearStore((state) => ({
    bookCaches: state.bookCaches,
    updateBookCaches: state.updateBookCaches,
    getBookCachesRefresh: state.getBookCachesRefresh,
  }));
  const location = useLocation();
  const navigate = useNavigate();

  const { openBook, removeBookCache } = useBook();

  const goToHome = () => {
    navigate(RouteConfig.HOME);
  };

  useEffect(() => {
    // pgDB
    //   .query(
    //     "select B.id AS book_id, B.title as book_title, C.is_active from book_caches AS C left join books AS B on C.book_id = B.id"
    //   )
    //   .then((res) => {
    //     const { rows } = res;
    //     console.log("🚀 ~ file: index.tsx:30 ~ .then ~ rows:", rows);
    //     setBookCache((rows as BookCacheItem[]).filter((item) => item.book_id));
    //   });
    store.getBookCachesRefresh();
  }, []);

  return (
    <div className="tab">
      <div className="tab-item" onClick={() => goToHome()}>
        <HomeIcon />
        <span>Home</span>
      </div>
      {store.bookCaches?.map((item) => {
        const isActive = location.pathname.includes(item.book_id.toString());

        return (
          <div
            className={clsx("tab-item", isActive && "tab-item--active")}
            key={item.book_id}
            onClick={() => openBook(item.book_id, item.book_title)}
          >
            <FileIcon className="shrink-0" />
            <span className="text-ellipsis overflow-hidden whitespace-nowrap">
              {item.book_title}
            </span>
            <span
              className="p-[2px] cursor-pointer rounded-full hover:bg-[var(--black-a3)]"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                removeBookCache(item.book_id);
              }}
            >
              <Cross2Icon className="" />
            </span>
          </div>
        );
      })}
    </div>
  );
});
