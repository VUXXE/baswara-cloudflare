import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import QRCode from 'react-qr-code';
import { Footer } from './Footer';


export interface RsvpEntry {
  id: string;
  name: string;
  attendance: 'yes' | 'no' | 'wish_only';
  guests: number;
  wish: string;
  timestamp: string;
}

interface RsvpFormProps {
  onAddRsvp: (entry: RsvpEntry) => void;
}

export const RsvpForm: React.FC<RsvpFormProps> = ({ onAddRsvp }) => {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState('');
  const [guests, setGuests] = useState('');
  const [wish, setWish] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!attendance) {
      setError('Please select your attendance.');
      return;
    }
    if (attendance === 'yes' && !guests) {
      setError('Please select the number of guests.');
      return;
    }

    const newEntry: RsvpEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      attendance: attendance as 'yes' | 'no',
      guests: attendance === 'yes' ? parseInt(guests, 10) : 0,
      wish: wish.trim(),
      timestamp: new Date().toLocaleString()
    };

    onAddRsvp(newEntry);

    // Confetti effect
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.8 },
      colors: ['#98A250', '#5b6318', '#E45D36', '#f3e481']
    });

    setSubmitted(true);
    // Remove auto-hide if they are attending, so they can download the ticket
    if (attendance !== 'yes') {
      setTimeout(() => {
        setSubmitted(false);
        // Clear form only after hiding popup
        setName('');
        setAttendance('');
        setGuests('');
        setWish('');
      }, 5000);
    }
  };

  const closePopup = () => {
    setSubmitted(false);
    setName('');
    setAttendance('');
    setGuests('');
    setWish('');
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const downloadTicket = async () => {
    const element = document.getElementById('e-ticket-pdf');
    if (!element) {
      alert("Ticket element not found.");
      return;
    }
    
    try {
      setIsDownloading(true);
      
      // Dynamically import to prevent SSR crashes
      const { jsPDF } = await import('jspdf');
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default || html2canvasModule;
      
      // Create canvas (wait for a short tick to ensure DOM is ready)
      await new Promise(r => setTimeout(r, 100));
      
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [400, 700]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, 400, 700);
      pdf.save(`Ticket_${name.replace(/\s+/g, '_')}.pdf`);
    } catch (err: any) {
      console.error("Error generating PDF", err);
      alert("Gagal men-download tiket: " + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section id="rsvp-form" className="w-full h-[100dvh] shrink-0 snap-start flex flex-col justify-center px-margin-mobile bg-surface-container-low relative">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full flex flex-col justify-center"
      >
        <h2 className="font-display-romantic text-primary text-center text-[44px] leading-tight mb-1 animate-pulse">
          Reservation
        </h2>
        <p className="font-body-md text-[14px] text-on-surface-variant text-center mb-6 leading-relaxed">
          Please confirm your attendance before<br />
          <span className="font-bold text-primary">September 10th, 2026</span>
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-3.5 relative"
        >
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-white/95 rounded-2xl z-20 flex flex-col items-center justify-center p-6 text-center"
              >
                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="material-symbols-outlined text-floral-green text-5xl mb-2"
                >
                  check_circle
                </motion.span>
                <h4 className="font-headline-lg text-primary text-2xl">RSVP Confirmed!</h4>
                
                {attendance === 'yes' ? (
                  <>
                    <p className="font-body-md text-on-surface-variant mt-1.5 text-xs max-w-[200px] mb-4">
                      Thank you! Please save your E-Ticket to show at the venue.
                    </p>
                    <button
                      onClick={downloadTicket}
                      disabled={isDownloading}
                      type="button"
                      className={`px-6 py-2.5 rounded-full font-semibold text-xs uppercase tracking-widest shadow-md transition-colors flex items-center gap-2 ${isDownloading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90'}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isDownloading ? 'hourglass_empty' : 'download'}
                      </span>
                      {isDownloading ? 'Generating PDF...' : 'Download PDF Ticket'}
                    </button>
                    <button 
                      onClick={closePopup}
                      className="text-xs text-gray-400 mt-4 underline font-medium"
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <p className="font-body-md text-on-surface-variant mt-1.5 text-xs max-w-[200px]">
                    Thank you! Your response is saved.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b border-outline-variant/40 bg-transparent py-2 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 px-0 placeholder-on-surface/40 text-[14px]"
              placeholder="Your Name"
              type="text"
            />
          </div>

          <div>
            <select
              value={attendance}
              onChange={(e) => {
                setAttendance(e.target.value);
                if (e.target.value === 'no') setGuests('');
              }}
              className="w-full border-b border-outline-variant/40 bg-transparent py-2 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 px-0 text-[14px]"
            >
              <option value="" disabled>Attendance</option>
              <option value="yes">Yes, I will attend</option>
              <option value="no">Sorry, I can't attend</option>
            </select>
          </div>

          {attendance === 'yes' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full border-b border-outline-variant/40 bg-transparent py-2 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 px-0 text-[14px]"
              >
                <option value="" disabled>Number of Guests</option>
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
              </select>
            </motion.div>
          )}

          <div>
            <textarea
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              className="w-full border-b border-outline-variant/40 bg-transparent py-2 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 px-0 placeholder-on-surface/40 text-[14px] resize-none min-h-[80px]"
              placeholder="Write warm wishes (optional)..."
              rows={3}
            />
          </div>

          {error && (
            <p className="text-error font-meta-data text-xs mt-0.5 text-center font-semibold">
              {error}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="mt-2 bg-floral-green text-white font-label-caps text-label-caps py-3 rounded-full hover:bg-primary transition-all duration-300 w-full cursor-pointer shadow-sm font-semibold text-[12px] tracking-wider"
          >
            Confirm RSVP
          </motion.button>
        </form>
      </motion.div>

      {/* Hidden E-Ticket PDF Template */}
      {submitted && attendance === 'yes' && (
        <div className="fixed top-0 left-0 z-[-1000] opacity-0 pointer-events-none">
          <div 
            id="e-ticket-pdf" 
            className="w-[400px] h-[700px] flex flex-col items-center justify-between p-8 relative overflow-hidden" 
            style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#ffffff', color: '#000000' }}
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-bl-full -z-10" style={{ backgroundColor: '#f4f6e4' }}></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-tr-full -z-10" style={{ backgroundColor: '#f4f6e4' }}></div>
            
            <div className="border rounded-3xl w-full h-full p-8 flex flex-col items-center relative z-10" style={{ borderColor: 'rgba(214, 97, 60, 0.3)', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(4px)' }}>
              
              <div className="mt-8 mb-4">
                <span className="material-symbols-outlined text-4xl" style={{ color: '#d6613c' }}>favorite</span>
              </div>
              
              <h1 className="text-3xl font-serif mb-1 text-center" style={{ fontFamily: 'Georgia, serif', color: '#111827' }}>Wedding Invitation</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-12 font-bold" style={{ color: '#8a8d7a' }}>Official E-Ticket</p>
              
              <div className="flex flex-col items-center px-8 py-6 rounded-2xl w-full border shadow-sm mb-10" style={{ backgroundColor: '#f9fafb', borderColor: '#f3f4f6' }}>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>{name}</h2>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]" style={{ color: '#d6613c' }}>group</span>
                  <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#4b5563' }}>{guests} Guest(s)</p>
                </div>
              </div>
              
              <div className="p-5 rounded-2xl mb-auto" style={{ backgroundColor: '#ffffff', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}>
                <QRCode value={`CHECKIN:${name}`} size={160} fgColor="#111111" />
              </div>
              
              <div className="text-center mt-auto pb-4 border-t pt-6 w-full" style={{ borderColor: 'rgba(229, 231, 235, 0.6)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#6b7280' }}>Entrance Pass</p>
                <p className="text-[9px]" style={{ color: '#9ca3af' }}>Please present this QR code to the receptionist upon arrival.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

interface WeddingWishesProps {
  rsvps: RsvpEntry[];
  onAddRsvp: (entry: RsvpEntry) => void;
  guestName: string;
  onDeleteRsvp: (id: string) => void;
}

export const WeddingWishes: React.FC<WeddingWishesProps> = ({ rsvps, onAddRsvp, guestName, onDeleteRsvp }) => {
  const [name, setName] = useState('');
  const [wish, setWish] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (guestName) {
      setName(guestName);
    }
  }, [guestName]);

  const formatWishDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!wish.trim()) {
      setError('Please write a wish.');
      return;
    }

    const newEntry: RsvpEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      attendance: 'wish_only',
      guests: 0,
      wish: wish.trim(),
      timestamp: formatWishDate(new Date())
    };

    onAddRsvp(newEntry);
    setWish('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section 
      id="wedding-wishes" 
      className="w-full h-[100dvh] shrink-0 snap-start flex flex-col justify-between py-10 px-margin-mobile relative overflow-hidden bg-background text-on-surface"
    >
      {/* Background Image of the couple with a light overlay */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover opacity-30 filter blur-[1px]"
          alt="Wishes background"
          src="/cover.png"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/95" />
      </div>



      {/* Decorative frame inside page */}
      <div className="absolute inset-4 border border-primary/15 rounded-2xl pointer-events-none z-0"></div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex-grow flex flex-col min-h-0 w-full gap-4 justify-between relative z-10 mt-4"
      >
        {/* Title */}
        <div className="text-center">
          <h3 className="font-display-romantic text-primary text-[52px] leading-none mb-1">
            Wedding Wish
          </h3>
        </div>

        {/* Wish Form - Name, Wish & Button */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 relative w-full px-2"
        >
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-white/95 rounded-2xl z-20 flex flex-col items-center justify-center p-4 text-center text-black"
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1 }}
                  className="material-symbols-outlined text-floral-green text-3xl mb-1"
                >
                  check_circle
                </motion.span>
                <h4 className="font-headline-lg text-primary text-lg">Wish Sent!</h4>
                <p className="font-body-md text-on-surface-variant text-[10px] max-w-[180px]">
                  Thank you! Your wish has been posted below.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-outline-variant/40 text-on-surface rounded-[24px] py-3.5 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
              placeholder="Your Name"
              type="text"
            />
          </div>

          <div className="w-full">
            <textarea
              value={wish}
              onChange={(e) => {
                setWish(e.target.value);
                // auto-grow
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              className="w-full bg-white border border-outline-variant/40 text-on-surface rounded-[20px] py-3.5 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-xs resize-none overflow-hidden min-h-[52px]"
              placeholder="Give your wish..."
              rows={2}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-primary text-white py-3.5 rounded-[24px] font-semibold text-base transition-colors hover:bg-primary/95 cursor-pointer shadow-md"
          >
            Send
          </motion.button>

          {error && (
            <p className="text-error font-meta-data text-[11px] text-center font-semibold mt-0.5">
              {error}
            </p>
          )}
        </form>

        <div className="flex-grow overflow-y-auto pr-1 pb-4 flex flex-col gap-4 min-h-0 max-h-[46svh] mt-4 px-2 scrollbar-none">
          {(!rsvps || rsvps.length === 0) ? (
            <p className="text-center font-body-md text-on-surface-variant/60 italic py-6">
              No wishes left yet. Be the first to write a wish!
            </p>
          ) : (
            (rsvps || []).map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#f4f6e4]/90 backdrop-blur-md border border-outline-variant/30 p-5 rounded-[20px] shadow-xs flex flex-col gap-1 w-full text-black relative"
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-[#d6613c] text-sm">
                      {entry.name} {entry.attendance === 'yes' && <span className="text-[#d6613c] ml-0.5">✔</span>}
                    </span>
                    <span className="text-[11px] text-[#8a8d7a] mt-0.5">
                      {entry.timestamp}
                    </span>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => onDeleteRsvp(entry.id)}
                    className="text-[#a5a995] hover:text-[#d6613c] transition-colors cursor-pointer p-1"
                    title="Delete wish"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
                
                {entry.wish && (
                  <p className="text-[#4a4b3f] text-[13px] leading-relaxed mt-2 text-left font-medium">
                    {entry.wish}
                  </p>
                )}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </section>
  );
};

export const ThankYouSection: React.FC = () => {
  return (
    <section id="thank-you" className="w-full h-[100dvh] shrink-0 snap-start flex flex-col justify-between pt-10 pb-6 px-margin-mobile bg-surface-container-low border-t border-outline-variant/10 relative overflow-hidden">

      <div className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <motion.span
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="material-symbols-outlined text-sunset-accent text-5xl mb-4"
        >
          favorite
        </motion.span>
        <h3 className="font-headline-lg text-primary text-center text-[32px] mb-4">
          Thank You
        </h3>
        <p className="font-body-md text-on-surface-variant text-[14px] leading-relaxed max-w-[280px] italic">
          "We thank you sincerely for your warm wishes and support as we embark on this beautiful adventure together."
        </p>
      </div>

      {/* Outro Footer */}
      <Footer />
    </section>
  );
};
