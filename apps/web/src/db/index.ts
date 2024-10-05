import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import { live } from '@electric-sql/pglite/live'

const client = new PGlite("idb://BookWiseDatabase", {
  extensions: {
    live
  }
});
const drizzleDB = drizzle(client);

export { drizzleDB, client as pgDB };
