import { useState, useEffect } from 'react';
import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router';
import { Clock, Users, UserCheck, UserX, ScanLine, ArrowLeft, Bell, Settings, Plus, Share2, Trash2, Download, X, Edit3, ExternalLink } from 'lucide-react';
import { fetchProject, fetchRsvps, updateProjectGuests, checkInGuest } from '../lib/serverFns';

export const Route = createFileRoute('/dashboard_/$projectId')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' });
  },
  loader: async ({ params }) => {
    const project = await fetchProject({ data: params.projectId });
    const rsvps = await fetchRsvps({ data: params.projectId });
    return { project, rsvps };
  },
  component: ProjectDashboard,
});

function ProjectDashboard() {
  const { project, rsvps } = Route.useLoaderData();
  const data = typeof project.data === 'string' ? JSON.parse(project.data) : project.data;
  
  const groomName = data.groomName || 'GROOM';
  const brideName = data.brideName || 'BRIDE';
  
  const totalRsvp = rsvps.length;
  const hadir = rsvps.filter((r: any) => r.attendance === 'yes').length;
  const berhalangan = rsvps.filter((r: any) => r.attendance === 'no').length;
  const totalGuests = rsvps.reduce((acc: number, r: any) => acc + (r.guestsCount || 0), 0);

  const [activeTab, setActiveTab] = useState('overview');
  const [inputMode, setInputMode] = useState<'single' | 'bulk' | 'template'>('single');
  const [bulkInput, setBulkInput] = useState('');
  const [singleName, setSingleName] = useState('');
  const [singlePhone, setSinglePhone] = useState('');
  
  const defaultTemplate = `Yth. [Nama Tamu],\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara pernikahan kami.\n\nDetail acara dan RSVP dapat dilihat melalui tautan berikut:\nhttps://${import.meta.env.VITE_APP_DOMAIN || 'localhost:3000'}/${project.slug}?to=[Link Tamu]\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia kami.\n\nTerima kasih.`;
  const [waTemplate, setWaTemplate] = useState(data.waTemplate || defaultTemplate);
  const [guests, setGuests] = useState<{name: string, phone: string, category?: string}[]>(data.guestList || []);
  const [singleCategory, setSingleCategory] = useState('Teman');
  const [isSaving, setIsSaving] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<{name?: string, status: 'idle' | 'success' | 'error' | 'loading', message?: string}>({status: 'idle'});
  const navigate = useNavigate();

  const handleBulkAdd = () => {
    if (!bulkInput.trim()) return;
    const lines = bulkInput.split('\n');
    const newGuests = lines.map(line => {
      // Split by comma
      const parts = line.split(',');
      const name = parts[0]?.trim();
      let phone = parts.length > 1 ? parts[1]?.trim() : '';
      let category = parts.length > 2 ? parts[2]?.trim() : 'Lainnya';
      
      // format phone to 62 if starts with 0
      if (phone && phone.startsWith('0')) {
        phone = '62' + phone.substring(1);
      }
      
      if (!name) return null;
      return { name, phone, category };
    }).filter(Boolean) as {name: string, phone: string, category?: string}[];

    const updated = [...guests, ...newGuests];
    setGuests(updated);
    setBulkInput('');
    saveGuests(updated);
  };

  const handleSingleAdd = () => {
    if (!singleName.trim()) return;
    let phone = singlePhone.trim();
    if (phone && phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    }
    const updated = [...guests, { name: singleName.trim(), phone, category: singleCategory }];
    setGuests(updated);
    setSingleName('');
    setSinglePhone('');
    saveGuests(updated, waTemplate);
  };

  const saveTemplate = () => {
    saveGuests(guests, waTemplate);
    alert('Template saved successfully!');
  };

  const removeGuest = (index: number) => {
    const updated = guests.filter((_, i) => i !== index);
    setGuests(updated);
    saveGuests(updated, waTemplate);
  };

  const saveGuests = async (updatedList: any[], template: string) => {
    setIsSaving(true);
    try {
      await updateProjectGuests({ data: { id: project.id, guests: updatedList, waTemplate: template } });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadCSV = () => {
    if (rsvps.length === 0) return;
    
    const headers = ['Guest Name', 'Attendance', 'Guests Count', 'Message', 'Date'];
    const rows = rsvps.map((r: any) => [
      `"${r.guestName.replace(/"/g, '""')}"`,
      r.attendance,
      r.guestsCount,
      `"${(r.wishMessage || '').replace(/"/g, '""')}"`,
      new Date(r.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RSVP_${project.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">


      {/* Main Content Area */}
      <main className="flex-1 max-w-[1100px] mx-auto w-full px-4 md:px-8 py-6 md:py-10 overflow-x-hidden">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold text-[#FD5E4B] hover:text-[#E54835] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <img src="/baswara-logo.svg" alt="Baswara" className="h-5 md:h-6 opacity-40 hover:opacity-100 transition-opacity" />
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8 md:pb-10 mb-8 md:mb-10">
          <div>
            <div className="inline-block px-3 py-1 bg-red-50 text-[#FD5E4B] text-[10px] font-black tracking-widest uppercase rounded-full mb-4">
              WEDDING
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase mb-2">
              {groomName} &amp; {brideName}
            </h1>
            <p className="text-gray-600 text-sm font-medium">
              Manage guest list, RSVPs, and digital check-in for your event.
            </p>
          </div>
          <button 
            onClick={() => setIsScannerOpen(true)}
            className="flex w-full md:w-auto justify-center items-center gap-2 bg-[#FD5E4B] hover:bg-[#E54835] text-white px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-[0_4px_14px_rgba(253,94,75,0.3)] transition-all hover:-translate-y-0.5"
          >
            <ScanLine className="w-5 h-5" /> CHECK-IN GUEST
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-6 md:gap-8 border-b border-gray-100 mb-8 md:mb-10 overflow-x-auto whitespace-nowrap hide-scrollbar pb-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'overview' ? 'text-[#FD5E4B]' : 'text-gray-400 hover:text-gray-900'}`}
          >
            Overview
            {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FD5E4B] rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('guests')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'guests' ? 'text-[#FD5E4B]' : 'text-gray-400 hover:text-gray-900'}`}
          >
            Guest List
            {activeTab === 'guests' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FD5E4B] rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('rsvp')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'rsvp' ? 'text-[#FD5E4B]' : 'text-gray-400 hover:text-gray-900'}`}
          >
            RSVP Data
            {activeTab === 'rsvp' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FD5E4B] rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('guestbook')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'guestbook' ? 'text-[#FD5E4B]' : 'text-gray-400 hover:text-gray-900'}`}
          >
            Guest Book
            {activeTab === 'guestbook' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FD5E4B] rounded-t-full"></div>}
          </button>
        </div>

        {/* Stats Section (Overview Tab) */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6 mb-10">
            {/* Quick Actions */}
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => {
                  const url = `${window.location.origin}/${project.slug}`;
                  navigator.clipboard.writeText(url);
                  alert('Link undangan berhasil disalin ke clipboard!');
                }}
                className="flex-1 bg-[#111111] text-white hover:bg-black transition-colors p-5 rounded-3xl flex items-center justify-center gap-3 font-bold text-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 duration-300"
              >
                <Share2 className="w-5 h-5" />
                SHARE INVITATION
              </button>
              <Link 
                to="/builder"
                className="flex-1 bg-[#fcfcfc] border border-gray-100 hover:bg-gray-50 transition-colors p-5 rounded-3xl flex items-center justify-center gap-3 font-bold text-sm text-gray-700 shadow-sm hover:-translate-y-1 duration-300"
              >
                <Edit3 className="w-5 h-5" />
                EDIT INVITATION
              </Link>
              <a 
                href={`/${project.slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-[#fcfcfc] border border-gray-100 hover:bg-[#fff5f4] hover:border-[#FD5E4B]/20 transition-colors p-5 rounded-3xl flex items-center justify-center gap-3 font-bold text-sm text-[#FD5E4B] shadow-sm hover:-translate-y-1 duration-300"
              >
                <ExternalLink className="w-5 h-5" />
                VIEW INVITATION
              </a>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat 1 */}
              <div className="bg-[#fcfcfc] border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">TOTAL RSVP</span>
                  <div className="w-8 h-8 rounded-full bg-red-50 text-[#FD5E4B] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-4xl font-black text-gray-900">{totalRsvp}</div>
              </div>
              
              {/* Stat 2 */}
              <div className="bg-[#fcfcfc] border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">TOTAL GUESTS</span>
                  <div className="w-8 h-8 rounded-full bg-red-50 text-[#FD5E4B] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-4xl font-black text-gray-900">{totalGuests}</div>
              </div>

              {/* Stat 3 */}
              <div className="bg-[#fcfcfc] border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">HADIR</span>
                  <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-4xl font-black text-gray-900">{hadir}</div>
              </div>

              {/* Stat 4 */}
              <div className="bg-[#fcfcfc] border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">BERHALANGAN</span>
                  <div className="w-8 h-8 rounded-full bg-red-50 text-[#FD5E4B] flex items-center justify-center">
                    <UserX className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-4xl font-black text-gray-900">{berhalangan}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#fcfcfc] border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Attendance Rate</h3>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-5xl font-black text-gray-900 leading-none">{totalRsvp > 0 ? Math.round((hadir/totalRsvp)*100) : 0}%</span>
                  <span className="text-xs font-bold text-gray-400 uppercase pb-1 tracking-wider">of RSVPs are attending</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-[#FD5E4B] h-3 rounded-full transition-all duration-1000" style={{ width: `${totalRsvp > 0 ? (hadir/totalRsvp)*100 : 0}%` }}></div>
                </div>
              </div>

              <div className="bg-[#fcfcfc] border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Live Check-in Progress</h3>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-5xl font-black text-green-500 leading-none">{Object.keys(data.checkIns || {}).length}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase pb-1 tracking-wider">/ {hadir} Guests Arrived</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-green-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${hadir > 0 ? (Object.keys(data.checkIns || {}).length / hadir) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guest List Tab */}
        {activeTab === 'guests' && (
          <div className="bg-[#fcfcfc] border border-gray-100 rounded-3xl p-8 mb-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase mb-1">Guest Invitations</h2>
              <p className="text-sm text-gray-500 font-medium">Manage your guest list and WhatsApp templates.</p>
            </div>
            {isSaving && <span className="text-xs font-bold text-gray-400">Saving...</span>}
          </div>

          {/* Sub-tabs for input mode */}
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit mb-8">
            <button 
              onClick={() => setInputMode('single')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${inputMode === 'single' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Add 1 Guest
            </button>
            <button 
              onClick={() => setInputMode('bulk')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${inputMode === 'bulk' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Bulk Import
            </button>
            <button 
              onClick={() => setInputMode('template')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${inputMode === 'template' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              WA Template
            </button>
          </div>
          
          {inputMode === 'single' && (
            <div className="mb-10 grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white p-5 border border-gray-100 rounded-2xl shadow-sm">
              <div>
                <label className="block text-xs font-black text-gray-400 tracking-widest uppercase mb-2">Guest Name</label>
                <input 
                  type="text" 
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  placeholder="e.g. Bapak Budi & Keluarga"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:border-[#FD5E4B] focus:ring-1 focus:ring-[#FD5E4B] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 tracking-widest uppercase mb-2">Phone Number</label>
                <input 
                  type="text" 
                  value={singlePhone}
                  onChange={(e) => setSinglePhone(e.target.value)}
                  placeholder="e.g. 08123456789"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:border-[#FD5E4B] focus:ring-1 focus:ring-[#FD5E4B] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 tracking-widest uppercase mb-2">Status</label>
                <select 
                  value={singleCategory}
                  onChange={(e) => setSingleCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:border-[#FD5E4B] focus:ring-1 focus:ring-[#FD5E4B] outline-none bg-white"
                >
                  <option value="Teman">Teman</option>
                  <option value="Saudara">Saudara</option>
                  <option value="Kolega">Kolega</option>
                  <option value="Keluarga VIP">Keluarga VIP</option>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <button 
                onClick={handleSingleAdd}
                disabled={!singleName.trim()}
                className="w-full py-2.5 bg-[#FD5E4B] hover:bg-[#E54835] text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-50 shadow-sm"
              >
                Add to List
              </button>
            </div>
          )}

          {inputMode === 'bulk' && (
            <div className="mb-10 bg-white p-5 border border-gray-100 rounded-2xl shadow-sm">
              <p className="text-xs text-gray-500 font-medium mb-3">Paste multiple guests. Format: <code>Name, Phone Number, Status</code></p>
              <textarea 
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="Bapak Budi, 08123456789, Kolega&#10;Keluarga Andi, 08987654321, Saudara"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:border-[#FD5E4B] focus:ring-1 focus:ring-[#FD5E4B] outline-none resize-none mb-3"
              />
              <button 
                onClick={handleBulkAdd}
                disabled={!bulkInput.trim()}
                className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-xs tracking-widest uppercase rounded-xl transition-colors disabled:opacity-50"
              >
                Import Guests
              </button>
            </div>
          )}

          {inputMode === 'template' && (
            <div className="mb-10 bg-white p-5 border border-gray-100 rounded-2xl shadow-sm">
              <p className="text-xs text-gray-500 font-medium mb-3">Customize the WhatsApp message. Use <code>[Nama Tamu]</code> and <code>[Link Tamu]</code> as placeholders.</p>
              <textarea 
                value={waTemplate}
                onChange={(e) => setWaTemplate(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:border-[#FD5E4B] focus:ring-1 focus:ring-[#FD5E4B] outline-none resize-none mb-3"
              />
              <button 
                onClick={saveTemplate}
                className="px-5 py-2.5 bg-[#FD5E4B] hover:bg-[#E54835] text-white font-bold text-xs tracking-widest uppercase rounded-xl transition-colors shadow-sm"
              >
                Save Template
              </button>
            </div>
          )}

          {guests.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-x-auto shadow-sm">
              <table className="w-full text-left text-sm text-gray-600 min-w-[800px]">
                <thead className="bg-gray-50 text-[10px] uppercase font-black tracking-widest text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Guest Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Phone Number</th>
                    <th className="px-6 py-4">RSVP</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {guests.map((g, index) => {
                    const personalizedMessage = waTemplate
                      .replace(/\[Nama Tamu\]/g, g.name)
                      .replace(/\[Link Tamu\]/g, encodeURIComponent(g.name));
                    
                    const waLink = g.phone ? `https://wa.me/${g.phone}?text=${encodeURIComponent(personalizedMessage)}` : `https://wa.me/?text=${encodeURIComponent(personalizedMessage)}`;
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{g.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {g.category || 'Lainnya'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-medium">{g.phone || '-'}</td>
                        <td className="px-6 py-4">
                          {(() => {
                            const rsvp = rsvps.find((r: any) => r.guestName.toLowerCase() === g.name.toLowerCase());
                            const isCheckedIn = !!data.checkIns?.[g.name];
                            
                            if (isCheckedIn) return <span className="px-2.5 py-1 bg-green-500 text-white border border-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Checked In</span>;
                            if (!rsvp) return <span className="px-2.5 py-1 bg-gray-50 text-gray-400 border border-gray-200 rounded-full text-[10px] font-bold uppercase tracking-wider">Menunggu</span>;
                            if (rsvp.attendance === 'yes') return <span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-[10px] font-bold uppercase tracking-wider">Hadir ({rsvp.guestsCount} org)</span>;
                            return <span className="px-2.5 py-1 bg-red-50 text-red-500 border border-red-100 rounded-full text-[10px] font-bold uppercase tracking-wider">Berhalangan</span>;
                          })()}
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end items-center gap-2">
                          <a 
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 font-bold text-xs rounded-lg transition-colors"
                          >
                            <Share2 className="w-3.5 h-3.5" /> Send WA
                          </a>
                          <button 
                            onClick={() => removeGuest(index)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          </div>
        )}

        {/* RSVP List Section (RSVP Tab) */}
        {activeTab === 'rsvp' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase mb-1">RSVP Data</h2>
                <p className="text-sm text-gray-500 font-medium">Guest attendance confirmations.</p>
              </div>
              <button 
                onClick={handleDownloadCSV}
                disabled={rsvps.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-[#FD5E4B] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#E54835] transition-colors disabled:opacity-50 shadow-sm"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
            {rsvps.length === 0 ? (
              <div className="w-full h-48 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center bg-gray-50/50">
                <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">NO RSVPS YET</span>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-3xl overflow-x-auto shadow-sm">
                <table className="w-full text-left text-sm text-gray-600 min-w-[700px]">
                  <thead className="bg-gray-50 text-[10px] uppercase font-black tracking-widest text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4">Guest Name</th>
                      <th className="px-6 py-4 text-center">Attendance</th>
                      <th className="px-6 py-4 text-center">Guests</th>
                      <th className="px-6 py-4">Message</th>
                      <th className="px-6 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rsvps.map((r: any) => (
                      <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{r.guestName}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${r.attendance === 'yes' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {r.attendance}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold">{r.guestsCount}</td>
                        <td className="px-6 py-4 max-w-[300px] truncate text-gray-500" title={r.wishMessage}>{r.wishMessage || '-'}</td>
                        <td className="px-6 py-4 text-right text-xs text-gray-400 font-medium">{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Guest Book Section */}
        {activeTab === 'guestbook' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase mb-1">Guest Book</h2>
                <p className="text-sm font-medium text-gray-500">Live attendance log of guests who have checked in.</p>
              </div>
            </div>
            
            {(!data.checkIns || Object.keys(data.checkIns).length === 0) ? (
              <div className="bg-[#fcfcfc] border border-gray-100 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <UserCheck className="w-6 h-6 text-gray-300" />
                </div>
                <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">No Guests Checked In Yet</span>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="bg-gray-50/80 text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Guest Name</th>
                      <th className="px-6 py-4">Check-in Time</th>
                      <th className="px-6 py-4">Message / Wish</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Object.entries(data.checkIns || {}).sort((a: any, b: any) => new Date(b[1]).getTime() - new Date(a[1]).getTime()).map(([name, timestamp]: [string, any]) => {
                      const rsvp = rsvps.find((r: any) => r.guestName.toLowerCase() === name.toLowerCase());
                      return (
                        <tr key={name} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {name}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-600">
                            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </td>
                          <td className="px-6 py-4 max-w-[300px] text-gray-500 italic">
                            {rsvp?.wishMessage ? `"${rsvp.wishMessage}"` : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

      </main>
      
      <QRScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        projectId={project.id} 
        rsvps={rsvps} 
      />
    </div>
  );
}

const QRScannerModal = ({ isOpen, onClose, projectId, rsvps }: { isOpen: boolean, onClose: () => void, projectId: string, rsvps: any[] }) => {
  const [status, setStatus] = useState<{name?: string, type: 'idle' | 'success' | 'error' | 'loading', message?: string}>({type: 'idle'});
  const [ScannerComp, setScannerComp] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      import('@yudiel/react-qr-scanner').then((module) => {
        setScannerComp(() => module.Scanner);
      }).catch(err => console.error("Failed to load scanner", err));
    }
  }, [isOpen]);

  const handleScan = async (result: any) => {
    if (status.type !== 'idle') return; // prevent multiple scans
    
    // @yudiel/react-qr-scanner v2+ returns an array of objects
    const decodedText = Array.isArray(result) && result.length > 0 ? result[0].rawValue : result;
    
    if (typeof decodedText === 'string' && decodedText.startsWith('CHECKIN:')) {
       const guest = decodedText.replace('CHECKIN:', '');
       const rsvp = rsvps.find(r => r.guestName.toLowerCase() === guest.toLowerCase());
       
       setStatus({ type: 'loading', name: guest });
       
       try {
         await checkInGuest({ data: { id: projectId, guestName: guest } });
         setStatus({ type: 'success', name: guest, message: rsvp ? `Guests: ${rsvp.guestsCount}` : 'Registered Guest' });
         setTimeout(() => {
           window.location.reload();
         }, 2000);
       } catch (e: any) {
         setStatus({ type: 'error', name: guest, message: e.message });
       }
    } else {
       setStatus({ type: 'error', message: 'Invalid QR Code' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 z-10"><X className="w-5 h-5"/></button>
        <div className="p-6 text-center border-b border-gray-100 sticky top-0 bg-white z-0">
           <h3 className="font-bold text-lg uppercase tracking-wider">Scan Ticket</h3>
        </div>
        <div className="p-6 bg-gray-50 flex flex-col items-center">
          {status.type === 'idle' && (
            <div className="w-full bg-black rounded-xl overflow-hidden shadow-inner aspect-square max-w-[300px]">
              {ScannerComp ? (
                <ScannerComp 
                  onScan={handleScan}
                  onError={(error: any) => console.log(error?.message)}
                  options={{ delayBetweenScanSuccess: 2000, delayBetweenScanAttempts: 300 }}
                  styles={{ container: { width: '100%', height: '100%' }, video: { objectFit: 'cover' } }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xs">Loading Camera...</div>
              )}
            </div>
          )}
          {status.type === 'loading' && <div className="py-12 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">Checking in {status.name}...</div>}
          {status.type === 'success' && (
             <div className="py-10 text-center">
               <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <ScanLine className="w-8 h-8" />
               </div>
               <h4 className="text-xl font-bold text-gray-900 mb-1">{status.name}</h4>
               <p className="text-green-600 font-bold uppercase tracking-widest text-xs mb-4">Checked In Successfully</p>
               <p className="text-gray-500 text-sm font-medium">{status.message}</p>
             </div>
          )}
          {status.type === 'error' && (
             <div className="py-10 text-center">
               <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <X className="w-8 h-8" />
               </div>
               <h4 className="text-xl font-bold text-gray-900 mb-1">{status.name || 'Error'}</h4>
               <p className="text-red-500 font-bold uppercase tracking-widest text-xs mb-4">Check-in Failed</p>
               <p className="text-gray-500 text-sm font-medium">{status.message}</p>
               <button onClick={() => { setStatus({type: 'idle'}); }} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold uppercase">Try Again</button>
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
