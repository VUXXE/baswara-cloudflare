import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle2, Heart } from 'lucide-react';
import { useInvitationStore } from '../../store/useInvitationStore';

export const BirthdayGift = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { banks } = useInvitationStore(state => state.data);

  const handleCopy = (number: string, id: string) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!banks || banks.length === 0) return null;

  return (
    <section className="w-full relative z-10 font-['Outfit',_sans-serif]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-[#FCF4F4]/80 backdrop-blur-xl border border-white/90 rounded-[40px] p-8 shadow-[0_20px_50px_rgba(201,136,134,0.1)] text-center relative overflow-hidden"
      >
        <div className="flex flex-col items-center mb-6">
          <h2 className="font-['Lora',_serif] font-medium text-[#C98886] text-[32px] text-center mb-1">
            Birthday Gift
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-[#C98886]">
            <div className="w-8 h-[1px] bg-[#EAAEA5]/40" />
            <Heart className="w-4 h-4 text-[#EAAEA5] stroke-[1.5]" />
            <div className="w-8 h-[1px] bg-[#EAAEA5]/40" />
          </div>
        </div>
        
        <p className="text-[13px] leading-[1.6] mb-[20px] text-[#5C4342] font-medium">
          Your love and presence<br/>are the best gift for me.<br/>
          But if you'd like to send a gift,<br/>
          you can use the details below.<br/>
          Thank you!
        </p>
        
        <div className="mx-auto mb-[20px] w-[180px]">
          <img src="/images/gift.png" alt="Gift Box" className="w-full h-auto block" />
        </div>
        
        <div className="flex flex-col gap-5">
          {banks.map((bank) => (
            <div key={bank.id} className="bg-white/80 p-6 rounded-[32px] border border-white shadow-sm flex flex-col items-center">
              {/* Optional: we can display bank logo if matched by name. For now, text format like image */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-['Outfit',_sans-serif] text-[20px] font-extrabold italic text-[#003399]">{bank.bank}</h3>
              </div>
              <p className="font-['Outfit',_sans-serif] text-[20px] font-bold mb-1 text-[#5C4342] tracking-wide">{bank.number}</p>
              <p className="text-[12px] mb-6 tracking-[1px] text-[#A68A8A] uppercase font-bold">{bank.name}</p>
              
              <button 
                className={`inline-flex items-center justify-center gap-2 rounded-full py-3 px-8 font-medium text-[13px] cursor-pointer transition-all duration-300 shadow-[0_4px_10px_rgba(201,136,134,0.2)] ${copiedId === bank.id ? 'bg-[#C98886] text-white' : 'bg-gradient-to-r from-[#D69B9B] to-[#C98886] text-white hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(201,136,134,0.4)]'}`}
                onClick={() => handleCopy(bank.number, bank.id)}
              >
                {copiedId === bank.id ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copiedId === bank.id ? 'Copied!' : 'Copy Number'}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
