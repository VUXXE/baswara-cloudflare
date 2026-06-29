import React from 'react';
import { motion } from 'framer-motion';
import { Grid, Heart } from 'lucide-react';
import { useInvitationStore } from '../../store/useInvitationStore';

export const BirthdayMemories = () => {
  const { galleryPhotos } = useInvitationStore(state => state.data);
  const photos = galleryPhotos && galleryPhotos.length > 0 ? galleryPhotos.slice(0, 6) : [
    '/images/hero.png', '/images/hero.png', '/images/hero.png', '/images/hero.png', '/images/hero.png', '/images/hero.png'
  ];

  return (
    <section className="w-full relative z-10 font-['Outfit',_sans-serif]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-[#FCF4F4]/80 backdrop-blur-xl border border-white/90 rounded-[40px] p-8 shadow-[0_20px_50px_rgba(201,136,134,0.1)] text-center relative overflow-hidden"
      >
        <div className="flex flex-col items-center mb-8">
          <h2 className="font-['Lora',_serif] font-medium text-[#C98886] text-[32px] text-center mb-1">
            Memories
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-[#C98886]">
            <div className="w-8 h-[1px] bg-[#EAAEA5]/40" />
            <Heart className="w-4 h-4 text-[#EAAEA5] stroke-[1.5]" />
            <div className="w-8 h-[1px] bg-[#EAAEA5]/40" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {photos.map((photo, i) => (
            <div key={i} className="rounded-xl overflow-hidden h-[120px] shadow-sm group">
              <img src={photo} alt={`Memory ${i + 1}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          ))}
        </div>
        
        <button className="w-[80%] mx-auto mt-2 inline-flex items-center justify-center gap-2 rounded-full py-3 px-6 font-medium text-[13px] cursor-pointer transition-all duration-300 shadow-[0_4px_10px_rgba(201,136,134,0.05)] bg-white text-[#C98886] border border-[#EAAEA5]/40 hover:bg-[#FCF4F4]">
          <Grid size={16} /> See More Memories
        </button>
      </motion.div>
    </section>
  );
};
