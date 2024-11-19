import { Outlet } from "react-router-dom";
import { ModeSwitch } from "./components/ModeSwitch";
import { TopBar } from "./views/Viewer/Epub/TopBar";

function App() {
  return (
    <div className="text-foreground bg-app w-full h-full grid grid-areas-layout grid-rows-[auto_1fr]">
      <div className="grid-in-top-bar border-b border-[var(--gray-5)]">
        <ModeSwitch />
        <TopBar />
      </div>
      <Outlet />
    </div>
  );
}

export default App;
