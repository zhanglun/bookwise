import { useEffect } from "react";
import { Home, Library, Plus, Search, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAnimate, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useBearStore } from "@/store";
import { Button } from "../ui/button";
import { NavItem } from "./NavItem";
import "./index.css";

export const Sidebar = () => {
  const [scope, animate] = useAnimate();
  const navigate = useNavigate();
  const store = useBearStore((state) => ({
    sidebarCollapse: state.sidebarCollapse,
    updateSidebarCollapse: state.updateSidebarCollapse,
  }));

  const toggleSidebar = () => {
    store.updateSidebarCollapse();
  };

  useEffect(() => {
    console.log(
      "%c Line:18 🥔 store.sidebarCollapse",
      "color:#33a5ff",
      store.sidebarCollapse
    );
    if (store.sidebarCollapse) {
      animate([[scope.current, { x: "-100%", width: 0, paddingRight: 0 }, { duration: 0.3 }]]);
    } else {
      animate(scope.current, { x: "0", width: 200, paddingRight: '0.5rem' }, { duration: 0.3 });
    }
  }, [store.sidebarCollapse]);

  return (
    <motion.div layout id="sidebar" ref={scope} className="overflow-hidden pr-2">
      <div className="grid grid-flow-col gap-[2px]">
        {!store.sidebarCollapse && (
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8"
            onClick={toggleSidebar}
          >
            <PanelLeftClose size={18} />
          </Button>
        )}
        {store.sidebarCollapse && (
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8"
            onClick={toggleSidebar}
          >
            <PanelLeftOpen size={18} />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8"
          onClick={() => navigate(1)}
        >
          <ChevronRight size={18} />
        </Button>
      </div>
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
    </motion.div>
  );
};
