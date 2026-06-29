import { Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { buttonVariants } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Zap, Sparkles, Send, ShieldCheck, Check, X } from 'lucide-react';

export const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#FEDBDF] text-gray-900 font-sans selection:bg-[#6B1D1D]/20 overflow-x-hidden">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/logo-main.svg" alt="Baswara Logo" className="h-8 md:h-10" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
            <a href="#" className="text-[#6B1D1D] border-b-2 border-[#6B1D1D] pb-1">Beranda</a>
            <a href="#fitur" className="hover:text-[#FD5E4B] transition-colors pb-1">Fitur</a>
            <a href="#template" className="hover:text-[#FD5E4B] transition-colors pb-1">Template</a>
            <a href="#harga" className="hover:text-[#FD5E4B] transition-colors pb-1">Harga</a>
            <a href="#testimoni" className="hover:text-[#FD5E4B] transition-colors pb-1">Testimoni</a>
            <a href="#tentang" className="hover:text-[#FD5E4B] transition-colors pb-1">Tentang Kami</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Masuk
            </Link>
            <Link to="/login" className={buttonVariants({ variant: "secondary", size: "sm" })}>
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full px-6 pt-28 md:pt-32 pb-0 flex flex-col md:flex-row md:items-stretch justify-between max-w-7xl mx-auto gap-8 md:gap-12 relative isolate">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          {/* Glowing Orbs */}
          <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-[#FD5E4B]/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[10%] left-[20%] w-80 h-80 bg-[#FECF00]/10 rounded-full blur-[100px]"></div>
          
          {/* Floating Petals/Leaves (CSS generated) */}
          <div className="absolute top-[15%] left-[5%] w-8 h-8 bg-gradient-to-br from-[#FD5E4B]/40 to-[#6B1D1D]/10 rounded-[50%_0_50%_0] rotate-45 animate-float blur-[1px]"></div>
          <div className="absolute top-[40%] left-[45%] w-6 h-6 bg-gradient-to-br from-[#6B1D1D]/30 to-transparent rounded-[0_50%_0_50%] rotate-12 animate-float blur-[2px]" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-[20%] left-[10%] w-10 h-10 bg-gradient-to-br from-[#FD5E4B]/30 to-transparent rounded-[50%_0_50%_0] -rotate-12 animate-float blur-[1px]" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[25%] right-[40%] w-7 h-7 bg-gradient-to-br from-[#FECF00]/40 to-transparent rounded-[0_50%_0_50%] rotate-45 animate-float" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-[40%] right-[35%] w-9 h-9 bg-gradient-to-br from-[#FD5E4B]/40 to-[#6B1D1D]/20 rounded-[50%_0_50%_0] rotate-[60deg] animate-float blur-[2px]" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="w-full md:w-5/12 lg:w-5/12 text-center md:text-left flex flex-col items-center md:items-start z-10 self-center pb-8 md:pb-24">
          <h1 className="text-[#FD5E4B] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider mb-2">
            BASWARA
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.2] md:leading-[1.15] mb-4 md:mb-6">
            Undangan Digital <br className="hidden sm:block"/>
            <span className="font-display-romantic text-[#6B1D1D] italic font-normal tracking-wide">Modern & Elegan</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-md leading-relaxed px-4 md:px-0">
            Buat undangan digital untuk momen spesialmu dengan mudah, cepat, dan berkesan.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto px-4 md:px-0">
            <Link to="/login" className={buttonVariants({ variant: "default", size: "lg", className: "w-full sm:w-auto gap-2" })}>
              Buat Undangan Gratis
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
            <Link to="/$slug" params={{ slug: 'shin-lena' }} className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto bg-white/50" })}>
              Lihat Contoh
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} alt="Avatar" className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm" />
              ))}
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-xs md:text-sm text-gray-900">10.000+ pasangan</span>
              <span className="text-[10px] md:text-xs text-gray-500">sudah membuat undangan</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full md:w-7/12 lg:w-7/12 relative flex justify-center items-end self-end pt-4 md:pt-0 pb-12 md:pb-0 overflow-hidden md:overflow-visible">
          {/* Floral Blob Background */}
          <img 
            src="/048a1876-f1b3-4ece-be30-019a31011551.png" 
            alt="Floral Background" 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[150%] sm:w-[130%] max-w-[900px] object-contain -z-10 pointer-events-none mix-blend-darken opacity-90" 
            style={{ 
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)', 
              maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)' 
            }}
          />
          <img 
            src="/hero-mockup.png" 
            alt="Hand holding smartphone with invitation" 
            className="relative z-10 w-[85%] sm:w-[90%] md:w-[110%] lg:w-[125%] max-w-[800px] object-contain drop-shadow-2xl origin-bottom translate-y-4 md:translate-y-2 md:translate-x-8 lg:translate-x-16" 
          />
        </div>
      </section>

      {/* Benefits - Premium Cards */}
      <section className="w-full py-24 bg-[#FAFAFA] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900 leading-none">
              Semua yang Kamu Butuh
            </h2>
            <p className="font-display-romantic text-4xl md:text-5xl text-[#FD5E4B] italic mt-2">
              untuk Undangan Sempurna
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Mudah & Cepat', desc: 'Buat undangan digital dalam hitungan menit tanpa perlu keahlian desain.', icon: Zap, gradient: 'from-[#FD5E4B] to-[#ff8f82]' },
              { title: 'Elegan', desc: 'Beragam template modern dan premium yang dirancang oleh desainer kelas dunia.', icon: Sparkles, gradient: 'from-[#FECF00] to-[#ffdf4d]' },
              { title: 'Praktis', desc: 'Bagikan undangan ke ribuan tamu kapan saja, di mana saja hanya dengan satu klik.', icon: Send, gradient: 'from-[#4ade80] to-[#86efac]' },
              { title: 'Aman & Terjaga', desc: 'Sistem RSVP dan data pribadi tamu dijamin terenkripsi dengan aman.', icon: ShieldCheck, gradient: 'from-[#60a5fa] to-[#93c5fd]' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="group relative bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col items-center text-center isolate"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-3 uppercase tracking-wider">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#FD5E4B]/10 rounded-[2rem] transition-colors duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fitur Unggulan */}
      <section id="fitur" className="w-full py-24 bg-[#FEDBDF]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-[#6B1D1D] font-bold text-xs tracking-wider uppercase mb-3">Fitur Unggulan</h4>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Lengkap, praktis,<br/>dan bikin momenmu<br/>semakin berkesan
            </h2>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto md:mx-0 leading-relaxed text-sm">
              Baswara menyediakan berbagai fitur lengkap untuk membantumu menciptakan undangan digital yang istimewa.
            </p>
            <Link to="/login" className={buttonVariants({ variant: "secondary", className: "gap-2" })}>
              Lihat Semua Fitur
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="flex-1 relative flex justify-center py-10 md:py-0 hidden md:flex items-center">
             <div className="absolute inset-0 bg-[#6B1D1D]/5 rounded-full blur-3xl -z-10 transform scale-150"></div>
             <img 
               src="/features-mockup.png" 
               alt="Multiple invitation templates mockup" 
               className="relative z-10 w-[110%] md:w-[130%] lg:w-[150%] max-w-[800px] object-contain drop-shadow-2xl md:scale-110 lg:scale-125 transition-transform duration-700" 
             />
          </div>

          <div className="flex-1 flex flex-col gap-6">
             {[
               { title: 'Template Premium', desc: 'Desain eksklusif & elegan', icon: 'mail', bg: 'bg-[#6B1D1D]' },
               { title: 'Musik Latar', desc: 'Tambahkan sentuhan musik favoritmu', icon: 'music_note', bg: 'bg-[#FD5E4B]' },
               { title: 'Countdown Event', desc: 'Hitung mundur menuju hari bahagiamu', icon: 'timer', bg: 'bg-[#FECF00]' },
               { title: 'Galeri Foto', desc: 'Bagikan momen spesial kamu berdua', icon: 'photo_library', bg: 'bg-[#6B1D1D]/80' },
             ].map((f, i) => (
                <Card key={i} className="flex gap-4 items-center p-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${f.bg}`}>
                    <span className="material-symbols-outlined">{f.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-0.5">{f.title}</h4>
                    <p className="text-xs text-gray-500">{f.desc}</p>
                  </div>
                </Card>
             ))}
          </div>
        </div>
      </section>

      {/* Cara Kerja */}
      <section className="w-full py-24 bg-white text-center">
        <h4 className="text-[#6B1D1D] font-bold text-xs tracking-wider uppercase mb-3">Cara Kerja</h4>
        <h2 className="text-3xl font-bold text-gray-900 mb-16">Buat undangan dalam 3 langkah mudah</h2>
        
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center relative">
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-[2px] border-t-2 border-dashed border-[#6B1D1D]/30 z-0"></div>
          
          {[
            { num: 1, title: 'Pilih Template', desc: 'Pilih desain undangan yang kamu suka', icon: 'edit' },
            { num: 2, title: 'Edit & Sesuaikan', desc: 'Masukkan detail acara, foto, musik, dan lainnya', icon: 'draw' },
            { num: 3, title: 'Bagikan', desc: 'Bagikan undangan ke tamu dengan mudah', icon: 'send' },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center relative z-10 w-64 mb-10 md:mb-0 bg-white px-2">
              <div className="w-8 h-8 rounded-full bg-red-50 text-[#6B1D1D] font-bold flex items-center justify-center mb-4 text-sm">
                {step.num}
              </div>
              <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-100 text-[#6B1D1D] flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">{step.icon}</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimoni */}
      <section id="testimoni" className="w-full py-24 bg-[#FEDBDF] text-center">
        <h4 className="text-[#6B1D1D] font-bold text-xs tracking-wider uppercase mb-3">Testimoni</h4>
        <h2 className="text-3xl font-bold text-gray-900 mb-12">Apa kata mereka?</h2>
        
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { text: "Undangannya sangat elegan dan mudah dibuat. Tamu-tamu juga puji tampilannya!", name: "Siti & Andi", date: "20 Juni 2024" },
            { text: "Fitur RSVP-nya sangat membantu kami mengelola konfirmasi tamu dengan praktis.", name: "Dewi & Raka", date: "15 Mei 2024" },
            { text: "Baswara bikin undangan digital jadi simpel, modern, dan pastinya hemat biaya!", name: "Nadia & Bimo", date: "10 April 2024" },
          ].map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-left flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-4xl text-[#6B1D1D] mb-4 block opacity-80">format_quote</span>
                <p className="text-gray-800 font-medium leading-relaxed mb-8">{t.text}</p>
              </div>
              <div className="flex items-center gap-3">
                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <h5 className="font-bold text-sm text-gray-900">{t.name}</h5>
                  <p className="text-xs text-gray-500">{t.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-10">
          <div className="w-2.5 h-2.5 rounded-full bg-[#6B1D1D]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
        </div>
      </section>

      {/* Harga */}
      <section id="harga" className="w-full py-24 bg-white text-center">
        <h4 className="text-[#FD5E4B] font-bold text-xs tracking-wider uppercase mb-3">Paket Harga</h4>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 uppercase tracking-tight">Pilih Paket</h2>
        <p className="font-display-romantic text-3xl md:text-4xl text-[#6B1D1D] italic mb-16">
          Sesuai Kebutuhanmu
        </p>
        
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Basic */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-left hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500">
            <h3 className="font-bold text-xl text-gray-900 mb-2 uppercase tracking-wider">Basic</h3>
            <div className="text-4xl font-black text-gray-900 mb-2">Rp 49rb<span className="text-base font-medium text-gray-400">/undangan</span></div>
            <p className="text-sm text-gray-500 mb-8 h-10">Cocok untuk acara intim dan personal.</p>
            
            <ul className="space-y-4 mb-10 text-sm text-gray-600 font-medium">
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-gray-400 shrink-0" /> 1 Undangan Digital</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-gray-400 shrink-0" /> Template Basic</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-gray-400 shrink-0" /> Fitur RSVP</li>
              <li className="flex items-center gap-3 text-gray-400"><X className="w-5 h-5 text-gray-200 shrink-0" /> <span className="line-through decoration-gray-200">Musik Latar</span></li>
              <li className="flex items-center gap-3 text-gray-400"><X className="w-5 h-5 text-gray-200 shrink-0" /> <span className="line-through decoration-gray-200">Galeri Foto</span></li>
            </ul>
            <button className="w-full py-4 rounded-2xl border-2 border-gray-100 text-gray-900 font-bold uppercase tracking-widest text-sm hover:bg-gray-50 hover:border-gray-200 transition-colors">Pilih Basic</button>
          </div>
          
          {/* Premium (High Contrast) */}
          <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] shadow-2xl border border-white/10 text-left relative transform md:scale-110 z-10 hover:-translate-y-2 transition-transform duration-500 flex flex-col justify-between">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FD5E4B] text-white text-[10px] font-bold uppercase tracking-widest py-2 px-5 rounded-full shadow-[0_0_20px_rgba(253,94,75,0.4)]">POPULER</div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-[#FD5E4B]/10 to-transparent rounded-[2.5rem] pointer-events-none"></div>

            <div className="relative z-10">
              <h3 className="font-bold text-xl text-white mb-2 uppercase tracking-wider">Premium</h3>
              <div className="text-4xl font-black text-white mb-2">Rp 99rb<span className="text-base font-medium text-gray-400">/undangan</span></div>
              <p className="text-sm text-gray-400 mb-8 h-10">Fitur lengkap untuk momen terbaikmu.</p>
              
              <ul className="space-y-4 mb-10 text-sm text-white font-medium">
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#FD5E4B] shrink-0" /> 1 Undangan Digital</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#FD5E4B] shrink-0" /> Template Premium</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#FD5E4B] shrink-0" /> Fitur RSVP</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#FD5E4B] shrink-0" /> Musik Latar</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#FD5E4B] shrink-0" /> Galeri Foto (Max 20)</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#FD5E4B] shrink-0" /> Countdown Event</li>
              </ul>
            </div>
            
            <button className="relative z-10 w-full py-4 rounded-2xl bg-[#FD5E4B] text-white font-bold uppercase tracking-widest text-sm hover:bg-[#E45D36] shadow-lg shadow-[#FD5E4B]/30 transition-colors">Pilih Premium</button>
          </div>
          
          {/* Ultimate */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-left hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500">
            <h3 className="font-bold text-xl text-gray-900 mb-2 uppercase tracking-wider">Ultimate</h3>
            <div className="text-4xl font-black text-gray-900 mb-2">Rp 149rb<span className="text-base font-medium text-gray-400">/undangan</span></div>
            <p className="text-sm text-gray-500 mb-8 h-10">Bebas kustomisasi tanpa batas.</p>
            
            <ul className="space-y-4 mb-10 text-sm text-gray-600 font-medium">
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-gray-400 shrink-0" /> 1 Undangan Digital</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-gray-400 shrink-0" /> Semua Template Premium</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-gray-400 shrink-0" /> Fitur RSVP</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-gray-400 shrink-0" /> Musik Latar & Galeri</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-gray-900 shrink-0" /> Galeri Foto (Max 50)</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#FECF00] shrink-0" /> Custom Domain Eksklusif</li>
            </ul>
            <button className="w-full py-4 rounded-2xl border-2 border-gray-100 text-gray-900 font-bold uppercase tracking-widest text-sm hover:bg-gray-50 hover:border-gray-200 transition-colors">Pilih Ultimate</button>
          </div>
          
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full py-20 px-6">
        <div className="max-w-5xl mx-auto bg-[#6B1D1D] rounded-[32px] p-10 md:p-14 text-center md:text-left flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl">
          {/* Floral background pattern could be added here */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6B1D1D]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-[#6B1D1D]/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-md mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">Siap membuat undangan digital impianmu?</h2>
            <p className="text-white/80 text-sm leading-relaxed">Bergabunglah dengan ribuan pasangan lainnya dan buat momen spesialmu semakin berkesan.</p>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link to="/login" className="px-6 py-3.5 bg-white text-[#6B1D1D] rounded-full text-sm font-bold shadow-md hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              Buat Undangan Gratis
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            <Link to="/$slug" params={{ slug: 'shin-lena' }} className="px-6 py-3.5 bg-transparent border border-white/30 text-white rounded-full text-sm font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              Lihat Contoh Undangan
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#6B1D1D] pt-16 pb-8 border-t-[16px] border-[#6B1D1D]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:pr-8">
            <img src="/logo-small.svg" alt="Baswara Logo" className="h-8 mb-6 brightness-0 invert" />
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Platform undangan digital modern dan elegan untuk momen spesial anda.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FD5E4B] transition-colors"><span className="material-symbols-outlined text-sm">camera_alt</span></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FD5E4B] transition-colors"><span className="material-symbols-outlined text-sm">facebook</span></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FD5E4B] transition-colors"><span className="material-symbols-outlined text-sm">music_video</span></a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-6">Navigasi</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Beranda</a></li>
              <li><a href="#fitur" className="hover:text-white transition-colors">Fitur</a></li>
              <li><a href="#template" className="hover:text-white transition-colors">Template</a></li>
              <li><a href="#harga" className="hover:text-white transition-colors">Harga</a></li>
              <li><a href="#testimoni" className="hover:text-white transition-colors">Testimoni</a></li>
              <li><a href="#tentang" className="hover:text-white transition-colors">Tentang Kami</a></li>
            </ul>
          </div>
          
          {/* Help */}
          <div>
            <h4 className="font-bold text-white mb-6">Bantuan</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Panduan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hubungi Kami</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-6">Kontak</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[#6B1D1D] text-lg">mail</span> hello@baswara.com</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[#6B1D1D] text-lg">call</span> +62 812-3456-7890</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[#6B1D1D] text-lg">location_on</span> Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>
        
        <div className="w-full pt-8 border-t border-white/10 text-center">
          <p className="text-white/50 text-xs">&copy; 2025 Baswara. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
