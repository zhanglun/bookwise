import { BookResItem } from "@/interface/book";
import { SegmentedControl } from "@radix-ui/themes";
import { Toc } from "./Epub/Toc";
import { Cover } from "@/components/Book/Cover";
import Navigation from "epubjs/types/navigation";
import { PackagingMetadataObject } from "epubjs/types/packaging";
import {
  BookmarkIcon,
  HighlighterIcon,
  NotebookPen,
  TableOfContents,
} from "lucide-react";
import { useState } from "react";

export interface ViewerSidebarProps {
  book: BookResItem;
  navigation?: Navigation;
  metadata?: PackagingMetadataObject;
}

export const ViewerSidebar = (props: ViewerSidebarProps) => {
  const { book, metadata, navigation } = props;
  const [segmented, setSegmented] = useState("toc");

  return (
    <div className="h-full flex flex-col w-[240px]">
      <div className="h-[70px] py-2 px-3 shrink-0 grow-0 flex gap-2 relative border-b border-gray-7">
        <Cover book={book} className="shrink-0 grow-0" />
        <span className="text-sm font-bold overflow-hidden whitespace-nowrap text-ellipsis">
          {metadata?.title}
        </span>
      </div>
      <SegmentedControl.Root
        defaultValue={segmented}
        radius="large"
        onValueChange={(v) => {
          setSegmented(v);
        }}
        className="my-2 shrink-0 grow-0"
      >
        <SegmentedControl.Item value="toc">
          <TableOfContents size={18} />
        </SegmentedControl.Item>
        <SegmentedControl.Item value="bookmark">
          <BookmarkIcon size={16} />
        </SegmentedControl.Item>
        <SegmentedControl.Item value="notes">
          <NotebookPen size={15} />
        </SegmentedControl.Item>
        <SegmentedControl.Item value="hightligher">
          <HighlighterIcon size={15} />
        </SegmentedControl.Item>
      </SegmentedControl.Root>
      {segmented === "toc" && (
        <Toc
          navigation={navigation}
          metadata={metadata}
          onItemClick={() => {}}
        />
      )}
      {segmented === "bookmark" && <div>TODO: bookmark</div>}
      {segmented === "notes" && <div>TODO: notes</div>}
      {segmented === "" && <div>TODO: hightligher</div>}
    </div>
  );
};
