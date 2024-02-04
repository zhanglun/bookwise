import clsx from "clsx";
import { BookNavItem, PackagingMetadataObject } from "@/helpers/epub";

export interface TocProps {
  navigation: BookNavItem[];
  metadata: PackagingMetadataObject;
  onItemClick: (href: string, id: string) => void;
  className?: string;
}

export const Toc = (props: TocProps) => {
  const { navigation = [], metadata, onItemClick, className } = props;

  const handleItemClick = (href: string, id: string) => {
    onItemClick(href, id);
  };

  const renderItems = (list: BookNavItem[], idx = 0) => {
    return list.map((item) => {
      const { label, href, url, subitems } = item;
      const [realHref, anchorId] = href.split("#");

      return (
        <div
          className={clsx("text-sm text-stone-800 cursor-default")}
          key={url}
        >
          <div
            data-href={href}
            data-url={url}
            className={clsx(
              "hover:underline hover:text-accent-foreground overflow-hidden text-ellipsis whitespace-nowrap",
              "pb-4"
            )}
            onClick={() => handleItemClick(realHref, anchorId)}
          >
            {label}
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
      id="catalog"
      className={clsx(
        "grid grid-flow-row w-[296px] overflow-hidden rounded-s-lg",
        className
      )}
    >
      <div className="grid grid-flow-col grid-cols-[1fr] gap-1 items-center px-5 py-2 mt-3">
        <span className="text-sm font-bold overflow-hidden whitespace-nowrap text-ellipsis">
          {metadata?.title}
        </span>
      </div>
      <div className="px-5 py-2 h-full">{renderItems(navigation)}</div>
    </div>
  );
};
