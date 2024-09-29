import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "sonner";

import { Home } from "@/views/Home";
import { All } from "@/views/All/index.tsx";
import { Editor } from "@/views/Editor";
import { Search } from "@/views/Search";
import { Viewer } from "@/views/Viewer";

import { Reading } from "@/views/Reading/index.tsx";
import { PGLiteRepl } from "@/views/PGLiteRepl.tsx";
import { MainLayout } from "./layout/MainLayout.tsx";
import { RouteConfig } from "./config.ts";
import App from "./App.tsx";

import { initListeners } from "./listener.ts";

import "./index.css";

initListeners();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: RouteConfig.SEARCH,
            element: <Search />,
          },
          {
            path: RouteConfig.ALL,
            element: <All />,
          },
          {
            path: RouteConfig.READING,
            element: <Reading />,
          },
          {
            path: RouteConfig.FINISHED,
            element: <All />,
          },
          {
            path: RouteConfig.EDITOR,
            element: <Editor />,
          },
        ],
      },
      {
        path: "/viewer/:uuid",
        element: <Viewer />,
      },
    ],
  },
  {
    path: "/repl",
    element: <PGLiteRepl />,
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
