import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInvitationStore } from '../../store/useInvitationStore';

export const Countdown: React.FC = () => {
  const { groomName, brideName, weddingVenue, weddingTimestamp: storeTimestamp } = useInvitationStore(state => state.data);
  const defaultTimestamp = new Date('2026-09-16T09:00:00').getTime();
  const weddingTimestamp = storeTimestamp && !isNaN(storeTimestamp) ? storeTimestamp : defaultTimestamp;

  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = weddingTimestamp - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: days.toString().padStart(2, '0'),
          hours: hours.toString().padStart(2, '0'),
          minutes: minutes.toString().padStart(2, '0'),
          seconds: seconds.toString().padStart(2, '0')
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingTimestamp]);

  const handleAddToCalendar = () => {
    const eventTitle = encodeURIComponent(`Wedding of ${groomName} & ${brideName}`);
    const eventDetails = encodeURIComponent(`You are cordially invited to the wedding of ${groomName} & ${brideName}.`);
    const eventLocation = encodeURIComponent(weddingVenue);
    
    // Format dates for Google Calendar (YYYYMMDDTHHMMSS)
    const startDate = new Date(weddingTimestamp);
    const endDate = new Date(weddingTimestamp + 6 * 60 * 60 * 1000); // assume 6 hours long
    const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}&details=${eventDetails}&location=${eventLocation}`;
    window.open(googleCalendarUrl, '_blank');
  };

  const weddingDateObj = new Date(weddingTimestamp);
  const monthName = weddingDateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const weddingDayOfMonth = weddingDateObj.getDate().toString();

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  // Generate calendar days
  const getCalendarDays = () => {
    const year = weddingDateObj.getFullYear();
    const month = weddingDateObj.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: string[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push('');
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i.toString());
    }
    return days;
  };

  const calendarDays = getCalendarDays();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full h-[100dvh] shrink-0 snap-start px-margin-mobile bg-surface-container flex flex-col justify-center relative overflow-hidden"
    >


      <div className="text-center mb-4 relative z-10">
        <h2 className="font-display-romantic text-primary text-[44px] leading-tight">Save the Date</h2>
      </div>

      {/* Calendar Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white p-5 rounded-2xl border border-outline-variant/35 shadow-xs w-full max-w-[340px] mx-auto flex flex-col items-center gap-4 relative z-10 mb-5"
      >
        {/* Month Header */}
        <div className="font-meta-data font-bold text-primary text-sm uppercase tracking-widest border-b border-primary/10 w-full pb-2 text-center">
          {monthName}
        </div>

        {/* Calendar Grid */}
        <div className="w-full">
          {/* Weekdays Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {weekdays.map((day, idx) => (
              <span key={idx} className="font-label-caps text-[10px] text-outline font-bold uppercase tracking-wider">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center">
            {calendarDays.map((day, idx) => {
              const isWeddingDay = day === weddingDayOfMonth;
              return (
                <div key={idx} className="relative py-1 flex items-center justify-center text-xs font-meta-data">
                  {day && (
                    <span 
                      className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-all ${
                        isWeddingDay 
                          ? 'bg-floral-green text-white font-bold shadow-xs z-10' 
                          : 'text-on-surface'
                      }`}
                    >
                      {day}
                      {/* Pulse circle around wedding date */}
                      {isWeddingDay && (
                        <span className="absolute inset-0 rounded-full border-2 border-floral-green animate-ping opacity-60 pointer-events-none" />
                      )}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Compact Countdown Bar */}
      <div className="flex justify-center gap-2 relative z-10 mb-6">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Mins', value: timeLeft.minutes },
          { label: 'Secs', value: timeLeft.seconds }
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-background-alt border border-primary/15 rounded-xl py-2 px-3 w-16 flex flex-col items-center shadow-2xs"
          >
            <span className="font-meta-data text-base font-bold text-primary tracking-tight">
              {item.value}
            </span>
            <span className="font-label-caps text-[8px] text-on-surface-variant uppercase tracking-wider">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Add to Calendar Button */}
      <div className="flex justify-center relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCalendar}
          className="border-2 border-floral-green text-floral-green font-label-caps text-label-caps px-6 py-2.5 rounded-full hover:bg-floral-green hover:text-white transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-xs font-semibold"
        >
          <span className="material-symbols-outlined text-base">calendar_month</span>
          Add to Calendar
        </motion.button>
      </div>

      {/* Decorative background shapes */}
      <div className="absolute -bottom-16 -right-16 w-36 h-36 border border-primary/10 rounded-full pointer-events-none"></div>
      <div className="absolute -top-16 -left-16 w-36 h-36 border border-primary/10 rounded-full pointer-events-none"></div>
    </motion.section>
  );
};
