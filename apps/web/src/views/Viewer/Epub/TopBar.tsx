import {
  ArrowLeft,
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export const TopBar = () => {
  return (
    <div className="h-full">
      <div className="h-full flex flex-row items-center gap-3 px-3">
        <PanelLeftClose size={18} />
        {/* <PanelLeftOpen size={18} /> */}
        <ArrowLeft size={18} />
        <ArrowRight size={18} />
      </div>
    </div>
  );
};
