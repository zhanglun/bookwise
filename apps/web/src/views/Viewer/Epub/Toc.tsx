import { Cover } from "@/components/Book/Cover";
import { BookResItem } from "@/interface/book";
import { ScrollArea, Text } from "@radix-ui/themes";
import clsx from "clsx";
import { NavItem } from "epubjs";
import Navigation from "epubjs/types/navigation";
import { PackagingMetadataObject } from "epubjs/types/packaging";

export interface TocProps {
  navigation?: Navigation;
  metadata?: PackagingMetadataObject;
  book: BookResItem;
  onItemClick: (href: NavItem) => void;
  className?: string;
}

export const Toc = (props: TocProps) => {
  const { navigation, metadata, book, onItemClick, className } = props;
  console.log("🚀 ~ Toc ~ metadata:", metadata)

  const handleItemClick = (item: NavItem) => {
    onItemClick(item);
  };

  const renderItems = (list: NavItem[], idx = 0) => {
    return (list || []).map((item) => {
      const { label, href, subitems } = item;

      return (
        <div className={clsx("text-sm cursor-default")} key={href}>
          <div
            data-href={href}
            className={clsx(
              "hover:underline hover:text-[var(--accent-11)] overflow-hidden text-ellipsis whitespace-nowrap",
              "pb-2"
            )}
            onClick={() => handleItemClick(item)}
          >
            <Text truncate>{label}</Text>
          </div>
          {subitems && subitems.length > 0 && (
            <div className="pl-4">{renderItems(subitems, idx + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className={clsx(
        "w-full h-full",
        "rounded-lg bg-cell text-cell-foreground",
        "flex flex-col",
        className
      )}
    >
      <div className="w-full h-[240px] pt-2 shrink-0 grow-0 flex items-center justify-center relative opacity-90 group-hover:opacity-100">
        <Cover book={book}/>
      </div>
      {/* <div className="h-[42px] grid grid-flow-col gap-1 items-center py-2 px-3 grid-cols-[1fr]">
        <span className="overflow-hidden text-sm font-bold whitespace-nowrap text-ellipsis">
          {metadata?.title}
        </span>
      </div> */}
      <div className="flex-0 w-full h-[calc(100vh-240px)]">
        <ScrollArea size="1" type="hover" scrollbars="vertical">
          <div className="w-[260px] px-3 py-3">
            {renderItems(navigation?.toc as NavItem[])}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
