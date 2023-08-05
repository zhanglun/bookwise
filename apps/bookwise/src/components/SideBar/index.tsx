import { Button } from "../ui/button";
import { Plus, Search } from "lucide-react";

export const Sidebar = () => {
  return (
    <div className="w-full h-full bg-white/40 shadow-sm rounded-md">
      <div className="p-2 flex flex-row space-x-2">
        <Button variant={"secondary"} size="sm" className="space-x-2 flex-1 bg-white/90 hover:bg-white/70">
          <Plus size={16} />
          <span>New Content</span>
        </Button>
        <Button className="w-8 h-8 px-0">
          <Search size={16} />
        </Button>
      </div>
    </div>
  );
};
