import React from 'react';
import { motion } from 'framer-motion';

export const BirthdayFooter = () => {
  return (
    <footer className="text-center pt-[60px] px-5 pb-[80px] relative w-full">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-['Lora',_serif] text-[#C98886] text-[48px] mb-4 tracking-[-0.5px]">Thank You</h2>
        <p className="font-['Great_Vibes',_cursive] text-[42px] text-[#5C4342] mb-10 leading-none">See You Soon! ♡</p>
        <div className="max-w-[240px] mx-auto opacity-90">
          <img src="/images/floral.png" alt="Floral Decoration" className="w-full h-auto" />
        </div>
      </motion.div>
    </footer>
  );
};
