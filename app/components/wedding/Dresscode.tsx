import React from 'react';
import { motion } from 'framer-motion';
import { useInvitationStore } from '../../store/useInvitationStore';

export const Dresscode: React.FC = () => {
  const { 
    dresscodeColors = [],
    dresscodeMenTitle = 'Gentlemen',
    dresscodeMenStyle = 'Casual',
    dresscodeMenDesc = 'Collar shirt, neat trousers, comfortable shoes.',
    dresscodeWomenTitle = 'Ladies',
    dresscodeWomenStyle = 'Casual',
    dresscodeWomenDesc = 'Flowing dresses, midi skirts, or chic jumpsuits.'
  } = useInvitationStore(state => state.data);

  return (
    <section 
      id="wedding-dresscode"
      className="w-full h-[100dvh] shrink-0 snap-start flex flex-col justify-center items-center bg-background px-margin-mobile relative overflow-hidden"
    >
      <div className="text-center mb-8 relative z-10">
        <h2 className="font-display-romantic text-primary text-[44px] leading-tight">Dress Code</h2>
        <p className="font-meta-data text-[10px] text-on-surface-variant uppercase tracking-widest mt-1 font-semibold">
          Style Guide for Guests
        </p>
      </div>

      {/* Cards container */}
      <div className="flex gap-4 w-full max-w-[340px] mb-8 relative z-10">
        {/* Men Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs flex flex-col items-center text-center gap-2"
        >
          <span className="material-symbols-outlined text-primary text-3xl">man</span>
          <h4 className="font-body-md font-bold text-primary text-[16px]">{dresscodeMenTitle}</h4>
          <div className="w-6 h-[1px] bg-primary/25 my-1"></div>
          <p className="font-label-caps text-[10px] text-sunset-accent uppercase tracking-widest font-bold">{dresscodeMenStyle}</p>
          <p className="font-body-md text-on-surface-variant text-[12px] leading-relaxed italic">
            {dresscodeMenDesc}
          </p>
        </motion.div>

        {/* Women Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs flex flex-col items-center text-center gap-2"
        >
          <span className="material-symbols-outlined text-primary text-3xl">woman</span>
          <h4 className="font-body-md font-bold text-primary text-[16px]">{dresscodeWomenTitle}</h4>
          <div className="w-6 h-[1px] bg-primary/25 my-1"></div>
          <p className="font-label-caps text-[10px] text-sunset-accent uppercase tracking-widest font-bold">{dresscodeWomenStyle}</p>
          <p className="font-body-md text-on-surface-variant text-[12px] leading-relaxed italic">
            {dresscodeWomenDesc}
          </p>
        </motion.div>
      </div>

      {/* Color Palette Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-[340px] bg-surface-container-low/60 border border-outline-variant/20 rounded-2xl p-5 flex flex-col items-center text-center gap-4 relative z-10"
      >
        <p className="font-body-md text-[13px] text-on-surface-variant leading-relaxed max-w-[260px]">
          We kindly ask that guests please attend wearing our wedding colors:
        </p>

        {/* Palette Circles */}
        <div className="flex gap-3 justify-center">
          {(dresscodeColors || []).map((hex, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <motion.div
                whileHover={{ scale: 1.15 }}
                className="w-9 h-9 rounded-full shadow-xs border-2 border-white"
                style={{ backgroundColor: hex }}
              />
              <span className="font-meta-data text-[9px] text-outline font-semibold uppercase">
                {hex}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Decorative side shape */}
      <div className="absolute top-1/2 -right-12 w-24 h-24 rounded-full border border-primary/10 pointer-events-none"></div>
    </section>
  );
};
