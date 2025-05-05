import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/drizzle",
  dialect: "postgresql",
  driver: "pglite",
  dbCredentials: {
    host: "localhost",
    port: "5432",
    password: "123",
    database: "bookwise",
    user: "bookwise",
    ssl: "allow",
  },
  verbose: true,
} satisfies Config;
