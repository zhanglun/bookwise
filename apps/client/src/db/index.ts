import { PGlite } from '@electric-sql/pglite';
import { live } from '@electric-sql/pglite/live';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from './schema';

const client = new PGlite('idb://BookWiseDatabase');
const drizzleDB = drizzle(client, { schema });

export { drizzleDB, client as pgDB };
