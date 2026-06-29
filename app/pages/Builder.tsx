import { useState, useEffect } from 'react';
import { EditorSidebar } from '../components/editor/EditorSidebar';
import { BirthdayEditorSidebar } from '../components/editor/BirthdayEditorSidebar';
import { Preview } from './Preview';
import {
  Users, Save,
  ArrowLeft, Globe, Monitor, Smartphone,
  BookOpen, Palette, Image as ImageIcon,
  Type, Music, MapPin, Gift, Video, Copy, ExternalLink, LayoutTemplate, Calendar
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useInvitationStore } from '../store/useInvitationStore';
import { createSupabaseClient } from '../lib/supabase/client';
import { saveInvitationData } from '../routes/builder';

export default function BuilderPage({ initialData, slug, initialRsvps = [], projectId }: { initialData?: any, slug?: string, initialRsvps?: any[], projectId?: string }) {
  const [activeSidebarMenu, setActiveSidebarMenu] = useState('COVER');
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');

  const { data } = useInvitationStore();
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const supabase = createSupabaseClient();

  // Hydrate store on mount if initialData is provided
  useEffect(() => {
    if (initialData) {
      useInvitationStore.setState({ data: initialData });
    }
  }, [initialData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveInvitationData({ data: { projectId, data } });
      alert('Data saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: '/login' });
  };

  const isBirthday = data.templateId === 'birthday-fun';

  const weddingMenus = [
    { id: 'COVER', label: 'COVER', icon: ImageIcon },
    { id: 'HERO', label: 'HERO', icon: Type },
    { id: 'QUOTE', label: 'QUOTE', icon: Music },
    { id: 'PROFILES', label: 'HOSTS', icon: Users },
    { id: 'STORY', label: 'STORY', icon: BookOpen },
    { id: 'EVENTS', label: 'EVENTS', icon: MapPin },
    { id: 'DRESSCODE', label: 'STYLE', icon: Palette },
    { id: 'GALLERY', label: 'GALLERY', icon: Video },
    { id: 'GIFTS', label: 'GIFTS', icon: Gift },
  ];

  const birthdayMenus = [
    { id: 'COVER', label: 'COVER', icon: ImageIcon },
    { id: 'HERO', label: 'HERO', icon: Type },
    { id: 'EVENTS', label: 'EVENTS', icon: Calendar },
    { id: 'DRESSCODE', label: 'STYLE', icon: Palette },
    { id: 'GALLERY', label: 'GALLERY', icon: Video },
    { id: 'QUOTE', label: 'WISHES', icon: Music },
    { id: 'GIFTS', label: 'GIFTS', icon: Gift },
  ];

  const sidebarMenus = isBirthday ? birthdayMenus : weddingMenus;


  return (
    <div className="flex flex-col w-full h-screen bg-[#f8f9fa] overflow-hidden font-sans text-gray-900">

      {/* Top Header */}
      <header className="h-[60px] shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-[60]">
        
        {/* Left: Identity & Nav */}
        <div className="flex items-center gap-6 w-1/3">
          <Link to="/dashboard" className="text-gray-400 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/baswara-logo.svg" alt="Baswara" className="h-6" />
            </div>
            
            <div className="h-6 w-[1px] bg-gray-200"></div>
            
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">Live</span>
            </div>
          </div>
        </div>

        {/* Center: Device Controls */}
        <div className="flex items-center justify-center gap-2 w-1/3">
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setDeviceView('desktop')}
              className={`flex items-center gap-1.5 text-[10px] font-bold tracking-widest px-4 py-1.5 rounded-md transition-all ${deviceView === 'desktop' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
            >
              <Monitor className="w-3.5 h-3.5" /> DESKTOP
            </button>
            <button
              onClick={() => setDeviceView('mobile')}
              className={`flex items-center gap-1.5 text-[10px] font-bold tracking-widest px-4 py-1.5 rounded-md transition-all ${deviceView === 'mobile' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
            >
              <Smartphone className="w-3.5 h-3.5" /> MOBILE
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3 w-1/3">
          {slug && (
            <button
              onClick={() => navigator.clipboard.writeText(`https://${import.meta.env.VITE_APP_DOMAIN || 'localhost:3000'}/${slug}`)}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 px-3 py-1.5 text-[10px] font-bold tracking-widest transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              COPY LINK
            </button>
          )}

          {slug && (
            <a href={`/${slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 px-3 py-1.5 text-[10px] font-bold tracking-widest transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              VIEW
            </a>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#FD5E4B] text-white px-5 py-2 rounded-lg font-bold text-[10px] tracking-widest hover:bg-[#E54835] transition-colors shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {isSaving ? 'SAVING...' : 'PUBLISH'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">

        {/* Primary Sidebar (Nav) */}
        <div className="w-[72px] shrink-0 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-2 overflow-y-auto scrollbar-none z-50">
          {sidebarMenus.map((menu) => {
            const isActive = activeSidebarMenu === menu.id;
            const Icon = menu.icon;
            return (
              <button
                key={menu.id}
                onClick={() => setActiveSidebarMenu(menu.id)}
                className={`w-full flex flex-col items-center gap-1.5 py-3 transition-colors relative ${isActive ? 'text-[#FD5E4B]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'}`}
              >
                {isActive && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-[42px] h-[42px] bg-[#FD5E4B]/10 rounded-xl -z-10"></div>
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#FD5E4B]' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[7px] font-black tracking-widest">{menu.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Sidebar (Editor Panel) */}
        <div className="w-[340px] shrink-0 bg-white border-r border-gray-200 flex flex-col z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          {isBirthday ? (
            <BirthdayEditorSidebar activeMenu={activeSidebarMenu} />
          ) : (
            <EditorSidebar activeMenu={activeSidebarMenu} />
          )}
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-[#1a1a1a] flex flex-col relative overflow-hidden">

          {/* Preview Canvas */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] [background-size:20px_20px]">
            {deviceView === 'desktop' && (() => {
              const DESKTOP_W = 1280;
              const DESKTOP_H = 800;
              const SCALE = 0.75;
              return (
                <div 
                  className="relative flex-shrink-0 bg-white shadow-2xl overflow-hidden ring-1 ring-white/10"
                  style={{ width: DESKTOP_W * SCALE, height: DESKTOP_H * SCALE }}
                >
                  <div style={{
                    width: DESKTOP_W,
                    height: DESKTOP_H,
                    transform: `scale(${SCALE})`,
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}>
                    <Preview isBuilder={true} initialData={initialData} deviceView={deviceView} />
                  </div>
                </div>
              );
            })()}

            {deviceView === 'mobile' && (() => {
              const PHONE_W = 375;
              const PHONE_H = 812;
              const SCALE = 0.70;
              return (
                <div
                  className="relative flex-shrink-0 bg-white shadow-2xl overflow-hidden ring-[10px] ring-gray-900"
                  style={{ width: PHONE_W * SCALE, height: PHONE_H * SCALE }}
                >
                  <div style={{
                    width: PHONE_W,
                    height: PHONE_H,
                    transform: `scale(${SCALE})`,
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}>
                    <Preview isBuilder={true} initialData={initialData} deviceView={deviceView} />
                  </div>
                </div>
              );
            })()}
          </div>

        </div>
      </div>
    </div>
  );
}
