import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import { Home } from "./views/Home";
import { Library } from "./views/Library";
import { Search } from "./views/Search/index.tsx";

import { Viewer } from "@/views/Viewer";

import { Theme } from "@radix-ui/themes";

import "./test.ts";
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
  {
    path: "/viewer/:uuid",
    element: <Viewer />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Theme className="w-full h-full" appearance="light" accentColor="indigo">
    <RouterProvider router={router} />
  </Theme>
);
