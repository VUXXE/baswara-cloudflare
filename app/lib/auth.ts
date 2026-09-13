import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/d1';
import { createServerOnlyFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { env } from 'cloudflare:workers';
import * as schema from './schema';

/**
 * Build a Better Auth instance bound to the request's D1 database.
 * Created lazily per request — never at module top-level, since
 * `env.D1_DB` only exists inside the Workers runtime.
 */
export function getAuth() {
  const db = drizzle(env.D1_DB, { schema });
  return betterAuth({
    appName: 'Baswara',
    database: drizzleAdapter(db, { provider: 'sqlite' }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      autoSignIn: true,
    },
    trustedOrigins: ['http://localhost:3000'],
    secret: (env.BETTER_AUTH_SECRET as string) || 'baswara-dev-secret-change-me',
    baseURL: (env.BETTER_AUTH_URL as string) || 'http://localhost:3000',
  });
}

export interface SessionUser {
  userId: string;
  email: string;
  fullName: string;
}

/** Server-only: read the current session from request cookies. */
export const getSessionUser = createServerOnlyFn(
  async (): Promise<SessionUser | null> => {
    const session = await getAuth().api.getSession({
      headers: getRequestHeaders() as unknown as Headers,
    });
    if (!session?.user) return null;
    return {
      userId: session.user.id,
      email: session.user.email,
      fullName: session.user.name || '',
    };
  }
);

/** Session for router context (`__root.tsx` beforeLoad, via `./session`). */
