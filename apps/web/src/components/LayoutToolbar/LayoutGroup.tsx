import React from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { ListBulletIcon, DashboardIcon, TableIcon } from "@radix-ui/react-icons";
import { useBearStore } from "@/store";

const toggleGroupItemClasses =
  "flex size-[28px] items-center justify-center leading-4 rounded text-[var(--gray-10)] hover:bg-[var(--gray-5)] focus:bg-gray-a4 data-[state=on]:bg-[var(--gray-a4)] data-[state=on]:text-[var(--gray-12)]";

const LayoutGroup = () => {
  const store = useBearStore((state) => ({
    layoutView: state.layoutView,
    updateLayoutView: state.updateLayoutView,
  }));

  function handleValueChange(value: LayoutViewType) {
    store.updateLayoutView(value);
  }

  return (
    <ToggleGroup.Root
      className="inline-flex gap-1"
      type="single"
      defaultValue={store.layoutView}
      aria-label="View"
      onValueChange={handleValueChange}
    >
      <ToggleGroup.Item
        className={toggleGroupItemClasses}
        value="list"
        aria-label="List view"
      >
        <ListBulletIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={toggleGroupItemClasses}
        value="table"
        aria-label="Table view"
      >
        <TableIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={toggleGroupItemClasses}
        value="grid"
        aria-label="Grid view"
      >
        <DashboardIcon />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};

export default LayoutGroup;
