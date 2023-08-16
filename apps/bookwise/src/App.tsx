import { useCallback, useEffect, useState } from "react";
import { useAnimate, motion } from "framer-motion";
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
import { useBearStore } from "./store";
import clsx from "clsx";

function App() {
  const store = useBearStore((state) => ({
    sidebarCollapse: state.sidebarCollapse,
    updateSidebarCollapse: state.updateSidebarCollapse,
  }));
  const [scope, animate] = useAnimate();
  const [server, setServer] = useState<any>({});
  const [isReading, setIsReading] = useState(false);
  const match = useMatch("/reader");
  const toggleSidebar = () => {
    store.updateSidebarCollapse();
  };

  useEffect(() => {
    window.electronAPI?.onUpdateServerStatus((_event: any, value: any) => {
      setServer(JSON.parse(value));
    });
  }, []);

  useEffect(() => {
    console.log("=====>");
    setIsReading(!!match);
  }, [store.sidebarCollapse]);

  return (
    <>
      <Toaster />
      <div
        id="app"
        className="w-full h-full grid grid-rows-[30px_minmax(0,1fr)] gap-2 backdrop-blur-[40px]"
      >
        <div className="grid grid-flow-col grid-cols-[auto_1fr_auto] items-center">
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
            <Button size="icon" variant="ghost" className="w-8 h-8">
              <ChevronLeft size={18} />
            </Button>
            <Button size="icon" variant="ghost" className="w-8 h-8">
              <ChevronRight size={18} />
            </Button>
          </div>
          <div className="text-center">
              {match && (<div>
                  asdfsdf
              </div>)}
          </div>
          <div>
            asdf
          </div>
        </div>
        {/* <TabBar /> */}
        <motion.div
          layout
          ref={scope}
          className={clsx("grid grid-cols-[minmax(0,max-content)_1fr]")}
        >
          {isReading}
          <Sidebar />
          <div className="rounded-lg overflow-hidden">
            <Outlet />
            {/* <Home /> */}
          </div>
        </motion.div>
        <p className="hidden">
          node server status: pid: {server.pid} connected: {server.connected}{" "}
          signCode: {server.signalCode}
        </p>
      </div>
    </>
  );
}

export default App;
