import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { createCoverLink } from "@/helpers/book";
import { BookResItem } from "@/interface/book";

export interface CoverProps {
  book: BookResItem;
  onClick?: (book: BookResItem) => void;
}

export const Cover = (props: CoverProps) => {
  const { onClick, book } = props;
  console.log("🚀 ~ Cover ~ props:", props)
  const [ path, setPath ] = useState("");

  useEffect(() => {
    setPath(createCoverLink(book.path) || "");
  }, [ book ]);

  return <div className="max-w-[50%] min-w-[50%]">
    { path ? (<div
        className={ clsx(
          "bg-muted overflow-hidden shadow-cover",
          "before:content-[' '] before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0",
          "before:bg-[linear-gradient(360deg,_rgba(0,_0,_0,_0.05)_0%,_rgba(255,_255,_255,_0.15)_100%)]"
        ) }
        onClick={ () => onClick && onClick(book) }
      >
        <img src={ path } alt={ book.title } className="object-fill"/>
      </div>
    ) : (
      <div>s</div>) }
  </div>
};
