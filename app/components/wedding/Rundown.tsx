import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { useInvitationStore } from '../../store/useInvitationStore';

export const Rundown: React.FC = () => {
  const { schedules, weddingDate, rundownTitle = 'Reception Rundown' } = useInvitationStore(state => state.data);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } }
  };

  return (
    <section
      id="wedding-rundown"
      className="w-full h-[100dvh] shrink-0 snap-start flex flex-col justify-center items-center bg-surface-container px-margin-mobile relative overflow-hidden"
    >
      {/* Decorative background blobs */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-7 relative z-10"
      >
        <p className="font-montserrat text-[9px] text-primary/60 uppercase tracking-[0.3em] font-semibold mb-1">
          {weddingDate}
        </p>
        <h2 className="font-display-romantic text-primary text-[44px] leading-tight">
          {rundownTitle}
        </h2>
      </motion.div>

      {/* Timeline card */}
      <motion.div
        key={`rundown-container-${(schedules || []).length}`}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="w-full max-w-[340px] relative z-10 flex flex-col gap-0 max-h-[55vh] overflow-y-auto scrollbar-none"
      >
        {/* Vertical line */}
        <div className="absolute left-[28px] top-4 bottom-4 w-[1.5px] bg-gradient-to-b from-primary/30 via-primary/20 to-transparent pointer-events-none" />

        {(schedules || []).map((event, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="flex items-start gap-4 pb-5 last:pb-0 relative group"
          >
            {/* Icon circle */}
            <div className="relative shrink-0 w-[56px] flex justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-white border border-primary/20 shadow-sm flex items-center justify-center z-10 relative group-hover:border-primary/50 group-hover:shadow-md transition-all duration-300"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">
                  {event.icon}
                </span>
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 pt-1.5">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="font-montserrat font-bold text-on-surface text-[13px] leading-tight">
                  {event.name}
                </p>
                <span className="shrink-0 font-montserrat text-[9px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold uppercase tracking-wider whitespace-nowrap">
                  {event.time}
                </span>
              </div>
              {event.description && (
                <p className="font-body-md text-on-surface-variant/70 text-[11px] leading-snug">
                  {event.description}
                </p>
              )}
              {/* Subtle divider */}
              {idx < schedules.length - 1 && (
                <div className="mt-3 w-full h-[1px] bg-outline-variant/20" />
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom floral accent */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="mt-8 flex items-center gap-3 relative z-10"
      >
        <div className="w-8 h-[1px] bg-primary/25" />
        <span className="material-symbols-outlined text-primary/40 text-sm">local_florist</span>
        <div className="w-8 h-[1px] bg-primary/25" />
      </motion.div>
    </section>
  );
};
