import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useInvitationStore } from '../../store/useInvitationStore';

export const BirthdayQuote = () => {
  const { quoteText, quoteAuthor } = useInvitationStore(state => state.data);

  return (
    <section className="w-full mb-2 relative z-10 font-['Outfit',_sans-serif]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-[#FCF4F4]/80 backdrop-blur-xl border border-white/90 rounded-[40px] px-8 py-10 shadow-[0_20px_50px_rgba(201,136,134,0.1)] text-center relative"
      >
        <div className="font-['Lora',_serif] text-[64px] text-[#EAAEA5] leading-none mb-[-20px] opacity-60">“</div>
        <p className="text-[16px] leading-[1.8] text-[#5C4342] font-medium z-10 relative whitespace-pre-line px-2">
          {quoteText || "May this year\nbring more happiness,\nhealth, and\nunforgettable memories."}
        </p>
        <p className="text-[12px] text-[#A68A8A] mt-4 font-bold uppercase tracking-[2px]">{quoteAuthor || ''}</p>
        <div className="flex justify-center mt-6">
          <Heart className="w-5 h-5 text-[#EAAEA5] stroke-[1.5]" />
        </div>
      </motion.div>
    </section>
  );
};
