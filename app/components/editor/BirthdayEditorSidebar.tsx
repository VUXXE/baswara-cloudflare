import { useState, useEffect } from 'react';
import { useInvitationStore } from '../../store/useInvitationStore';
import { Type, Music, Calendar, MapPin, ChevronDown, ChevronUp, Gift, Upload, Plus, Trash2, Info, Image as ImageIcon, Clock, Palette, Video } from 'lucide-react';
import { createSupabaseClient } from '../../lib/supabase/client';

export const BirthdayEditorSidebar = ({ activeMenu = 'COVER' }: { activeMenu?: string }) => {
  const { data, updateData, updateEvent, addEvent, removeEvent, updateBank, addBank, removeBank, setInvitationOpen } = useInvitationStore();
  const [activeSection, setActiveSection] = useState<string>('cover');
  const [uploading, setUploading] = useState(false);

  const menuConfig: Record<string, { title: string, subtitle: string, sections: string[] }> = {
    COVER: { title: 'Halaman Sampul', subtitle: 'Foto depan & musik latar', sections: ['cover'] },
    HERO: { title: 'Beranda Utama', subtitle: 'Nama, Umur, & Foto', sections: ['hero'] },
    EVENTS: { title: 'Informasi Acara', subtitle: 'Waktu, Lokasi & Hitung Mundur', sections: ['events'] },
    DRESSCODE: { title: 'Panduan Busana', subtitle: 'Dresscode & Palet warna', sections: ['dresscode'] },
    GALLERY: { title: 'Galeri Foto', subtitle: 'Foto-foto memori', sections: ['footage'] },
    QUOTE: { title: 'Harapan & Doa', subtitle: 'Kutipan ulang tahun', sections: ['quote'] },
    GIFTS: { title: 'Kado & Angpao', subtitle: 'Alamat & Rekening', sections: ['gifts'] },
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
    } else {
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
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to upload.');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('invitation-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('invitation-assets')
        .getPublicUrl(filePath);

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
        className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all ${isActive ? 'bg-[#C98886]/10 border border-[#C98886]/20 text-[#5C4342]' : 'bg-gray-50/80 hover:bg-gray-100 text-gray-800 border border-transparent'}`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isActive ? 'bg-white text-[#C98886] shadow-sm' : 'bg-white text-gray-400 shadow-sm'}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-black tracking-wider">{title.replace(/^\d+\.\s*/, '')}</div>
          </div>
        </div>
        {isActive ? <ChevronUp className="w-4 h-4 text-[#C98886]" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
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
          
          <div className="p-6 bg-white">
            <h2 className="text-xl font-black text-[#5C4342] uppercase tracking-wide">{currentConfig.title}</h2>
            <p className="text-xs font-bold text-[#C98886] mt-1 tracking-wide">{currentConfig.subtitle}</p>
          </div>
          
          <div className="px-6 pb-4">
             <span className="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase flex items-center gap-2">
               <div className="w-1 h-1 rounded-full bg-[#C98886]"></div> PENGATURAN ULANG TAHUN
             </span>
          </div>

          <div className="px-4 pb-12 flex flex-col gap-2">
            
            {showSection('cover') && (
            <div className="bg-white">
              <AccordionHeader id="cover" targetId="home" icon={ImageIcon} title="Halaman Sampul" description="Foto depan & musik latar" />
              {activeSection === 'cover' && (
                <div className="p-5 flex flex-col gap-2 bg-gray-50/50 border-b border-gray-100">
                  <ImageUploadField 
                    label="Foto Sampul (Amplop)" 
                    value={data.coverPhoto} 
                    fieldName="coverPhoto" 
                    helperText="Foto potret (berdiri) yang dilihat tamu saat pertama kali menerima undangan ulang tahun."
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

            {showSection('hero') && (
            <div className="bg-white">
              <AccordionHeader id="hero" targetId="home" icon={Type} title="Beranda Utama (Hero)" description="Nama & Foto" />
              {activeSection === 'hero' && (
                <div className="p-5 flex flex-col gap-3 bg-gray-50/50 border-b border-gray-100">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Panggilan</label>
                    <input type="text" value={data.birthdayName || ''} onChange={(e) => updateData({ birthdayName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Aurelia" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Perayaan Ke- (Umur)</label>
                    <input type="text" value={data.birthdayAge || ''} onChange={(e) => updateData({ birthdayAge: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="23rd" />
                  </div>
                  <div className="mt-2">
                    <ImageUploadField 
                      label="Foto Hero (Latar Belakang Utama)" 
                      value={data.heroPhoto} 
                      fieldName="heroPhoto" 
                      helperText="Foto potret (berdiri) yang akan terlihat besar di bagian depan acara ulang tahun."
                    />
                  </div>
                </div>
              )}
            </div>
            )}

            {showSection('events') && (
            <div className="bg-white">
              <AccordionHeader id="events" targetId="events" icon={Calendar} title="Informasi Acara" description="Jadwal & Lokasi" />
              {activeSection === 'events' && (
                <div className="p-5 flex flex-col gap-3 bg-gray-50/50 border-b border-gray-100">
                  <FieldHelper text="Tentukan kapan dan di mana acara perayaan ulang tahun ini akan diadakan." />
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Hitung Mundur (Tanggal Pasti)</label>
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

                  <div className="space-y-4 mt-2">
                    {(data.events || []).slice(0, 1).map((ev) => (
                      <div key={ev.id} className="border border-gray-200 p-3 rounded-xl bg-white space-y-3 relative">
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-1">Hari & Tanggal</label>
                          <input type="text" value={ev.date || ''} onChange={(e) => updateEvent(ev.id, { date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Saturday, 22 Aug 2026" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-1">Waktu (Jam Mulai - Selesai)</label>
                          <input type="text" value={ev.time || ''} onChange={(e) => updateEvent(ev.id, { time: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="19:00 PM - End" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-1">Nama Tempat / Gedung</label>
                          <input type="text" value={ev.venueLabel || ''} onChange={(e) => updateEvent(ev.id, { venueLabel: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="The Ritz Carlton" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-1">Alamat Lengkap Tempat</label>
                          <textarea value={ev.venueAddress || ''} onChange={(e) => updateEvent(ev.id, { venueAddress: e.target.value })} rows={2}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white resize-none" placeholder="Jl. Raya..." />
                        </div>
                      </div>
                    ))}
                    {(!data.events || data.events.length === 0) && (
                      <button 
                        onClick={() => addEvent({ id: Date.now().toString(), name: 'Birthday Party', date: '', time: '', venueLabel: '', venueAddress: '' })}
                        className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 text-gray-500 rounded-lg py-2 hover:bg-gray-100 text-sm font-semibold"
                      >
                        <Plus className="w-4 h-4" /> Tambah Info Acara
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            )}

            {showSection('dresscode') && (
            <div className="bg-white">
              <AccordionHeader id="dresscode" targetId="dresscode" icon={Palette} title="Panduan Busana" description="Dresscode acara" />
              {activeSection === 'dresscode' && (
                <div className="p-5 flex flex-col gap-4 bg-gray-50/50 border-b border-gray-100">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Tema Pakaian / Dresscode</label>
                    <input type="text" value={data.dresscodeMenStyle || ''} onChange={(e) => {
                        updateData({ dresscodeMenStyle: e.target.value, dresscodeWomenStyle: e.target.value });
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="White & Beige, Casual" />
                    <FieldHelper text="Tuliskan panduan busana umum untuk tamu." />
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <FieldHelper text="Pilih palet warna (opsional) yang disarankan." />
                    
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

            {showSection('footage') && (
            <div className="bg-white">
              <AccordionHeader id="footage" targetId="gallery" icon={Video} title="Galeri Foto" description="Momen berharga" />
              {activeSection === 'footage' && (
                <div className="p-5 flex flex-col gap-3 bg-gray-50/50 border-b border-gray-100">
                  <FieldHelper text="Upload foto-foto perayaan, masa kecil, atau memori indah lainnya." />
                  
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
                    
                    <label className={`border-2 border-dashed border-gray-300 rounded-lg h-24 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-primary hover:border-primary transition-colors cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Plus className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-semibold">Tambah Foto</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'galleryPhotos_add')} />
                    </label>
                  </div>
                </div>
              )}
            </div>
            )}

            {showSection('quote') && (
            <div className="bg-white">
              <AccordionHeader id="quote" targetId="quote" icon={Music} title="Harapan & Doa" description="Kata-kata atau ucapan syukur" />
              {activeSection === 'quote' && (
                <div className="p-5 flex flex-col gap-3 bg-gray-50/50 border-b border-gray-100">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Isi Pesan/Kutipan</label>
                    <textarea value={data.quoteText} onChange={(e) => updateData({ quoteText: e.target.value })} rows={4}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white resize-none" placeholder="Thank you for being part of my journey..." />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Tertanda (Penulis)</label>
                    <input type="text" value={data.quoteAuthor} onChange={(e) => updateData({ quoteAuthor: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Aurelia" />
                  </div>
                </div>
              )}
            </div>
            )}

            {showSection('gifts') && (
            <div className="bg-white">
              <AccordionHeader id="gifts" targetId="gifts" icon={Gift} title="Kado & Angpao" description="Penerimaan hadiah" />
              {activeSection === 'gifts' && (
                <div className="p-5 flex flex-col gap-4 bg-gray-50/50 border-b border-gray-100">
                  <FieldHelper text="Bagi tamu yang ingin memberikan hadiah atau dana ulang tahun secara digital." />
                  
                  <div className="space-y-4">
                    {(data.banks || []).map((bank) => (
                      <div key={bank.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm relative group">
                        <button 
                          onClick={() => removeBank(bank.id)}
                          className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        
                        <div className="space-y-2">
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">Nama Bank / Dompet Digital</label>
                            <input type="text" value={bank.bank} onChange={(e) => updateBank(bank.id, { bank: e.target.value })}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs outline-none focus:border-primary" placeholder="BCA / OVO" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">Nomor Rekening / HP</label>
                            <input type="text" value={bank.number} onChange={(e) => updateBank(bank.id, { number: e.target.value })}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs outline-none focus:border-primary" placeholder="123456789" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-0.5">Nama Pemilik</label>
                            <input type="text" value={bank.name} onChange={(e) => updateBank(bank.id, { name: e.target.value })}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs outline-none focus:border-primary" placeholder="Aurelia" />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => addBank({ id: Date.now().toString(), bank: 'BCA', name: 'Aurelia', number: '123456' })}
                      className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 text-gray-500 rounded-lg py-2.5 hover:bg-gray-100 text-sm font-semibold"
                    >
                      <Plus className="w-4 h-4" /> Tambah Rekening / Dompet
                    </button>
                  </div>
                </div>
              )}
            </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};
