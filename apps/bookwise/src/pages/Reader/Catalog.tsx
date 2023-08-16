import { useState } from "react";
import { ChevronsLeft } from "lucide-react";
import clsx from "clsx";
import { animate } from "framer-motion";
import { BookCatalog } from "@/helpers/parseEpub";

export interface CatalogProps {
  data: BookCatalog[];
  packaging: any;
  onGoToPage: (href: string, id: string) => void;
}

export const Catalog = (props: CatalogProps) => {
  const { data, packaging, onGoToPage } = props;
  const { metadata } = packaging;
  const [expanded, setExpanded] = useState(false);

  const goToPage = (href: string, id: string) => {
    onGoToPage(href, id);
  };

  const showSidebar = () => {
    const $catalog = document.querySelector("#catalog");

    if ($catalog && !expanded) {
      animate($catalog, { x: [0, 240] });
      setExpanded(true);
    }
  };

  const renderItems = (list: BookCatalog[], idx = 0) => {
    const styles = [
      "font-semibold mx-2 py-2",
      "font-normal ml-6 mr-3 py-1",
      "font-normal ml-10 mr-3 py-1",
    ];

    return list.map((item) => {
      const { id, label, href, subitems } = item;
      return (
        <div className={clsx("text-sm cursor-default")} key={id}>
          <div
            data-idx={idx}
            data-href={href}
            className={clsx(
              "hover:underline overflow-hidden text-ellipsis whitespace-nowrap",
              styles[idx]
            )}
            onClick={() => goToPage(href, id)}
          >
            {label}
          </div>
          {subitems.length > 0 && (
            <div className="">{renderItems(subitems, idx + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      id="catalog"
      className="grid grid-flow-row w-[250px] bg-white shadow-sm rounded-md border border-[#efefef] border-opacity-60 absolute top-[46px] left-[20px] bottom-2"
    >
      <div className="grid grid-flow-col grid-cols-[24px_1fr] gap-1 items-center px-4 py-2 mt-3">
        <span
          className="w-6 h-6 rounded-lg hover:bg-accent flex items-center justify-center"
          onClick={showSidebar}
        >
          <ChevronsLeft size={18} />
        </span>
        <span className="text-sm font-bold overflow-hidden whitespace-nowrap text-ellipsis">
          {metadata.title}
        </span>
      </div>
      <div className="px-2 py-2 h-full overflow-y-scroll">
        {renderItems(data)}
      </div>
    </div>
  );
};
