import {
  BrowserWindow,
  IpcMainEvent,
  IpcRendererEvent,
  ipcMain,
  ipcRenderer,
} from "electron";
import fs from "node:fs/promises";

export type Channels = {
  UPLOAD_FILE: string;
  ON_UPLOAD_FILE_SUCCESS: string;
  LOAD_COVER: Blob;
};

export function ipcMainOn<ChannelName extends keyof Channels>(
  channel: ChannelName,
  listener: (
    event: IpcMainEvent,
    ...args: unknown[]
  ) => Promise<void> | Channels[ChannelName] | unknown
) {
  ipcMain.on(channel, listener);
}

export function ipcRendererSend<ChannelName extends keyof Channels>(
  channel: ChannelName,
  args: unknown[]
) {
  console.log("🚀 ~ args:", args);
  ipcRenderer.send(channel, args);
}

export function ipcRendererOn<ChannelName extends keyof Channels>(
  channel: ChannelName,
  callback: (event: IpcRendererEvent, ...args: any[]) => void
) {
  ipcRenderer.on(channel, callback);
}

export function webContentsSend<ChannelName extends keyof Channels>(
  channel: ChannelName,
  args: unknown[]
) {
  console.log("🚀 ~ args:", args);
  ipcRenderer.send(channel, args);
}
