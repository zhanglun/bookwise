import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/electron-vite.animate.svg";
import { request } from "./helpers/request";
import { createCoverLink } from "./helpers/utils";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [res, setRes] = useState([]);
  const [server, setServer] = useState<any>({});

  useEffect(() => {
    request.get("/books").then((res) => {
      console.log("%c Line:14 🥤 res", "color:#2eafb0", res);
      setRes(res.data);
    });
  }, []);

  useEffect(() => {
    window.electronAPI.onUpdateServerStatus((_event: any, value: any) => {
      setServer(JSON.parse(value));
    });
  }, []);

  return (
    <div id="app" className="w-full h-full grid grid-cols-[240px_1fr]">
      <div className="border-r border-border">
        <h3>node server status: </h3>
        <div>
          pid: {server.pid} connected: {server.connected} signCode:{" "}
          {server.signalCode}
        </div>
        {res.map((i) => {
          return (
            <p key={i.id}>
              {i?.title}
              <img src={createCoverLink(i.path)} />
            </p>
          );
        })}
      </div>
      <div className="p-2">
        2
      </div>
    </div>
  );
}

export default App;
