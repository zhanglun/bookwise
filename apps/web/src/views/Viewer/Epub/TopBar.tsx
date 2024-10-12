import { useBearStore } from "@/store";
import { IconButton, ScrollArea } from "@radix-ui/themes";
import {
  ArrowLeft,
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { ViewTab } from "../Tab";

export const TopBar = () => {
  const store = useBearStore((state) => ({
    leftSidebarExpanded: state.leftSidebarExpanded,
    updateLeftSidebarExpanded: state.updateLeftSidebarExpanded,
  }));

  return (
    <div className="h-[36px] grid grid-cols-[auto_1fr]">
      <div className="h-[32px] flex flex-row items-center gap-3 px-3">
        <IconButton
          variant="ghost"
          color="gray"
          onClick={() =>
            store.updateLeftSidebarExpanded(!store.leftSidebarExpanded)
          }
        >
          {store.leftSidebarExpanded && <PanelLeftClose size={20} />}
          {!store.leftSidebarExpanded && <PanelLeftOpen size={20} />}
        </IconButton>
        <ArrowLeft size={20} />
        <ArrowRight size={20} />
      </div>

      <ScrollArea style={{ flex: 1, height: "100%" }}>
        <ViewTab />
      </ScrollArea>
    </div>
  );
};
