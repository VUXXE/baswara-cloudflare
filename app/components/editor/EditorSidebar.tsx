import { useState } from 'react';
import { useInvitationStore } from '../../store/useInvitationStore';
import { Camera, Type, Music, Calendar, MapPin, Hash, ChevronDown, ChevronUp, Gift, Upload, Plus, Trash2, Info, Image as ImageIcon, Clock, Users, Palette, Video, LayoutTemplate, Check } from 'lucide-react';
import { uploadAsset } from '../../lib/serverFns';
import { useEffect } from 'react';
export const EditorSidebar = ({ activeMenu = 'COVER' }: { activeMenu?: string }) => {
  const { data, updateData, updateSchedule, addSchedule, removeSchedule, updateBank, addBank, removeBank, updateEvent, addEvent, removeEvent, setInvitationOpen } = useInvitationStore();
  const [activeSection, setActiveSection] = useState<string>('cover');
  const [uploading, setUploading] = useState(false);

  const menuConfig: Record<string, { title: string, subtitle: string, sections: string[] }> = {
    COVER: { title: 'Halaman Sampul', subtitle: 'Foto depan & musik latar', sections: ['cover'] },
    HERO: { title: 'Beranda Utama', subtitle: 'Foto utama & nama mempelai', sections: ['hero'] },
    QUOTE: { title: 'Kutipan', subtitle: 'Kata-kata mutiara / doa', sections: ['quote'] },
    PROFILES: { title: 'Profil Mempelai', subtitle: 'Foto individu & nama orang tua', sections: ['profiles'] },
    STORY: { title: 'Kisah Cinta', subtitle: 'Cerita pertemuan & foto kenangan', sections: ['loveStory'] },
    EVENTS: { title: 'Informasi Acara', subtitle: 'Jadwal, lokasi, dan rundown', sections: ['countdown', 'events', 'rundown'] },
    DRESSCODE: { title: 'Panduan Busana', subtitle: 'Palet warna untuk tamu', sections: ['dresscode'] },
    GALLERY: { title: 'Galeri Foto', subtitle: 'Album pre-wedding', sections: ['footage'] },
    GIFTS: { title: 'Angpao Digital', subtitle: 'Rekening bank & e-wallet', sections: ['gifts'] },
  };

  const currentConfig = menuConfig[activeMenu] || menuConfig['COVER'];
  const showSection = (id: string) => currentConfig.sections.includes(id);

  useEffect(() => {
    if (currentConfig.sections.length > 0) {
      scrollToSection(currentConfig.sections[0], currentConfig.sections[0]);
    }
  }, [activeMenu]);

  const scrollToSection = (id: string, sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'cover') {
      setInvitationOpen(false);
    } else if (sectionId !== 'themes') {
      setInvitationOpen(true);
      setTimeout(() => {
        const previewMain = document.getElementById('preview-main-container');
        if (previewMain) {
          const element = previewMain.querySelector(`#${id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 100);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, arrayIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1] || '');
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      const { publicUrl } = await uploadAsset({
        data: { fileName: file.name, contentType: file.type || 'application/octet-stream', base64 },
      });

      if (fieldName === 'galleryPhotos' && arrayIndex !== undefined) {
        const newArray = [...(data.galleryPhotos || [])];
        newArray[arrayIndex] = publicUrl;
        updateData({ galleryPhotos: newArray });
      } else if (fieldName === 'galleryPhotos_add') {
        updateData({ galleryPhotos: [...(data.galleryPhotos || []), publicUrl] });
      } else {
        updateData({ [fieldName as keyof typeof data]: publicUrl });
      }
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const AccordionHeader = ({ id, icon: Icon, title, targetId, description }: { id: string, icon: any, title: string, targetId: string, description: string }) => {
    const isActive = activeSection === id;
    return (
      <button 
        onClick={() => scrollToSection(targetId, id)}
        className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all ${isActive ? 'bg-[#FD5E4B]/10 border border-[#FD5E4B]/20 text-[#8B2020]' : 'bg-gray-50/80 hover:bg-gray-100 text-gray-800 border border-transparent'}`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isActive ? 'bg-white text-[#FD5E4B] shadow-sm' : 'bg-white text-gray-400 shadow-sm'}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-black tracking-wider">{title.replace(/^\d+\.\s*/, '')}</div>
          </div>
        </div>
        {isActive ? <ChevronUp className="w-4 h-4 text-[#FD5E4B]" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
    );
  };

  const FieldHelper = ({ text }: { text: string }) => (
    <div className="flex items-start gap-1.5 mt-1.5 text-[10px] text-gray-500 bg-blue-50/50 p-2 rounded-md border border-blue-100/50">
      <Info className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
      <span className="leading-relaxed">{text}</span>
    </div>
  );

  const ImageUploadField = ({ label, value, fieldName, helperText }: { label: string, value: string, fieldName: string, helperText?: string }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      <label className={`relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all group overflow-hidden ${uploading ? 'opacity-50 pointer-events-none' : 'border-gray-300 hover:bg-gray-50 hover:border-primary'} ${value ? 'bg-gray-100' : 'bg-white'}`}>
        {value && (
          <img src={value} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity" />
        )}
        <div className="flex flex-col items-center justify-center z-10 p-4 text-center bg-white/40 rounded-lg backdrop-blur-[2px] shadow-sm">
          <Upload className="w-5 h-5 text-gray-600 mb-1" />
          <p className="text-[10px] text-gray-700 font-bold">{value ? 'Ganti Foto' : 'Klik untuk upload'}</p>
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, fieldName)} />
      </label>

      {/* Media Library Picker */}
      {data.mediaLibrary && data.mediaLibrary.length > 0 && (
        <div className="mt-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
          <p className="text-[9px] font-bold text-gray-500 mb-2 uppercase tracking-widest flex items-center gap-1">
            <ImageIcon className="w-3 h-3" /> Pilih dari Galeri Tersimpan
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {data.mediaLibrary.map((url, i) => (
              <button 
                key={i} 
                onClick={(e) => { e.preventDefault(); updateData({ [fieldName as keyof typeof data]: url }); }}
                type="button" 
                className={`shrink-0 w-12 h-12 rounded-lg border-2 overflow-hidden transition-all ${value === url ? 'border-primary shadow-sm scale-105' : 'border-transparent hover:border-gray-300'}`}
              >
                <img src={url} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {helperText && <FieldHelper text={helperText} />}
    </div>
  );

  return (
    <div className="w-full h-full bg-white flex flex-col pointer-events-auto z-50">
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="flex flex-col">
          
          {/* Header Title */}
          <div className="p-6 bg-white">
            <h2 className="text-xl font-black text-[#8B2020] uppercase tracking-wide">{currentConfig.title}</h2>
            <p className="text-xs font-bold text-[#FD5E4B] mt-1 tracking-wide">{currentConfig.subtitle}</p>
          </div>
          
          <div className="px-6 pb-4">
             <span className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase flex items-center gap-2">
               <div className="w-1 h-1 rounded-full bg-[#FD5E4B]"></div> PENGATURAN KONTEN
             </span>
          </div>

          <div className="px-4 pb-12 flex flex-col gap-2">
            
            {/* Section 1: Cover */}
            {showSection('cover') && (
          <div className="bg-white">
            <AccordionHeader id="cover" targetId="home" icon={ImageIcon} title="1. Halaman Sampul" description="Foto depan & musik latar" />
            {activeSection === 'cover' && (
              <div className="p-5 flex flex-col gap-2 bg-gray-50/50 border-b border-gray-100">
                <ImageUploadField 
                  label="Foto Sampul (Amplop)" 
                  value={data.coverPhoto} 
                  fieldName="coverPhoto" 
                  helperText="Foto potret (berdiri) yang dilihat tamu saat pertama kali menerima link."
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Musik Latar (MP3 URL)</label>
                  <input type="text" value={data.musicUrl} onChange={(e) => updateData({ musicUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="https://..." />
                  <FieldHelper text="Musik akan diputar otomatis setelah tamu membuka undangan." />
                </div>
              </div>
            )}
          </div>
          )}

          {/* Section 2: Hero */}
          {showSection('hero') && (
          <div className="bg-white">
            <AccordionHeader id="hero" targetId="home" icon={Type} title="2. Beranda Utama (Hero)" description="Foto utama & nama mempelai" />
            {activeSection === 'hero' && (
              <div className="p-5 flex flex-col gap-2 bg-gray-50/50 border-b border-gray-100">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Panggilan Pria</label>
                    <input type="text" value={data.groomName} onChange={(e) => updateData({ groomName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Panggilan Wanita</label>
                    <input type="text" value={data.brideName} onChange={(e) => updateData({ brideName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Hashtag Pernikahan</label>
                  <div className="relative border border-gray-200 rounded-lg">
                    <Hash className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input type="text" value={data.hashtag} onChange={(e) => updateData({ hashtag: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white outline-none" />
                  </div>
                </div>
                <div className="mt-2">
                  <ImageUploadField 
                    label="Foto Hero (Latar Belakang)" 
                    value={data.heroPhoto} 
                    fieldName="heroPhoto" 
                    helperText="Foto potret (berdiri) yang menjadi latar belakang judul utama."
                  />
                </div>
              </div>
            )}
          </div>
          )}

          {/* Section 3: Quote */}
          {showSection('quote') && (
          <div className="bg-white">
            <AccordionHeader id="quote" targetId="romantic-quote" icon={Music} title="3. Kutipan (Quote)" description="Kata-kata mutiara / doa" />
            {activeSection === 'quote' && (
              <div className="p-5 flex flex-col gap-3 bg-gray-50/50 border-b border-gray-100">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Isi Kutipan</label>
                  <textarea value={data.quoteText} onChange={(e) => updateData({ quoteText: e.target.value })} rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Sumber / Penulis</label>
                  <input type="text" value={data.quoteAuthor} onChange={(e) => updateData({ quoteAuthor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" />
                </div>
              </div>
            )}
          </div>
          )}

          {/* Section 4: Profiles */}
          {showSection('profiles') && (
          <div className="bg-white">
            <AccordionHeader id="profiles" targetId="romantic-quote" icon={Users} title="4. Profil Mempelai" description="Foto individu & nama orang tua" />
            {activeSection === 'profiles' && (
              <div className="p-5 flex flex-col gap-4 bg-gray-50/50 border-b border-gray-100">
                {/* Groom Profile */}
                <div className="border border-gray-200 p-3 rounded-xl bg-white">
                  <h4 className="font-bold text-sm mb-3">Pihak Pria</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Nama Lengkap Pria</label>
                      <input type="text" value={data.groomFullName || ''} onChange={(e) => updateData({ groomFullName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Shin Ryujin" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Status Anak (Contoh: Putra Pertama dari)</label>
                      <input type="text" value={data.groomChildOrder || ''} onChange={(e) => updateData({ groomChildOrder: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Putra Pertama dari" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Nama Orang Tua</label>
                      <input type="text" value={data.groomParents || ''} onChange={(e) => updateData({ groomParents: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Bapak Budi & Ibu Ani" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Instagram (tanpa @)</label>
                      <input type="text" value={data.groomIg} onChange={(e) => updateData({ groomIg: e.target.value })}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs outline-none focus:border-primary" />
                    </div>
                    <div className="pt-2">
                      <ImageUploadField 
                        label="Foto Profil Pria" 
                        value={data.groomPhoto} 
                        fieldName="groomPhoto" 
                      />
                    </div>
                  </div>
                </div>

                {/* Bride Profile */}
                <div className="border border-gray-200 p-3 rounded-xl bg-white">
                  <h4 className="font-bold text-sm mb-3">Pihak Wanita</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Nama Lengkap Wanita</label>
                      <input type="text" value={data.brideFullName || ''} onChange={(e) => updateData({ brideFullName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Lena Kurnia" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Status Anak (Contoh: Putri Kedua dari)</label>
                      <input type="text" value={data.brideChildOrder || ''} onChange={(e) => updateData({ brideChildOrder: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Putri Kedua dari" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Nama Orang Tua</label>
                      <input type="text" value={data.brideParents || ''} onChange={(e) => updateData({ brideParents: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Bapak Joko & Ibu Siti" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Instagram (tanpa @)</label>
                      <input type="text" value={data.brideIg} onChange={(e) => updateData({ brideIg: e.target.value })}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs outline-none focus:border-primary" />
                    </div>
                    <div className="pt-2">
                      <ImageUploadField 
                        label="Foto Profil Wanita" 
                        value={data.bridePhoto} 
                        fieldName="bridePhoto" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          )}

          {/* Section 5: Love Story */}
          {showSection('loveStory') && (
          <div className="bg-white">
            <AccordionHeader id="loveStory" targetId="love-story" icon={Type} title="5. Kisah Cinta" description="Cerita pertemuan & foto kenangan" />
            {activeSection === 'loveStory' && (
              <div className="p-5 flex flex-col gap-4 bg-gray-50/50 border-b border-gray-100">
                {/* Part 1 */}
                <div className="border border-gray-200 p-3 rounded-xl bg-white space-y-3">
                  <h4 className="font-bold text-sm mb-1">Bagian 1</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Cerita 1</label>
                    <input type="text" value={data.loveStoryTitle1 || ''} onChange={(e) => updateData({ loveStoryTitle1: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="First Sight" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Isi Cerita 1</label>
                    <textarea value={data.loveStoryText || ''} onChange={(e) => updateData({ loveStoryText: e.target.value })} rows={4}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white resize-none" />
                  </div>
                  <div>
                    <ImageUploadField 
                      label="Foto Bagian 1" 
                      value={data.loveStoryPhoto1} 
                      fieldName="loveStoryPhoto1" 
                    />
                  </div>
                </div>

                {/* Part 2 */}
                <div className="border border-gray-200 p-3 rounded-xl bg-white space-y-3">
                  <h4 className="font-bold text-sm mb-1">Bagian 2</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Cerita 2</label>
                    <input type="text" value={data.loveStoryTitle2 || ''} onChange={(e) => updateData({ loveStoryTitle2: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="We're Forever" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Isi Cerita 2</label>
                    <textarea value={data.loveStoryText2 || ''} onChange={(e) => updateData({ loveStoryText2: e.target.value })} rows={4}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white resize-none" />
                  </div>
                  <div>
                    <ImageUploadField 
                      label="Foto Bagian 2" 
                      value={data.loveStoryPhoto2} 
                      fieldName="loveStoryPhoto2" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          )}

          {/* Section 6: Countdown */}
          {showSection('countdown') && (
          <div className="bg-white">
            <AccordionHeader id="countdown" targetId="love-story" icon={Clock} title="6. Hitung Mundur" description="Pengaturan jam untuk kalender" />
            {activeSection === 'countdown' && (
              <div className="p-5 flex flex-col gap-3 bg-gray-50/50 border-b border-gray-100">
                <FieldHelper text="Ini akan otomatis menghitung sisa hari menuju pernikahan dan digunakan untuk tombol 'Add to Calendar'." />
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal & Waktu Persis (Timestamp)</label>
                  <input 
                    type="datetime-local"
                    value={
                      data.weddingTimestamp 
                        ? new Date(data.weddingTimestamp - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
                        : new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
                    }
                    onChange={(e) => updateData({ weddingTimestamp: new Date(e.target.value).getTime() })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" 
                  />
                </div>
              </div>
            )}
          </div>
          )}

          {/* Section 7: Events */}
          {showSection('events') && (
          <div className="bg-white">
            <AccordionHeader id="events" targetId="wedding-events" icon={MapPin} title="7. Informasi Acara" description="Tanggal tulisan & lokasi Maps" />
            {activeSection === 'events' && (
              <div className="p-5 flex flex-col gap-3 bg-gray-50/50 border-b border-gray-100">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Utama Halaman (Contoh: The Wedding Day)</label>
                  <input type="text" value={data.eventMainTitle || ''} onChange={(e) => updateData({ eventMainTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="The Wedding Day" />
                </div>

                <div className="space-y-4">
                  {(data.events || []).map((ev, idx) => (
                    <div key={ev.id} className="border border-gray-200 p-3 rounded-xl bg-white space-y-3 relative group">
                      <button 
                        onClick={() => removeEvent(ev.id)}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      
                      <h4 className="font-bold text-sm mb-1">Acara {idx + 1}</h4>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 mb-1">Nama Acara</label>
                        <input type="text" value={ev.name} onChange={(e) => updateEvent(ev.id, { name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Akad Nikah / Resepsi" />
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-1">Tanggal</label>
                          <input type="date" value={ev.date} onChange={(e) => updateEvent(ev.id, { date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-gray-500 mb-1">Jam Mulai</label>
                            <input type="time" value={(ev.time || '').split(' - ')[0]?.trim() || ''} onChange={(e) => {
                              const end = (ev.time || '').split(' - ')[1]?.trim() || '';
                              updateEvent(ev.id, { time: e.target.value ? `${e.target.value} - ${end}` : end });
                            }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-gray-500 mb-1">Jam Selesai</label>
                            <input type="time" value={(ev.time || '').split(' - ')[1]?.trim() || ''} onChange={(e) => {
                              const start = (ev.time || '').split(' - ')[0]?.trim() || '';
                              updateEvent(ev.id, { time: e.target.value ? `${start} - ${e.target.value}` : start });
                            }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 mb-1">Label Lokasi (Gedung)</label>
                        <input type="text" value={ev.venueLabel} onChange={(e) => updateEvent(ev.id, { venueLabel: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Nama Gedung / Tempat" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 mb-1">Alamat Lengkap</label>
                        <textarea value={ev.venueAddress} onChange={(e) => updateEvent(ev.id, { venueAddress: e.target.value })} rows={2}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white resize-none" placeholder="Jl. Raya..." />
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => addEvent({ id: Date.now().toString(), name: 'Acara Baru', date: '', time: '', venueLabel: '', venueAddress: '' })}
                    className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 text-gray-500 rounded-lg py-2 hover:bg-gray-100 text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" /> Tambah Acara
                  </button>
                </div>
              </div>
            )}
          </div>
          )}

          {/* Section 8: Dresscode */}
          {showSection('dresscode') && (
          <div className="bg-white">
            <AccordionHeader id="dresscode" targetId="wedding-dresscode" icon={Palette} title="8. Panduan Busana (Dresscode)" description="Palet warna untuk tamu" />
            {activeSection === 'dresscode' && (
              <div className="p-5 flex flex-col gap-4 bg-gray-50/50 border-b border-gray-100">
                {/* Men Dresscode */}
                <div className="border border-gray-200 p-3 rounded-xl bg-white space-y-3">
                  <h4 className="font-bold text-sm mb-1">Pakaian Pria</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Pria</label>
                    <input type="text" value={data.dresscodeMenTitle || ''} onChange={(e) => updateData({ dresscodeMenTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Gentlemen" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Tema / Gaya</label>
                    <input type="text" value={data.dresscodeMenStyle || ''} onChange={(e) => updateData({ dresscodeMenStyle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Casual" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Keterangan Tambahan</label>
                    <textarea value={data.dresscodeMenDesc || ''} onChange={(e) => updateData({ dresscodeMenDesc: e.target.value })} rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white resize-none" placeholder="Collar shirt, neat trousers..." />
                  </div>
                </div>

                {/* Women Dresscode */}
                <div className="border border-gray-200 p-3 rounded-xl bg-white space-y-3">
                  <h4 className="font-bold text-sm mb-1">Pakaian Wanita</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Wanita</label>
                    <input type="text" value={data.dresscodeWomenTitle || ''} onChange={(e) => updateData({ dresscodeWomenTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Ladies" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Tema / Gaya</label>
                    <input type="text" value={data.dresscodeWomenStyle || ''} onChange={(e) => updateData({ dresscodeWomenStyle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Casual" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Keterangan Tambahan</label>
                    <textarea value={data.dresscodeWomenDesc || ''} onChange={(e) => updateData({ dresscodeWomenDesc: e.target.value })} rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white resize-none" placeholder="Flowing dresses, midi skirts..." />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-2">
                  <FieldHelper text="Pilih warna yang disarankan untuk dipakai oleh tamu undangan Anda." />
                  
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {(data.dresscodeColors || []).map((color, idx) => (
                      <div key={idx} className="flex flex-col gap-1 border border-gray-200 bg-white p-2 rounded-lg relative group">
                        <button 
                          onClick={() => {
                            const newColors = [...data.dresscodeColors];
                            newColors.splice(idx, 1);
                            updateData({ dresscodeColors: newColors });
                          }}
                          className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <input type="color" value={color} onChange={(e) => {
                          const newColors = [...data.dresscodeColors];
                          newColors[idx] = e.target.value;
                          updateData({ dresscodeColors: newColors });
                        }} className="w-full h-8 cursor-pointer rounded border border-gray-200" />
                        <input type="text" value={color} onChange={(e) => {
                          const newColors = [...data.dresscodeColors];
                          newColors[idx] = e.target.value;
                          updateData({ dresscodeColors: newColors });
                        }} className="w-full px-1 text-center font-mono text-[10px] uppercase border-none focus:ring-0" />
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => updateData({ dresscodeColors: [...(data.dresscodeColors || []), '#000000'] })}
                    className="w-full flex items-center justify-center gap-1 border border-dashed border-gray-300 text-gray-500 rounded-lg py-2 hover:bg-gray-100 text-xs font-semibold mt-3"
                  >
                    <Plus className="w-3 h-3" /> Tambah Warna
                  </button>
                </div>
              </div>
            )}
          </div>
          )}

          {/* Section 9: Rundown */}
          {showSection('rundown') && (
          <div className="bg-white">
            <AccordionHeader id="rundown" targetId="wedding-rundown" icon={Calendar} title="9. Rundown Acara" description="Akad, Pemberkatan, Resepsi" />
            {activeSection === 'rundown' && (
              <div className="p-5 flex flex-col gap-3 bg-gray-50/50 border-b border-gray-100">
                <FieldHelper text="Tambahkan rangkaian acara di hari-H. Urutan akan muncul dari atas ke bawah." />
                
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5 font-bold">Judul Halaman Rundown</label>
                  <input type="text" value={data.rundownTitle || ''} onChange={(e) => updateData({ rundownTitle: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs outline-none focus:border-primary mb-2" placeholder="Reception Rundown" />
                </div>

                <div className="space-y-4">
                  {(data.schedules || []).map((schedule) => (
                    <div key={schedule.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm relative group">
                      <button 
                        onClick={() => removeSchedule(schedule.id)}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-0.5">Nama Acara</label>
                          <input type="text" value={schedule.name} onChange={(e) => updateSchedule(schedule.id, { name: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-0.5">Waktu (Jam)</label>
                          <input type="text" value={schedule.time} onChange={(e) => updateSchedule(schedule.id, { time: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none focus:border-primary" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 mb-0.5">Deskripsi Singkat</label>
                        <input type="text" value={schedule.description} onChange={(e) => updateSchedule(schedule.id, { description: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none focus:border-primary" />
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => addSchedule({ id: Date.now().toString(), time: '09:00', name: 'Acara Baru', icon: 'event', description: 'Deskripsi' })}
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 text-gray-500 rounded-lg py-2 hover:bg-gray-100 text-sm font-semibold mt-2"
                >
                  <Plus className="w-4 h-4" /> Tambah Jadwal
                </button>
              </div>
            )}
          </div>
          )}

          {/* Section 10: Footage (Gallery) */}
          {showSection('footage') && (
          <div className="bg-white">
            <AccordionHeader id="footage" targetId="prewedding-footage" icon={Video} title="10. Galeri Foto (Footage)" description="Carousel / Album pre-wedding" />
            {activeSection === 'footage' && (
              <div className="p-5 flex flex-col gap-3 bg-gray-50/50 border-b border-gray-100">
                <FieldHelper text="Upload foto-foto momen Anda yang bisa digeser (slide) oleh tamu." />
                
                <div className="grid grid-cols-2 gap-3">
                  {(data.galleryPhotos || []).map((photo, idx) => (
                    <div key={idx} className="relative group border border-gray-200 rounded-lg overflow-hidden h-24 bg-gray-100">
                      <img src={photo} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full cursor-pointer transition-colors">
                          <Upload className="w-4 h-4 text-white" />
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'galleryPhotos', idx)} />
                        </label>
                        <button 
                          onClick={() => {
                            const newPhotos = [...data.galleryPhotos];
                            newPhotos.splice(idx, 1);
                            updateData({ galleryPhotos: newPhotos });
                          }}
                          className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Upload New Card */}
                  <label className={`border-2 border-dashed border-gray-300 rounded-lg h-24 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-primary hover:border-primary transition-colors cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-semibold">Tambah Foto</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'galleryPhotos_add')} />
                  </label>
                </div>

                {/* Gallery Specific Media Picker */}
                {data.mediaLibrary && data.mediaLibrary.length > 0 && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[9px] font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" /> Tambah dari Galeri Tersimpan
                    </p>
                    <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                      {data.mediaLibrary.map((url, i) => {
                        const isAdded = (data.galleryPhotos || []).includes(url);
                        return (
                          <button 
                            key={i} 
                            onClick={(e) => { 
                              e.preventDefault(); 
                              if (!isAdded) {
                                updateData({ galleryPhotos: [...(data.galleryPhotos || []), url] });
                              }
                            }}
                            type="button" 
                            className={`shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all relative ${isAdded ? 'border-gray-300 opacity-50 cursor-not-allowed' : 'border-transparent hover:border-primary shadow-sm hover:shadow'}`}
                          >
                            <img src={url} className="w-full h-full object-cover" />
                            {isAdded && <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[1px]"><Check className="w-6 h-6 text-white" /></div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          )}

          {/* Section 11: Gifts */}
          {showSection('gifts') && (
          <div className="bg-white">
            <AccordionHeader id="gifts" targetId="wedding-gifts" icon={Gift} title="11. Angpao Digital" description="Rekening bank & e-wallet" />
            {activeSection === 'gifts' && (
              <div className="p-5 flex flex-col gap-4 bg-gray-50/50 border-b border-gray-100">
                <FieldHelper text="Informasi rekening agar tamu dapat menyalin nomor dan mengirim hadiah." />
                
                <div className="space-y-4">
                  {(data.banks || []).map((bank) => (
                    <div key={bank.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm relative group">
                      <button 
                        onClick={() => removeBank(bank.id)}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-0.5">Nama Bank / E-Wallet</label>
                          <input type="text" value={bank.bank} onChange={(e) => updateBank(bank.id, { bank: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-0.5">Nomor Rekening</label>
                          <input type="text" value={bank.number} onChange={(e) => updateBank(bank.id, { number: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none focus:border-primary font-mono" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-0.5">Atas Nama</label>
                          <input type="text" value={bank.name} onChange={(e) => updateBank(bank.id, { name: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none focus:border-primary" />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => addBank({ id: Date.now().toString(), bank: 'BCA', name: 'Atas Nama', number: '000000000' })}
                    className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 text-gray-500 rounded-lg py-2 hover:bg-gray-100 text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" /> Tambah Rekening
                  </button>
                </div>
              </div>
            )}
          </div>
          )}
          </div>

        </div>
      </div>
      
      {/* Footer Backup Data */}
      <div className="p-4 border-t border-gray-200 bg-white shrink-0">
        <button 
          onClick={() => {
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'invitation-data-backup.json';
            a.click();
          }}
          className="w-full py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
        >
          Download Backup Data (JSON)
        </button>
      </div>
    </div>
  );
};
