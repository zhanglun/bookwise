import { ipcRenderer, IpcRendererEvent } from "electron";
import { ipcRendererSend, ipcRendererOn } from "./events";

export type onCallback = (event: IpcRendererEvent, ...args: any[]) => void;

export const api = {
  onUpdateCounter: (callback: onCallback) =>
    ipcRenderer.on("update-counter", callback),
  onUpdateServerStatus: (callback: onCallback) =>
    ipcRenderer.on("update-server-status", callback),
  onUploadFileSuccess: (callback: onCallback) =>
    ipcRendererOn("ON_UPLOAD_FILE_SUCCESS", callback),

  uploadFile: (args) => ipcRendererSend("UPLOAD_FILE", args),
};

export type API = {
  [K in keyof typeof api]: (typeof api)[K];
};
