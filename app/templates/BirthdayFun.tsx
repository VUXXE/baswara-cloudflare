import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BirthdayCover } from '../components/birthday/Cover';
import { BirthdayDetails } from '../components/birthday/Details';
import { BirthdayGallery } from '../components/birthday/Gallery';
import { BirthdayQuote } from '../components/birthday/Quote';
import { BirthdayRSVP } from '../components/birthday/RSVP';
import { BirthdayGift } from '../components/birthday/Gift';
import { BirthdayMemories } from '../components/birthday/Memories';
import { BirthdayFooter } from '../components/birthday/Footer';
import { BirthdayMusicPlayer } from '../components/birthday/MusicPlayer';
import { useInvitationStore } from '../store/useInvitationStore';
import { submitRsvp } from '../lib/serverFns';

export const BirthdayFun = ({ 
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

  const { coverPhoto, heroPhoto, musicUrl, birthdayName } = data;
  const isOpen = isInvitationOpen;
  const setIsOpen = setInvitationOpen;
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

  useEffect(() => {
    if (musicUrl && !audioRef.current) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
    }
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
      else audioRef.current.pause();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isPlaying, musicUrl]);

  const handleAddRsvp = async (newEntry: any) => {
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
            className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#FCF4F4]"
          >
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-center">
              <h1 className="font-['Lora',_serif] font-bold text-[#C98886] text-3xl mb-2">Loading...</h1>
              <p className="text-xs text-[#E3B4B2] uppercase tracking-widest">{progress}%</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`w-full flex overflow-hidden bg-[#FDF7F7] ${isBuilder ? 'h-full' : 'h-[100dvh]'}`}>
        
        {/* Desktop Fixed Side */}
        <div className={`flex-1 h-full relative ${isBuilder ? (deviceView === 'desktop' ? 'block' : 'hidden') : 'hidden md:block'}`}>
          <div className="absolute inset-0 bg-[#5C4342]/40 z-10" />
          <img src={heroPhoto || 'https://images.unsplash.com/photo-1530103862676-de8892bf30da?w=1200'} alt="Birthday" className="w-full h-full object-cover" />
          <div className="absolute bottom-16 left-12 z-20 text-white">
            <p className="text-xs font-bold uppercase tracking-widest mb-2 font-['Outfit',_sans-serif]">Birthday Celebration</p>
            <h1 className="text-5xl font-['Lora',_serif] font-black mb-2">{birthdayName || 'Aurelia'}</h1>
          </div>
        </div>

        {/* Mobile / Main Content */}
        <div className={`relative flex-shrink-0 h-full bg-[#FDF7F7] overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.1)] ${isBuilder ? (deviceView === 'desktop' ? 'w-[390px]' : 'w-full') : 'md:w-[35%] md:min-w-[375px] md:max-w-[420px] mx-auto'}`}>
          <AnimatePresence>
            {!isOpen && !isLoading && <BirthdayCover key="cover" onOpen={() => { setIsOpen(true); setIsPlaying(true); }} guestName={guestName} />}
          </AnimatePresence>
          <BirthdayMusicPlayer isPlaying={isPlaying} togglePlay={() => setIsPlaying(!isPlaying)} />
          
          <main id="preview-main-container" className={`w-full h-full flex flex-col scroll-smooth scrollbar-none font-['Outfit',_sans-serif] text-[#5C4342] ${!isOpen && !isBuilder ? 'overflow-hidden' : 'overflow-y-auto'}`}>
            <div className="w-full max-w-[480px] mx-auto bg-gradient-to-b from-[#FFFafA] to-[#F8EFEF] min-h-screen relative shadow-[0_0_50px_rgba(0,0,0,0.08)]">
              <div className="pt-10 px-6 pb-[120px] flex flex-col gap-12">
                <BirthdayDetails />
                <BirthdayGallery />
                <BirthdayQuote />
                <BirthdayRSVP onAddRsvp={handleAddRsvp} />
                <BirthdayGift />
                <BirthdayMemories />
              </div>
              
              <BirthdayFooter />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
