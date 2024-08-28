import { useBearStore } from "@/store";
import { IconButton } from "@radix-ui/themes";
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
    <div className="h-full flex">
      <div className="h-full flex flex-row items-center gap-3 px-3">
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

      <ViewTab />
    </div>
  );
};
