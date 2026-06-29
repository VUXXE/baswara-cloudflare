import { createServerFn } from '@tanstack/react-start';
import { createSupabaseServerClient } from './supabase/server';

export const fetchSession = createServerFn({ method: 'GET' })
  .handler(async () => {
    const supabase = createSupabaseServerClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }

    return session;
  });

export const fetchUser = createServerFn({ method: 'GET' })
  .handler(async () => {
    const supabase = createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Ensure the profile exists in Supabase
    // We only need to check if the user is authenticated, 
    // and upsert their Profile so that they can create Invitations.
    try {
      await supabase.from('Profile').upsert({
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name || '',
        subscriptionTier: 'free',
      }, { onConflict: 'id' });
    } catch (err) {
      console.error('Error upserting profile:', err);
      // Even if upsert fails, we still return the authenticated user
    }

    return user;
  });
