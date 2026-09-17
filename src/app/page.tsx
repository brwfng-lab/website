import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { 
  Calendar, MessageCircle, ChevronRight, Star, Medal, 
  History, Quote, HelpCircle, Trophy, UsersRound 
} from 'lucide-react'
import PastReadsCarousel from '@/components/PastReadsCarousel'
import PhotoBentoGrid from '@/components/PhotoBentoGrid'

export const revalidate = 0; // completely disable caching for now

export default async function Home() {
  const supabase = await createClient()

  // Fetch the current book
  const { data: currentBook } = await supabase
    .from('books')
    .select('*')
    .eq('status', 'current')
    .single()

  // Fetch the next upcoming event
  const { data: nextEvent } = await supabase
    .from('events')
    .select('*')
    .gte('date_time', new Date().toISOString())
    .order('date_time', { ascending: true })
    .limit(1)
    .single()

  // Fetch past books for the slideshow
  const { data: pastBooks } = await supabase
    .from('books')
    .select('*')
    .eq('status', 'past')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left: Text Content */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl lg:text-7xl font-thin tracking-wide text-slate-900 tracking-tight mb-8 leading-tight">
                Read together,<br className="hidden md:block"/> <span className="text-blue-600">discuss freely,</span><br className="hidden md:block"/> and vote on what&apos;s next.
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed font-light">
                Book Review With Friends is a community-driven club where every member helps shape the journey. Join us for our next chapter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
                <Link 
                  href="/login" 
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-light tracking-wide rounded-none shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-lg text-center"
                >
                  Join the Club
                </Link>
                <Link 
                  href="#bento-grid" 
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-light tracking-wide rounded-none shadow-sm border border-slate-200 hover:bg-slate-50 transition-all text-lg text-center"
                >
                  Explore Features
                </Link>
              </div>
            </div>

            {/* Right: Illustration */}
            <div className="flex-1 w-full max-w-lg md:max-w-none md:-mt-16 lg:-mt-24">
              <img 
                src="/Livingroom-rafiki.png" 
                alt="Reading in the living room" 
                className="w-full h-auto object-contain drop-shadow-xl hover:-translate-y-2 transition-transform duration-500"
              />
            </div>
            
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
            
            {/* Left: Founder Photo */}
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 translate-x-3 translate-y-3 rounded-2xl"></div>
                <img 
                  src="/owner.png" 
                  alt="Community Founder" 
                  className="relative z-10 w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl border-4 border-white shadow-xl"
                />
              </div>
            </div>

            {/* Right: Welcome Message */}
            <div className="w-full md:w-2/3 text-center md:text-left">
              <h2 className="text-sm font-light tracking-widest uppercase text-blue-600 mb-4">Meet the Founder</h2>
              <h3 className="text-3xl md:text-4xl font-thin text-slate-900 mb-6 leading-tight">
                Welcome to our reading sanctuary.
              </h3>
              <div className="space-y-4 text-lg text-slate-600 font-light leading-relaxed">
                <p>
                  I started Book Review With Friends because I believe that books are meant to be shared. There is a unique magic that happens when we read a story alone, and then come together to discover how it resonated differently with someone else.
                </p>
                <p>
                  Our community is built on open minds, lively debates, and a shared love for the written word. Whether you're a lifelong bibliophile or just getting back into reading, you have a place here. Grab a cup of coffee, find a comfortable spot, and let's turn the page together.
                </p>
              </div>
              <div className="mt-8">
                <p className="font-medium text-slate-900 signature font-serif text-xl italic">— Shola Odeyinde</p>
                <p className="text-sm text-slate-500 font-light">Founder, Book Reviews With Friends</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <div id="bento-grid" className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-[2px] bg-white border-2 border-white auto-rows-auto max-w-7xl mx-auto mb-24 mt-24">
        
        {/* 1. Current Read / Discussions - Large Hero Box */}
        <section className="md:col-span-2 lg:col-span-2 md:row-span-2 bg-blue-50/80 rounded-none  p-8 shadow-sm flex flex-col relative overflow-hidden group">
          <h2 className="text-sm font-light tracking-wide tracking-wider uppercase text-blue-600 mb-6">Current Read</h2>
          
          {currentBook ? (
            <div className="flex flex-col sm:flex-row gap-8 flex-1">
              {currentBook.cover_image_url && (
                <div className="shrink-0">
                  <img 
                    src={currentBook.cover_image_url} 
                    alt={currentBook.title}
                    className="w-40 h-60 sm:w-48 sm:h-72 object-cover rounded-none shadow-md ring-1 ring-black/5"
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col">
                <h3 className="text-3xl sm:text-4xl font-thin tracking-wide mb-2 text-slate-900">{currentBook.title}</h3>
                <p className="text-lg text-slate-500 mb-8 font-light">by {currentBook.author}</p>
                
                {/* Reading Progress */}
                <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-xs font-light uppercase tracking-wider text-slate-500">Current Goal</p>
                      <p className="text-sm text-slate-900">Week 2: Chapters 4-7</p>
                    </div>
                    <span className="text-sm font-light text-slate-500">45%</span>
                  </div>
                  <div className="w-full bg-blue-100/50 h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-full w-[45%]"></div>
                  </div>
                </div>

                <div className="mt-auto">
                  <Link 
                    href="/discussions" 
                    className="inline-flex items-center text-white font-light bg-slate-900 hover:bg-slate-800 px-6 py-3 rounded-none transition-all shadow-sm w-full sm:w-auto justify-center"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Join Discussion
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-slate-400 italic">No current book selected.</p>
            </div>
          )}
        </section>

        {/* 2. Events & Meetings */}
        <Link href="/events" className="md:col-span-1 lg:col-span-1 md:row-span-1 bg-indigo-50 rounded-none  p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white text-blue-600 shadow-sm rounded-none">
              <Calendar className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <h3 className="font-light tracking-wide text-slate-900 text-lg mb-1">Upcoming Event</h3>
          {nextEvent ? (
            <div className="mt-2">
              <p className="text-sm font-light text-slate-800 truncate">{nextEvent.title}</p>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(nextEvent.date_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 mt-2">No upcoming events.</p>
          )}
        </Link>

        {/* 3. Vote for Next Book */}
        <Link href="/vote" className="md:col-span-1 lg:col-span-1 md:row-span-1 bg-violet-900 rounded-none p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
             <Star className="w-24 h-24" />
          </div>
          <div className="relative z-10 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-light tracking-wide text-xl mb-2">Vote for Next Book</h3>
              <p className="text-sm text-slate-400">Help decide our next adventure.</p>
            </div>
            <div className="mt-6 flex items-center font-light text-blue-400 group-hover:text-blue-300">
              Voting Booth <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>

        {/* 4. Sub-Groups */}
        <Link href="/subgroups" className="md:col-span-2 lg:col-span-2 md:row-span-1 bg-sky-50 rounded-none  p-6 shadow-sm hover:shadow-md transition-shadow group flex items-center">
          <div className="p-4 bg-white text-indigo-600 shadow-sm rounded-none mr-6">
            <UsersRound className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="font-light tracking-wide text-slate-900 text-xl mb-1">Sub-Groups</h3>
            <p className="text-sm text-slate-500">Join optional genre-focused mini-clubs.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
        </Link>

        {/* 5. Archive Timeline */}
        <Link href="/archive" className="md:col-span-1 lg:col-span-1 bg-rose-50 rounded-none  p-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center mb-4 text-slate-700">
            <History className="w-5 h-5 mr-2" />
            <h3 className="font-light tracking-wide">Archive</h3>
          </div>
          <p className="text-sm text-slate-500">Visual journey of every book we&apos;ve read.</p>
        </Link>

        {/* 6. Reviews & Ratings */}
        <Link href="/reviews" className="md:col-span-1 lg:col-span-1 bg-amber-50 rounded-none  p-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center mb-4 text-amber-600">
            <Star className="w-5 h-5 mr-2" />
            <h3 className="font-light tracking-wide text-slate-900">Reviews</h3>
          </div>
          <p className="text-sm text-slate-500">Club-average scores & ratings.</p>
        </Link>

        {/* 7. Reading Challenges */}
        <Link href="/challenges" className="md:col-span-1 lg:col-span-1 bg-emerald-50 rounded-none  p-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center mb-4 text-emerald-600">
            <Medal className="w-5 h-5 mr-2" />
            <h3 className="font-light tracking-wide text-slate-900">Challenges</h3>
          </div>
          <p className="text-sm text-slate-500">Track streaks and hit goals.</p>
        </Link>

        {/* 8. Quote Wall */}
        <Link href="/quotes" className="md:col-span-1 lg:col-span-1 bg-purple-50 rounded-none  p-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center mb-4 text-purple-600">
            <Quote className="w-5 h-5 mr-2" />
            <h3 className="font-light tracking-wide text-slate-900">Quote Wall</h3>
          </div>
          <p className="text-sm text-slate-500">Member-submitted favorites.</p>
        </Link>

        {/* 9. Polls & Quizzes */}
        <Link href="/polls" className="md:col-span-1 lg:col-span-1 bg-pink-50 rounded-none  p-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center mb-4 text-rose-500">
            <HelpCircle className="w-5 h-5 mr-2" />
            <h3 className="font-light tracking-wide text-slate-900">Polls & Quizzes</h3>
          </div>
          <p className="text-sm text-slate-500">Playful post-book content.</p>
        </Link>

        {/* 10. Leaderboard */}
        <Link href="/leaderboard" className="md:col-span-1 lg:col-span-1 bg-yellow-50 rounded-none  p-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center mb-4 text-yellow-600">
            <Trophy className="w-5 h-5 mr-2" />
            <h3 className="font-light tracking-wide text-slate-900">Leaderboard</h3>
          </div>
          <p className="text-sm text-slate-500">Recognition for top readers.</p>
        </Link>

      </div>

      {/* Club Stats / Impact */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] bg-white border-2 border-white">
          <div className="bg-slate-50 p-8 text-center">
            <p className="text-4xl font-thin text-slate-900 mb-2">42</p>
            <p className="text-sm font-light text-slate-500 uppercase tracking-widest">Books Read</p>
          </div>
          <div className="bg-slate-50 p-8 text-center">
            <p className="text-4xl font-thin text-slate-900 mb-2">128</p>
            <p className="text-sm font-light text-slate-500 uppercase tracking-widest">Active Members</p>
          </div>
          <div className="bg-slate-50 p-8 text-center">
            <p className="text-4xl font-thin text-slate-900 mb-2">15.3k</p>
            <p className="text-sm font-light text-slate-500 uppercase tracking-widest">Pages Read</p>
          </div>
          <div className="bg-slate-50 p-8 text-center">
            <p className="text-4xl font-thin text-slate-900 mb-2">1,204</p>
            <p className="text-sm font-light text-slate-500 uppercase tracking-widest">Discussions</p>
          </div>
        </div>
      </section>

      {/* Past Books Slideshow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-thin tracking-wide text-slate-900 tracking-tight">Past Reads</h2>
          <Link href="/archive" className="text-blue-600 font-light hover:text-blue-700 flex items-center transition-colors">
            View Archive <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <PastReadsCarousel pastBooks={pastBooks || []} />
      </section>

      {/* Community Vibes Bento Grid */}
      <PhotoBentoGrid />

      {/* Call to Action */}
      <section className="bg-blue-600 py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/50 text-blue-50 text-sm font-light mb-8 border border-blue-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Accepting New Members
          </div>
          <h2 className="text-4xl md:text-5xl font-thin tracking-wide text-white mb-6">
            Ready to turn the next page?
          </h2>
          <p className="text-blue-100 font-light text-lg mb-10 max-w-2xl mx-auto">
            Join a thriving community of readers, dive into deep discussions, and cast your vote on the books that shape our journey.
          </p>
          <Link 
            href="/login" 
            className="px-10 py-4 bg-white text-blue-600 font-light tracking-wide rounded-none shadow-lg hover:bg-slate-50 hover:-translate-y-0.5 transition-all text-lg"
          >
            Join the Club Today
          </Link>
        </div>
      </section>
    </>
  )
}


