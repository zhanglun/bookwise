import { IpcMainEvent, ipcMain, ipcRenderer } from "electron";
import fs from "node:fs/promises";

export type Channels = {
  UPLOAD_FILE: string;
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

export class EventHandler {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.registerListeners();
  }

  registerListeners() {
    ipcMainOn("UPLOAD_FILE", this.uploadFile);
  }

  uploadFile(event: IpcMainEvent, body: any) {
    console.log("🚀 ~ uploadFile ~ body:", body);
  }
}
