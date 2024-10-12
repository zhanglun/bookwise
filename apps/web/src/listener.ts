export function initListeners() {
  window.addEventListener("DOMContentLoaded", () => {
    window.electronAPI.onUpdateServerStatus((event, args) => {
      console.log(
        "🚀 ~ file: listener.ts:26 ~ window.electronAPI.onUpdateServerStatus ~ args:",
        args
      );
    });
  });
}
