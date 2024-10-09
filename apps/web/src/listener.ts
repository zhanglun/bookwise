export function initListeners() {
  window.addEventListener("DOMContentLoaded", () => {
    // window.electronAPI.onUploadFileSuccess(async (event, args) => {
    //   const record = await drizzleDB.select().from(books);

    //   console.log(
    //     "🚀 ~ file: listener.ts:13 ~ window.electronAPI.onUploadFile ~ record:",
    //     record
    //   );

    //   const { model } = args;

    // });

    window.electronAPI.onUpdateServerStatus((event, args) => {
      console.log(
        "🚀 ~ file: listener.ts:26 ~ window.electronAPI.onUpdateServerStatus ~ args:",
        args
      );
    });
  });
}
