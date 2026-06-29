import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { Preview } from '../pages/Preview';
import { createSupabaseServerClient } from '../lib/supabase/server';
import { defaultData } from '../store/useInvitationStore';

const fetchInvitationBySlug = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const supabase = createSupabaseServerClient();
    const { data: invitation, error } = await supabase
      .from('Invitation')
      .select('*, profile:Profile(*), rsvps:Rsvp(*)')
      .eq('slug', slug)
      .order('createdAt', { foreignTable: 'Rsvp', ascending: false })
      .single();
    
    if (error || !invitation) {
      if (slug === 'shin-lena') {
        return {
          id: 'demo',
          data: defaultData,
          rsvps: [
            { id: '1', guestName: 'Budi', attendance: 'yes', guestsCount: 2, wishMessage: 'Happy wedding!', createdAt: new Date().toISOString() },
            { id: '2', guestName: 'Siti', attendance: 'no', guestsCount: 0, wishMessage: 'Sorry I cannot make it.', createdAt: new Date().toISOString() }
          ]
        };
      }
      throw notFound();
    }
    return invitation;
  });



export const Route = createFileRoute('/$slug')({
  loader: async ({ params }) => await fetchInvitationBySlug({ data: params.slug }),
  head: ({ loaderData }) => {
    const raw = loaderData?.data 
      ? (typeof loaderData.data === 'string' ? JSON.parse(loaderData.data) : loaderData.data) 
      : {};
    const groomName = raw.groomName || 'Pengantin Pria';
    const brideName = raw.brideName || 'Pengantin Wanita';
    const weddingDate = raw.weddingDate || '';
    
    // Get the first event's venue info for the description
    const firstEvent = raw.events?.[0];
    const venueLine = firstEvent 
      ? `${firstEvent.venueLabel}${firstEvent.venueAddress ? ', ' + firstEvent.venueAddress : ''}`
      : (raw.weddingVenue || '');
    
    const title = `Undangan Pernikahan ${groomName} & ${brideName}`;
    
    // Rich description: date · venue — like the screenshot card
    const descParts = [weddingDate, venueLine].filter(Boolean);
    const description = descParts.length > 0
      ? `${groomName} & ${brideName} · ${descParts.join(' · ')} · Klik untuk membuka undangan digital.`
      : `${groomName} & ${brideName} mengundang Anda untuk hadir di hari bahagia mereka. Klik untuk membuka undangan.`;

    const BASE_URL = 'https://ds1-navy.vercel.app';

    // Only use a photo if it's already an absolute URL (Supabase storage URL)
    // Relative paths like '/cover.png' won't work for WhatsApp crawlers
    const isAbsoluteUrl = (url: string | undefined) => 
      typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));

    const coverImage = isAbsoluteUrl(raw.heroPhoto) 
      ? raw.heroPhoto 
      : isAbsoluteUrl(raw.coverPhoto) 
        ? raw.coverPhoto
        : `${BASE_URL}/cover.png`;
        
    const siteUrl = 'https://ds1-navy.vercel.app';
    
    // Build the dynamic OG Image URL
    const ogImageUrl = new URL(`${siteUrl}/api/og`);
    ogImageUrl.searchParams.set('groom', groomName);
    ogImageUrl.searchParams.set('bride', brideName);
    
    let ogDate = weddingDate;
    let ogTime = '';
    let ogVenueLabel = '';
    let ogVenueAddress = '';
    
    if (firstEvent) {
      if (firstEvent.date) ogDate = firstEvent.date;
      if (firstEvent.time) ogTime = firstEvent.time;
      if (firstEvent.venueLabel) ogVenueLabel = firstEvent.venueLabel;
      if (firstEvent.venueAddress) ogVenueAddress = firstEvent.venueAddress;
    }
    
    if (ogDate) ogImageUrl.searchParams.set('date', ogDate);
    if (ogTime) ogImageUrl.searchParams.set('time', ogTime);
    if (ogVenueLabel) ogImageUrl.searchParams.set('venueLabel', ogVenueLabel);
    if (ogVenueAddress) ogImageUrl.searchParams.set('venueAddress', ogVenueAddress);
    // fallback for older code just in case
    if (venueLine) ogImageUrl.searchParams.set('venue', venueLine);
    
    if (coverImage) ogImageUrl.searchParams.set('photo', coverImage);
    
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        // Open Graph (WhatsApp, iMessage, Facebook, etc.)
        { property: 'og:site_name', content: 'Baswara — Undangan Digital' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: ogImageUrl.toString() },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: `${siteUrl}/${loaderData?.slug || ''}` },
        // Twitter / X Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: ogImageUrl.toString() },
      ],
    };
  },
  component: SlugRoute,
});

function SlugRoute() {
  const invitation = Route.useLoaderData();

  return <Preview isBuilder={false} initialData={invitation.data} invitationId={invitation.id} initialRsvps={invitation.rsvps} />;
}
