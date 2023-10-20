import { Home, Library, Search, Star } from "lucide-react";
import clsx from 'clsx';
import { NavItem } from "./NavItem";
import "./index.css";

export const Sidebar = () => {
  return (
    <div id="sidebar" className="overflow-hidden mt-4">
      <div className="w-full h-full">
        <div>
          <div className={clsx("side-menu-item", "")}>
            <Search size={16} />
          </div>
        </div>
        <div className="pt-6 pb-6 border-b">
          <NavItem to="/" title="Home" icon={<Home size={16} />} />
          <NavItem to="/library" title="Library" icon={<Library size={16} />} />
          <NavItem to="/canvas" title="Canvas" icon={<Star size={16} />} />
        </div>
      </div>
    </div>
  );
};
