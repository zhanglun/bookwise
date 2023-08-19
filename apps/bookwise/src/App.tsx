import { useCallback, useEffect, useState } from "react";
import { useAnimate, motion } from "framer-motion";
import { TabBar } from "./components/TabBar";
import { Sidebar } from "./components/SideBar";
import { Outlet, useMatch } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { useBearStore } from "./store";
import clsx from "clsx";

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

  return (
    <>
      <Toaster />
      <motion.div
        layout
        id="app"
        className="w-full h-full grid grid-cols-[minmax(0,max-content)_1fr] backdrop-blur-[40px]"
      >
        <Sidebar />
        <div className="rounded-lg overflow-hidden shadow-lg bg-white/80">
          <Outlet />
        </div>
      </motion.div>
      <p className="hidden">
        node server status: pid: {server.pid} connected: {server.connected}{" "}
        signCode: {server.signalCode}
      </p>
    </>
  );
}

export default App;
