import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause } from 'lucide-react';
import { useInvitationStore } from '../../store/useInvitationStore';

export const BirthdayMusicPlayer = ({ isPlaying, togglePlay }: { isPlaying: boolean; togglePlay: () => void }) => {
  const { isInvitationOpen } = useInvitationStore();

  return (
    <AnimatePresence>
      {isInvitationOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-6 left-1/2 bg-white/85 backdrop-blur-[20px] rounded-full p-3 px-6 flex items-center gap-4 shadow-[0_10px_40px_rgba(201,136,134,0.25)] z-[100] w-[calc(100%-48px)] max-w-[400px] border border-white/90"
        >
          <div className="bg-gradient-to-br from-[#FDF7F7] to-[#F5E8E8] w-10 h-10 rounded-full flex items-center justify-center text-[#C98886] shadow-[0_4px_12px_rgba(201,136,134,0.08)] border border-white/80 shrink-0">
            <Music size={20} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[15px] font-semibold m-0 text-[#5C4342] leading-[1.3] truncate font-['Outfit',_sans-serif]">Birthday Celebration</p>
            <p className="text-[13px] text-[#9B7D7D] m-0 truncate font-['Outfit',_sans-serif]">Special Playlist</p>
          </div>
          <button 
            className="bg-[#C98886] border-none text-white cursor-pointer flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-[0_4px_12px_rgba(201,136,134,0.4)] hover:scale-105 hover:shadow-[0_6px_16px_rgba(201,136,134,0.5)] shrink-0"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
