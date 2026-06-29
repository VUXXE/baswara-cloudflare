import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Shirt, Heart } from 'lucide-react';
import { useInvitationStore } from '../../store/useInvitationStore';

const CountdownTimer = ({ targetDate }: { targetDate: number }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="w-full bg-[#FCF4F4] rounded-[24px] border border-white p-6 shadow-sm mb-10 relative">
      <div className="flex flex-col items-center mb-6">
        <p className="text-[#A68A8A] text-[14px] uppercase tracking-[2px] font-semibold">Countdown</p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <div className="w-8 h-px bg-[#EAAEA5]/40" />
          <Heart className="w-3 h-3 text-[#EAAEA5]" />
          <div className="w-8 h-px bg-[#EAAEA5]/40" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 relative">
        {/* Horizontal Divider */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#EAAEA5]/20 -translate-y-1/2" />
        {/* Vertical Divider */}
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#EAAEA5]/20 -translate-x-1/2" />
        {/* Cross dot */}
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#EAAEA5]/40 -translate-x-1/2 -translate-y-1/2" />

        <div className="flex flex-col items-center justify-center py-4">
          <span className="font-['Lora',_serif] text-[42px] text-[#C98886] leading-none mb-1">{timeLeft.days}</span>
          <span className="text-[10px] text-[#5C4342] uppercase tracking-[1px] font-bold">Days</span>
        </div>
        <div className="flex flex-col items-center justify-center py-4">
          <span className="font-['Lora',_serif] text-[42px] text-[#C98886] leading-none mb-1">{timeLeft.hours}</span>
          <span className="text-[10px] text-[#5C4342] uppercase tracking-[1px] font-bold">Hours</span>
        </div>
        <div className="flex flex-col items-center justify-center py-4">
          <span className="font-['Lora',_serif] text-[42px] text-[#C98886] leading-none mb-1">{timeLeft.minutes}</span>
          <span className="text-[10px] text-[#5C4342] uppercase tracking-[1px] font-bold">Minutes</span>
        </div>
        <div className="flex flex-col items-center justify-center py-4">
          <span className="font-['Lora',_serif] text-[42px] text-[#C98886] leading-none mb-1">{timeLeft.seconds}</span>
          <span className="text-[10px] text-[#5C4342] uppercase tracking-[1px] font-bold">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export const BirthdayDetails = () => {
  const { birthdayName, events, dresscodeMenStyle, dresscodeWomenStyle, weddingTimestamp } = useInvitationStore(state => state.data);
  const mainEvent = events?.[0];

  return (
    <section className="w-full relative z-10 font-['Outfit',_sans-serif]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-[40px] p-8 shadow-[0_20px_50px_rgba(201,136,134,0.1)] relative overflow-hidden"
      >
        {/* Soft decorative blur */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#EAAEA5]/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#C98886]/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <h2 className="font-['Great_Vibes',_cursive] text-[40px] text-center mb-2 text-[#C98886]">Hello,</h2>
          <h3 className="text-[20px] font-medium text-center leading-[1.4] mb-8 text-[#5C4342] tracking-wide">
            You're Invited<br/>to<br/>{birthdayName || 'Aurelia'}'s<br/>Birthday Celebration
          </h3>
          
          <div className="flex items-center justify-center gap-1.5 mb-10 text-[#C98886]">
            <div className="w-16 h-[1px] bg-[#EAAEA5]/30" />
            <Heart className="w-4 h-4 text-[#EAAEA5] stroke-[1.5]" />
            <div className="w-16 h-[1px] bg-[#EAAEA5]/30" />
          </div>
          
          {mainEvent && (
            <div className="flex items-center justify-center gap-4 mb-10 bg-white/50 py-3 px-6 rounded-full border border-white shadow-sm">
              <Calendar className="w-5 h-5 text-[#C98886]" />
              <div className="text-left text-[#5C4342] flex flex-col justify-center">
                <p className="font-bold text-[12px] uppercase tracking-widest leading-tight">{mainEvent.name || 'Saturday'}</p>
                <p className="text-[12px] opacity-80 leading-tight">{mainEvent.date}</p>
              </div>
            </div>
          )}

          <CountdownTimer targetDate={weddingTimestamp} />
          
          <div className="flex flex-col gap-6 pl-2">
            {mainEvent && (
              <>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#C98886] shadow-sm border border-white shrink-0 relative">
                    <MapPin className="w-5 h-5" />
                    {/* Connection line to next item */}
                    <div className="absolute top-12 left-1/2 w-[1px] h-6 bg-[#EAAEA5]/30 -translate-x-1/2" />
                  </div>
                  <div className="text-left text-[#5C4342] mt-1">
                    <p className="text-[11px] uppercase tracking-[2px] text-[#A68A8A] font-bold mb-0.5">Location</p>
                    <p className="text-[14px] leading-[1.4] font-medium">{mainEvent.venueLabel}<br/><span className="font-normal opacity-80 text-[12px]">{mainEvent.venueAddress}</span></p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#C98886] shadow-sm border border-white shrink-0 relative">
                    <Clock className="w-5 h-5" />
                    {/* Connection line to next item */}
                    <div className="absolute top-12 left-1/2 w-[1px] h-6 bg-[#EAAEA5]/30 -translate-x-1/2" />
                  </div>
                  <div className="text-left text-[#5C4342] mt-1">
                    <p className="text-[11px] uppercase tracking-[2px] text-[#A68A8A] font-bold mb-0.5">Time</p>
                    <p className="text-[14px] leading-[1.4] font-medium">{mainEvent.time}<br/><span className="font-normal opacity-80 text-[12px]">until end</span></p>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#C98886] shadow-sm border border-white shrink-0">
                <Shirt className="w-5 h-5" />
              </div>
              <div className="text-left text-[#5C4342] mt-1">
                <p className="text-[11px] uppercase tracking-[2px] text-[#A68A8A] font-bold mb-0.5">Dresscode</p>
                <p className="text-[14px] leading-[1.4] font-medium">{dresscodeMenStyle || dresscodeWomenStyle || 'White & Beige'}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
