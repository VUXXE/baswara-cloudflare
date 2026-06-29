import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInvitationStore } from '../../store/useInvitationStore';

export const BirthdayGallery = () => {
  const { galleryPhotos } = useInvitationStore(state => state.data);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const photos = galleryPhotos && galleryPhotos.length > 0 ? galleryPhotos : [
    '/images/hero.png', '/images/hero.png', '/images/hero.png', '/images/hero.png'
  ];

  const handleScroll = () => {
    if (trackRef.current) {
      const scrollPosition = trackRef.current.scrollLeft;
      const itemWidth = trackRef.current.clientWidth / 3; 
      const newIndex = Math.round(scrollPosition / itemWidth);
      if (newIndex !== activeIndex) {
        setActiveIndex(Math.min(newIndex, photos.length - 3));
      }
    }
  };

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -(trackRef.current.clientWidth / 3), behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: trackRef.current.clientWidth / 3, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full relative z-10 font-['Outfit',_sans-serif]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center mb-6"
      >
        <h2 className="font-['Lora',_serif] font-medium text-[#C98886] text-[28px] text-center mb-1">
          A Little Gallery
        </h2>
        <div className="flex items-center justify-center gap-1.5 text-[#C98886]">
          <div className="w-8 h-[1px] bg-[#EAAEA5]/40" />
          <Heart className="w-4 h-4 text-[#EAAEA5] stroke-[1.5]" />
          <div className="w-8 h-[1px] bg-[#EAAEA5]/40" />
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative px-6"
      >
        {/* Left Arrow */}
        <button 
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-[#D69B9B] text-white flex items-center justify-center shadow-md hover:bg-[#C98886] transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <div 
          ref={trackRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none px-2 py-2"
        >
          {photos.map((photo, idx) => (
            <div key={idx} className="w-[30%] shrink-0 snap-center rounded-[16px] overflow-hidden shadow-sm border border-white">
              <div className="aspect-square relative group cursor-pointer">
                <img src={photo} alt={`Gallery ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-[#D69B9B] text-white flex items-center justify-center shadow-md hover:bg-[#C98886] transition-colors"
        >
          <ChevronRight size={16} />
        </button>

        <div className="flex justify-center gap-2 mt-4">
          {photos.map((_, idx) => (
            <span 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === idx ? 'bg-[#C98886] w-5 opacity-100' : 'bg-[#EAAEA5] w-1.5 opacity-40'}`}
            ></span>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
