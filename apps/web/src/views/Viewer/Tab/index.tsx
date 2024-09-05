import { useLocation } from "react-router-dom";
import clsx from "clsx";
import { useLiveQuery } from "dexie-react-hooks";
import { FileIcon } from "@radix-ui/react-icons";
import { useBook } from "@/hooks/book";
import { db } from "@/store/db";
import "./index.css";

export const ViewTab = () => {
  const location = useLocation();
  const bookCached = useLiveQuery(async () => {
    return await db.bookCached.toArray();
  });

  const { activateBook } = useBook();

  return (
    <div className="tab">
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
};
