import { useCallback, useEffect, useState } from "react";
import { useAnimate, motion } from "framer-motion";
import { TabBar } from "./components/TabBar";
import { Sidebar } from "./components/SideBar";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { useBearStore } from "./store";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

function App() {
  const store = useBearStore((state) => ({
    sidebarCollapse: state.sidebarCollapse,
    updateSidebarCollapse: state.updateSidebarCollapse,
    bookStack: state.bookStack,
  }));
  const [server, setServer] = useState<any>({});
  const [isReading, setIsReading] = useState(false);
  const match = useMatch("/reader");

  useEffect(() => {
    window.electronAPI?.onUpdateServerStatus((_event: any, value: any) => {
      setServer(JSON.parse(value));
    });
  }, []);

  useEffect(() => {
    setIsReading(!!match);
  }, [store.sidebarCollapse, match]);

  useEffect(() => {
    console.log("====>");
    console.log(store.bookStack);
  }, [store.bookStack]);

  const navigate = useNavigate();
  const [scope, animate] = useAnimate();

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
      animate([[scope.current, { x: "-100%", width: 0 }, { duration: 0.3 }]]);
    } else {
      animate(scope.current, { x: "0", width: 200 }, { duration: 0.3 });
    }
  }, [store.sidebarCollapse]);

  return (
    <>
      <Toaster />
      <div id="app" className="w-full h-full backdrop-blur-[40px] flex gap-1">
        <motion.div
          layout
          className=""
        >
          <div className="bg-white/0 px-2 pt-2">
            <div className="flex gap-1">
              {!store.sidebarCollapse && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-8 h-8 text-stone-700 hover:text-stone-800 hover:bg-white/30"
                  onClick={toggleSidebar}
                >
                  <PanelLeftClose size={18} />
                </Button>
              )}
              {store.sidebarCollapse && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-8 h-8 text-stone-700 hover:text-stone-800 hover:bg-white/30"
                  onClick={toggleSidebar}
                >
                  <PanelLeftOpen size={18} />
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 text-stone-700 hover:text-stone-800 hover:bg-white/30"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft size={18} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 text-stone-700 hover:text-stone-800 hover:bg-white/30"
                onClick={() => navigate(1)}
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          <div ref={scope}>
            <Sidebar />
          </div>
          </div>
        </motion.div>
        <div className="flex-1 rounded-lg overflow-hidden p-2 mr-3">
          <Outlet />
        </div>
        <div></div>
      </div>
      <p className="hidden">
        node server status: pid: {server.pid} connected: {server.connected}{" "}
        signCode: {server.signalCode}
      </p>
    </>
  );
}

export default App;
