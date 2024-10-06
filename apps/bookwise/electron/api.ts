import { ipcRenderer, IpcRendererEvent } from "electron";
import { ipcRendererSend, ipcRendererOn } from "./events";

export type onCallback = (event: IpcRendererEvent, ...args: any[]) => void;

export const api = {
  onUpdateCounter: (callback: onCallback) =>
    ipcRenderer.on("update-counter", callback),
  onUpdateServerStatus: (callback: onCallback) =>
    ipcRenderer.on("update-server-status", callback),

  uploadFile: (args: unknown[]) => ipcRendererSend("UPLOAD_FILE", args),
  onUploadFileSuccess: (callback: onCallback) => {
    console.log("🚀 ~ file: api.ts:12 ~ onUploadFileSuccess:");
    ipcRenderer.on("ON_UPLOAD_FILE_SUCCESS", callback);
  },

  readLocalFile: (args: unknown[]) => ipcRendererSend("READ_LOCAL_FILE", args),

  onReadLocalFileSuccess: (callback: onCallback) => {
    ipcRendererOn("ON_READ_LOCAL_FILE_SUCCESS", callback);
  },

};

export type API = {
  [K in keyof typeof api]: (typeof api)[K];
};
