import { Badge, ScrollArea } from "@radix-ui/themes";
import { useState } from "react";
import { AuthorList } from "./AuthorList";
import { PublisherList } from "@/layout/Sidebar/category/PublisherList";
import { LanguageList } from "@/layout/Sidebar/category/LanguageList";

const Category = {
  Author: "author",
  Publisher: "publisher",
  Language: "language",
} as const;

type CategoryType = (typeof Category)[keyof typeof Category];

export const CategoryFilter = () => {
  const [current, setCurrent] = useState<CategoryType>(Category.Author);

  function handleSelect(_key: string, value: CategoryType) {
    setCurrent(value);
  }

  function renderBadges() {
    return Object.entries(Category).map(([key, value]) => {
      return (
        <Badge
          size="2"
          variant={current === value ? "solid" : "soft"}
          radius="full"
          className="cursor-pointer"
          onClick={() => handleSelect(key, value)}
        >
          {key}
        </Badge>
      );
    });
  }

  return (
    <div className="flex-1 min-h-0 overflow-hidden">
      <div className="flex gap-1 px-3 pt-1 pb-2">{renderBadges()}</div>
        <ScrollArea size="1" scrollbars="vertical" className="min-w-0 max-w-full">
          { current === Category.Author && <AuthorList />}
          { current === Category.Publisher && <PublisherList />}
          { current === Category.Language && <LanguageList />}
        </ScrollArea>
    </div>
  );
};
