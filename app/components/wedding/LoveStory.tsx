import React from 'react';
import { motion } from 'framer-motion';
import { useInvitationStore } from '../../store/useInvitationStore';

export const LoveStory: React.FC = () => {
  const { 
    loveStoryPhoto1, 
    loveStoryPhoto2, 
    loveStoryTitle1 = 'First Sight',
    loveStoryText = 'Every love story is beautiful, but ours is my favorite. From our first meeting to this magical moment, every step has been an adventure.',
    loveStoryTitle2 = "We're Forever",
    loveStoryText2 = "One day, in the same garden that had seen the beginning of their story, Shin shared his heartfelt intention. With a warm smile and sincere belief, Lena said yes.",
    heroPhoto 
  } = useInvitationStore(state => state.data);

  const stories = [
    {
      id: 'first-sight',
      title: loveStoryTitle1,
      description: loveStoryText,
      image: loveStoryPhoto1 || '/love_story_1.png'
    },
    {
      id: 'forever',
      title: loveStoryTitle2,
      description: loveStoryText2,
      image: loveStoryPhoto2 || '/love_story_2.png'
    }
  ];

  return (
    <section
      id="love-story"
      className="w-full h-[100dvh] shrink-0 snap-start flex flex-col justify-between py-10 px-6 relative overflow-hidden bg-black text-white"
    >
      {/* Background Image of the couple with a dark overlay */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-35 filter blur-[1px]"
          alt="Love story background"
          src={heroPhoto || "/hero.png"}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
      </div>



      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center mt-2"
      >
        <h2 className="font-display-romantic text-[#f3e481] text-[48px] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
          Our Love Story
        </h2>
      </motion.div>

      {/* Stories content */}
      <div className="relative z-10 flex flex-col gap-6 my-auto">
        {/* Story 1: Image Left, Text Right */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center gap-4 w-full"
        >
          {/* Image */}
          <div className="w-[42%] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-white/10 shrink-0">
            <img
              className="w-full h-full object-cover"
              alt={stories[0].title}
              src={stories[0].image}
            />
          </div>
          {/* Text */}
          <div className="flex flex-col text-left justify-center flex-1">
            <h3 className="font-body-lg text-[#f3e481] text-lg font-bold mb-1.5 drop-shadow-md">
              {stories[0].title}
            </h3>
            <p className="font-body-lg text-white/90 text-[13px] leading-relaxed drop-shadow-xs">
              {stories[0].description}
            </p>
          </div>
        </motion.div>

        {/* Story 2: Text Left, Image Right */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-4 w-full"
        >
          {/* Text */}
          <div className="flex flex-col text-left justify-center flex-1">
            <h3 className="font-body-lg text-[#f3e481] text-lg font-bold mb-1.5 drop-shadow-md">
              {stories[1].title}
            </h3>
            <p className="font-body-lg text-white/90 text-[13px] leading-relaxed drop-shadow-xs">
              {stories[1].description}
            </p>
          </div>
          {/* Image */}
          <div className="w-[42%] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-white/10 shrink-0">
            <img
              className="w-full h-full object-cover"
              alt={stories[1].title}
              src={stories[1].image}
            />
          </div>
        </motion.div>
      </div>

      {/* Faint decorative frame inside page */}
      <div className="absolute inset-4 border border-white/5 rounded-2xl pointer-events-none z-0"></div>
    </section>
  );
};
