export interface electronAPI {
  readLocalFile: (args: { path: string }) => void;
}

declare global {
  interface Window {
    electronAPI: API;
  }
}
