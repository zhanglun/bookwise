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
  viewType?: LayoutViewType;
}

export const Book = (props: BookProps) => {
  const { data, viewType = "grid", onClick } = props;

  console.log(data)

  const coverClass = {
    grid: "",
    list: "w-[70px]",
  };

  const boxClass = {
    grid: "",
    list: "flex gap-4 flex-row py-4",
  };

  return (
    <div className={boxClass[viewType]}>
      <div>
        <BookContextMenu book={data} variant="context">
          <Cover
            book={data}
            onClick={() => onClick && onClick(data)}
            className={coverClass[viewType]}
          />
        </BookContextMenu>
      </div>
      <div className="flex flex-col flex-1 justify-between">
        { viewType === 'list' && <div className="mt-3">
          <div className="text-sm">{data.title}</div>
        </div>}
        <div className="flex justify-between my-2">
          <Badge color="indigo" variant="solid" radius="full">
            New
          </Badge>
          <BookContextMenu book={data}>
            <Ellipsis />
          </BookContextMenu>
        </div>
      </div>
    </div>
  );
};
