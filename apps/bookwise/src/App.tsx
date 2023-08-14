import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { TabBar } from "./components/TabBar";
import { Sidebar } from "./components/SideBar";
import { Outlet, useMatch } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [server, setServer] = useState<any>({});
  const [isReading, setIsReading] = useState(false);
  const match = useMatch("/reader");

  console.log("%c Line:10 🥤 match", "color:#4fff4B", match);

  useEffect(() => {
    window.electronAPI?.onUpdateServerStatus((_event: any, value: any) => {
      setServer(JSON.parse(value));
    });
  }, []);

  useEffect(() => {
    setIsReading(!!match);

    if(match) {
      const $sidebar = document.querySelector('#sidebar');
      const $catalog = document.querySelector('#catalog');

      const animateSidebar = () => {
        console.log("%c Line:28 🥝 animateSidebar", "color:#33a5ff");
        $catalog && animate($catalog, { x: [0, 100] }, { type: "spring" })
      }

      $sidebar?.addEventListener('mouseover', animateSidebar);
    }
  }, [match]);

  return (
    <>
      <Toaster />
      <div
        id="app"
        className="w-full h-full grid grid-rows-[30px_minmax(0,1fr)] gap-2 backdrop-blur-[40px]"
      >
        {/* <div></div> */}
        <TabBar />
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
