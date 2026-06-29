import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInvitationStore } from '../../store/useInvitationStore';

export const WeddingGift: React.FC = () => {
  const { banks, coverPhoto } = useInvitationStore(state => state.data);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [senderName, setSenderName] = useState('');
  const [amount, setAmount] = useState('');
  const [fileName, setFileName] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleCopy = (num: string, idx: number) => {
    navigator.clipboard.writeText(num);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!senderName.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!amount.trim()) {
      setError('Please enter the transfer amount.');
      return;
    }

    // Success submission
    setShowConfirm(true);
    setSenderName('');
    setAmount('');
    setFileName('');
    setTimeout(() => setShowConfirm(false), 5000);
  };

  return (
    <section 
      id="wedding-gifts"
      className="w-full h-[100dvh] shrink-0 snap-start flex flex-col justify-center items-center bg-black text-white px-margin-mobile relative overflow-hidden"
    >
      {/* Background Image of the couple with a dark overlay */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover opacity-40 filter blur-[1px]"
          alt="Wishes background"
          src={coverPhoto || "/cover.png"}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />
      </div>



      {/* Decorative frame inside page */}
      <div className="absolute inset-4 border border-white/10 rounded-2xl pointer-events-none z-0"></div>

      {/* Header */}
      <div className="text-center mb-4 relative z-10">
        <h2 className="font-display-romantic text-[#f3e481] text-[40px] leading-tight drop-shadow-md">Wedding Gift</h2>
        <p className="font-meta-data text-[9px] text-white/70 uppercase tracking-widest mt-0.5 font-semibold">
          Digital Envelope & Confirmation
        </p>
      </div>

      <p className="font-body-md text-[12px] text-white/80 text-center leading-relaxed max-w-[320px] mb-4 italic relative z-10">
        "Your blessings are enough for us. However, if you wish to send a gift, details are below."
      </p>

      {/* Bank Accounts (Side-by-side) */}
      <div className="grid grid-cols-2 gap-2.5 w-full max-w-[340px] mb-4 relative z-10">
        {(banks || []).map((acc, idx) => (
          <div 
            key={idx}
            className="bg-primary/95 text-white border border-white/10 rounded-xl p-3 shadow-xs flex flex-col justify-between relative overflow-hidden min-h-[92px]"
          >
            <div className="flex flex-col text-left">
              <span className="font-label-caps text-[7.5px] text-white/70 uppercase tracking-wider font-semibold truncate">
                {acc.bank}
              </span>
              <span className="font-meta-data font-bold text-[#f3e481] text-[13px] tracking-wide mt-1">
                {acc.number}
              </span>
              <span className="font-body-md text-[11px] text-white/90 truncate mt-0.5">
                a/n {acc.name}
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCopy(acc.number, idx)}
              className="bg-white text-primary hover:bg-white/95 py-1 rounded-lg font-label-caps text-[8px] uppercase tracking-wider transition-all duration-300 cursor-pointer font-bold flex items-center gap-1 justify-center shadow-xs mt-2"
            >
              <span className="material-symbols-outlined text-[10px]">
                {copiedIdx === idx ? 'done' : 'content_copy'}
              </span>
              {copiedIdx === idx ? 'Copied' : 'Copy'}
            </motion.button>
          </div>
        ))}
      </div>

      {/* Confirmation Form wrapper (Glassmorphism dark card) */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-md flex flex-col gap-3 w-full max-w-[340px] relative z-10"
      >
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-black/95 rounded-2xl z-20 flex flex-col items-center justify-center p-4 text-center text-white"
            >
              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="material-symbols-outlined text-floral-green text-4xl mb-1.5"
              >
                sentiment_very_satisfied
              </motion.span>
              <h4 className="font-headline-lg text-[#f3e481] text-xl">Thank You!</h4>
              <p className="font-body-md text-white/80 mt-1 text-[11px] max-w-[200px]">
                We have received your gift confirmation. Your kind generosity is deeply appreciated!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="font-label-caps text-[8.5px] text-white/60 uppercase tracking-wider font-bold text-center border-b border-white/10 pb-1 mb-0.5">
          Confirm Gift Transfer
        </p>

        <div>
          <input
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="w-full border-b border-white/20 bg-transparent py-1 font-body-md text-white focus:outline-none focus:border-[#f3e481] focus:ring-0 px-0 placeholder-white/40 text-[12px]"
            placeholder="Sender Name"
            type="text"
          />
        </div>

        <div>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border-b border-white/20 bg-transparent py-1 font-body-md text-white focus:outline-none focus:border-[#f3e481] focus:ring-0 px-0 placeholder-white/40 text-[12px]"
            placeholder="Transfer Amount (e.g. 100,000)"
            type="text"
          />
        </div>

        {/* Custom Upload Button */}
        <div className="flex items-center justify-between border-b border-white/20 py-0.5 px-0 relative">
          <span className="font-body-md text-[12px] text-white/40 overflow-hidden text-ellipsis whitespace-nowrap max-w-[190px]">
            {fileName || 'Upload proof slip (optional)'}
          </span>
          <label className="bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded-full font-label-caps text-[7.5px] uppercase tracking-wider cursor-pointer hover:bg-white/20 transition-colors font-bold">
            Choose File
            <input
              onChange={handleFileChange}
              className="hidden"
              type="file"
              accept="image/*"
            />
          </label>
        </div>

        {error && (
          <p className="text-[#f3e481] font-meta-data text-[10px] text-center font-semibold">
            {error}
          </p>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          className="mt-0.5 bg-[#98a250] hover:bg-[#838c41] text-white font-label-caps text-label-caps py-2.5 rounded-full transition-all duration-300 w-full cursor-pointer shadow-xs font-semibold text-[10px] tracking-wider"
        >
          Confirm Transfer
        </motion.button>
      </form>
    </section>
  );
};
