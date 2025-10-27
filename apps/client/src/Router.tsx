import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DemoPage } from './pages/demo';
import { Foliate } from './pages/foliate';
import { Grabber } from './pages/grabber';
import { HomePage } from './pages/Home.page';
import { Library } from './pages/library';
import { PGLiteRepl } from './pages/PGLiteRepl';
import { Viewer } from './pages/viewer';

export enum RouteConfig {
  HOME = '/',
  GRABBER = '/grabber',
  FOLIATE = '/foliate',
  SEARCH = '/search',
  FILTER = '/filter',
  LIBRARY = '/library',
  EDITOR = '/editor/:id',
  ALL = '/all',
  READING = '/reading',
  FINISHED = '/finished',
  DEMO = '/demo',
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
    path: RouteConfig.FOLIATE,
    element: <Foliate />,
  },
  {
    path: '/repl',
    element: <PGLiteRepl />,
  },
  {
    path: '/viewer/:uuid',
    element: <Viewer />,
  },
  {
    path: '/demo',
    element: <DemoPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
