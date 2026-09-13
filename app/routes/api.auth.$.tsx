import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { getAuth } = await import('../lib/auth');
        return getAuth().handler(request);
      },
      POST: async ({ request }) => {
        const { getAuth } = await import('../lib/auth');
        return getAuth().handler(request);
      },
    },
  },
});
