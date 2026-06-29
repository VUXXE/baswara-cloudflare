import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cover } from '../components/wedding/Cover';
import { Hero } from '../components/wedding/Hero';
import { Quote } from '../components/wedding/Quote';
import { LoveStory } from '../components/wedding/LoveStory';
import { Profiles } from '../components/wedding/Profiles';
import { Countdown } from '../components/wedding/Countdown';
import { Events } from '../components/wedding/Events';
import { Rundown } from '../components/wedding/Rundown';
import { Dresscode } from '../components/wedding/Dresscode';
import { Footage } from '../components/wedding/Footage';
import { RsvpForm, WeddingWishes, ThankYouSection } from '../components/wedding/Rsvp';
import type { RsvpEntry } from '../components/wedding/Rsvp';
import { WeddingGift } from '../components/wedding/Gift';
import { ClosingCover } from '../components/wedding/ClosingCover';
import { MusicPlayer } from '../components/wedding/MusicPlayer';
import { useInvitationStore } from '../store/useInvitationStore';
import { submitRsvp } from '../lib/serverFns';

import type { InvitationData } from '../store/useInvitationStore';

export const WeddingClassic = ({ 
  isBuilder = false, 
  initialData, 
  invitationId,
  initialRsvps = [],
  deviceView = 'mobile'
}: { 
  isBuilder?: boolean; 
  initialData?: any;
  invitationId?: string;
  initialRsvps?: any[];
  deviceView?: 'mobile' | 'tablet' | 'desktop';
}) => {
  const { data, isInvitationOpen, setInvitationOpen } = useInvitationStore();
  
  // Hydrate store on mount if initialData is provided
  useEffect(() => {
    if (initialData) {
      useInvitationStore.setState({ data: initialData });
    }
    // Always reset the cover state on mount for guest-facing mode
    // so the opening cover appears every time the page is freshly visited
    if (!isBuilder) {
      useInvitationStore.setState({ isInvitationOpen: false });
    }
  }, []);

  const { groomName, brideName, weddingDate, weddingVenue, hashtag, coverPhoto, heroPhoto } = data;
  
  const isOpen = isInvitationOpen;
  const setIsOpen = setInvitationOpen;

  const [isPlaying, setIsPlaying] = useState(false);
  
  // Map Prisma Rsvps to RsvpEntry format
  const mappedRsvps: RsvpEntry[] = initialRsvps.map(r => ({
    id: r.id,
    name: r.guestName,
    attendance: r.attendance,
    guests: r.guestsCount || 0,
    wish: r.wishMessage || '',
    timestamp: new Date(r.createdAt).toLocaleString()
  }));

  const [rsvps, setRsvps] = useState<RsvpEntry[]>(mappedRsvps);
  const [guestName, setGuestName] = useState('Guest');
  const [isLoading, setIsLoading] = useState(!isBuilder); // Skip loading in builder
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const assets = [coverPhoto, heroPhoto].filter(Boolean) as string[];

    let loadedCount = 0;
    const total = assets.length;

    if (total === 0) {
      setIsLoading(false);
      return;
    }

    const handleLoad = () => {
      loadedCount++;
      setProgress(Math.round((loadedCount / total) * 100));
      if (loadedCount === total) {
        setTimeout(() => {
          setIsLoading(false);
        }, 650);
      }
    };

    const handleError = () => {
      handleLoad();
    };

    assets.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleLoad;
      img.onerror = handleError;
    });
  }, [coverPhoto, heroPhoto]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const toParam = queryParams.get('to') || queryParams.get('guest');
    if (toParam) {
      setGuestName(toParam);
    }
  }, []);

  const handleAddRsvp = async (newEntry: RsvpEntry) => {
    // Optimistic UI update
    setRsvps([newEntry, ...rsvps]);

    if (!isBuilder && invitationId) {
      try {
        await submitRsvp({
          data: {
            invitationId,
            guestName: newEntry.name,
            attendance: newEntry.attendance || 'yes',
            guestsCount: newEntry.guests || 0,
            wishMessage: newEntry.wish
          }
        });
      } catch (err) {
        console.error('Failed to submit RSVP', err);
      }
    }
  };

  const handleDeleteRsvp = (id: string) => {
    // Only available in Builder mode realistically, 
    // but we can just filter state for now.
    setRsvps(rsvps.filter(item => item.id !== id));
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setIsPlaying(true);
  };

  const toggleMusic = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#fcf9ee]"
          >
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-center flex flex-col items-center gap-3 px-margin-mobile"
            >
              <span className="material-symbols-outlined text-primary text-4xl animate-pulse">
                favorite
              </span>
              <h1 className="font-display-romantic text-primary text-[42px] leading-none mb-1">
                {groomName} &amp; {brideName}
              </h1>
              <p className="font-meta-data text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                Loading invitation... {progress}%
              </p>
              <div className="w-40 h-[2px] bg-primary/20 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-primary h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Loading screen di sini (sudah dihapus sebelumnya) */}
      </AnimatePresence>

      <div className={`w-full flex overflow-hidden bg-background ${isBuilder ? 'h-full' : 'h-[100dvh]'}`}>
        
        {/* Sisi Kiri - Fixed Editorial Photo (Hanya Desktop) */}
        <div className={`flex-1 h-full relative ${isBuilder ? (deviceView === 'desktop' ? 'block' : 'hidden') : 'hidden md:block'}`}>
          <div className="absolute inset-0 bg-black/25 z-10" />
          <img 
            src={heroPhoto || coverPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'} 
            alt="Wedding"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-16 left-12 z-20 text-white">
            <p className="font-meta-data text-xs text-white/80 uppercase tracking-widest font-semibold drop-shadow-md mb-3">
              Wedding Invitation
            </p>
            <h1 className="font-display-romantic text-white leading-[1.1] mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              style={{ fontSize: 'clamp(48px, 5vw, 80px)' }}
            >
              {groomName} & {brideName}
            </h1>
            <p className="font-meta-data text-sm tracking-[0.2em] drop-shadow-md text-white/80">
              {weddingDate}
            </p>
            <p className="font-body-md text-white/60 tracking-wider italic text-sm mt-1">
              {hashtag}
            </p>
          </div>
        </div>

        {/* Sisi Kanan / Konten Utama (Mobile 100%, Desktop clamped) */}
        <div 
          className={`relative flex-shrink-0 h-full bg-background overflow-hidden ${
            isBuilder 
              ? (deviceView === 'desktop' ? 'shadow-[-10px_0_30px_rgba(0,0,0,0.15)] w-[390px]' : 'w-full') 
              : 'md:shadow-[-10px_0_30px_rgba(0,0,0,0.15)] w-full md:w-[28%] md:min-w-[320px] md:max-w-[390px]'
          }`}
        >
          <AnimatePresence>
            {!isOpen && !isLoading && (
              <Cover key="cover" onOpen={handleOpenInvitation} guestName={guestName} />
            )}
          </AnimatePresence>
          <MusicPlayer isPlaying={isPlaying} togglePlay={toggleMusic} />
          <main
            id="preview-main-container"
            className={`w-full h-full flex flex-col scroll-smooth scrollbar-none ${
              !isOpen && !isBuilder ? 'overflow-hidden' : 'overflow-y-auto snap-y snap-mandatory'
            }`}
          >
            <Hero />
            <Quote />
            <Profiles />
            <LoveStory />
            <Countdown />
            <Events />
            <Dresscode />
            <Rundown />
            <RsvpForm onAddRsvp={handleAddRsvp} />
            <Footage />
            <WeddingGift />
            <WeddingWishes rsvps={rsvps} onAddRsvp={handleAddRsvp} guestName={guestName} onDeleteRsvp={handleDeleteRsvp} />
            <ThankYouSection />
            <ClosingCover />
          </main>
        </div>

      </div>
    </>
  );
};
