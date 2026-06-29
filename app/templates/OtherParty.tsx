import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cover } from '../components/wedding/Cover';
import { Hero } from '../components/wedding/Hero';
import { Events } from '../components/wedding/Events';
import { Footage } from '../components/wedding/Footage';
import { RsvpForm, ThankYouSection } from '../components/wedding/Rsvp';
import type { RsvpEntry } from '../components/wedding/Rsvp';
import { MusicPlayer } from '../components/wedding/MusicPlayer';
import { useInvitationStore } from '../store/useInvitationStore';
import { submitRsvp } from '../lib/serverFns';

export const OtherParty = ({ 
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
  
  useEffect(() => {
    if (initialData) {
      useInvitationStore.setState({ data: initialData });
    }
    if (!isBuilder) {
      useInvitationStore.setState({ isInvitationOpen: false });
    }
  }, []);

  const { groomName, brideName, weddingDate, coverPhoto, heroPhoto } = data;
  const isOpen = isInvitationOpen;
  const setIsOpen = setInvitationOpen;
  const [isPlaying, setIsPlaying] = useState(false);
  
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
  const [isLoading, setIsLoading] = useState(!isBuilder);
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
      if (loadedCount === total) setTimeout(() => setIsLoading(false), 650);
    };
    assets.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleLoad;
      img.onerror = handleLoad;
    });
  }, [coverPhoto, heroPhoto]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const toParam = queryParams.get('to') || queryParams.get('guest');
    if (toParam) setGuestName(toParam);
  }, []);

  const handleAddRsvp = async (newEntry: RsvpEntry) => {
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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#fdfaf6]"
          >
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-center">
              <h1 className="font-bold text-orange-600 text-3xl mb-2">Loading...</h1>
              <p className="text-xs text-orange-400 uppercase tracking-widest">{progress}%</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`w-full flex overflow-hidden bg-white ${isBuilder ? 'h-full' : 'h-[100dvh]'}`}>
        
        {/* Desktop Fixed Side */}
        <div className={`flex-1 h-full relative ${isBuilder ? (deviceView === 'desktop' ? 'block' : 'hidden') : 'hidden md:block'}`}>
          <div className="absolute inset-0 bg-orange-900/20 z-10" />
          <img src={heroPhoto || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200'} alt="Party" className="w-full h-full object-cover" />
          <div className="absolute bottom-16 left-12 z-20 text-white">
            <p className="text-xs font-bold uppercase tracking-widest mb-2 text-white drop-shadow-md">Special Event</p>
            <h1 className="text-5xl font-black mb-2 drop-shadow-lg">{groomName}</h1>
            <p className="text-xl tracking-widest drop-shadow-md">{brideName}</p>
            <p className="text-sm mt-2 opacity-80 drop-shadow-md">{weddingDate}</p>
          </div>
        </div>

        {/* Mobile / Main Content */}
        <div className={`relative flex-shrink-0 h-full bg-white overflow-hidden ${isBuilder ? (deviceView === 'desktop' ? 'w-[390px]' : 'w-full') : 'md:w-[28%] md:min-w-[320px] md:max-w-[390px]'}`}>
          <AnimatePresence>
            {!isOpen && !isLoading && <Cover key="cover" onOpen={() => { setIsOpen(true); setIsPlaying(true); }} guestName={guestName} />}
          </AnimatePresence>
          <MusicPlayer isPlaying={isPlaying} togglePlay={() => setIsPlaying(!isPlaying)} />
          <main id="preview-main-container" className={`w-full h-full flex flex-col scroll-smooth scrollbar-none ${!isOpen && !isBuilder ? 'overflow-hidden' : 'overflow-y-auto'}`}>
            <Hero />
            <Events />
            <Footage />
            <RsvpForm onAddRsvp={handleAddRsvp} />
            <ThankYouSection />
          </main>
        </div>
      </div>
    </>
  );
};
