import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EventSchedule {
  id: string;
  time: string;
  name: string;
  icon: string;
  description: string;
}

export interface EventItem {
  id: string;
  name: string;
  date: string;
  time: string;
  venueLabel: string;
  venueAddress: string;
}

export interface BankAccount {
  id: string;
  bank: string;
  name: string;
  number: string;
}

export interface InvitationData {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingVenue: string;
  eventMainTitle: string;
  rundownTitle: string;
  musicUrl: string;
  templateId: string;
  hashtag: string;
  birthdayName?: string;
  birthdayAge?: string;
  
  // Photos
  coverPhoto: string;
  heroPhoto: string;
  loveStoryPhoto1: string;
  loveStoryPhoto2: string;
  
  // Custom Texts
  quoteText: string;
  quoteAuthor: string;
  loveStoryTitle1: string;
  loveStoryText: string;
  loveStoryTitle2: string;
  loveStoryText2: string;

  // New Per-Section Data
  groomFullName: string;
  groomParents: string;
  groomChildOrder: string;
  groomPhoto: string;
  brideFullName: string;
  brideParents: string;
  brideChildOrder: string;
  bridePhoto: string;
  groomIg: string;
  brideIg: string;
  dresscodeColors: string[];
  dresscodeMenTitle: string;
  dresscodeMenStyle: string;
  dresscodeMenDesc: string;
  dresscodeWomenTitle: string;
  dresscodeWomenStyle: string;
  dresscodeWomenDesc: string;
  galleryPhotos: string[];
  mediaLibrary: string[];
  weddingTimestamp: number;
  
  // Sections
  events: EventItem[];
  schedules: EventSchedule[];
  banks: BankAccount[];
}

interface EditorState {
  data: InvitationData;
  isInvitationOpen: boolean;
  setInvitationOpen: (open: boolean) => void;
  updateData: (updates: Partial<InvitationData>) => void;
  updateSchedule: (id: string, updates: Partial<EventSchedule>) => void;
  addSchedule: (schedule: EventSchedule) => void;
  removeSchedule: (id: string) => void;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  addEvent: (event: EventItem) => void;
  removeEvent: (id: string) => void;
  updateBank: (id: string, updates: Partial<BankAccount>) => void;
  addBank: (bank: BankAccount) => void;
  removeBank: (id: string) => void;
  resetToDefault: () => void;
}

export const defaultData: InvitationData = {
  groomName: 'Shin',
  brideName: 'Lena',
  weddingDate: '22 . 08 . 2026',
  weddingVenue: 'Grand Ballroom, Jakarta',
  events: [
    {
      id: '1',
      name: 'Akad Nikah',
      date: '22 . 08 . 2026',
      time: '09:00 - 10:00',
      venueLabel: 'Masjid Agung',
      venueAddress: 'Jl. Kebaikan No 1, Jakarta'
    },
    {
      id: '2',
      name: 'Resepsi',
      date: '22 . 08 . 2026',
      time: '11:00 - 15:00',
      venueLabel: 'Grand Ballroom',
      venueAddress: 'Jl. Kebaikan No 2, Jakarta'
    }
  ],

  eventMainTitle: 'The Wedding Day',
  rundownTitle: 'Reception Rundown',
  templateId: 'wedding-classic',
  musicUrl: '',
  hashtag: '#ShinLenaAlways',
  birthdayName: 'Aurelia',
  birthdayAge: '23rd',
  coverPhoto: '/cover.png',
  heroPhoto: '/hero.png',
  loveStoryPhoto1: '/love_story_1.png',
  loveStoryPhoto2: '/love_story_2.png',
  quoteText: 'And I\'d choose you; in a hundred lifetimes, in a hundred worlds, in any version of reality, I\'d find you and I\'d choose you.',
  quoteAuthor: 'The Chaos of Stars',
  loveStoryTitle1: 'First Sight',
  loveStoryText: 'Every love story is beautiful, but ours is my favorite. From our first meeting to this magical moment, every step has been an adventure.',
  loveStoryTitle2: 'We\'re Forever',
  loveStoryText2: 'One day, in the same garden that had seen the beginning of their story, Shin shared his heartfelt intention. With a warm smile and sincere belief, Lena said yes.',
  groomFullName: 'Shin Ryujin',
  groomParents: 'Bapak Budi & Ibu Ani',
  groomChildOrder: 'Putra Pertama dari',
  groomPhoto: '/hero.png',
  brideFullName: 'Lena Kurnia',
  brideParents: 'Bapak Joko & Ibu Siti',
  brideChildOrder: 'Putri Kedua dari',
  bridePhoto: '/hero.png',
  groomIg: 'baswara',
  brideIg: 'baswara',
  dresscodeColors: ['#3e4530', '#c2baab', '#bda89b', '#fdfbf7'],
  dresscodeMenTitle: 'Gentlemen',
  dresscodeMenStyle: 'Casual',
  dresscodeMenDesc: 'Collar shirt, neat trousers, comfortable shoes.',
  dresscodeWomenTitle: 'Ladies',
  dresscodeWomenStyle: 'Casual',
  dresscodeWomenDesc: 'Flowing dresses, midi skirts, or chic jumpsuits.',
  galleryPhotos: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB3i_jO-B98k_5pQyZ_oR-5hCgYw42qI67N_Ff900Xk30kE15cM8v431_Zk26iW5o5r2Nl07kQ9xU1G79K01qZ68Z5oQ5-85Wk_tqg_6R-h-E9Z51P32sT_Lw0_40Qn51XlE8-13gO15Xl7N_T8h_65kU-l-V58U-hL4M_q02GZ07_19-XgG57Qh0_6_11l6-V3U6E_T7b-O-x-L6020qU81eP7x8q4U',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDFzDk_Y-jK_9xZ23vK1xV9u2XjFzE_BwH_2gYk2U9Z6O-Fh9Ww304Xb58zN_8y_tQ34tN5y0-9rQZ4R-9u_pY-9pW_l8z29D1-T5sZ854Q63-eL_O2w4U7zB1qK0U_L13fN5nU1O_86g66V77K1W29E-R872E-V1M8mP8tO-Y_L0K4yE2E72qP-Y3oN9nK3M90-p2wF_y_22588sW1e_G7V67rF84T5',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDPjY0m9G3L-59KzE2T1q3RzQxY8u7U8oU177I4F_17yI8kU9V-5-E93-Z35q2QpQ4-59q4n9-u35rN_V3I_8y12Y_oY8o35-R0-2T7F-1N_20n9z5N-o72tM-O5g92T-yK_E8lP4nE369Y_3M8-k1U4zN8uP-T7eO5-6q_Q6E2uR9lF3W4uL-I5eY8T_3_68rP_Q8pY_vH84vE272g28-E6g2nZ56gE72_O7eP'
  ],
  mediaLibrary: [
    '/cover.png',
    '/hero.png',
    '/love_story_1.png',
    '/love_story_2.png',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB3i_jO-B98k_5pQyZ_oR-5hCgYw42qI67N_Ff900Xk30kE15cM8v431_Zk26iW5o5r2Nl07kQ9xU1G79K01qZ68Z5oQ5-85Wk_tqg_6R-h-E9Z51P32sT_Lw0_40Qn51XlE8-13gO15Xl7N_T8h_65kU-l-V58U-hL4M_q02GZ07_19-XgG57Qh0_6_11l6-V3U6E_T7b-O-x-L6020qU81eP7x8q4U',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDFzDk_Y-jK_9xZ23vK1xV9u2XjFzE_BwH_2gYk2U9Z6O-Fh9Ww304Xb58zN_8y_tQ34tN5y0-9rQZ4R-9u_pY-9pW_l8z29D1-T5sZ854Q63-eL_O2w4U7zB1qK0U_L13fN5nU1O_86g66V77K1W29E-R872E-V1M8mP8tO-Y_L0K4yE2E72qP-Y3oN9nK3M90-p2wF_y_22588sW1e_G7V67rF84T5'
  ],
  weddingTimestamp: new Date('2026-09-16T09:00:00').getTime(),
  schedules: [
    { id: '1', time: '11:00 AM', name: 'Grand Entrance', icon: 'celebration', description: 'Welcome the bride & groom' },
    { id: '2', time: '11:15 AM', name: 'First Dance', icon: 'favorite', description: 'Bride & Groom first dance together' },
    { id: '3', time: '11:45 AM', name: 'Cut the Cake', icon: 'cake', description: 'Wedding cake ceremony' },
  ],
  banks: [
    { id: '1', bank: 'BANK EKSPOR INDONESIA', name: 'Lena', number: '12000333203656' },
    { id: '2', bank: 'BANK BNI', name: 'Shin', number: '165400023315' }
  ]
};

export const useInvitationStore = create<EditorState>()(
  persist(
    (set) => ({
      data: defaultData,
      isInvitationOpen: false,
      setInvitationOpen: (open) => set({ isInvitationOpen: open }),
      updateData: (updates) => 
        set((state) => ({ data: { ...state.data, ...updates } })),
      updateSchedule: (id, updates) => 
        set((state) => ({
          data: {
            ...state.data,
            schedules: (state.data.schedules || []).map(sch => sch.id === id ? { ...sch, ...updates } : sch)
          }
        })),
      addSchedule: (schedule) =>
        set((state) => ({
          data: { ...state.data, schedules: [...(state.data.schedules || []), schedule] }
        })),
      removeSchedule: (id) =>
        set((state) => ({
          data: { ...state.data, schedules: (state.data.schedules || []).filter(sch => sch.id !== id) }
        })),
      updateEvent: (id, updates) => 
        set((state) => ({
          data: {
            ...state.data,
            events: (state.data.events || []).map(ev => ev.id === id ? { ...ev, ...updates } : ev)
          }
        })),
      addEvent: (eventItem) =>
        set((state) => ({
          data: { ...state.data, events: [...(state.data.events || []), eventItem] }
        })),
      removeEvent: (id) =>
        set((state) => ({
          data: { ...state.data, events: (state.data.events || []).filter(ev => ev.id !== id) }
        })),
      updateBank: (id, updates) => 
        set((state) => ({
          data: {
            ...state.data,
            banks: (state.data.banks || []).map(bank => bank.id === id ? { ...bank, ...updates } : bank)
          }
        })),
      addBank: (bank) =>
        set((state) => ({
          data: { ...state.data, banks: [...(state.data.banks || []), bank] }
        })),
      removeBank: (id) =>
        set((state) => ({
          data: { ...state.data, banks: (state.data.banks || []).filter(bank => bank.id !== id) }
        })),
      resetToDefault: () => set({ data: defaultData })
    }),
    {
      name: 'invitation-builder-storage',
      merge: (persistedState: any, currentState: EditorState) => {
        return {
          ...currentState,
          ...persistedState,
          data: {
            ...currentState.data,
            ...(persistedState?.data || {}),
            events: persistedState?.data?.events || currentState.data.events,
            schedules: persistedState?.data?.schedules || currentState.data.schedules,
            banks: persistedState?.data?.banks || currentState.data.banks
          }
        };
      }
    }
  )
);
