import { PGlite } from '@electric-sql/pglite'
import { Repl } from '@electric-sql/pglite-repl'

export const  PGLiteRepl = () => {
  const pg = new PGlite("idb://BookWiseDatabase")

  return (
    <>
      <Repl pg={pg} />
    </>
  )
}
