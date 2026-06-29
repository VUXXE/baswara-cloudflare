import React from 'react';
import { motion } from 'framer-motion';

export const FilterStream: React.FC = () => {
  const streamUrl = "https://www.youtube.com/watch?v=1FKTCrpw7VQ&list=RD1FKTCrpw7VQ&start_radio=1";
  const filterUrl = "https://www.instagram.com/ar/933715080836492/";

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <section 
      id="wedding-stream-filter"
      className="w-full h-[100dvh] shrink-0 snap-start flex flex-col justify-center items-center bg-surface-container px-margin-mobile relative overflow-hidden"
    >
      {/* Decorative line art background */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-primary/5 pointer-events-none"></div>

      <div className="text-center mb-8 relative z-10">
        <h2 className="font-display-romantic text-primary text-[44px] leading-tight">Virtual Celebration</h2>
        <p className="font-meta-data text-[10px] text-on-surface-variant uppercase tracking-widest mt-1 font-semibold">
          Share our moments from anywhere
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-[340px] relative z-10">
        {/* Live Stream Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs flex flex-col items-center text-center gap-3"
        >
          <span className="material-symbols-outlined text-primary text-3xl animate-pulse">live_tv</span>
          <h3 className="font-body-md font-bold text-primary text-[17px]">Live Streaming</h3>
          <p className="font-body-md text-on-surface-variant text-[12px] leading-relaxed italic max-w-[240px]">
            "Though distance may keep us apart, your prayers and virtual presence mean the world to us."
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenLink(streamUrl)}
            className="mt-2 bg-floral-green text-white font-label-caps text-label-caps px-6 py-2.5 rounded-full hover:bg-primary transition-all duration-300 cursor-pointer shadow-sm font-semibold flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            Join Live Stream
          </motion.button>
        </motion.div>

        {/* Wedding Filter Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-xs flex flex-col items-center text-center gap-3"
        >
          <span className="material-symbols-outlined text-primary text-3xl">photo_filter</span>
          <h3 className="font-body-md font-bold text-primary text-[17px]">Instagram Filter</h3>
          <p className="font-body-md text-on-surface-variant text-[12px] leading-relaxed italic max-w-[240px]">
            Capture your moment while attending our wedding by using our custom Instagram filter.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenLink(filterUrl)}
            className="mt-2 border-2 border-floral-green text-floral-green font-label-caps text-label-caps px-6 py-2 rounded-full hover:bg-floral-green hover:text-white transition-all duration-300 cursor-pointer shadow-sm font-semibold flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">camera</span>
            Use Filter
          </motion.button>
        </motion.div>
      </div>

      <div className="absolute -bottom-12 -left-12 w-24 h-24 rounded-full border border-primary/10 pointer-events-none"></div>
    </section>
  );
};
