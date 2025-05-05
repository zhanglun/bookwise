import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { Library } from './pages/Library';
import { PGLiteRepl } from './pages/PGLiteRepl';

export enum RouteConfig {
  HOME = '/',
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
    path: '/repl',
    element: <PGLiteRepl />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
