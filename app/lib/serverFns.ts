import { createServerFn } from '@tanstack/react-start';
import { eq, desc } from 'drizzle-orm';
import { invitations, rsvps } from './schema';

/**
 * Submit an RSVP entry for an invitation.
 */
export const submitRsvp = createServerFn({ method: 'POST' })
  .validator((data: {
    invitationId: string;
    guestName: string;
    attendance: string;
    guestsCount: number;
    wishMessage: string;
  }) => data)
  .handler(async ({ data }) => {
    const { getDb } = await import('./db');
    const db = getDb();
    const id = crypto.randomUUID();

    const [newRsvp] = await db
      .insert(rsvps)
      .values({
        id,
        invitationId: data.invitationId,
        guestName: data.guestName,
        attendance: data.attendance,
        guestsCount: data.guestsCount,
        wishMessage: data.wishMessage,
      })
      .returning();

    return newRsvp;
  });

/**
 * Check-in a guest for a project
 */
export const checkInGuest = createServerFn({ method: 'POST' })
  .validator((payload: { id: string; guestName: string }) => payload)
  .handler(async ({ data: { id, guestName } }) => {
    const { getDb } = await import('./db');
    const db = getDb();

    const project = await db
      .select()
      .from(invitations)
      .where(eq(invitations.id, id))
      .get();

    if (!project) throw new Error('Project not found');

    const currentData = typeof project.data === 'string' ? JSON.parse(project.data) : (project.data || {});
    const checkIns = currentData.checkIns || {};
    checkIns[guestName] = new Date().toISOString();

    const newData = { ...currentData, checkIns };

    await db
      .update(invitations)
      .set({ data: newData })
      .where(eq(invitations.id, id));

    return newData;
  });

/**
 * Fetch RSVPs for a given invitation ID.
 */
export const fetchRsvps = createServerFn({ method: 'GET' })
  .validator((invitationId: string) => invitationId)
  .handler(async ({ data: invitationId }) => {
    const { getDb } = await import('./db');
    const db = getDb();

    const list = await db
      .select()
      .from(rsvps)
      .where(eq(rsvps.invitationId, invitationId))
      .orderBy(desc(rsvps.createdAt));

    return list || [];
  });

/**
 * Fetch a single project by ID.
 */
export const fetchProject = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { getDb } = await import('./db');
    const db = getDb();

    const project = await db
      .select()
      .from(invitations)
      .where(eq(invitations.id, id))
      .get();

    if (!project) throw new Error('Invitation not found');

    return project;
  });

/**
 * Update guest list for a project
 */
export const updateProjectGuests = createServerFn({ method: 'POST' })
  .validator((payload: { id: string; guests: any[]; waTemplate?: string }) => payload)
  .handler(async ({ data: { id, guests, waTemplate } }) => {
    const { getDb } = await import('./db');
    const db = getDb();

    const project = await db
      .select()
      .from(invitations)
      .where(eq(invitations.id, id))
      .get();

    if (!project) throw new Error('Project not found');

    const currentData = typeof project.data === 'string' ? JSON.parse(project.data) : (project.data || {});
    const newData = { ...currentData, guestList: guests };

    if (waTemplate !== undefined) {
      newData.waTemplate = waTemplate;
    }

    await db
      .update(invitations)
      .set({ data: newData })
      .where(eq(invitations.id, id));

    return { success: true };
  });

/**
 * Delete a project by ID
 */
export const deleteProject = createServerFn({ method: 'POST' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { getDb } = await import('./db');
    const db = getDb();

    // Delete associated RSVPs first
    await db.delete(rsvps).where(eq(rsvps.invitationId, id));

    // Delete invitation
    await db.delete(invitations).where(eq(invitations.id, id));

    return { success: true };
  });

/**
 * Upload an asset file to the Cloudflare R2 bucket.
 */
export const uploadAsset = createServerFn({ method: 'POST' })
  .validator((data: { fileName: string; contentType: string; base64: string }) => data)
  .handler(async ({ data }) => {
    const [{ getSessionUser }, { env }] = await Promise.all([
      import('./auth'),
      import('cloudflare:workers'),
    ]);
    const sessionUser = await getSessionUser();
    if (!sessionUser) throw new Error('Unauthorized');

    const fileKey = `${sessionUser.userId}/${Date.now()}-${data.fileName}`;

    // Decode base64 string to Uint8Array
    const binaryString = atob(data.base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Put file into Cloudflare R2 bucket
    if (env.R2_BUCKET) {
      await env.R2_BUCKET.put(fileKey, bytes.buffer as ArrayBuffer, {
        httpMetadata: { contentType: data.contentType },
      });
    }

    // Public URL: set R2_PUBLIC_URL (custom domain / r2.dev) in env
    const publicDomain = (env.R2_PUBLIC_URL as string) || '';
    const publicUrl = publicDomain ? `${publicDomain}/${fileKey}` : `https://r2.baswara.app/${fileKey}`;

    return { publicUrl, fileKey };
  });
