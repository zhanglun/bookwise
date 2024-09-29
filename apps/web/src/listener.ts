import { dal } from "./dal";
import { db } from "./db";

export function initListeners() {
  window.addEventListener("DOMContentLoaded", () => {
    window.electronAPI.onUploadFile((event, args) => {
      console.log(
        "🚀 ~ file: listener.ts:7 ~ window.electronAPI.onUploadFile ~ args:",
        args
      );
    });
  });
}
