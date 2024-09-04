import { ScrollArea } from "@radix-ui/themes";
import { Outlet } from "react-router-dom";

import { Sidebar } from "./layout/Sidebar";
import { ModeSwitch } from "./components/ModeSwitch";

import "./App.css";
import { TopBar } from "./views/Viewer/Epub/TopBar";

function App() {
  return (
    <div className="text-foreground bg-app w-full h-full p-2 grid gap-2 grid-areas-layout grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      <ModeSwitch />
      <div className="grid-in-top-bar">
        <TopBar />
      </div>
      <div className="grid-in-left-sidebar overflow-hidden">
        <Sidebar />
      </div>
      <div className="grid-in-main-view overflow-hidden">
        <ScrollArea className="rounded-lg">
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  );
}

export default App;
