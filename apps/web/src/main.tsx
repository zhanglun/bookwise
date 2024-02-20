import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Theme } from "@radix-ui/themes";

import App from "./App.tsx";
import { Home } from "./views/Home";
import { Library } from "./views/Library";
import { Search } from "./views/Search/index.tsx";

import { Viewer } from "@/views/Viewer";

import "@radix-ui/themes/styles.css";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Theme>
        <App></App>
      </Theme>
    ),
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
  <RouterProvider router={router} />
);
