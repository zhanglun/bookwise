import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App.tsx";
import { Home } from "./views/Home";
import { Library } from "./views/Library";
import { Search } from "./views/Search/index.tsx";

import "./index.css";

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
        path: "/search",
        element: <Search />,
      },
      {
        path: "/library",
        element: <Library />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <NextUIProvider className="h-full">
    <RouterProvider router={router} />,
  </NextUIProvider>,
);

// ReactDOM.createRoot(document.getElementById("root")!).render(
//     <App />
//   </NextUIProvider>,
// );
