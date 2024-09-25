import { drizzle } from 'drizzle-orm/pglite';
import { PGlite } from '@electric-sql/pglite';

const client = new PGlite('idb://BookWiseDatabase')
const db = drizzle(client);

export { db }
