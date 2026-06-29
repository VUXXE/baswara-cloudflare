import React from 'react';
import { motion } from 'framer-motion';
import { useInvitationStore } from '../../store/useInvitationStore';

export const Quote: React.FC = () => {
  const { quoteText, quoteAuthor } = useInvitationStore(state => state.data);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="w-full h-[100dvh] shrink-0 snap-start px-container-padding text-center bg-surface-container-low flex flex-col items-center justify-center border-y border-outline-variant/10 relative"
    >
      <span className="material-symbols-outlined text-primary/30 text-5xl mb-3">
        format_quote
      </span>
      <p className="font-body-lg text-body-lg text-primary max-w-[85%] mx-auto leading-relaxed italic">
        "{quoteText}"
      </p>
      <p className="font-meta-data text-[11px] text-outline mt-6 tracking-widest uppercase font-semibold">
        - {quoteAuthor} -
      </p>
      
      {/* Decorative dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary/20"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-primary/45"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-primary/20"></span>
      </div>
    </motion.section>
  );
};
