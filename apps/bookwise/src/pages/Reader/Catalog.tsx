import { useState } from "react";
import { ChevronsLeft } from "lucide-react";
import clsx from "clsx";
import { animate, motion } from "framer-motion";
import { BookCatalog } from "@/helpers/parseEpub";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { NavItem } from "epubjs";
import Navigation from "epubjs/types/navigation";
import { PackagingManifestObject } from "epubjs/types/packaging";

export interface CatalogProps {
  data: Navigation;
  manifest: PackagingManifestObject;
  onGoToPage: (href: string, id: string) => void;
  className?: string;
}

export const Catalog = (props: CatalogProps) => {
  const { data, manifest, onGoToPage, className } = props;
  const [ expanded, setExpanded ] = useState(false);
  const navigate = useNavigate();

  const goToPage = (href: string, id: string) => {
    onGoToPage(href, id);
  };

  const renderItems = (list: NavItem[], idx = 0) => {
    return list.map((item) => {
      const { id, label, href, subitems } = item;
      const [realHref, anchorId] = href.split("#");

      return (
        <div
          className={ clsx("text-sm text-stone-800 cursor-default") }
          key={ id }
        >
          <div
            data-id={ id }
            data-href={ href }
            className={ clsx(
              "hover:underline hover:text-accent-foreground overflow-hidden text-ellipsis whitespace-nowrap",
              "pb-4"
            ) }
            onClick={ () => goToPage(realHref, anchorId) }
          >
            { label }
          </div>
          { subitems.length > 0 && (
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
          { manifest.title }
        </span>
      </div>
      <div className="px-5 py-2 h-full overflow-y-scroll">
        { renderItems(data.toc) }
      </div>
    </motion.div>
  );
};
