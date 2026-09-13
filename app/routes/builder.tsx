import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import BuilderPage from '../pages/Builder';
import { invitations, rsvps } from '../lib/schema';
import { eq, desc } from 'drizzle-orm';

const fetchUserInvitation = createServerFn({ method: 'GET' })
  .validator((projectId?: string) => projectId || '')
  .handler(async ({ data: projectId }) => {
    const [{ getSessionUser }, { getDb }] = await Promise.all([
      import('../lib/auth'),
      import('../lib/db'),
    ]);
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      throw redirect({ to: '/login' });
    }

    const db = getDb();
    let invitation;

    if (projectId) {
      // Fetch by the specific projectId, scoped to the current user
      const rows = await Promise.all([
        db.select().from(invitations)
          .where(eq(invitations.id, projectId))
          .limit(1),
        db.select().from(rsvps)
          .where(eq(rsvps.invitationId, projectId))
          .orderBy(desc(rsvps.createdAt)),
      ]);
      const inv = rows[0][0];
      const invRsvps = rows[1];
      if (!inv) {
        throw redirect({ to: '/onboarding' });
      }
      invitation = { ...inv, rsvps: invRsvps };
    } else {
      // Fallback: latest invitation for the user
      const inv = await db.select().from(invitations)
        .where(eq(invitations.userId, sessionUser.userId))
        .orderBy(desc(invitations.createdAt))
        .limit(1)
        .then((r) => r[0]);

      if (!inv) {
        throw redirect({ to: '/onboarding' });
      }
      const invRsvps = await db.select().from(rsvps)
        .where(eq(rsvps.invitationId, inv.id))
        .orderBy(desc(rsvps.createdAt));
      invitation = { ...inv, rsvps: invRsvps };
    }

    return invitation;
  });

export const saveInvitationData = createServerFn({ method: 'POST' })
  .validator((payload: { projectId?: string, data: any }) => payload)
  .handler(async ({ data: payload }) => {
    const [{ getSessionUser }, { getDb }] = await Promise.all([
      import('../lib/auth'),
      import('../lib/db'),
    ]);
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      throw new Error('Unauthorized');
    }

    const db = getDb();

    let invitation;
    if (payload.projectId) {
      invitation = await db.select().from(invitations)
        .where(eq(invitations.id, payload.projectId))
        .limit(1)
        .then((r) => r[0]);
    } else {
      invitation = await db.select().from(invitations)
        .where(eq(invitations.userId, sessionUser.userId))
        .orderBy(desc(invitations.createdAt))
        .limit(1)
        .then((r) => r[0]);
    }

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    const updated = await db.update(invitations)
      .set({ data: payload.data })
      .where(eq(invitations.id, invitation.id))
      .returning();

    return { success: true, invitation: updated[0] };
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