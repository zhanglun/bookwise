import { drizzleDB } from "./db";
import { books } from "./db/schema";

export function initListeners() {
  window.addEventListener("DOMContentLoaded", () => {
    window.electronAPI.onUploadFileSuccess(async (_event, args) => {
      const book = await drizzleDB.insert(books).values({ ...args.model });
      console.log(
        "🚀 ~ file: listener.ts:19 ~ window.electronAPI.onUploadFile ~ book:",
        book
      );
    });
  });
}
