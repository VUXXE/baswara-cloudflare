import React from 'react';
import { motion } from 'framer-motion';
import { useInvitationStore } from '../../store/useInvitationStore';

export const Events: React.FC = () => {
  const { 
    events,
    eventMainTitle
  } = useInvitationStore(state => state.data);

  const formatIndonesianDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split('-');
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      return `${days[dateObj.getDay()]}, ${d} ${months[Number(m) - 1]} ${y}`;
    }
    return dateStr;
  };

  return (
    <section 
      id="wedding-events" 
      className="w-full h-[100dvh] shrink-0 snap-start flex flex-col justify-center items-center bg-background px-margin-mobile relative overflow-hidden"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display-romantic text-primary text-center text-[44px] leading-tight mb-6"
      >
        {eventMainTitle}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-[340px] max-h-[60vh] overflow-y-auto scrollbar-none flex flex-col gap-6 relative z-10 py-4"
      >
        {(events || []).map((ev) => (
          <div key={ev.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-fixed/20 rounded-bl-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-container/15 rounded-tr-full -z-10"></div>
            
            <h3 className="font-headline-lg text-primary text-[28px] mb-1">{ev.name || 'Event'}</h3>
            <div className="font-meta-data text-sunset-accent uppercase tracking-widest text-[10px] font-bold mb-1">
              {formatIndonesianDate(ev.date)} | {ev.time}
            </div>
            <h4 className="font-body-md text-on-surface font-bold text-sm mt-3">
              {ev.venueLabel}
            </h4>
            <p className="font-body-md text-on-surface-variant text-[11px] max-w-[240px] leading-relaxed mb-4">
              {ev.venueAddress}
            </p>

            <div className="w-full h-28 rounded-xl overflow-hidden border border-primary/20 mb-2 shadow-sm relative bg-gray-100">
              <iframe 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(ev.venueAddress || '')}&output=embed`}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Google Maps ${ev.name}`}
                className="absolute inset-0 grayscale-[0.3] contrast-[0.9]"
              ></iframe>
            </div>
            
            <button
              onClick={() => window.open("https://maps.google.com/?q=" + encodeURIComponent(ev.venueAddress || ''), '_blank')}
              className="mt-2 border border-primary text-primary px-6 py-2.5 rounded-full font-label-caps text-[9px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-primary hover:text-white transition-all duration-300 shadow-xs font-bold w-full justify-center"
            >
              <span className="material-symbols-outlined text-sm">location_on</span> View Maps
            </button>
          </div>
        ))}
      </motion.div>

      {/* Decorative botanical element background */}
      <div className="absolute -bottom-16 -right-16 w-36 h-36 border border-primary/10 rounded-full pointer-events-none"></div>
    </section>
  );
};
