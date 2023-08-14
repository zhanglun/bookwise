import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { TabBar } from "./components/TabBar";
import { Sidebar } from "./components/SideBar";
import { Outlet, useMatch } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import {
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Button } from "./components/ui/button";

function App() {
  const [server, setServer] = useState<any>({});
  const [isReading, setIsReading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const match = useMatch("/reader");

  console.log("%c Line:10 🥤 match", "color:#4fff4B", match);

  useEffect(() => {
    window.electronAPI?.onUpdateServerStatus((_event: any, value: any) => {
      setServer(JSON.parse(value));
    });
  }, []);

  useEffect(() => {
    console.log("=====>");

    setIsReading(!!match);

    if (match) {
      const $sidebar = document.querySelector("#sidebar");
      const $catalog = document.querySelector("#catalog");

      const animateSidebarIn = () => {
        if ($catalog && !expanded) {
          animate($catalog, { x: [0, 100] }, { type: "spring" });
          setExpanded(true);
        }
      };

      const animateSidebarOut = () => {
        if ($catalog) {
          animate($catalog, { x: [100, 0] }, { type: "spring" });
          setExpanded(false);
        }
      };

      // $sidebar?.addEventListener("click", animateSidebarIn, true);
      // $sidebar?.addEventListener("mouseout", animateSidebarOut, true);
    }
  }, [match]);

  return (
    <>
      <Toaster />
      <div
        id="app"
        className="w-full h-full grid grid-rows-[30px_minmax(0,1fr)] gap-2 backdrop-blur-[40px]"
      >
        <div className="grid grid-flow-col grid-cols-[auto_1fr_auto] items-center">
          <div className="grid grid-flow-col gap-[2px]">
            <Button size="icon" variant="ghost" className="w-8 h-8">
              <PanelLeftClose size={18} />
            </Button>
            <Button size="icon" variant="ghost" className="w-8 h-8">
              <PanelLeftOpen size={18} />
            </Button>
            <Button size="icon" variant="ghost" className="w-8 h-8">
              <ChevronLeft size={18} />
            </Button>
            <Button size="icon" variant="ghost" className="w-8 h-8">
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
        {/* <TabBar /> */}
        <div className="grid gap-4 grid-cols-[260px_1fr]">
          {isReading}
          <Sidebar />
          <div className="rounded-lg overflow-hidden">
            <Outlet />
            {/* <Home /> */}
          </div>
        </div>
        <p className="hidden">
          node server status: pid: {server.pid} connected: {server.connected}{" "}
          signCode: {server.signalCode}
        </p>
      </div>
    </>
  );
}

export default App;
