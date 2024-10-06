import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { FileIcon, HomeIcon } from "@radix-ui/react-icons";
import { useBook } from "@/hooks/book";
import { RouteConfig } from "@/config";
import { pgDB } from "@/db";
import { BookCacheItem } from "@/interface/book";

import "./index.css";
import { XIcon } from "lucide-react";

export const ViewTab = React.memo(() => {
  const [bookCaches, setBookCache] = useState<BookCacheItem[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { openBook } = useBook();

  const goToHome = () => {
    navigate(RouteConfig.HOME);
  };

  useEffect(() => {
    pgDB
      .query(
        "select B.id AS book_id, B.title as book_title, C.is_active from book_caches AS C left join books AS B on C.book_id = B.id"
      )
      .then((res) => {
        const { rows } = res;
        setBookCache((rows as BookCacheItem[]).filter((item) => item.book_id));
      });
  }, []);

  return (
    <div className="tab">
      <div className="tab-item" onClick={() => goToHome()}>
        <HomeIcon />
        <span>Home</span>
      </div>
      {bookCaches?.map((item) => {
        const isActive = location.pathname.includes(item.book_id.toString());

        return (
          <div
            className={clsx("tab-item", isActive && "tab-item--active")}
            key={item.book_id}
            onClick={() => openBook(item.book_id)}
          >
            <FileIcon className="shrink-0" />
            <span className="text-ellipsis overflow-hidden whitespace-nowrap">
              {item.book_title}
            </span>
            <span className="p-[2px] cursor-pointer rounded-full hover:bg-[var(--black-a3)]">
              <XIcon size={14} className="" />
            </span>
          </div>
        );
      })}
    </div>
  );
});
