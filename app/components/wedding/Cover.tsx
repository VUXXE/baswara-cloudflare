import React from 'react';
import { motion } from 'framer-motion';
import { useInvitationStore } from '../../store/useInvitationStore';

interface CoverProps {
  onOpen: () => void;
  guestName: string;
}

export const Cover = React.forwardRef<HTMLDivElement, CoverProps>(({ onOpen, guestName }, ref) => {
  const { groomName, brideName, hashtag, coverPhoto } = useInvitationStore(state => state.data);

  return (
    <motion.div
      ref={ref}
      initial={{ y: 0 }}
      exit={{ 
        y: '-100%',
        transition: { 
          duration: 1.2, 
          ease: [0.76, 0, 0.24, 1] // Custom premium cubic-bezier (smooth deceleration)
        } 
      }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-between text-center overflow-hidden z-50 bg-background py-16 px-6"
    >
      {/* Background Image with Ken Burns effect */}
      <motion.img
        initial={{ scale: 1.15 }}
        animate={{ scale: 1.02 }}
        transition={{ duration: 10, ease: 'easeOut' }}
        alt="Wedding couple cover"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
        src={coverPhoto || "/cover.png"}
      />
      {/* No color overlay, keeping the image fully bright and clear */}

      {/* Floating Sparkles/Leaves Particles for a premium touch */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute block w-2 h-2 rounded-full bg-floral-green/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -120],
              x: [0, (Math.random() - 0.5) * 40],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Title section at the very top */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="relative z-10 flex flex-col items-center gap-0.5"
      >
        <p className="font-meta-data text-xs text-on-surface-variant uppercase tracking-widest font-semibold drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)]">
          The Wedding Of
        </p>
        <h1 className="font-display-romantic text-primary text-[64px] leading-none my-0 drop-shadow-[0_2px_4px_rgba(255,255,255,0.95)]">
          {groomName} &amp; {brideName}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant tracking-wider italic drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)]">
          {hashtag}
        </p>
      </motion.div>

      {/* CTA section at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="relative z-10 w-[85%] max-w-[380px] flex flex-col items-center gap-3 mb-8"
      >
        <p className="font-body-lg text-white text-lg font-medium drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.5)]">
          Hi {guestName}
        </p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(91,99,24,0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          className="bg-floral-green text-on-primary font-label-caps text-label-caps px-8 py-3.5 rounded-full hover:bg-primary transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer font-semibold"
        >
          <span className="material-symbols-outlined text-base animate-pulse">mail</span>
          Open Invitation
        </motion.button>
      </motion.div>

      {/* Decorative frame inside cover */}
      <div className="absolute inset-6 border-2 border-primary/10 rounded-3xl pointer-events-none z-0"></div>
    </motion.div>
  );
});
