import { AspectRatio } from "@/components/ui/aspect-ratio";
import { createCoverLink } from "@/helpers/utils";
import { MoreVertical } from "lucide-react";

export interface BookProps {
  data: any;
}
export const Book = (props: BookProps) => {
  const { data } = props;

  return (
    <div className="">
      {createCoverLink(data.path) && (
        <AspectRatio
          ratio={7 / 10}
          className="bg-muted rounded-lg overflow-hidden  shadow-book"
        >
          <img
            src={createCoverLink(data.path)}
            alt="Photo by Drew Beamer"
            className="w-full h-full object-fill"
          />
        </AspectRatio>
      )}
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
