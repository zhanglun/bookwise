import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css";
import "./index.css";

ReactDOM.createRoot(document.body as HTMLElement).render(
  <App />
);

postMessage({ payload: "removeLoading" }, "*");
