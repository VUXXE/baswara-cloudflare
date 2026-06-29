import React from 'react';
import { motion } from 'framer-motion';
import { Gift, ChevronDown, Heart } from 'lucide-react';
import { useInvitationStore } from '../../store/useInvitationStore';

export const BirthdayCover = React.forwardRef<HTMLDivElement, { onOpen: () => void; guestName?: string }>(({ onOpen, guestName }, ref) => {
  const { birthdayName, birthdayAge, coverPhoto } = useInvitationStore(state => state.data);

  return (
    <motion.div 
      ref={ref}
      initial={{ y: 0 }}
      exit={{ 
        y: '-100%',
        transition: { 
          duration: 1.2, 
          ease: [0.76, 0, 0.24, 1]
        } 
      }}
      className="absolute inset-0 w-full h-full flex flex-col justify-between text-center overflow-hidden z-50 bg-gradient-to-b from-[#FFF5F5] to-[#FBECEC] font-['Outfit',_sans-serif]"
    >
      {/* Soft floating particles / florals (Optional enhancement) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute block w-1.5 h-1.5 rounded-full bg-[#EAAEA5]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, -50],
              x: [0, (Math.random() - 0.5) * 30],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col relative z-10 w-full overflow-y-auto scrollbar-none pt-12 pb-8">
        {/* Top Titles */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center gap-2 px-6"
        >
          <p className="text-[10px] tracking-[4px] text-[#A68A8A] uppercase font-bold mb-2">
            LET'S CELEBRATE
          </p>
          <div className="flex items-center gap-2">
            <span className="font-['Great_Vibes',_cursive] text-[72px] block leading-none text-[#5C4342]">
              {birthdayName || 'Aurelia'}
            </span>
            <Heart className="w-6 h-6 text-[#EAAEA5] stroke-[2] -mt-4" />
          </div>
          <p className="text-[14px] text-[#A68A8A] font-semibold tracking-[2px] mt-2 uppercase">
            ✦ {birthdayAge || '23rd'} Birthday ✦
          </p>
        </motion.div>

        {/* Faded Portrait Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full flex-1 min-h-[300px] mt-6 flex-shrink-0"
        >
          {/* Mask image for the smooth bottom fade */}
          <div className="absolute inset-0 w-full h-full [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] -webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)">
            <img 
              src={coverPhoto || "/images/birthday-cover.png"} 
              alt="Birthday Cover" 
              className="w-full h-full object-cover object-top" 
            />
          </div>
          
          {/* Floral decorations could go here (if assets exist), simulated with subtle glow for now */}
          <div className="absolute bottom-10 -left-6 w-32 h-32 bg-[#EAAEA5]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 -right-6 w-32 h-32 bg-[#C98886]/20 rounded-full blur-3xl" />
        </motion.div>

        {/* Bottom CTA Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center px-6 mt-[-20px] relative z-20"
        >
          <div className="flex flex-col items-center gap-2 mb-6 text-center">
            <h2 className="font-['Great_Vibes',_cursive] text-[36px] text-[#5C4342] leading-none">
              Dear, {guestName || 'Guest'}
            </h2>
            <p className="text-[12px] text-[#A68A8A] leading-relaxed max-w-[220px]">
              You are specially invited<br/>to celebrate my special day!
            </p>
          </div>
          
          <button 
            onClick={onOpen}
            className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#D69B9B] to-[#C98886] text-white border-none rounded-full py-3.5 px-8 font-medium text-[14px] tracking-[0.5px] cursor-pointer shadow-[0_8px_20px_rgba(201,136,134,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(201,136,134,0.4)] active:translate-y-0 w-[240px]"
          >
            <Gift size={18} /> Open Invitation
          </button>

          <div className="flex flex-col items-center gap-1 mt-6 text-[#C98886]/60">
            <span className="text-[10px] uppercase tracking-widest">Scroll Down</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});
