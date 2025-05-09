import { ipcRenderer, IpcRendererEvent } from "electron";
import { ipcRendererSend, ipcRendererOn } from "./events";

export type onCallback = (event: IpcRendererEvent, ...args: any[]) => void;

export const api = {
  onUpdateCounter: (callback: onCallback) =>
    ipcRenderer.on("update-counter", callback),
  onUpdateServerStatus: (callback: onCallback) =>
    ipcRenderer.on("update-server-status", callback),

  uploadFile: (files: any) => ipcRendererSend("UPLOAD_FILE", files),
  onUploadFileSuccess: (callback: onCallback) => {
    console.log("🚀 ~ file: api.ts:12 ~ onUploadFileSuccess:");
    ipcRendererOn("ON_UPLOAD_FILE_SUCCESS", callback);
  },

  readLocalFile: (args: { path: string }) =>
    ipcRendererSend("READ_LOCAL_FILE", args),

  onReadLocalFileSuccess: (callback: onCallback) => {
    ipcRenderer.on("ON_READ_LOCAL_FILE_SUCCESS", callback);
  },
};

export type API = {
  [K in keyof typeof api]: (typeof api)[K];
};
