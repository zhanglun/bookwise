import {
  IpcMainEvent,
  IpcRendererEvent,
  ipcMain,
  ipcRenderer,
} from "electron";

export type Channels = {
  UPLOAD_FILE: string;
  ON_UPLOAD_FILE_SUCCESS: string;
  LOAD_COVER: Blob;
  READ_LOCAL_FILE: Blob;
  ON_READ_LOCAL_FILE_SUCCESS: string;
};

export function ipcMainOn<ChannelName extends keyof Channels>(
  channel: ChannelName,
  listener: (
    event: IpcMainEvent,
    ...args: unknown[]
  ) => Promise<void> | Channels[ChannelName] | unknown
) {
  console.log(
    "🚀 ~ file: events.ts:25 ~  ipcMain.on(channel, listener):",
    channel
  );
  ipcMain.on(channel, listener);
}

export function ipcRendererSend<ChannelName extends keyof Channels>(
  channel: ChannelName,
  args: unknown[]
) {
  console.log(
    "🚀 ~ file: events.ts:32 ~ ipcRenderer.send(channel, args):",
    channel,
    args
  );
  ipcRenderer.send(channel, args);
}

export function ipcRendererOn<ChannelName extends keyof Channels>(
  channel: ChannelName,
  callback: (event: IpcRendererEvent, ...args: any[]) => void
) {
  console.log("🚀 ~ file: events.ts:32 ~ ipcRenderer.on(channel):", channel);
  ipcRenderer.on(channel, callback);
}

export function webContentsSend<ChannelName extends keyof Channels>(
  channel: ChannelName,
  args: unknown[]
) {
  console.log("🚀 ~ args:", args);
  ipcRenderer.send(channel, args);
}
