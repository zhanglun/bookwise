import { Outlet } from "react-router-dom";
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
      <Outlet />
    </div>
  );
}

export default App;
