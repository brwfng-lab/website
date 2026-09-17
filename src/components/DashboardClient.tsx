"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, User, Settings, LogOut, 
  BookOpen, Calendar, MessageSquare, Palette, Bell,
  History, Star, BarChart3, CheckSquare, Users, Layers,
  Award, Trophy, Quote, Video, BellRing
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import ReadingChart from './ReadingChart';
import LiveChat from './LiveChat';
import { updateThemePreference } from '@/app/BWRF-member/actions';

import ThemeBackground from './ThemeBackground';

export default function DashboardClient({ 
  profile, 
  email,
  currentBook,
  nextEvent
}: { 
  profile: any; 
  email: string;
  currentBook?: any;
  nextEvent?: any;
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState('scifi');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (profile?.theme_color) {
      setThemeColor(profile.theme_color);
    }
  }, [profile]);

  useEffect(() => {
    let channel: any;
    let isMounted = true;

    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isMounted) return;
      
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (data && isMounted) setNotifications(data);

      if (!isMounted) return;

      const channelName = `notifications_${user.id}_${Math.random().toString(36).substring(7)}`;
      channel = supabase.channel(channelName);
      
      channel
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {
            setNotifications((prev) => [payload.new, ...prev].slice(0, 10));
          }
        )
        .subscribe();
    };
    
    fetchNotifications();

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const markNotificationsRead = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && notifications.some(n => !n.read)) {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      await supabase.from('notifications').update({ read: true }).in('id', unreadIds);
    }
  };

  const isEventToday = nextEvent && new Date(nextEvent.date_time).toDateString() === new Date().toDateString();

  const handleThemeChange = async (color: string) => {
    setThemeColor(color);
    localStorage.setItem('brwf_theme_color', color);
    
    // Save to DB if profile exists
    try {
      await updateThemePreference(color);
    } catch (e) {
      console.error("Failed to save theme to DB", e);
    }
  };


  const themeClasses: Record<string, { name: string, bg: string, text: string, border: string, light: string }> = {
    classic: { name: 'The Classic', bg: 'bg-slate-800', text: 'text-slate-800', border: 'border-slate-800', light: 'bg-slate-100' },
    mystery: { name: 'Mystery', bg: 'bg-violet-600', text: 'text-violet-600', border: 'border-violet-600', light: 'bg-violet-50' },
    romance: { name: 'Romance', bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-600', light: 'bg-rose-50' },
    scifi: { name: 'Sci-Fi', bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', light: 'bg-blue-50' },
    fantasy: { name: 'Fantasy', bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', light: 'bg-emerald-50' },
  };

  useEffect(() => {
    const saved = localStorage.getItem('brwf_theme_color');
    if (profile?.theme_color && themeClasses[profile.theme_color]) {
      setThemeColor(profile.theme_color);
    } else if (saved && themeClasses[saved]) {
      setThemeColor(saved);
    }
  }, []);

  const changeTheme = (color: string) => {
    setThemeColor(color);
    localStorage.setItem('brwf_theme_color', color);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const currentTheme = themeClasses[themeColor] || themeClasses.scifi;

  const sidebarSections = [
    {
      title: 'Overview',
      items: [
        { id: 'overview', label: 'Dashboard Home', icon: LayoutDashboard },
      ]
    },
    {
      title: 'My Reading',
      items: [
        { id: 'current_progress', label: 'Current Book Progress', icon: BookOpen },
        { id: 'reading_history', label: 'Reading History', icon: History },
        { id: 'ratings_reviews', label: 'My Ratings & Reviews', icon: Star },
        { id: 'reading_stats', label: 'Reading Stats', icon: BarChart3 },
      ]
    },
    {
      title: 'Community',
      items: [
        { id: 'discussions', label: 'Discussions', icon: MessageSquare },
        { id: 'vote', label: 'Vote', icon: CheckSquare },
        { id: 'directory', label: 'Member Directory', icon: Users },
        { id: 'subgroups', label: 'Sub-Groups I\'m in', icon: Layers },
        { id: 'author_wall', label: 'Author Wall of Fame', icon: Star },
      ]
    },
    {
      title: 'Participation',
      items: [
        { id: 'badges', label: 'Badges & Achievements', icon: Award },
        { id: 'leaderboard', label: 'Leaderboard Position', icon: Trophy },
        { id: 'quote_wall', label: 'Quote Wall', icon: Quote },
      ]
    },
    {
      title: 'Events',
      items: [
        { id: 'rsvps', label: 'Upcoming Meetings', icon: Calendar },
        { id: 'live_meeting', label: 'Live Meeting Mode', icon: Video },
      ]
    },
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'notifications', label: 'Notification Preferences', icon: BellRing },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'settings', label: 'Privacy & Settings', icon: Settings },
      ]
    },
  ];

  return (
    <div className="min-h-screen flex relative bg-transparent">
      <ThemeBackground theme={themeColor} />
      
      {/* Sidebar */}
      <div className="w-64 bg-white/90 backdrop-blur-sm border-r border-slate-200 flex flex-col hidden md:flex h-screen sticky top-0 z-10">
        <div className="p-6 border-b border-slate-100 shrink-0">
          <Link href="/">
            <img src="/LOGO.png" alt="BRWF" className="h-8 w-auto" />
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          {sidebarSections.map((section, idx) => (
            <div key={idx} className="mb-6 last:mb-0">
              <h4 className="px-3 mb-2 text-xs font-light text-slate-400 uppercase tracking-wider">
                {section.title}
              </h4>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button 
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-light rounded-md transition-colors ${
                        isActive 
                          ? `${currentTheme.light} ${currentTheme.text}` 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" /> 
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 shrink-0">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-light text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-h-screen overflow-y-auto z-10 relative">
        
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-20">
          <h2 className="text-lg font-light text-slate-800 capitalize">{activeTab.replace('_', ' ')}</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={markNotificationsRead} className="text-slate-400 hover:text-slate-600 relative p-1">
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-sm font-medium text-slate-900">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-500 font-light">No notifications yet.</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-4 border-b border-slate-100 last:border-0 ${n.read ? 'opacity-70' : 'bg-blue-50/50'}`}>
                          <p className="text-sm font-medium text-slate-900 mb-1">{n.title}</p>
                          <p className="text-xs text-slate-500 font-light">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-2">{new Date(n.created_at).toLocaleDateString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className={`w-8 h-8 rounded-full ${currentTheme.bg} flex items-center justify-center text-white font-light shadow-sm`}>
              {profile?.display_name?.charAt(0).toUpperCase() || email.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                <div className="mb-8">
                  <h1 className="text-3xl font-thin text-slate-900 mb-2">Welcome back, {profile?.display_name || 'Member'}</h1>
                  <p className="text-slate-500 font-light">Here's what's happening in the book club today.</p>
                </div>

                {profile?.status === 'pending' && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md mb-8 shadow-sm">
                    <div className="flex">
                      <div className="flex-1">
                        <h3 className="text-amber-800 font-light">Pending Approval</h3>
                        <p className="text-amber-700 mt-1 text-sm">Your account is currently under review by an administrator. Some features are restricted.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 rounded-lg ${currentTheme.light} ${currentTheme.text} flex items-center justify-center mb-4`}>
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-slate-900 font-light mb-1">Current Read</h3>
                    {email === 'test@brwf.com' ? (
                      <>
                        <p className="text-slate-500 text-sm mb-4">Jewish Secrets of Wealth Creation</p>
                        <Link href="/discussions" className={`text-sm font-light ${currentTheme.text} hover:underline`}>Join discussion &rarr;</Link>
                      </>
                    ) : currentBook ? (
                      <>
                        <p className="text-slate-500 text-sm mb-4 truncate">{currentBook.title}</p>
                        <Link href="/discussions" className={`text-sm font-light ${currentTheme.text} hover:underline`}>Join discussion &rarr;</Link>
                      </>
                    ) : (
                      <>
                        <p className="text-slate-500 text-sm mb-4">No current book selected.</p>
                        <Link href="/discussions" className={`text-sm font-light ${currentTheme.text} hover:underline`}>Go to discussions &rarr;</Link>
                      </>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 rounded-lg ${currentTheme.light} ${currentTheme.text} flex items-center justify-center mb-4`}>
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="text-slate-900 font-light mb-1">Next Event</h3>
                    {email === 'test@brwf.com' ? (
                      <>
                        <p className="text-slate-500 text-sm mb-4">Monthly Discussion Meeting</p>
                        <Link href="/events" className={`text-sm font-light ${currentTheme.text} hover:underline`}>View details &rarr;</Link>
                      </>
                    ) : nextEvent ? (
                      <>
                        <p className="text-slate-500 text-sm mb-4 truncate">{nextEvent.title}</p>
                        <Link href="/events" className={`text-sm font-light ${currentTheme.text} hover:underline`}>View details &rarr;</Link>
                      </>
                    ) : (
                      <>
                        <p className="text-slate-500 text-sm mb-4">No upcoming events.</p>
                        <Link href="/events" className={`text-sm font-light ${currentTheme.text} hover:underline`}>View calendar &rarr;</Link>
                      </>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 rounded-lg ${currentTheme.light} ${currentTheme.text} flex items-center justify-center mb-4`}>
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="text-slate-900 font-light mb-1">Voting</h3>
                    <p className="text-slate-500 text-sm mb-4">Next month's book vote is open.</p>
                    <Link href="/vote" className={`text-sm font-light ${currentTheme.text} hover:underline`}>Cast your vote &rarr;</Link>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-light text-slate-800">Recent Activity</h3>
                  </div>
                  <div className="p-6 text-center text-slate-500 text-sm font-light">
                    No recent activity to show.
                  </div>
                </div>
              </div>
            )}

            {/* Current Progress Tab */}
            {activeTab === 'current_progress' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
                <div className="mb-8">
                  <h1 className="text-3xl font-thin text-slate-900 mb-2 flex items-center gap-3">
                    <BookOpen className={`w-8 h-8 ${currentTheme.text}`} />
                    Current Book Progress
                  </h1>
                  <p className="text-slate-500 font-light">Track your reading, log your thoughts, and see how you stack up against the club's reading pace.</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 mb-8 flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/3 shrink-0">
                    <img 
                      src="/81LcDLXilnL._UF1000,1000_QL80_.jpg" 
                      alt="Jewish Secrets of Wealth Creation" 
                      className="w-full rounded-lg shadow-md object-cover aspect-[2/3]"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="mb-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-light tracking-widest uppercase mb-3 ${currentTheme.light} ${currentTheme.text}`}>
                        Current Read
                      </span>
                      <h2 className="text-2xl font-light text-slate-900 leading-tight mb-1">Jewish Secrets of Wealth Creation</h2>
                      <p className="text-slate-500 font-light text-sm">by Dr. David Ogbueli</p>
                    </div>

                    <div className="mt-8 mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-light text-slate-700">Your Progress</span>
                        <span className={`font-medium ${currentTheme.text}`}>45%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div className={`h-2.5 rounded-full ${currentTheme.bg} transition-all duration-1000`} style={{ width: '45%' }}></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 font-light">You are on page <span className="font-medium text-slate-600">142</span> of 315.</p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <button className={`w-full py-3 rounded-lg text-sm font-light text-white transition-colors shadow-sm ${currentTheme.bg} hover:opacity-90`}>
                        Update Progress
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                  <h3 className="text-xl font-light text-slate-900 mb-6 border-b border-slate-100 pb-4">Personal Reading Notes</h3>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[150px] font-light text-slate-700 text-sm focus:outline-none focus:border-slate-400 transition-colors placeholder:text-slate-400"
                    placeholder="Jot down your private thoughts, quotes you love, or questions you have for the upcoming discussion..."
                  ></textarea>
                  <div className="flex justify-end mt-4">
                    <button className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-light hover:bg-slate-800 transition-colors shadow-sm">
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reading History Tab */}
            {activeTab === 'reading_history' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
                <div className="mb-8">
                  <h1 className="text-3xl font-thin text-slate-900 mb-2 flex items-center gap-3">
                    <History className={`w-8 h-8 ${currentTheme.text}`} />
                    Reading History
                  </h1>
                  <p className="text-slate-500 font-light">A timeline of every book you've finished with the club.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", date: "July 2026", cover: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg" },
                    { title: "Dune", author: "Frank Herbert", date: "June 2026", cover: "https://m.media-amazon.com/images/I/A1u+2ZYG3uL._AC_UF1000,1000_QL80_.jpg" },
                    { title: "1984", author: "George Orwell", date: "May 2026", cover: "https://m.media-amazon.com/images/I/61NAx5pd6XL._AC_UF1000,1000_QL80_.jpg" },
                  ].map((book, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex gap-6 items-center hover:border-slate-300 transition-colors">
                      <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded shadow-sm" />
                      <div className="flex-1">
                        <h3 className="text-lg font-light text-slate-900">{book.title}</h3>
                        <p className="text-sm font-light text-slate-500 mb-2">by {book.author}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-light ${currentTheme.light} ${currentTheme.text}`}>
                          Finished {book.date}
                        </span>
                      </div>
                      <button className="px-4 py-2 text-sm font-light text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ratings & Reviews Tab */}
            {activeTab === 'ratings_reviews' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
                <div className="mb-8">
                  <h1 className="text-3xl font-thin text-slate-900 mb-2 flex items-center gap-3">
                    <Star className={`w-8 h-8 ${currentTheme.text}`} />
                    My Ratings & Reviews
                  </h1>
                  <p className="text-slate-500 font-light">Your personal thoughts on past club selections.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "1984", rating: 5, review: "An absolute masterpiece. The foresight Orwell had is terrifying and brilliant." },
                    { title: "The Great Gatsby", rating: 4, review: "Beautiful prose, though the characters are deeply flawed. A fascinating study of the American Dream." },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-light text-slate-900 text-lg">{item.title}</h3>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`w-4 h-4 ${j < item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm font-light text-slate-600 leading-relaxed">"{item.review}"</p>
                      <button className={`mt-4 text-xs font-light ${currentTheme.text} hover:underline`}>Edit Review</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reading Stats Tab */}
            {activeTab === 'reading_stats' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
                <div className="mb-8">
                  <h1 className="text-3xl font-thin text-slate-900 mb-2 flex items-center gap-3">
                    <BarChart3 className={`w-8 h-8 ${currentTheme.text}`} />
                    Reading Stats
                  </h1>
                  <p className="text-slate-500 font-light">Your reading habits by the numbers.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center">
                    <div className={`text-4xl font-thin mb-1 ${currentTheme.text}`}>12</div>
                    <div className="text-xs font-light text-slate-500 uppercase tracking-widest">Books Read</div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center">
                    <div className={`text-4xl font-thin mb-1 ${currentTheme.text}`}>3.8k</div>
                    <div className="text-xs font-light text-slate-500 uppercase tracking-widest">Pages Turned</div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center">
                    <div className={`text-4xl font-thin mb-1 ${currentTheme.text}`}>14</div>
                    <div className="text-xs font-light text-slate-500 uppercase tracking-widest">Discussions</div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center">
                    <div className={`text-4xl font-thin mb-1 ${currentTheme.text}`}>Sci-Fi</div>
                    <div className="text-xs font-light text-slate-500 uppercase tracking-widest">Top Genre</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
                  <ReadingChart themeColorClass={currentTheme.text} />
                </div>
              </div>
            )}

            {/* Author Wall Tab */}
            {activeTab === 'author_wall' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h1 className="text-3xl font-thin text-slate-900 mb-2 flex items-center gap-3">
                    <Star className={`w-8 h-8 ${currentTheme.text}`} />
                    Author Wall of Fame
                  </h1>
                  <p className="text-slate-500 font-light">The most loved and frequently read authors by our community.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Mock Author Card */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group">
                    <div className={`h-24 ${currentTheme.light} w-full flex items-center justify-center`}>
                      <Star className={`w-8 h-8 ${currentTheme.text} opacity-50`} />
                    </div>
                    <div className="p-6 text-center -mt-12">
                      <img src="https://ui-avatars.com/api/?name=George+Orwell&background=random" className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-sm mb-3" alt="Author" />
                      <h3 className="text-lg font-light text-slate-900">George Orwell</h3>
                      <p className="text-sm text-slate-500 mb-4">4 Books Read</p>
                      <div className="flex justify-center gap-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${currentTheme.light} ${currentTheme.text}`}>Dystopian</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${currentTheme.light} ${currentTheme.text}`}>Classic</span>
                      </div>
                    </div>
                  </div>

                  {/* Mock Author Card */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group">
                    <div className={`h-24 ${currentTheme.light} w-full flex items-center justify-center`}>
                      <Star className={`w-8 h-8 ${currentTheme.text} opacity-50`} />
                    </div>
                    <div className="p-6 text-center -mt-12">
                      <img src="https://ui-avatars.com/api/?name=Dr+David&background=random" className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-sm mb-3" alt="Author" />
                      <h3 className="text-lg font-light text-slate-900">Dr. David Ogbueli</h3>
                      <p className="text-sm text-slate-500 mb-4">Current Favorite</p>
                      <div className="flex justify-center gap-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${currentTheme.light} ${currentTheme.text}`}>Finance</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${currentTheme.light} ${currentTheme.text}`}>Non-Fiction</span>
                      </div>
                    </div>
                  </div>

                  {/* Add Author Action */}
                  <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 shadow-sm flex flex-col items-center justify-center p-6 text-center min-h-[300px] hover:border-slate-400 hover:bg-slate-100 transition-all cursor-pointer">
                    <div className={`w-12 h-12 rounded-full ${currentTheme.light} ${currentTheme.text} flex items-center justify-center mb-4`}>
                      <span className="text-2xl font-light">+</span>
                    </div>
                    <h3 className="text-slate-900 font-light">Nominate an Author</h3>
                    <p className="text-sm text-slate-500 mt-2">Who should be on the Wall of Fame?</p>
                  </div>
                </div>
              </div>
            )}

            {/* Member Directory Tab */}
            {activeTab === 'directory' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h1 className="text-3xl font-thin text-slate-900 mb-2 flex items-center gap-3">
                    <Users className={`w-8 h-8 ${currentTheme.text}`} />
                    Member Directory
                  </h1>
                  <p className="text-slate-500 font-light">Connect with other readers in the club.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Sarah Jenkins', role: 'Avid Reader', genre: 'Sci-Fi', books: 14 },
                    { name: 'Michael Chen', role: 'Moderator', genre: 'Non-Fiction', books: 28 },
                    { name: 'Emma Watson', role: 'New Member', genre: 'Fantasy', books: 2 },
                    { name: 'David O.', role: 'Author', genre: 'Finance', books: 42 },
                    { name: 'Lisa Ray', role: 'Member', genre: 'Romance', books: 9 },
                  ].map((member, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center hover:border-slate-300 transition-colors">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`} className="w-16 h-16 rounded-full mb-4 shadow-sm" alt={member.name} />
                      <h3 className="text-lg font-light text-slate-900">{member.name}</h3>
                      <p className="text-sm text-slate-500 font-light mb-4">{member.role}</p>
                      
                      <div className="flex gap-4 w-full border-t border-slate-100 pt-4 mt-auto">
                        <div className="flex-1">
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-light">Top Genre</p>
                          <p className="text-sm font-light text-slate-700">{member.genre}</p>
                        </div>
                        <div className="w-px bg-slate-100"></div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-light">Books</p>
                          <p className="text-sm font-light text-slate-700">{member.books}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            
            {/* Sub-Groups Tab */}
            {activeTab === 'subgroups' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8 flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-thin text-slate-900 mb-2 flex items-center gap-3">
                      <Layers className={`w-8 h-8 ${currentTheme.text}`} />
                      {activeGroup ? activeGroup.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Sub-Groups I'm In"}
                    </h1>
                    <p className="text-slate-500 font-light">
                      {activeGroup ? "Live Chat Room" : "Smaller, niche reading circles within the main club."}
                    </p>
                  </div>
                  {activeGroup ? (
                    <button onClick={() => setActiveGroup(null)} className={`px-4 py-2 rounded-lg text-sm font-light text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50`}>
                      Leave Chat
                    </button>
                  ) : (
                    <button className={`px-4 py-2 rounded-lg text-sm font-light text-white shadow-sm ${currentTheme.bg} hover:opacity-90`}>
                      Browse All Groups
                    </button>
                  )}
                </div>

                {activeGroup ? (
                  <LiveChat subgroupId={activeGroup} themeColorClass={currentTheme.text} />
                ) : (
                  <div className="space-y-4">
                    {[
                      { id: 'scifi-geeks', name: 'The Sci-Fi Geeks', members: 12, activity: 'Very Active', desc: 'Exploring the outer limits of space and time.' },
                      { id: 'nonfiction-nerds', name: 'Non-Fiction Nerds', members: 34, activity: 'Active', desc: 'Biographies, history, and wealth creation.' },
                      { id: 'fantasy-realm', name: 'Fantasy Realm', members: 56, activity: 'Active', desc: 'Dragons, magic, and epic quests.' },
                    ].map((group, i) => (
                      <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center hover:border-slate-300 transition-colors">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${currentTheme.light} ${currentTheme.text}`}>
                          <Layers className="w-8 h-8" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="text-xl font-light text-slate-900 mb-1">{group.name}</h3>
                          <p className="text-sm text-slate-500 font-light mb-2">{group.desc}</p>
                          <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-slate-400 font-light">
                            <span>{group.members} Members</span>
                            <span>&bull;</span>
                            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span> {group.activity}</span>
                          </div>
                        </div>
                        <button onClick={() => setActiveGroup(group.id)} className="px-5 py-2 border border-slate-200 rounded-lg text-sm font-light text-slate-600 hover:bg-slate-50 transition-colors w-full md:w-auto">
                          Enter Chat
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
                
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 mb-6">
                  <h3 className="text-xl font-light text-slate-900 mb-2 flex items-center gap-2"><Palette className="w-5 h-5 text-slate-400" /> Genre Themes (Accent Colors)</h3>
                  <p className="text-sm text-slate-500 mb-8">Personalize your dashboard's accent colors based on your favorite literary genre.</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Object.entries(themeClasses).map(([key, theme]) => (
                      <button
                        key={key}
                        onClick={() => changeTheme(key)}
                        className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                          themeColor === key 
                            ? `${theme.border} bg-slate-50 scale-105 shadow-sm` 
                            : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full mb-3 shadow-inner ${theme.bg}`}></div>
                        <span className="text-sm font-light text-slate-700">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 mb-6">
                  <h3 className="text-xl font-light text-slate-900 mb-2">Display & Layout</h3>
                  <p className="text-sm text-slate-500 mb-8">Adjust how the dashboard interface feels.</p>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div>
                        <p className="font-light text-slate-800 text-sm">Dark Mode</p>
                        <p className="text-slate-500 text-xs">Switch to a dark theme for late-night reading.</p>
                      </div>
                      <button className="w-11 h-6 bg-slate-200 rounded-full relative cursor-not-allowed opacity-50">
                        <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div>
                        <p className="font-light text-slate-800 text-sm">Compact Sidebar</p>
                        <p className="text-slate-500 text-xs">Collapse the sidebar to icon-only mode to save space.</p>
                      </div>
                      <button className="w-11 h-6 bg-slate-200 rounded-full relative cursor-pointer hover:bg-slate-300 transition-colors">
                        <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-light text-slate-800 text-sm">Literary Typography (Serif)</p>
                        <p className="text-slate-500 text-xs">Use a classic serif font across the dashboard for a bookish feel.</p>
                      </div>
                      <button className="w-11 h-6 bg-slate-200 rounded-full relative cursor-pointer hover:bg-slate-300 transition-colors">
                        <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                  <h3 className="text-xl font-light text-slate-900 mb-2">Dashboard Widgets</h3>
                  <p className="text-sm text-slate-500 mb-8">Toggle which widgets appear on your dashboard overview.</p>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className={`w-4 h-4 rounded border-slate-300 ${currentTheme.text} focus:ring-0`} />
                      <span className="text-sm text-slate-700">Show Leaderboard & Rankings</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className={`w-4 h-4 rounded border-slate-300 ${currentTheme.text} focus:ring-0`} />
                      <span className="text-sm text-slate-700">Show Reading Stats (Books/Year)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className={`w-4 h-4 rounded border-slate-300 ${currentTheme.text} focus:ring-0`} />
                      <span className="text-sm text-slate-700">Show Quote Wall Contributions</span>
                    </label>
                  </div>
                </div>

              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                  <h3 className="text-xl font-medium text-slate-900 mb-6">Profile Information</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input type="text" disabled value={email} className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-500 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                      <input type="text" disabled value={profile?.display_name || ''} placeholder="Set a display name" className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                      <input type="text" disabled value={profile?.role || 'Member'} className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-500 sm:text-sm capitalize" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center text-slate-500 py-16">
                  <Settings className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-light text-slate-900 mb-2">Club Settings</h3>
                  <p className="font-light mb-8 max-w-sm mx-auto">Manage your club configurations, library, and user access in the dedicated Admin Portal.</p>
                  
                  {profile?.role === 'owner' || profile?.role === 'admin' ? (
                    <Link href="/BWRF-admin" className="inline-block bg-slate-900 text-white px-6 py-2 rounded-lg font-light text-sm hover:bg-slate-800 transition shadow-sm">
                      Open Admin Portal
                    </Link>
                  ) : (
                    <p className="text-xs text-rose-500 bg-rose-50 inline-block px-3 py-1 rounded border border-rose-100">
                      You must be an Owner or Admin to access club settings.
                    </p>
                  )}
                </div>
              </div>
            )}

            
            {/* Discussions Tab */}
            {activeTab === 'discussions' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                <div className="mb-8 flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-thin text-slate-900 mb-2 flex items-center gap-3">
                      <MessageSquare className={`w-8 h-8 ${currentTheme.text}`} />
                      Community Discussions
                    </h1>
                    <p className="text-slate-500 font-light">Join the conversation on our latest reads.</p>
                  </div>
                  <Link href="/discussions" className={`px-6 py-2 rounded-lg text-sm font-light text-white shadow-sm ${currentTheme.bg} hover:opacity-90 transition-opacity`}>
                    Open Full Board
                  </Link>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
                  <MessageSquare className="w-16 h-16 text-slate-200 mb-4" />
                  <h3 className="text-xl font-light text-slate-900 mb-2">Active Threads Await</h3>
                  <p className="text-slate-500 font-light mb-6 max-w-md">Our community is actively discussing 3 books right now. Dive into the dedicated discussion board to share your thoughts.</p>
                  <Link href="/discussions" className="text-sm font-light uppercase tracking-widest text-slate-500 hover:text-slate-900 border-b border-transparent hover:border-slate-900 pb-1 transition-all">Launch Discussions &rarr;</Link>
                </div>
              </div>
            )}

            {/* Vote Tab */}
            {activeTab === 'vote' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                <div className="mb-8 flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-thin text-slate-900 mb-2 flex items-center gap-3">
                      <CheckSquare className={`w-8 h-8 ${currentTheme.text}`} />
                      Voting Booth
                    </h1>
                    <p className="text-slate-500 font-light">Help us choose next month's selection.</p>
                  </div>
                  <Link href="/vote" className={`px-6 py-2 rounded-lg text-sm font-light text-white shadow-sm ${currentTheme.bg} hover:opacity-90 transition-opacity`}>
                    Cast Your Vote
                  </Link>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                  <div className={`w-full md:w-1/3 p-8 flex flex-col justify-center items-center text-center ${currentTheme.light}`}>
                    <div className="text-5xl font-thin text-slate-900 mb-2">3</div>
                    <div className="text-xs uppercase tracking-widest text-slate-500 font-light">Days Left</div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-center">
                    <h3 className="text-xl font-light text-slate-900 mb-2">August Selection is Open</h3>
                    <p className="text-slate-500 font-light mb-6">There are currently 4 nominated books waiting for your approval. Your vote decides what we read next!</p>
                    <div>
                      <Link href="/vote" className="inline-block text-sm font-light uppercase tracking-widest text-slate-500 hover:text-slate-900 border-b border-transparent hover:border-slate-900 pb-1 transition-all">Enter Voting Booth &rarr;</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Badges Tab */}
            {activeTab === 'badges' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h1 className="text-3xl font-thin text-slate-900 mb-2 flex items-center gap-3">
                    <Award className={`w-8 h-8 ${currentTheme.text}`} />
                    Badges & Achievements
                  </h1>
                  <p className="text-slate-500 font-light">Unlock exclusive flairs as you participate in the club.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { name: "First Chapter", desc: "Read your first book with us.", earned: true },
                    { name: "Debater", desc: "Leave 10 comments in discussions.", earned: true },
                    { name: "Speed Reader", desc: "Finish a book 2 weeks early.", earned: false },
                    { name: "Bookworm", desc: "Read 5 books in a row.", earned: false },
                  ].map((badge, i) => (
                    <div key={i} className={`bg-white rounded-xl border ${badge.earned ? 'border-slate-300' : 'border-slate-200 border-dashed opacity-60'} shadow-sm p-6 flex flex-col items-center text-center`}>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm ${badge.earned ? `${currentTheme.light} ${currentTheme.text}` : 'bg-slate-100 text-slate-400'}`}>
                        <Award className="w-8 h-8" />
                      </div>
                      <h3 className="text-sm font-light text-slate-900 mb-1">{badge.name}</h3>
                      <p className="text-xs text-slate-500 font-light">{badge.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
                <div className="mb-8">
                  <h1 className="text-3xl font-thin text-slate-900 mb-2 flex items-center gap-3">
                    <Trophy className={`w-8 h-8 ${currentTheme.text}`} />
                    Leaderboard
                  </h1>
                  <p className="text-slate-500 font-light">The most active readers and contributors this month.</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {[
                      { rank: 1, name: "David O.", points: 1250, change: "up" },
                      { rank: 2, name: "Sarah Jenkins", points: 980, change: "same" },
                      { rank: 3, name: "Michael Chen", points: 850, change: "down" },
                      { rank: 4, name: "You", points: 720, change: "up" },
                      { rank: 5, name: "Emma Watson", points: 640, change: "same" },
                    ].map((user, i) => (
                      <div key={i} className={`p-4 flex items-center gap-4 ${user.name === 'You' ? currentTheme.light : 'hover:bg-slate-50'} transition-colors`}>
                        <div className="w-8 text-center text-slate-400 font-light">{user.rank}</div>
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} className="w-10 h-10 rounded-full" alt={user.name} />
                        <div className="flex-1 font-light text-slate-900">{user.name}</div>
                        <div className="font-light text-slate-600">{user.points} pts</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quote Wall Tab */}
            {activeTab === 'quote_wall' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8 flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-thin text-slate-900 mb-2 flex items-center gap-3">
                      <Quote className={`w-8 h-8 ${currentTheme.text}`} />
                      Quote Wall
                    </h1>
                    <p className="text-slate-500 font-light">Favorite lines curated by the community.</p>
                  </div>
                  <button className={`px-4 py-2 rounded-lg text-sm font-light text-white shadow-sm ${currentTheme.bg} hover:opacity-90`}>
                    Submit Quote
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 hover:shadow-md transition-shadow">
                    <Quote className="w-8 h-8 text-slate-200 mb-4" />
                    <p className="text-lg font-light text-slate-800 leading-relaxed mb-6">"Perhaps one did not want to be loved so much as to be understood."</p>
                    <div className="text-sm font-light text-slate-500">&mdash; George Orwell, <span className="italic">1984</span></div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 hover:shadow-md transition-shadow">
                    <Quote className="w-8 h-8 text-slate-200 mb-4" />
                    <p className="text-lg font-light text-slate-800 leading-relaxed mb-6">"And so with the sunshine and the great bursts of leaves growing on the trees, I had that familiar conviction that life was beginning over again with the summer."</p>
                    <div className="text-sm font-light text-slate-500">&mdash; F. Scott Fitzgerald, <span className="italic">The Great Gatsby</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* RSVPs Tab */}
            {activeTab === 'rsvps' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                <div className="mb-8 flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-thin text-slate-900 mb-2 flex items-center gap-3">
                      <Calendar className={`w-8 h-8 ${currentTheme.text}`} />
                      Upcoming Meetings
                    </h1>
                    <p className="text-slate-500 font-light">Manage your RSVPs and calendar.</p>
                  </div>
                  <Link href="/events" className={`px-6 py-2 rounded-lg text-sm font-light text-white shadow-sm ${currentTheme.bg} hover:opacity-90 transition-opacity`}>
                    All Events
                  </Link>
                </div>
                
                {email === 'test@brwf.com' ? (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center">
                    <div className={`w-24 h-24 rounded-xl flex flex-col items-center justify-center ${currentTheme.light} ${currentTheme.text}`}>
                      <span className="text-sm uppercase tracking-widest font-light">Aug</span>
                      <span className="text-3xl font-thin">28</span>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-light text-slate-900 mb-2">August Book Discussion</h3>
                      <p className="text-sm text-slate-500 font-light mb-4">Join us online to discuss Jewish Secrets of Wealth Creation.</p>
                      <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-light text-slate-400">
                        <span>7:00 PM EST</span>
                        <span>&bull;</span>
                        <span>Google Meet</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      <button className={`px-6 py-2 rounded-lg text-sm font-light text-white shadow-sm ${currentTheme.bg} hover:opacity-90`}>
                        I'm Attending
                      </button>
                      <button className="px-6 py-2 rounded-lg text-sm font-light text-slate-500 border border-slate-200 hover:bg-slate-50">
                        Can't Make It
                      </button>
                    </div>
                  </div>
                ) : nextEvent ? (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center">
                    <div className={`w-24 h-24 rounded-xl flex flex-col items-center justify-center ${currentTheme.light} ${currentTheme.text}`}>
                      <span className="text-sm uppercase tracking-widest font-light">
                        {new Date(nextEvent.date_time).toLocaleDateString(undefined, { month: 'short' })}
                      </span>
                      <span className="text-3xl font-thin">
                        {new Date(nextEvent.date_time).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-light text-slate-900 mb-2">{nextEvent.title}</h3>
                      <p className="text-sm text-slate-500 font-light mb-4">{nextEvent.description}</p>
                      <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-light text-slate-400">
                        <span>{new Date(nextEvent.date_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>&bull;</span>
                        <span>Online</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                      <Link href="/events" className={`px-6 py-2 rounded-lg text-sm font-light text-white text-center shadow-sm ${currentTheme.bg} hover:opacity-90`}>
                        Manage RSVP
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                    <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-light text-slate-900 mb-2">No Upcoming Meetings</h3>
                    <p className="text-slate-500 font-light">Check back later for new events.</p>
                  </div>
                )}
              </div>
            )}

            {/* Live Meeting Tab */}
            {activeTab === 'live_meeting' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl text-center">
                {isEventToday && nextEvent.meeting_mode === 'online' ? (
                  <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden min-h-[500px] flex flex-col relative">
                    <iframe
                      allow="camera; microphone; fullscreen; display-capture; autoplay"
                      src={`https://meet.jit.si/BWRF_${nextEvent.id}`}
                      style={{ width: '100%', height: '500px', border: '0', borderRadius: '1rem' }}
                    ></iframe>
                  </div>
                ) : isEventToday && nextEvent.meeting_mode === 'physical' ? (
                  <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden min-h-[500px] flex flex-col items-center justify-center p-8 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h1 className="text-4xl font-thin text-white mb-4">In-Person Meeting Today</h1>
                      <p className="text-slate-400 font-light max-w-md mx-auto mb-4">Today's meeting is physical, so the live video room is disabled.</p>
                      <div className="bg-white/10 px-6 py-4 rounded-xl backdrop-blur-sm border border-white/10 mb-8">
                        <span className="text-emerald-400 font-medium block mb-1">Location:</span>
                        <span className="text-white text-lg">{nextEvent.location}</span>
                      </div>
                      <Link href="/events" className="text-sm font-light uppercase tracking-widest text-slate-500 hover:text-white border-b border-transparent hover:border-white pb-1 transition-all">View Details &rarr;</Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden min-h-[500px] flex flex-col items-center justify-center p-8 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center animate-pulse">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h1 className="text-4xl font-thin text-white mb-4">No Active Meeting</h1>
                      <p className="text-slate-400 font-light max-w-md mx-auto mb-8">This space transforms into a live video room during our scheduled online book club discussions. Check the Events tab for the next gathering.</p>
                      <Link href="/events" className="text-sm font-light uppercase tracking-widest text-slate-500 hover:text-white border-b border-transparent hover:border-white pb-1 transition-all">View Schedule &rarr;</Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
                <div className="mb-8 flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-thin text-slate-900 mb-2 flex items-center gap-3">
                      <BellRing className={`w-8 h-8 ${currentTheme.text}`} />
                      Notification Preferences
                    </h1>
                    <p className="text-slate-500 font-light">Control how we contact you.</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div>
                        <p className="font-light text-slate-800 text-sm">New Book Announcements</p>
                        <p className="text-slate-500 text-xs">When the monthly selection is revealed.</p>
                      </div>
                      <input type="checkbox" defaultChecked className={`w-4 h-4 rounded border-slate-300 ${currentTheme.text} focus:ring-0 cursor-pointer`} />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div>
                        <p className="font-light text-slate-800 text-sm">Event Reminders</p>
                        <p className="text-slate-500 text-xs">24 hours before a live meeting.</p>
                      </div>
                      <input type="checkbox" defaultChecked className={`w-4 h-4 rounded border-slate-300 ${currentTheme.text} focus:ring-0 cursor-pointer`} />
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-light text-slate-800 text-sm">Discussion Replies</p>
                        <p className="text-slate-500 text-xs">When someone replies to your comment.</p>
                      </div>
                      <input type="checkbox" defaultChecked className={`w-4 h-4 rounded border-slate-300 ${currentTheme.text} focus:ring-0 cursor-pointer`} />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
