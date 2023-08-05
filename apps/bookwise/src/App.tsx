import { useEffect, useState } from "react";
import { request } from "./helpers/request";
import { createCoverLink } from "./helpers/utils";
import { TabBar } from "./components/TabBar";
import { Sidebar } from "./components/SideBar";

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
      className="w-full h-full grid grid-rows-[30px_1fr] gap-2 backdrop-blur-[40px]"
    >
      <TabBar />
      <div className="grid gap-4 grid-cols-[260px_1fr]">
        <Sidebar />
        <div className="bg-white rounded-lg border border-slate-100 test"></div>
      </div>
      <p className="hidden">
        node server status: pid: {server.pid} connected: {server.connected}{" "}
        signCode: {server.signalCode}
      </p>
    </div>
  );
}

export default App;
