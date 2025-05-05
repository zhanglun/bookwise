import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "./schema";

const client = new PGlite("idb://BookWiseDatabase");
const drizzleDB = drizzle(client, { schema });

console.log("🚀 ~ drizzleDB:", drizzleDB)

export { drizzleDB, client as pgDB };
