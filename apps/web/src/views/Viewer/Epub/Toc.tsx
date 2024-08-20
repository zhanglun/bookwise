import {ScrollArea, Text} from "@radix-ui/themes";
import clsx from "clsx";
import {NavItem} from "epubjs";
import Navigation from "epubjs/types/navigation";
import {PackagingMetadataObject} from "epubjs/types/packaging";
import {useBearStore} from "@/store";

export interface TocProps {
  navigation?: Navigation;
  metadata?: PackagingMetadataObject;
  onItemClick: (href: NavItem) => void;
  className?: string;
}

export const Toc = (props: TocProps) => {
  const {navigation, metadata, className} = props;
  const store = useBearStore((state) => ({
    handleTocClick: state.handleTocClick
  }))

  const handleItemClick = (item: NavItem) => {
    store.handleTocClick(item)
  };

  const renderItems = (list: NavItem[], idx = 0) => {
    return (list || []).map((item) => {
      const {label, href, subitems} = item;

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
    // <div className="grow overflow-hidden">
    <ScrollArea size="1" type="hover" scrollbars="vertical">
      <div className="px-2 py-2">
        {renderItems(navigation?.toc as NavItem[])}
      </div>
    </ScrollArea>
    // </div>
  );
};
