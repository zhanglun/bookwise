import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fork } from "child_process";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist");
process.env.DIST_SERVER = path.join(__dirname, "../dist-server");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
let ps: any;

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

// console.log('process.env', process.env);

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC as string, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  try {
    if (VITE_DEV_SERVER_URL) {
      win.loadURL(VITE_DEV_SERVER_URL);
    } else {
      // win.loadFile('dist/index.html')
      win.loadFile(path.join(process.env.DIST as string, "index.html"));
    }

    if (app.isPackaged) {
      ps = fork(`${process.env.DIST_SERVER}/dist/main.js`, [], {});
    } else {
      console.log("=====> Please start Nest.js server");
      // ps = fork(`${path.join(__dirname, "/../../server/dist/main.js")}`, {});
    }

    setTimeout(() => {
      win &&
        win.webContents.send("update-server-status", `${JSON.stringify(ps)}`);
    }, 2000);
  } catch (err) {
    console.error(err);
    setTimeout(() => {
      win && win.webContents.send("update-server-status", JSON.stringify(err));
    }, 3000);
  }
}

app.on("window-all-closed", () => {
  win = null;
});

app.whenReady().then(() => {
  createWindow();
});

app.on("before-quit", () => {
  console.log("before-quit");

  if (ps) {
    ps.kill("SIGHUP");
  }
});
