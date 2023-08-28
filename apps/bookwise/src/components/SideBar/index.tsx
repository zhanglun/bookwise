import { Home, Library, Plus, Search, Star } from "lucide-react";
import { Button } from "../ui/button";
import { NavItem } from "./NavItem";
import "./index.css";

export const Sidebar = () => {
  return (
    <div id="sidebar" className="overflow-hidden">
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
        <div className="px-3 pt-6">
          <NavItem to="/" title="Home" icon={<Home size={14} />} />
          <NavItem to="/library" title="Library" icon={<Library size={14} />} />
          <NavItem to="/starred" title="Starred" icon={<Star size={14} />} />
        </div>
      </div>
    </div>
  );
};
