import { PGlite } from '@electric-sql/pglite';
import { Repl } from '@electric-sql/pglite-repl';
import { NavLink } from 'react-router-dom';
import { RouteConfig } from '@/Router';

export const PGLiteRepl = () => {
  const pg = new PGlite('idb://BookWiseDatabase');

  return (
    <>
      <div className="fixed right-0 top-0 z-10">
        <NavLink to={RouteConfig.HOME}>Home</NavLink>
      </div>
      <Repl pg={pg} />
    </>
  );
};
