import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInvitationStore } from '../../store/useInvitationStore';

export const Footage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { galleryPhotos } = useInvitationStore(state => state.data);

  // Pre-wedding photo URLs
  const photos = galleryPhotos || [];

  const handleNext = () => {
    if (photos.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    if (photos.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <section 
      id="prewedding-footage"
      className="w-full h-[100dvh] shrink-0 snap-start relative overflow-hidden bg-black"
    >
      {/* Immersive Background Image */}
      <div className="absolute inset-0 z-0">
        {photos.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover"
              alt={`Pre-wedding photo full ${activeIndex + 1}`}
              src={photos[activeIndex]}
            />
          </AnimatePresence>
        )}
        {/* Subtle dark gradient overlay for aesthetic legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
      </div>



      {/* Gallery Carousel Controller (Bottom Area) */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex items-center justify-between px-2">
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="text-white/80 hover:text-white bg-black/35 hover:bg-black/55 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer select-none active:scale-95"
        >
          <span className="material-symbols-outlined text-xl">chevron_left</span>
        </button>

        {/* Horizontal Thumbnails Scroll Wrapper */}
        <div className="flex items-center gap-2.5 justify-center overflow-hidden h-28 px-1">
          {photos.map((photo, idx) => {
            const isActive = idx === activeIndex;
            return (
              <motion.div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`transition-all duration-300 shrink-0 cursor-pointer rounded-xl overflow-hidden shadow-md ${
                  isActive 
                    ? 'w-[72px] h-[92px] border-2 border-white scale-105' 
                    : 'w-[62px] h-[82px] border border-white/10 opacity-55 hover:opacity-75'
                }`}
              >
                <img
                  className="w-full h-full object-cover"
                  alt={`Thumbnail ${idx + 1}`}
                  src={photo}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="text-white/80 hover:text-white bg-black/35 hover:bg-black/55 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer select-none active:scale-95"
        >
          <span className="material-symbols-outlined text-xl">chevron_right</span>
        </button>
      </div>

      {/* Decorative inner frame */}
      <div className="absolute inset-4 border border-white/5 rounded-2xl pointer-events-none z-0"></div>
    </section>
  );
};
