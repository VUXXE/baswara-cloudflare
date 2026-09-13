import { createServerFn } from '@tanstack/react-start';

/**
 * Thin client-safe wrapper: all server-only imports happen
 * dynamically inside the handler, so this module bundles cleanly
 * for the client (handler body is replaced with an RPC stub).
 */
export const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
  const { getSessionUser } = await import('./auth');
  const s = await getSessionUser();
  if (!s) return null;
  return { id: s.userId, email: s.email, name: s.fullName };
});
