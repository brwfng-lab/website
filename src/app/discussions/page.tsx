import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import NewTopicModal from './NewTopicModal'

export const revalidate = 0; // always fetch fresh

interface DiscussionRow {
  id: string;
  title: string;
  created_at: string;
  books: { id: string; title: string } | null;
  profiles: { display_name: string } | null;
}

export default async function DiscussionsPage() {
  const supabase = await createClient()

  // Fetch discussions with book info and comment count
  // In a real app we might use a database view or RPC for the comment count.
  const { data: discussions } = await supabase
    .from('discussions')
    .select(`
      id,
      title,
      created_at,
      books ( id, title ),
      profiles ( display_name )
    `)
    .order('created_at', { ascending: false })

  // Fetch all books for the modal dropdown
  const { data: books } = await supabase.from('books').select('id, title')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light tracking-wide text-slate-900">Discussions</h1>
        <NewTopicModal books={books || []} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {discussions && discussions.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {discussions.map((discussion: any) => (
              <li key={discussion.id} className="hover:bg-gray-50 transition">
                <Link href={`/discussions/${discussion.id}`} className="block p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-light text-slate-900 mb-1">
                        {discussion.title}
                      </h2>
                      <div className="text-sm text-slate-400 flex items-center space-x-2">
                        <span>Started by {discussion.profiles?.display_name || 'Anonymous'}</span>
                        <span>&bull;</span>
                        <span className="bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded text-xs">
                          {discussion.books?.title}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center text-gray-400">
                      <MessageSquare className="w-5 h-5 mr-1" />
                      <span className="text-sm">Join</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No discussions yet. Be the first to start one!</p>
          </div>
        )}
      </div>
    </div>
  )
}
