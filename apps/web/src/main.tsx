import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import App from "./App.tsx";
import { Home } from "./views/Home";
import { Library } from "./views/Library";
import { Filter } from "./views/Filter";
import { Search } from "./views/Search/index.tsx";

import { Viewer } from "@/views/Viewer";

import { Theme } from "@radix-ui/themes";

import "./test.ts";
import "./index.css";
import { RouteConfig } from "./config.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: RouteConfig.HOME,
        element: <Home />,
      },
      {
        path: RouteConfig.SEARCH,
        element: <Search />,
      },
      {
        path: RouteConfig.FILTER,
        element: <Filter />,
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
  <Theme
    className="w-full h-full"
    panelBackground="translucent"
    accentColor="indigo"
  >
    <Toaster richColors={true} />
    <RouterProvider router={router} />
  </Theme>
);
