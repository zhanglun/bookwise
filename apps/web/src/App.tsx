import { ScrollArea } from "@radix-ui/themes";
import { Outlet } from "react-router-dom";

import { Sidebar } from "./layout/Sidebar";
import { ModeSwitch } from "./components/ModeSwitch";

import "./App.css";

function App() {
  return (
    <div className="text-foreground bg-app grid w-full h-full grid-cols-[auto_1fr] grid-areas-layout gap-2 p-2">
      <ModeSwitch />
      <Sidebar />
      <ScrollArea className="grid-in-main-view rounded-lg">
        <Outlet />
      </ScrollArea>
      {/* <div className="grid-in-right-sidebar"></div> */}
    </div>
  );
}

export default App;
