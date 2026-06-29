import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, PartyPopper, Link2, ChevronRight, Sparkles, Info, Mic, GlassWater, ArrowLeft } from 'lucide-react';
import { createSupabaseServerClient } from '../lib/supabase/server';

export const createInvitation = createServerFn({ method: 'POST' })
  .validator((data: { groomName: string; brideName: string; slug: string; templateId: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Unauthorized');

    // Basic initial payload merging their names
    const initialPayload = {
      templateId: data.templateId,
      groomName: data.groomName,
      brideName: data.brideName,
      weddingDate: '22 . 08 . 2026',
      weddingVenue: 'Grand Ballroom, Jakarta',
      hashtag: `#${data.groomName}${data.brideName}`,
      coverPhoto: '/cover.png',
      heroPhoto: '/hero.png',
      loveStoryPhoto1: '/love_story_1.png',
      loveStoryPhoto2: '/love_story_2.png',
      quoteText: 'And I\'d choose you; in a hundred lifetimes, in a hundred worlds, in any version of reality, I\'d find you and I\'d choose you.',
      quoteAuthor: 'The Chaos of Stars',
      loveStoryText: 'Every love story is beautiful, but ours is my favorite. From our first meeting to this magical moment, every step has been an adventure.',
      schedules: [
        { id: '1', time: '11:00 AM', name: 'Grand Entrance', icon: 'celebration', description: 'Welcome the bride & groom' }
      ],
      banks: []
    };

    const { data: invitation, error } = await supabase.from('Invitation').insert({
      userId: user.id,
      slug: data.slug,
      data: initialPayload,
    }).select().single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, invitation };
  });

export const Route = createFileRoute('/onboarding')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' });
  },
  component: OnboardingPage,
});

function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [slug, setSlug] = useState('');
  const [templateId, setTemplateId] = useState('wedding-classic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groomName || !brideName || !slug) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createInvitation({ data: { groomName, brideName, slug, templateId } });
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      setError(err.message || 'Failed to create project. Slug might be taken.');
    } finally {
      setLoading(false);
    }
  };

  const isWedding = templateId === 'wedding-classic';
  const isSeminar = templateId === 'seminar';
  const isOther = templateId === 'other-party';
  
  const getImageUrl = () => {
    if (isWedding) return "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop";
    if (isSeminar) return "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop";
    if (isOther) return "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop";
    return "https://images.unsplash.com/photo-1530103862676-de8892bf30da?q=80&w=2070&auto=format&fit=crop";
  };
  
  const getLeftTitle = () => {
    if (isWedding) return "Craft Your Perfect Wedding";
    if (isSeminar) return "Host a Professional Seminar";
    if (isOther) return "Celebrate Special Moments";
    return "Plan an Unforgettable Party";
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Column - Visual/Premium feel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-primary items-center justify-center">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <AnimatePresence mode="wait">
          <motion.img 
            key={templateId}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            src={getImageUrl()}
            className="absolute inset-0 w-full h-full object-cover"
            alt="Onboarding"
          />
        </AnimatePresence>
        <div className="relative z-20 p-12 text-white flex flex-col items-center text-center">
          <Sparkles className="w-12 h-12 mb-6 opacity-80" />
          <h2 className="font-display-romantic text-5xl mb-4 leading-tight drop-shadow-md">
            {getLeftTitle()}
          </h2>
          <p className="text-white/80 font-meta-data tracking-widest uppercase text-xs">
            Begin your journey with Baswara
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 sm:p-12 md:p-20 bg-surface">
        <div className="w-full max-w-md relative">
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-1 bg-primary rounded-full transition-all duration-300"></div>
            <div className={`w-8 h-1 rounded-full transition-all duration-300 ${step === 2 ? 'bg-primary' : 'bg-outline-variant'}`}></div>
            <span className="text-xs font-bold tracking-widest text-primary uppercase ml-2">Step {step} of 2</span>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm border border-error/20"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <h1 className="text-4xl font-display-romantic text-on-surface mb-2">What are you planning?</h1>
                  <p className="text-on-surface-variant text-sm mb-8">Choose the type of event you're hosting.</p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                      type="button"
                      onClick={() => setTemplateId('wedding-classic')}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${templateId === 'wedding-classic' ? 'border-primary bg-primary/5 shadow-sm' : 'border-outline-variant bg-white hover:border-primary/40'}`}
                    >
                      <Heart className={`w-8 h-8 mb-3 transition-colors ${templateId === 'wedding-classic' ? 'text-primary' : 'text-outline'}`} />
                      <span className={`font-semibold text-sm ${templateId === 'wedding-classic' ? 'text-primary' : 'text-on-surface-variant'}`}>Wedding</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplateId('birthday-fun')}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${templateId === 'birthday-fun' ? 'border-sunset-accent bg-sunset-accent/5 shadow-sm' : 'border-outline-variant bg-white hover:border-sunset-accent/40'}`}
                    >
                      <PartyPopper className={`w-8 h-8 mb-3 transition-colors ${templateId === 'birthday-fun' ? 'text-sunset-accent' : 'text-outline'}`} />
                      <span className={`font-semibold text-sm ${templateId === 'birthday-fun' ? 'text-sunset-accent' : 'text-on-surface-variant'}`}>Birthday</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplateId('seminar')}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${templateId === 'seminar' ? 'border-secondary bg-secondary/5 shadow-sm' : 'border-outline-variant bg-white hover:border-secondary/40'}`}
                    >
                      <Mic className={`w-8 h-8 mb-3 transition-colors ${templateId === 'seminar' ? 'text-secondary' : 'text-outline'}`} />
                      <span className={`font-semibold text-sm ${templateId === 'seminar' ? 'text-secondary' : 'text-on-surface-variant'}`}>Seminar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplateId('other-party')}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${templateId === 'other-party' ? 'border-tertiary bg-tertiary/5 shadow-sm' : 'border-outline-variant bg-white hover:border-tertiary/40'}`}
                    >
                      <GlassWater className={`w-8 h-8 mb-3 transition-colors ${templateId === 'other-party' ? 'text-tertiary' : 'text-outline'}`} />
                      <span className={`font-semibold text-sm ${templateId === 'other-party' ? 'text-tertiary' : 'text-on-surface-variant'}`}>Other</span>
                    </button>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="w-full group bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <h1 className="text-4xl font-display-romantic text-on-surface mb-2">Event Details</h1>
                  <p className="text-on-surface-variant text-sm mb-8">Tell us a bit about the {isWedding ? 'couple' : 'event'}.</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-on-surface uppercase tracking-widest mb-2">
                        {isWedding ? "Groom's Name" : isSeminar ? "Event Name" : "Primary Name"}
                      </label>
                      <input 
                        type="text" 
                        value={groomName}
                        onChange={(e) => setGroomName(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline/50"
                        placeholder={isWedding ? "Shin" : isSeminar ? "Tech Conference" : "John"}
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface uppercase tracking-widest mb-2">
                        {isWedding ? "Bride's Name" : isSeminar ? "Organizer" : "Secondary Name"}
                      </label>
                      <input 
                        type="text" 
                        value={brideName}
                        onChange={(e) => setBrideName(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline/50"
                        placeholder={isWedding ? "Lena" : isSeminar ? "Vuxxe Team" : "Doe"}
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-widest mb-2">Custom Link</label>
                    <div className="flex bg-white border border-outline-variant rounded-xl focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all overflow-hidden">
                      <div className="flex items-center gap-2 text-outline bg-gray-50/80 px-4 py-3 border-r border-outline-variant/30">
                        <Link2 className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium whitespace-nowrap">{import.meta.env.VITE_APP_DOMAIN || 'localhost:3000'}/</span>
                      </div>
                      <input 
                        type="text" 
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className="w-full px-4 py-3 bg-transparent outline-none font-medium placeholder:text-outline/50"
                        placeholder="shin-lena"
                      />
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-2 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      This is your permanent invitation link.
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      className="px-5 py-4 rounded-xl border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-high transition-colors flex items-center justify-center group"
                    >
                      <ArrowLeft className="w-4 h-4 text-outline group-hover:-translate-x-1 transition-transform" />
                    </button>
                    
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex-1 group bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Create Project <Sparkles className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}
