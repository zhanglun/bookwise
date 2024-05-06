import { Badge } from "@radix-ui/themes";
import { useState } from "react";

const Category = {
  Author: "author",
  Publisher: "publisher",
} as const;

type CategoryType = (typeof Category)[keyof typeof Category];

export const CategoryFilter = () => {
  const [current, setCurrent] = useState<CategoryType>(Category.Author);

  function handleSelect(key: string, value: CategoryType) {
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
    <div>
      <div className="flex gap-1">{renderBadges()}</div>
    </div>
  );
};
