import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import CommentThread from './CommentThread'

export const revalidate = 0;

export default async function DiscussionThreadPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Fetch the discussion
  const { data: discussion, error } = await supabase
    .from('discussions')
    .select(`
      *,
      books ( id, title, cover_image_url ),
      profiles ( display_name )
    `)
    .eq('id', params.id)
    .single()

  if (error || !discussion) {
    notFound()
  }

  // Fetch comments
  const { data: comments } = await supabase
    .from('discussion_comments')
    .select('*, profiles(display_name)')
    .eq('discussion_id', discussion.id)
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/discussions" className="inline-flex items-center text-sm font-light text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Discussions
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-light text-slate-900">{discussion.title}</h1>
            <div className="flex items-center gap-2 text-sm text-slate-500 font-light mt-1">
              <span>Posted by {discussion.profiles?.display_name || 'Anonymous'}</span>
              <span>&bull;</span>
              <span>{new Date(discussion.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {discussion.books && (
          <div className="mb-6 flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
            {discussion.books.cover_image_url && (
              <img src={discussion.books.cover_image_url} alt="" className="w-10 h-14 object-cover rounded shadow-sm" />
            )}
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-light mb-1">Related Book</p>
              <p className="text-sm font-medium text-slate-700">{discussion.books.title}</p>
            </div>
          </div>
        )}

        <div className="prose prose-slate max-w-none font-light leading-relaxed whitespace-pre-wrap">
          {discussion.content}
        </div>
      </div>

      <CommentThread discussionId={discussion.id} comments={comments || []} />
    </div>
  )
}
