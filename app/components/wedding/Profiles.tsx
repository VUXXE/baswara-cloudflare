import React from 'react';
import { motion } from 'framer-motion';
import { useInvitationStore } from '../../store/useInvitationStore';

export const Profiles: React.FC = () => {
  const { 
    groomName, 
    groomFullName,
    groomChildOrder,
    brideName, 
    brideFullName,
    brideChildOrder,
    groomPhoto, 
    bridePhoto, 
    groomParents, 
    brideParents, 
    groomIg = '', 
    brideIg = '' 
  } = useInvitationStore(state => state.data);
  return (
    <>
      {/* Groom Section */}
      <section className="w-full h-[100dvh] shrink-0 snap-start flex flex-col justify-center items-center bg-background bg-botanical-pattern px-margin-mobile relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center w-full flex flex-col items-center"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="w-48 h-48 rounded-t-full rounded-b-2xl overflow-hidden border-4 border-surface-container-high shadow-md mb-6 bg-surface-dim"
          >
            <img
              className="w-full h-full object-cover"
              alt={`${groomName} portrait`}
              src={groomPhoto || "/hero.png"}
            />
          </motion.div>
          
          <h2 className="font-headline-lg text-primary text-[38px] leading-tight px-4">{groomFullName || groomName}</h2>
          <div className="flex flex-col mt-2">
            <span className="font-meta-data text-[10px] text-sunset-accent uppercase tracking-widest font-bold mb-1">
              {groomChildOrder}
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {groomParents}
            </p>
          </div>
          {groomIg && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              className="font-meta-data text-meta-data text-sunset-accent mt-4 flex items-center gap-1 hover:underline hover:text-primary transition-all duration-300"
              href={`https://instagram.com/${groomIg.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-sm">alternate_email</span>
              {groomIg.replace('@', '')}
            </motion.a>
          )}
        </motion.div>

        {/* Small floating ampersand indicator at the bottom of Groom screen */}
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-4 font-display-romantic text-outline-variant/60 text-3xl"
        >
          &amp;
        </motion.div>
      </section>

      {/* Bride Section */}
      <section className="w-full h-[100dvh] shrink-0 snap-start flex flex-col justify-center items-center bg-background bg-botanical-pattern px-margin-mobile relative border-t border-outline-variant/5">
        {/* Ampersand at the top */}
        <div className="absolute top-4 font-display-romantic text-outline-variant/60 text-3xl">
          &amp;
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center w-full flex flex-col items-center"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="w-48 h-48 rounded-t-full rounded-b-2xl overflow-hidden border-4 border-surface-container-high shadow-md mb-6 bg-surface-dim"
          >
            <img
              className="w-full h-full object-cover"
              alt={`${brideName} portrait`}
              src={bridePhoto || "/hero.png"}
            />
          </motion.div>
          
          <h2 className="font-headline-lg text-primary text-[38px] leading-tight px-4">{brideFullName || brideName}</h2>
          <div className="flex flex-col mt-2">
            <span className="font-meta-data text-[10px] text-sunset-accent uppercase tracking-widest font-bold mb-1">
              {brideChildOrder}
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {brideParents}
            </p>
          </div>
          {brideIg && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              className="font-meta-data text-meta-data text-sunset-accent mt-4 flex items-center gap-1 hover:underline hover:text-primary transition-all duration-300"
              href={`https://instagram.com/${brideIg.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-sm">alternate_email</span>
              {brideIg.replace('@', '')}
            </motion.a>
          )}
        </motion.div>
      </section>
    </>
  );
};
