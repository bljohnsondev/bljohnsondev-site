import { env } from '$env/dynamic/private';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from './schema';

let db: ReturnType<typeof drizzle> | undefined;

export const getDb = () => {
  if (!db) {
    db = drizzle(createClient({ url: env.DATABASE_URL }), { schema });
  }
  return db;
};
