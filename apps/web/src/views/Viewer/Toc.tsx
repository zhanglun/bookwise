import { ScrollArea, Text } from "@radix-ui/themes";
import clsx from "clsx";
import { useBearStore } from "@/store";

export interface TocItem {
  label: string;
  href: string;
  subitems?: TocItem[];
  level?: number;
}

export interface TocProps {
  items?: TocItem[];
  className?: string;
  onItemClick?: (item: TocItem) => void;
}

export const Toc = ({ items = [], className, onItemClick }: TocProps) => {
  const store = useBearStore((state) => ({
    currentTocItem: state.currentTocItem,
  }));

  const handleItemClick = (item: TocItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const renderItems = (list: TocItem[], level = 0) => {
    return (list || []).map((item) => {
      const { label, href, subitems } = item;
      const isActive = store.currentTocItem?.href === href;

      return (
        <div
          className={clsx("text-sm cursor-default", className)}
          key={href}
          style={{ paddingLeft: `${level * 16}px` }}
        >
          <div
            data-href={href}
            className={clsx(
              "hover:underline hover:text-[var(--accent-11)] overflow-hidden text-ellipsis whitespace-nowrap",
              "pb-2",
              isActive && "text-[var(--accent-11)] font-medium"
            )}
            onClick={() => handleItemClick(item)}
          >
            <Text truncate>{label}</Text>
          </div>
          {subitems && subitems.length > 0 && (
            <div>{renderItems(subitems, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <ScrollArea
      size="1"
      type="hover"
      scrollbars="vertical"
      className="h-[calc(100vh-68px)]"
    >
      <div className="p-2">{renderItems(items)}</div>
    </ScrollArea>
  );
};
