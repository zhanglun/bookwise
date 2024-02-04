import { BookResItem } from "@/interface/book";
import { Cover } from "./Cover";

export interface BookProps {
  data: any;
  onCoverClick?: (book: BookResItem) => void;
  onClick?: (book: BookResItem) => void;
  onHover?: (book: BookResItem) => void;
}

export const Book = (props: BookProps) => {
  const { data, onClick, onHover } = props;

  return (
    <div
      className="border border-border rounded-lg isolation bg-white transition-all hover:scale-[1.02] hover:shadow-hover-book group duration-[0.5s]"
      onMouseEnter={() => onHover && onHover(data)}
    >
      <div className="h-[308px] flex flex-col">
        <div className="w-full h-[202px] flex items-center justify-center relative opacity-90">
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
