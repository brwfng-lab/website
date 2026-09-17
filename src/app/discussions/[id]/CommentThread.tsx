'use client'

import { useState } from 'react'
import { addComment } from './actions'
import { Send, CornerDownRight } from 'lucide-react'

export default function CommentThread({ 
  discussionId, 
  comments 
}: { 
  discussionId: string, 
  comments: any[] 
}) {
  const [newComment, setNewComment] = useState('')
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsPending(true)
    try {
      await addComment(discussionId, newComment)
      setNewComment('')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="mt-12">
      <h3 className="text-xl font-light text-slate-900 mb-8 border-b border-slate-200 pb-4">
        {comments.length} Comments
      </h3>

      <div className="space-y-8 mb-12">
        {comments.map((comment, i) => (
          <div key={comment.id} className="flex gap-4">
            <div className="flex-shrink-0">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.profiles?.display_name || 'A')}&background=f8fafc&color=64748b`} 
                alt="" 
                className="w-10 h-10 rounded-full border border-slate-200"
              />
            </div>
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-5 shadow-sm relative group">
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-medium text-slate-900 text-sm">
                  {comment.profiles?.display_name || 'Anonymous'}
                </span>
                <span className="text-xs text-slate-400 font-light">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-600 font-light text-sm leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
              
              <button className="absolute -bottom-3 right-4 bg-slate-50 border border-slate-200 text-slate-500 text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-slate-900">
                <CornerDownRight className="w-3 h-3" /> Reply
              </button>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center text-slate-400 font-light py-8 bg-slate-50 rounded-xl border border-slate-100 dashed">
            No one has commented yet. Be the first to share your thoughts!
          </div>
        )}
      </div>

      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 shadow-sm">
        <h4 className="text-sm font-medium text-slate-900 mb-4">Leave a Reply</h4>
        <form onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isPending}
            placeholder="What are your thoughts?"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-light focus:outline-none focus:border-slate-400 min-h-[120px] mb-4 bg-white"
          />
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={isPending || !newComment.trim()}
              className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-light shadow-sm hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isPending ? 'Posting...' : (
                <>
                  <Send className="w-4 h-4" /> Post Reply
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
