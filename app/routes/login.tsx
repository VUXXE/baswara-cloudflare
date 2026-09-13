import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { authClient } from '../lib/auth-client';
import { Loader2, Mail, Lock } from 'lucide-react';

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) throw new Error(error.message);
      } else {
        const { error } = await authClient.signUp.email({ email, password, name: email });
        if (error) throw new Error(error.message);
      }
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-[#F9FAFB] font-sans">
      
      {/* Left Panel - Dark Section */}
      <div className="hidden lg:flex w-[45%] bg-[#0a0a0a] relative overflow-hidden flex-col justify-between p-16 text-white border-r border-white/10">
        
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-[#FD5E4B]/10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo-main.svg" alt="Baswara Logo" className="h-10 brightness-0 invert" />
          </div>

          {/* Main Typography */}
          <div className="my-auto">
            <h1 className="text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
              Create <br />
              <span className="text-[#FD5E4B]">Legacy</span> <br />
              Invites.
            </h1>
            <p className="mt-8 text-gray-400 text-sm font-semibold tracking-widest uppercase max-w-sm leading-relaxed">
              Professional digital invitations for every milestone.
            </p>
          </div>



        </div>
      </div>

      {/* Right Panel - Form Section */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center p-6 relative">
        <div className="w-full max-w-[480px] bg-white p-10 md:p-14 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-fade-in-up">
          
            <>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-[#FD5E4B] text-sm font-semibold">
                  {isLogin ? 'Enter your credentials to access your studio.' : 'Sign up to start building your legacy.'}
                </p>
              </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-[#FD5E4B] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#FD5E4B]/20 focus:border-[#FD5E4B] outline-none transition-all placeholder:text-gray-400"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1 mr-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Password
                </label>
                {isLogin && (
                  <a href="#" className="text-[10px] font-bold text-[#FD5E4B] uppercase tracking-wider hover:underline">
                    Forgot?
                  </a>
                )}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-[#FD5E4B] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#FD5E4B]/20 focus:border-[#FD5E4B] outline-none transition-all placeholder:text-gray-400 tracking-widest"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-[#FD5E4B] hover:bg-[#E45D36] text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-[#FD5E4B]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Enter Studio' : 'Start Building'}
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </>
              )}
            </button>

          </form>

          <div className="mt-10 pt-8 relative text-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative inline-block bg-white px-4">
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                Secure Gateway
              </span>
            </div>
          </div>

              <div className="mt-8 text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {isLogin ? 'New Here? ' : 'Already Member? '}
                  <button 
                    type="button" 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[#FD5E4B] hover:underline"
                  >
                    {isLogin ? 'Register' : 'Login'}
                  </button>
                </p>
              </div>
            </>

        </div>
      </div>
      
    </div>
  );
}