// import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/drizzle",
  dialect: "postgresql",
  driver: "pglite",
  dbCredentials: {
    url: 'idb://BookWiseDatabase2',
  },
  verbose: true,
} satisfies Config;
