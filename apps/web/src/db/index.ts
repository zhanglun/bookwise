import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";

const client = new PGlite("idb://BookWiseDatabase");
const drizzleDB = drizzle(client);

export { drizzleDB, client as pgDB };
