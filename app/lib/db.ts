import { drizzle } from 'drizzle-orm/d1';
import { env } from 'cloudflare:workers';
import * as schema from './schema';

/**
 * Create a Drizzle D1 client bound to the Workers D1 binding.
 * The `env` import from `cloudflare:workers` is only available in
 * server-side (Workers) contexts — never import this module on the client.
 */
export function getDb() {
  return drizzle(env.D1_DB, { schema });
}

export { schema };