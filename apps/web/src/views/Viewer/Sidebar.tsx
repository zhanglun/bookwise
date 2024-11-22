import { memo, useState } from "react";
import {
  BookmarkIcon,
  HighlighterIcon,
  NotebookPen,
  TableOfContents,
} from "lucide-react";
import { SegmentedControl } from "@radix-ui/themes";
import { BookResItem } from "@/interface/book";
import { Toc, TocItem } from "./Toc";
import { useBearStore } from "@/store";
import { Cover } from "@/components/Book/Cover";

interface ViewerSidebarProps {
  book: BookResItem;
  toc: TocItem[];
}

export const ViewerSidebar = memo(({ book, toc }: ViewerSidebarProps) => {
  const store = useBearStore((state) => ({
    handleTocClick: state.handleTocClick,
  }));
  const [segmented, setSegmented] = useState("toc");

  const handleTocItemClick = (item: TocItem) => {
    store.handleTocClick(item);
  };

  return (
    <div className="h-full flex flex-col w-[240px]">
      <div className="h-[70px] py-2 px-3 shrink-0 grow-0 flex gap-2 relative border-b border-gray-7">
        <Cover book={book} className="w-[48px]" />
        <span className="text-sm font-bold overflow-hidden whitespace-nowrap text-ellipsis">
          {book.title}
        </span>
      </div>
      <SegmentedControl.Root
        defaultValue={segmented}
        size="1"
        radius="large"
        onValueChange={(v) => {
          setSegmented(v);
        }}
        className="my-2 shrink-0 grow-0"
      >
        <SegmentedControl.Item value="toc">
          <TableOfContents size={14} />
        </SegmentedControl.Item>
        <SegmentedControl.Item value="bookmark">
          <BookmarkIcon size={14} />
        </SegmentedControl.Item>
        <SegmentedControl.Item value="notes">
          <NotebookPen size={12} />
        </SegmentedControl.Item>
        <SegmentedControl.Item value="hightligher">
          <HighlighterIcon size={13} />
        </SegmentedControl.Item>
      </SegmentedControl.Root>
      {segmented === "toc" && (
        <Toc items={toc} onItemClick={handleTocItemClick} />
      )}
      {segmented === "bookmark" && <div>TODO: bookmark</div>}
      {segmented === "notes" && <div>TODO: notes</div>}
      {segmented === "" && <div>TODO: hightligher</div>}
    </div>
  );
});

ViewerSidebar.displayName = "ViewerSidebar";
