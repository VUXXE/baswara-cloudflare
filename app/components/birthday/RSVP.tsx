import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Heart } from 'lucide-react';
import { useInvitationStore } from '../../store/useInvitationStore';

export const BirthdayRSVP = ({ onAddRsvp }: { onAddRsvp?: (entry: any) => void }) => {
  const [attendance, setAttendance] = useState('yes');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { birthdayName } = useInvitationStore(state => state.data);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    setIsSubmitting(true);
    if (onAddRsvp) {
      await onAddRsvp({
        name,
        attendance,
        guests: 1, // Defaulting to 1 for birthday template per design
        wish: message,
        timestamp: new Date().toLocaleString()
      });
    }
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <section className="w-full relative z-10 font-['Outfit',_sans-serif]" id="rsvp">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-[#FCF4F4]/80 backdrop-blur-xl border border-white/90 rounded-[40px] p-8 shadow-[0_20px_50px_rgba(201,136,134,0.1)]"
      >
        <div className="flex flex-col items-center mb-8">
          <h2 className="font-['Lora',_serif] font-medium text-[#C98886] text-[32px] text-center mb-1">
            Kindly RSVP
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-[#C98886]">
            <div className="w-8 h-[1px] bg-[#EAAEA5]/40" />
            <Heart className="w-4 h-4 text-[#EAAEA5] stroke-[1.5]" />
            <div className="w-8 h-[1px] bg-[#EAAEA5]/40" />
          </div>
        </div>
        
        {submitted ? (
          <div className="text-center py-10">
            <h3 className="font-['Lora',_serif] text-[#C98886] text-2xl mb-2">Thank You!</h3>
            <p className="text-[#9B7D7D]">Your RSVP has been confirmed.</p>
          </div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col text-left">
              <label className="block text-[12px] font-semibold mb-2 text-[#5C4342]">Your Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full p-3.5 rounded-xl border border-white bg-white font-['Outfit',_sans-serif] text-[14px] text-[#5C4342] transition-all duration-300 shadow-sm focus:outline-none focus:border-[#EAAEA5] focus:ring-2 focus:ring-[#EAAEA5]/20" 
                placeholder="Enter your name" 
              />
            </div>
            
            <div className="flex flex-col text-left">
              <label className="block text-[12px] font-semibold mb-2 text-[#5C4342]">Attendance</label>
              <div className="flex flex-col gap-2.5">
                <label className="flex items-center gap-3 cursor-pointer text-[14px] text-[#5C4342] select-none group">
                  <input 
                    type="radio" 
                    name="attendance" 
                    value="yes" 
                    className="absolute opacity-0 cursor-pointer h-0 w-0 peer"
                    checked={attendance === 'yes'} 
                    onChange={() => setAttendance('yes')} 
                  />
                  <span className="w-5 h-5 rounded-full border border-[#C98886] transition-all duration-200 bg-white shrink-0 flex items-center justify-center peer-checked:border-[#EAAEA5] peer-checked:bg-[#EAAEA5] after:content-[''] after:w-2 after:h-2 after:bg-white after:rounded-full after:opacity-0 peer-checked:after:opacity-100 shadow-sm"></span>
                  Yes, I'll be there
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-[14px] text-[#5C4342] select-none group">
                  <input 
                    type="radio" 
                    name="attendance" 
                    value="no" 
                    className="absolute opacity-0 cursor-pointer h-0 w-0 peer"
                    checked={attendance === 'no'} 
                    onChange={() => setAttendance('no')} 
                  />
                  <span className="w-5 h-5 rounded-full border border-[#C98886] transition-all duration-200 bg-white shrink-0 flex items-center justify-center peer-checked:border-[#EAAEA5] peer-checked:bg-[#EAAEA5] after:content-[''] after:w-2 after:h-2 after:bg-white after:rounded-full after:opacity-0 peer-checked:after:opacity-100 shadow-sm"></span>
                  Sorry, can't make it
                </label>
              </div>
            </div>
            
            <div className="flex flex-col text-left">
              <label className="block text-[12px] font-semibold mb-2 text-[#5C4342]">Message for {birthdayName || 'Aurelia'}</label>
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-white bg-white font-['Outfit',_sans-serif] text-[14px] text-[#5C4342] transition-all duration-300 shadow-sm focus:outline-none focus:border-[#EAAEA5] focus:ring-2 focus:ring-[#EAAEA5]/20 resize-y min-h-[100px]" 
                placeholder="Write your message here..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#D69B9B] to-[#C98886] text-white border-none rounded-full py-4 px-8 font-medium text-[14px] tracking-[0.5px] cursor-pointer shadow-[0_8px_20px_rgba(201,136,134,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(201,136,134,0.4)] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : <><Send size={16} /> Send RSVP</>}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
};
