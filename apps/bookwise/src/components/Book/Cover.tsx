import { useEffect, useState } from "react";
import { createCoverLink } from "@/helpers/utils";
import { BookResItem } from "@/interface/book";
import { AspectRatio } from "../ui/aspect-ratio";

export interface CoverProps {
  book: BookResItem;
  onClick?: (book: BookResItem) => void;
}

export const Cover = (props: CoverProps) => {
  const { onClick, book } = props;
  const [path, setPath] = useState("");

  useEffect(() => {
    setPath(createCoverLink(book.path) || "");
  }, [book]);

  return path ? (
    <AspectRatio
      ratio={7 / 10}
      className="bg-muted overflow-hidden shadow-book"
      onClick={() => onClick && onClick(book)}
    >
      <img src={path} alt={book.title} className="w-full h-full object-fill" />
    </AspectRatio>
  ) : (
    <div>s</div>
  );
};
