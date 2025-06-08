import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Grabber } from './pages/grabber';
import { HomePage } from './pages/Home.page';
import { Library } from './pages/Library';
import { PGLiteRepl } from './pages/PGLiteRepl';
import { Viewer } from './pages/viewer';

export enum RouteConfig {
  HOME = '/',
  GRABBER = '/grabber',
  SEARCH = '/search',
  FILTER = '/filter',
  LIBRARY = '/library',
  EDITOR = '/editor/:id',
  ALL = '/all',
  READING = '/reading',
  FINISHED = '/finished',
}

const router = createBrowserRouter([
  {
    path: RouteConfig.HOME,
    element: <HomePage />,
    children: [
      {
        index: true,
        element: <Library />,
      },
    ],
  },
  {
    path: RouteConfig.GRABBER,
    element: <Grabber />,
  },
  {
    path: '/repl',
    element: <PGLiteRepl />,
  },
  {
    path: '/viewer/:uuid',
    element: <Viewer />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
