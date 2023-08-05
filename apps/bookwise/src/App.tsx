import { useEffect, useState } from "react";
import { TabBar } from "./components/TabBar";
import { Sidebar } from "./components/SideBar";
import { Outlet } from "react-router-dom";

function App() {
  const [server, setServer] = useState<any>({});

  useEffect(() => {
    window.electronAPI.onUpdateServerStatus((_event: any, value: any) => {
      setServer(JSON.parse(value));
    });
  }, []);

  return (
    <div
      id="app"
      className="w-full h-full grid grid-rows-[30px_minmax(0,1fr)] gap-2 backdrop-blur-[40px]"
    >
      <TabBar />
      <div className="grid gap-4 grid-cols-[260px_1fr]">
        <Sidebar />
        <div className="rounded-lg overflow-y-scroll">\
          <Outlet />
          {/* <Home /> */}
        </div>
      </div>
      <p className="hidden">
        node server status: pid: {server.pid} connected: {server.connected}{" "}
        signCode: {server.signalCode}
      </p>
    </div>
  );
}

export default App;
