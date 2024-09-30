// windowsManager.js
import { BrowserWindow } from "electron";

const windows = {};

function createWindow(name, options): BrowserWindow {
  windows[name] = new BrowserWindow(options);

  return windows[name];
}

function getWindowWebContents(name) {
  return windows[name].webContents;
}

export { createWindow, getWindowWebContents };
