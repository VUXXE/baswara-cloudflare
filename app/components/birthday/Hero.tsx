import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useInvitationStore } from '../../store/useInvitationStore';

export const BirthdayHero: React.FC = () => {
  const { birthdayName, birthdayAge, heroPhoto } = useInvitationStore(state => state.data);

  return (
    <div id="home" className="relative w-full h-[100dvh] shrink-0 flex flex-col items-center justify-center text-center overflow-hidden bg-[#FDF7F7] font-['Outfit',_sans-serif]">
      {/* Background Image with a subtle zoom-in on mount */}
      <motion.img
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        alt="Birthday hero"
        className="absolute inset-0 w-full h-full object-cover"
        src={heroPhoto || "/images/hero.png"}
      />
      
      {/* Smooth bottom gradient overlay blending into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#FFFafA] to-transparent pointer-events-none z-10" />

      {/* Top gradient overlay for text legibility */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

      {/* Content */}
      <div className="relative z-10 px-6 flex flex-col items-center justify-between h-full w-full py-16">
        
        {/* Top Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col items-center gap-2 mt-8"
        >
          <p className="text-[12px] tracking-[4px] text-white uppercase font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            LET'S CELEBRATE
          </p>
          <h1 className="font-['Lora',_serif] font-bold text-white text-[56px] leading-[1.1] tracking-[-0.5px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            Happy<br />Birthday
          </h1>
        </motion.div>

        {/* Center/Bottom Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col items-center mb-8"
        >
          <span className="font-['Great_Vibes',_cursive] text-[80px] block leading-none text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            {birthdayName || 'Aurelia'}
          </span>
          <p className="text-[18px] text-white font-semibold tracking-[3px] mt-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] uppercase">
            ✦ {birthdayAge || '23rd'} Birthday ✦
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 animate-bounce text-[#C98886] flex flex-col items-center text-[12px] tracking-[2px] font-bold z-20"
        >
          <p>SCROLL DOWN</p>
          <ChevronDown size={24} className="mt-1" />
        </motion.div>
      </div>

      {/* Subtle frame design */}
      <div className="absolute inset-5 border-2 border-white/20 rounded-2xl pointer-events-none z-10 mix-blend-overlay"></div>
    </div>
  );
};
