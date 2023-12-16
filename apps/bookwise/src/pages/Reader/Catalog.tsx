import { ChevronsLeft } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { BookNavItem, PackagingMetadataObject } from "@/helpers/parseEpub";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export interface CatalogProps {
  data: BookNavItem[];
  metadata: PackagingMetadataObject;
  onGoToPage: (href: string, id: string) => void;
  className?: string;
}

export const Catalog = (props: CatalogProps) => {
  const { data, metadata, onGoToPage, className } = props;
  const navigate = useNavigate();

  const goToPage = (href: string, id: string) => {
    onGoToPage(href, id);
  };

  const renderItems = (list: BookNavItem[], idx = 0) => {
    return list.map((item) => {
      const { label, href, url, subitems } = item;
      const [realHref, anchorId] = href.split("#");

      return (
        <div
          className={ clsx("text-sm text-stone-800 cursor-default") }
          key={ url }
        >
          <div
            data-href={ href }
            data-url={ url }
            className={ clsx(
              "hover:underline hover:text-accent-foreground overflow-hidden text-ellipsis whitespace-nowrap",
              "pb-4"
            ) }
            onClick={ () => goToPage(realHref, anchorId) }
          >
            { label }
          </div>
          { subitems && subitems.length > 0 && (
            <div className="pl-4">{ renderItems(subitems, idx + 1) }</div>
          ) }
        </div>
      );
    });
  };

  return (
    <motion.div
      layout
      id="catalog"
      className={ clsx("grid grid-flow-row w-[296px] overflow-hidden rounded-s-lg", className) }
    >
      <div className="sticky top-0 left-0 px-3 py-3 border-b border-border">
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8 text-stone-700 hover:text-stone-900 bg-stone-300/30 hover:bg-stone-500/30"
          onClick={ () => navigate(-1) }
        >
          <ChevronsLeft size={ 18 }/>
        </Button>
      </div>
      <div className="grid grid-flow-col grid-cols-[1fr] gap-1 items-center px-5 py-2 mt-3">
        <span className="text-sm font-bold overflow-hidden whitespace-nowrap text-ellipsis">
          { metadata.title }
        </span>
      </div>
      <div className="px-5 py-2 h-full overflow-y-scroll">
        { renderItems(data) }
      </div>
    </motion.div>
  );
};
