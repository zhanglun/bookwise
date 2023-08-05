import { Button } from "../ui/button";
import { Home, Library, Plus, Search, Star } from "lucide-react";
import "./index.css";

export const Sidebar = () => {
  return (
    <div className="w-full h-full bg-white/50 shadow-sm rounded-md border border-[#efefef] border-opacity-60">
      <div className="p-3 flex flex-row space-x-3">
        <Button
          variant={"secondary"}
          size="sm"
          className="space-x-2 flex-1 bg-white/90 hover:bg-white/70"
        >
          <Plus size={16} />
          <span>New Content</span>
        </Button>
        <Button className="w-8 h-8 px-0">
          <Search size={16} />
        </Button>
      </div>
      <ul className="px-3 pt-6">
        <li className="side-menu-item active">
          <Home size={14} className="text-stone-600"/>
          <span>Home</span>
        </li>
        <li className="side-menu-item">
          <Library size={14} className="text-stone-600"/>
          <span>Library</span>
        </li>
        <li className="side-menu-item">
          <Star size={14} className="text-stone-600"/>
          <span>Starred</span>
        </li>
      </ul>
    </div>
  );
};
