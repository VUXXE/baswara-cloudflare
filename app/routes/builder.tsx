import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import BuilderPage from '../pages/Builder';

import { createSupabaseServerClient } from '../lib/supabase/server';

const fetchUserInvitation = createServerFn({ method: 'GET' })
  .validator((projectId?: string) => projectId || '')
  .handler(async ({ data: projectId }) => {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw redirect({ to: '/login' });
    }

    let query = supabase.from('Invitation').select('*, rsvps:Rsvp(*)').eq('userId', user.id);
    if (projectId) {
      query = query.eq('id', projectId);
    } else {
      // Fallback: order by latest Invitation instead of rsvps relation since foreignTable order is buggy sometimes
      query = query.order('createdAt', { ascending: false }).limit(1);
    }

    const { data: invitation, error } = await query.single();

    if (error || !invitation) {
      throw redirect({ to: '/onboarding' });
    }

    return invitation;
  });

export const saveInvitationData = createServerFn({ method: 'POST' })
  .validator((payload: { projectId?: string, data: any }) => payload)
  .handler(async ({ data: payload }) => {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Unauthorized');
    }

    let query = supabase.from('Invitation').select('id').eq('userId', user.id);
    if (payload.projectId) {
      query = query.eq('id', payload.projectId);
    } else {
      query = query.order('createdAt', { ascending: false }).limit(1);
    }

    const { data: invitation, error: fetchError } = await query.single();

    if (fetchError || !invitation) {
      throw new Error('Invitation not found');
    }

    const { data: updated, error: updateError } = await supabase
      .from('Invitation')
      .update({ data: payload.data })
      .eq('id', invitation.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return { success: true, invitation: updated };
  });

export const Route = createFileRoute('/builder')({
  validateSearch: (search: Record<string, unknown>) => ({
    projectId: search.projectId as string | undefined,
  }),
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' });
  },
  loaderDeps: ({ search: { projectId } }) => ({ projectId }),
  loader: async ({ deps: { projectId } }) => await fetchUserInvitation({ data: projectId }),
  component: BuilderRoute,
});

function BuilderRoute() {
  const invitation = Route.useLoaderData();

  return <BuilderPage initialData={invitation.data} slug={invitation.slug} initialRsvps={invitation.rsvps} projectId={invitation.id} />;
}
