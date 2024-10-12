import { BookResItem } from "@/interface/book";
import { Cover } from "./Cover";
import { Badge } from "@radix-ui/themes";
import { Ellipsis } from "lucide-react";
import { BookContextMenu } from "./Menu";

export interface BookProps {
  data: BookResItem;
  onCoverClick?: (book: BookResItem) => void;
  onClick?: (book: BookResItem) => void;
  onHover?: (book: BookResItem) => void;
  full?: boolean;
}

export const Book = (props: BookProps) => {
  const { data, full, onClick, onHover } = props;
  const { authors } = data;

  return full ? (
    <div
      className="w-full border border-[var(--gray-5)] cursor-pointer rounded-lg isolation bg-[var(--gray-2)] transition-all duration-[0.3s] hover:bg[var(--gray-3)] hover:scale-[1.03] hover:shadow-[0px_0px_0px_1px_rgba(60,64,67,0.00),0px_1.5px_4px_rgba(60,64,67,0.03),0px_3px_10px_rgba(60,64,67,0.1)] group"
      onMouseEnter={() => onHover && onHover(data)}
    >
      <div className="flex flex-col">
        <div className="w-full h-[202px] py-[8%] shrink-0 grow-0 flex items-center justify-center relative opacity-90 group-hover:opacity-100">
          <Cover book={data} onClick={() => onClick && onClick(data)} />
        </div>
        <div className="flex-1 p-3 flex flex-col gap-1 border-t border-[var(--gray-5)]">
          <div className="leading-5">
            <span className="text-xs">{data.format}</span>
          </div>
          <h1 className="text-sm font-bold line-clamp-2 h-[40px] leading-5 flex-0 balance">
            {data.title}
          </h1>
          <div className="leading-5 flex flex-row items-center text-xs leading text-[var(--gray-11)]">
            <span className="flex-1 text-ellipsis overflow-hidden whitespace-nowrap">
              {/* {authors.map((author) => {
                return <span>{author.name}</span>;
              })} */}
              <span>张伦</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <Cover book={data} onClick={() => onClick && onClick(data)} />
      <div className="flex justify-between my-2">
        <Badge color="indigo" variant="solid" radius="full">
          New
        </Badge>
        <BookContextMenu book={data}>
          <Ellipsis />
        </BookContextMenu>
      </div>
    </div>
  );
};
