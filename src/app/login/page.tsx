"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // The trigger will automatically create a row in the profiles table.
        // We'll redirect to dashboard.
        router.push('/BWRF-member');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/BWRF-member');
        router.refresh(); // refresh the session context
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* Left Side - Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-50 border-r border-slate-200 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
        
        <div className="z-10 w-full flex justify-center items-center">
          <img 
            src="/Reading-book-rafiki.png" 
            alt="Reading" 
            className="w-full max-w-2xl mix-blend-multiply opacity-90 drop-shadow-sm scale-110"
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          
          <div className="mb-8">
            <Link href="/">
              <img src="/LOGO.png" alt="BRWF Logo" className="h-10 w-auto" />
            </Link>
          </div>

          <h2 className="text-3xl font-thin tracking-wide text-slate-900 mb-2">
            {mode === 'login' ? 'Welcome back' : 'Join the club'}
          </h2>
          <p className="text-sm font-light text-slate-500 mb-8">
            {mode === 'login' 
              ? 'Please enter your details to sign in.' 
              : 'Create an account to participate in discussions.'}
          </p>

          <form className="space-y-6" onSubmit={handleAuth}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 text-sm font-light border border-red-200">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 bg-slate-50 text-slate-900 font-light focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors rounded-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 bg-slate-50 text-slate-900 font-light focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors rounded-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-light text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors rounded-none"
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Sign in to account' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500 font-light">
                  {mode === 'login' ? 'New to BRWF?' : 'Already a member?'}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="w-full flex justify-center py-3 px-4 border border-slate-300 shadow-sm text-sm font-light text-slate-700 bg-white hover:bg-slate-50 transition-colors rounded-none"
              >
                {mode === 'login' ? 'Create a new account' : 'Sign in instead'}
              </button>
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
