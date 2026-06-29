import React from 'react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full py-4 flex flex-col items-center gap-3 text-center bg-transparent mt-auto relative z-10"
    >
      <div className="font-display-romantic text-primary text-[38px] mb-1 select-none">
        Shin &amp; Lena
      </div>
      
      <p className="font-body-md text-body-md text-on-surface-variant max-w-[80%] mx-auto mb-6 leading-relaxed">
        With hearts full of gratitude, we thank you for your presence, prayers, and kind wishes.
      </p>
      
      <div className="w-12 h-[1px] bg-primary/20 mb-2"></div>
      
      <p className="font-meta-data text-[10px] text-outline tracking-widest uppercase font-semibold">
        Made with Love for Shin &amp; Lena
      </p>
    </motion.footer>
  );
};
