import { Outlet } from "react-router-dom";
import { Sidebar } from "./layout/Sidebar";
import { Toaster } from 'sonner'

import "./App.css";
import { useEffect } from "react";
import { request } from "./helpers/request";
import { useBearStore } from "./store";

function App() {
  const store = useBearStore((state) => ({
    updateSettings: state.updateSetting
  }))

  useEffect(() => {
    request.get('/settings').then((res) => {
      console.log("%c Line:12 🍢 res", "color:#4fff4B", res.data);
      store.updateSettings(res.data);
    })
  }, []);

  return (
    <>
      <Toaster/>
      <div className="text-foreground bg-app grid w-full h-full grid-cols-[auto_1fr] gap-2 p-3">
        <div>
          <Sidebar/>
        </div>
        <div>
          <Outlet/>
        </div>
      </div>
    </>
  );
}

export default App;
