//github.com/drizzle-team/drizzle-orm/discussions/2532

import { readMigrationFiles } from "drizzle-orm/migrator";
import { join } from "node:path";
import fs from "node:fs";

const migrations = readMigrationFiles({
  migrationsFolder: join(import.meta.dirname, "./drizzle/"),
});

await fs.writeFileSync(
  join(import.meta.dirname, "./migrations.json"),
  JSON.stringify(migrations)
);

console.log("Migrations compiled!");
