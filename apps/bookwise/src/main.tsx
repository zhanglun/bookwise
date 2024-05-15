import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Library } from "./pages/Library";
import { Home } from "./pages/Home";
// import { Reader } from "./pages/Reader";
import { Settings } from "@/pages/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/library",
        element: <Library />,
      },
      // {
      //   path: "/reader/:id",
      //   element: <Reader />,
      // },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);

postMessage({ payload: "removeLoading" }, "*");
