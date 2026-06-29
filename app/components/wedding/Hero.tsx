import React from 'react';
import { motion } from 'framer-motion';
import { useInvitationStore } from '../../store/useInvitationStore';

export const Hero: React.FC = () => {
  const { groomName, brideName, hashtag, heroPhoto } = useInvitationStore(state => state.data);

  return (
    <div id="home" className="relative w-full h-[100dvh] shrink-0 snap-start flex flex-col items-center justify-start text-center overflow-hidden bg-background">
      {/* Background Image with a subtle zoom-in on mount */}
      <motion.img
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover"
        src={heroPhoto || "/hero.png"}
      />
      
      {/* Smooth bottom gradient overlay blending into the Quote section color */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-surface-container-low to-transparent pointer-events-none z-10" />

      {/* Top gradient overlay for text legibility */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-10" />

      <div className="relative z-10 px-margin-mobile flex flex-col items-center gap-element-gap mt-16 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col items-center gap-0.5"
        >
          <p className="font-meta-data text-white uppercase tracking-widest text-[11px] font-bold">
            The Wedding Of
          </p>
          <h1 className="font-display-romantic text-white text-[64px] leading-none my-0">
            {groomName} &amp; {brideName}
          </h1>
          <p className="font-body-md text-white/95 text-lg tracking-widest italic">
            {hashtag}
          </p>
        </motion.div>
      </div>

      {/* Subtle frame design */}
      <div className="absolute inset-4 border border-primary/10 rounded-2xl pointer-events-none z-0"></div>
    </div>
  );
};
