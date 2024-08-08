import {
  ArrowLeft,
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export const TopBar = () => {
  return (
    <div className="gird-in-top-bar h-[48px]">
      <div className="flex flex-row gap-3">
        <PanelLeftClose size={18} />
        <PanelLeftOpen size={18} />
        <ArrowLeft size={18} />
        <ArrowRight size={18} />
      </div>
    </div>
  );
};
