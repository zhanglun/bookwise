import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useLiveQuery } from "dexie-react-hooks";
import { FileIcon, HomeIcon } from "@radix-ui/react-icons";
import { useBook } from "@/hooks/book";
import { db } from "@/store/db";

import "./index.css";
import { RouteConfig } from "@/config";

export const ViewTab = React.memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookCached = useLiveQuery(async () => {
    return await db.bookCached.toArray();
  });

  const { activateBook } = useBook();

  const goToHome = () => {
    navigate(RouteConfig.HOME);
  };

  return (
    <div className="tab">
      <div className="tab-item" onClick={() => goToHome()}>
        <HomeIcon />
        <span>Home</span>
      </div>
      {bookCached?.map((item) => {
        const isActive = location.pathname.includes(item.book_id.toString());

        return (
          <div
            className={clsx("tab-item", isActive && "tab-item--active")}
            key={item.book_id}
            onClick={() => activateBook(item.book_id)}
          >
            <FileIcon />
            <span>{item.title}</span>
          </div>
        );
      })}
    </div>
  );
});
