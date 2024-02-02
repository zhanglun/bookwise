import { Outlet } from "react-router-dom";
import { Sidebar } from "./layout/Sidebar";
import "./App.css";

function App() {
  return (
    <div className="text-foreground bg-background grid h-full grid-cols-[auto_1fr] gap-2 p-3">
      <div>
        <Sidebar/>
      </div>
      <div>
        <Outlet/>
      </div>
    </div>
  );
}

export default App;
