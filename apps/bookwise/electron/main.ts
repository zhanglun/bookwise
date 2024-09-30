import { app, BrowserWindow, ipcMain, protocol, net } from "electron";
import path from "node:path";
import fs from "node:fs";
import { fork } from "child_process";
import { testFile } from "./test";
import { createWindow, getWindowWebContents } from "./windowManager";

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

console.log("process.env", process.env);

// initMigrate();

function registerProtocols() {
  protocol.registerSchemesAsPrivileged([
    { scheme: "bookwise", privileges: { standard: true } },
  ]);
}

function createMainWindow() {
  win = createWindow("main-window", {
    icon: path.join(process.env.PUBLIC as string, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  win.webContents.openDevTools();
  win.maximize();

  try {
    if (VITE_DEV_SERVER_URL) {
      win.loadURL(`http://localhost:5173`);
      // win.loadURL(VITE_DEV_SERVER_URL);
    } else {
      // win.loadFile('dist/index.html')
      // win.loadFile(path.join(process.env.DIST as string, "index.html"));
      win.loadURL(`http://localhost:5173`);
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

  return win;
}

registerProtocols();

app.on("window-all-closed", () => {
  win = null;
});

app.whenReady().then(() => {
  createMainWindow();

  protocol.handle("bookwise", async (request, callback) => {
    const url = request.url.replace("bookwise:///", "");
    console.log("🚀 ~ file: main.ts:98 ~ protocol.handle ~ url:", url);
    const filePath = path.join(app.getPath("documents"), url); //  获取文件路径，注意路径的正确性
    console.log(
      "🚀 ~ file: main.ts:99 ~ protocol.handle ~ filePath:",
      filePath
    );

    try {
      const response = await net.fetch(filePath);
      callback(response);
    } catch (error) {
      callback(error);
    }
  });

  ipcMain.on("UPLOAD_FILE", async (e, data) => {
    const newData = await testFile(data);
    console.log("🚀 ~ file: main.ts:89 ~ ipcMain.on ~ newData:", newData);
    getWindowWebContents("main-window").send("ON_UPLOAD_FILE_SUCCESS", newData);
  });
});

app.on("before-quit", () => {
  console.log("before-quit");

  if (ps) {
    ps.kill("SIGHUP");
  }
});
