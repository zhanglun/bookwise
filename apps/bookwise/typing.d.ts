export {};

declare global {
  interface Window {
    electronAPI: any; // 👈️ turn off type checking
  }
}