import { ScrollArea, Text } from "@radix-ui/themes";
import clsx from "clsx";
import { NavItem } from "epubjs";
import Navigation from "epubjs/types/navigation";
import { PackagingMetadataObject } from "epubjs/types/packaging";

export interface TocProps {
  navigation?: Navigation;
  metadata?: PackagingMetadataObject;
  onItemClick: (href: NavItem) => void;
  className?: string;
}

export const Toc = (props: TocProps) => {
  const { navigation, metadata, onItemClick, className } = props;

  const handleItemClick = (item: NavItem) => {
    onItemClick(item);
  };

  const renderItems = (list: NavItem[], idx = 0) => {
    return (list || []).map((item) => {
      const { label, href, subitems } = item;

      return (
        <div
          className={clsx("text-sm text-stone-800 cursor-default")}
          key={href}
        >
          <div
            data-href={href}
            className={clsx(
              "hover:underline hover:text-accent-foreground overflow-hidden text-ellipsis whitespace-nowrap",
              "pb-4"
            )}
            onClick={() => handleItemClick(item)}
          >
            <Text>{label}</Text>
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
        "w-[290px] fixed top-2 bottom-2 left-2",
        "rounded-lg bg-cell text-cell-foreground",
        "grid grid-row-[36px_1fr]",
        className
      )}
    >
      <div className="grid grid-flow-col gap-1 items-center py-2 px-3 mt-3 grid-cols-[1fr]">
        <span className="overflow-hidden text-sm font-bold whitespace-nowrap text-ellipsis">
          {metadata?.title}
        </span>
      </div>
      <ScrollArea size="1" type="always" scrollbars="vertical">
        <div className="w-[290px] px-3 py-3">
          {renderItems(navigation?.toc as NavItem[])}
        </div>
      </ScrollArea>
    </div>
  );
};
