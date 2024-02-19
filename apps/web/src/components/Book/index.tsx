import { BookResItem } from "@/interface/book";
import { Cover } from "./Cover";

export interface BookProps {
  data: BookResItem;
  onCoverClick?: (book: BookResItem) => void;
  onClick?: (book: BookResItem) => void;
  onHover?: (book: BookResItem) => void;
}

export const Book = (props: BookProps) => {
  const { data, onClick, onHover } = props;

  return (
    <div
      className="w-[210px] border border-border rounded-lg isolation bg-white transition-all duration-[0.5s] hover:scale-[1.02] hover:shadow-[0px_0px_0px_1px_rgba(60,64,67,0.00),0px_1.5px_4px_rgba(60,64,67,0.03),0px_3px_10px_rgba(60,64,67,0.1)] group"
      onMouseEnter={() => onHover && onHover(data)}
    >
      <div className="h-[308px] flex flex-col">
        <div className="w-full h-[202px] flex items-center justify-center relative opacity-90 group-hover:opacity-100">
          <Cover book={data} onClick={() => onClick && onClick(data)} />
        </div>
        <div className="flex-1 p-3 flex flex-col border-t border-border">
          <h1 className="text-sm font-bold line-clamp-2 leading-5 mb-1 flex-1 balance">
            {data.title}
          </h1>
          <div className="leading-5 flex flex-row items-center text-xs leading text-muted-foreground">
            <span className="flex-1 text-ellipsis overflow-hidden whitespace-nowrap">
              {data.author?.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
