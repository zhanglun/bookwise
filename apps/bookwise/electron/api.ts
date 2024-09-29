import { ipcRenderer } from "electron";
import { ipcRendererSend } from "./events";

export const api = {
  onUpdateCounter: (callback) => ipcRenderer.on("update-counter", callback),
  onUpdateServerStatus: (callback) =>
    ipcRenderer.on("update-server-status", callback),
  uploadFile: (args) => ipcRendererSend("UPLOAD_FILE", args),
  onUploadFile: (callback) => ipcRenderer.on("UPLOAD_FILE_SUCCESS", callback),
};
