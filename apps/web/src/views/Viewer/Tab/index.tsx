import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { FileIcon, HomeIcon } from "@radix-ui/react-icons";
import { useBook } from "@/hooks/book";
import { RouteConfig } from "@/config";

import "./index.css";
import { useBearStore } from "@/store";
import { pgDB } from "@/db";
import { BookCacheItem } from "@/interface/book";

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
        "select B.id AS book_id, B.title, C.is_active from book_cache AS C left join books AS B on C.book_id = B.id"
      )
      .then((res) => {
        const { rows } = res;
        setBookCache(rows as BookCacheItem[]);
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
            <FileIcon />
            <span>{item.title}</span>
          </div>
        );
      })}
    </div>
  );
});
