import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseClient() {
  // These will be injected by Vite / Vinxi in the client environment
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  );
}
