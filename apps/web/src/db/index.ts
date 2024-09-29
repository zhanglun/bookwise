import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";
import { PGlite } from "@electric-sql/pglite";

const client = new PGlite("idb://BookWiseDatabase");
const drizzleDB = drizzle(client, {
  schema,
});

export { drizzleDB, schema, client as pgDB };
