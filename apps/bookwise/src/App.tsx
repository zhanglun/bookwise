import { useEffect, useState } from "react";
import { request } from "./helpers/request";
import { createCoverLink } from "./helpers/utils";
import "./App.css";
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
    <div id="app" className="w-full h-full grid grid-rows-[30px_1fr] gap-3">
      <TabBar />
      <div className="grid gap-4 grid-cols-[260px_1fr]">
        <Sidebar />
        <div className="bg-white rounded-lg">

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
