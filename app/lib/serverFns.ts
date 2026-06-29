import { createServerFn } from '@tanstack/react-start';
import { createSupabaseServerClient } from './supabase/server';

/**
 * Submit an RSVP entry for an invitation.
 * Extracted to lib/ to avoid circular import between $slug.tsx <-> Preview.tsx
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
    const supabase = createSupabaseServerClient();
    
    const { data: rsvp, error } = await supabase.from('Rsvp').insert({
      invitationId: data.invitationId,
      guestName: data.guestName,
      attendance: data.attendance,
      guestsCount: data.guestsCount,
      wishMessage: data.wishMessage,
    }).select().single();

    if (error) throw new Error(error.message);
    
    return rsvp;
  });

/**
 * Check-in a guest for a project
 */
export const checkInGuest = createServerFn({ method: 'POST' })
  .validator((payload: { id: string, guestName: string }) => payload)
  .handler(async ({ data: { id, guestName } }) => {
    const supabase = createSupabaseServerClient();
    
    // Fetch project data
    const { data: project, error: fetchError } = await supabase
      .from('Invitation')
      .select('data')
      .eq('id', id)
      .single();

    if (fetchError) throw new Error(fetchError.message);
    
    const currentData = typeof project.data === 'string' ? JSON.parse(project.data) : project.data;
    
    // Initialize checkIns if it doesn't exist
    const checkIns = currentData.checkIns || {};
    
    // Add check-in time
    checkIns[guestName] = new Date().toISOString();
    
    const newData = { ...currentData, checkIns };

    const { error: updateError } = await supabase
      .from('Invitation')
      .update({ data: newData })
      .eq('id', id);

    if (updateError) throw new Error(updateError.message);
    
    return newData;
  });

/**
 * Fetch RSVPs for a given invitation ID.
 */
export const fetchRsvps = createServerFn({ method: 'GET' })
  .validator((invitationId: string) => invitationId)
  .handler(async ({ data: invitationId }) => {
    const supabase = createSupabaseServerClient();
    
    const { data: rsvps, error } = await supabase
      .from('Rsvp')
      .select('*')
      .eq('invitationId', invitationId)
      .order('createdAt', { ascending: false });

    if (error) throw new Error(error.message);
    
    return rsvps || [];
  });

/**
 * Fetch a single project by ID.
 */
export const fetchProject = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const supabase = createSupabaseServerClient();
    
    const { data: project, error } = await supabase
      .from('Invitation')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    
    return project;
  });

/**
 * Update guest list for a project
 */
export const updateProjectGuests = createServerFn({ method: 'POST' })
  .validator((payload: { id: string, guests: any[], waTemplate?: string }) => payload)
  .handler(async ({ data: { id, guests, waTemplate } }) => {
    const supabase = createSupabaseServerClient();
    
    // First, fetch the current project data to merge the guests
    const { data: project, error: fetchError } = await supabase
      .from('Invitation')
      .select('data')
      .eq('id', id)
      .single();

    if (fetchError) throw new Error(fetchError.message);
    
    const currentData = typeof project.data === 'string' ? JSON.parse(project.data) : project.data;
    const newData = { ...currentData, guestList: guests };
    
    if (waTemplate !== undefined) {
      newData.waTemplate = waTemplate;
    }

    const { error: updateError } = await supabase
      .from('Invitation')
      .update({ data: newData })
      .eq('id', id);

    if (updateError) throw new Error(updateError.message);
    
    return { success: true };
  });

/**
 * Delete a project by ID
 */
export const deleteProject = createServerFn({ method: 'POST' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const supabase = createSupabaseServerClient();
    
    const { error } = await supabase
      .from('Invitation')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    
    return { success: true };
  });
