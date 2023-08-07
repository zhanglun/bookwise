import { BookResItem } from "@/interface/book";
import { MoreVertical } from "lucide-react";
import { Cover } from "./Cover";

export interface BookProps {
  data: any;
  onCoverClick: (book: BookResItem) => void;
}
export const Book = (props: BookProps) => {
  const { data, onCoverClick } = props;

  return (
    <div className="">
      <Cover
        onClick={() => onCoverClick(data)}
        book={data}
      />
      <div className="grid grid-flow-col grid-cols-[minmax(0,1fr)_auto] gap-1 items-center py-2">
        <span
          className="text-xs text-ellipsis
            overflow-hidden
            whitespace-nowrap"
        >
          {data.title}
        </span>
        <span>
          <MoreVertical size={14} />
        </span>
      </div>
    </div>
  );
};
