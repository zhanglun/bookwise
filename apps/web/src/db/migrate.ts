import type { MigrationConfig } from "drizzle-orm/migrator";
import { drizzleDB } from "./";
import migrations from "./migrations.json";

export async function migrate() {
  // dialect and session will appear to not exist...but they do
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await drizzleDB.dialect.migrate(migrations, drizzleDB.session, {
    migrationsTable: "drizzle_migrations",
  } satisfies Omit<MigrationConfig, "migrationsFolder">);
}
