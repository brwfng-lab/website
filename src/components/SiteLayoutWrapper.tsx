"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import CartSidebar from './CartSidebar';
import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function SiteLayoutWrapper({ children, clubName, clubTagline, isDashboard = false }: { children: React.ReactNode, clubName?: string, clubTagline?: string, isDashboard?: boolean }) {
  const pathname = usePathname();
  const { items, setIsCartOpen } = useCart();
      
  // Routes that shouldn't show the public navbar and footer
  const hideNavAndFooter = pathname.startsWith('/BWRF-member') || 
                           pathname === '/login' || 
                           pathname.startsWith('/BWRF-admin') || 
                           isDashboard;

  if (hideNavAndFooter) {
    return <main className="min-h-screen">{children}</main>;
  }

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left Logo */}
            <div className="flex-1 flex items-center">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <img src="/LOGO.png" alt={clubName || "BRWF Logo"} className="h-8 w-auto object-contain" />
              </Link>
            </div>

            {/* Center NavLinks */}
            <div className="hidden sm:flex items-center justify-center space-x-8">
              <Link href="/discussions" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-light tracking-wide text-slate-600 hover:text-blue-700 hover:border-blue-400 transition-all">
                Discussions
              </Link>
              <Link href="/vote" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-light tracking-wide text-slate-600 hover:text-blue-700 hover:border-blue-400 transition-all">
                Vote
              </Link>
              <Link href="/events" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-light tracking-wide text-slate-600 hover:text-blue-700 hover:border-blue-400 transition-all">
                Events
              </Link>
              <Link href="/merchandise" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-light tracking-wide text-slate-600 hover:text-blue-700 hover:border-blue-400 transition-all">
                Merchandise
              </Link>
            </div>
            
            {/* Right Action */}
            <div className="flex-1 flex items-center justify-end gap-4">
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors">
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-blue-600 text-white text-[10px] font-medium flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <Link href="/BWRF-member" className="text-sm font-light tracking-wide bg-slate-900 text-white px-5 py-2 rounded-lg shadow-sm hover:bg-slate-800 transition-colors">
                Member Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <CartSidebar />

      <main className="min-h-screen">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
                <img src="/LOGO.png" alt={clubName || "BRWF Logo"} className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
              </Link>
              <p className="text-sm font-light text-slate-500 mb-6 leading-relaxed max-w-xs">
                {clubTagline || "A community-driven book club where we read, discuss, and decide together."}
              </p>
            </div>
            
            <div>
              <h3 className="text-xs font-medium text-slate-900 uppercase tracking-wider mb-4">Explore</h3>
              <ul className="space-y-3">
                <li><Link href="/discussions" className="text-sm font-light text-slate-500 hover:text-slate-900 transition-colors">Discussions</Link></li>
                <li><Link href="/vote" className="text-sm font-light text-slate-500 hover:text-slate-900 transition-colors">Vote</Link></li>
                <li><Link href="/events" className="text-sm font-light text-slate-500 hover:text-slate-900 transition-colors">Events</Link></li>
                <li><Link href="/archive" className="text-sm font-light text-slate-500 hover:text-slate-900 transition-colors">Archive</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xs font-medium text-slate-900 uppercase tracking-wider mb-4">Community</h3>
              <ul className="space-y-3">
                <li><Link href="/challenges" className="text-sm font-light text-slate-500 hover:text-slate-900 transition-colors">Reading Challenges</Link></li>
                <li><Link href="/leaderboard" className="text-sm font-light text-slate-500 hover:text-slate-900 transition-colors">Leaderboard</Link></li>
                <li><Link href="/subgroups" className="text-sm font-light text-slate-500 hover:text-slate-900 transition-colors">Sub-Groups</Link></li>
                <li><Link href="/reviews" className="text-sm font-light text-slate-500 hover:text-slate-900 transition-colors">Member Reviews</Link></li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xs font-medium text-slate-900 uppercase tracking-wider mb-4">Newsletter</h3>
              <p className="text-sm font-light text-slate-500 mb-4">
                Stay updated on new books, events, and community highlights.
              </p>
              <form className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-light focus:outline-none focus:border-blue-400 transition-colors"
                />
                <button className="bg-slate-900 text-white px-4 py-2 text-sm font-light hover:bg-slate-800 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-slate-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-xs font-light text-slate-400">
                &copy; {new Date().getFullYear()} {clubName || "Book Review With Friends"}. All rights reserved.
              </p>
              <p className="text-xs font-light text-slate-400">
                Built By <a href="https://crelligent.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors">Crelligent</a>
              </p>
            </div>
            <div className="flex gap-4 text-xs font-light text-slate-400">
              <Link href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

