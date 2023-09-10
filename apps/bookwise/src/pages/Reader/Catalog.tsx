import { useState } from "react";
import { ChevronsLeft } from "lucide-react";
import clsx from "clsx";
import { animate, motion } from "framer-motion";
import { BookCatalog } from "@/helpers/parseEpub";

export interface CatalogProps {
  data: BookCatalog[];
  packaging: any;
  onGoToPage: (href: string, id: string) => void;
  className?: string;
}

export const Catalog = (props: CatalogProps) => {
  const { data, packaging, onGoToPage, className } = props;
  const { metadata } = packaging;
  const [expanded, setExpanded] = useState(false);

  const goToPage = (href: string, id: string) => {
    onGoToPage(href, id);
  };

  const renderItems = (list: BookCatalog[], idx = 0) => {
    const styles = [
      "font-normal mx-3 py-1",
      "font-normal ml-6 mr-3 py-1",
      "font-normal ml-10 mr-3 py-1",
      "font-normal ml-14 mr-3 py-1",
    ];

    return list.map((item) => {
      const { id, label, href, subitems } = item;

      return (
        <div className={clsx("text-sm text-stone-800 cursor-default")} key={id}>
          <div
            data-idx={idx}
            data-href={href}
            data-anchor-id={id}
            className={clsx(
              "hover:underline hover:text-accent-foreground overflow-hidden text-ellipsis whitespace-nowrap",
              "py-2 px-3"
            )}
            onClick={() => goToPage(href, id)}
          >
            {label}
          </div>
          {subitems.length > 0 && (
            <div className="pl-4">{renderItems(subitems, idx + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <motion.div
      layout
      id="catalog"
      className={clsx("grid grid-flow-row w-[296px] overflow-hidden rounded-s-lg", className)}
    >
      <div className="grid grid-flow-col grid-cols-[1fr] gap-1 items-center px-5 py-2 mt-3">
        <span className="text-md font-bold overflow-hidden whitespace-nowrap text-ellipsis">
          {metadata.title}
        </span>
      </div>
      <div className="px-2 py-2 h-full overflow-y-scroll">
        {renderItems(data)}
      </div>
    </motion.div>
  );
};
