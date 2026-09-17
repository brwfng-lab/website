'use client'

import { useState } from 'react'
import { createDiscussion } from './actions'
import { X } from 'lucide-react'

export default function NewTopicModal({ books }: { books: {id: string, title: string}[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [bookId, setBookId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    try {
      await createDiscussion(title, content, bookId || null)
      setIsOpen(false)
      setTitle('')
      setContent('')
      setBookId('')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-light shadow-sm hover:bg-slate-800 transition"
      >
        New Topic
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-light text-slate-900">Start a New Discussion</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-light text-slate-700 mb-2">Topic Title</label>
                <input 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-light focus:outline-none focus:border-slate-400"
                  placeholder="What's on your mind?"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-light text-slate-700 mb-2">Related Book (Optional)</label>
                <select 
                  value={bookId}
                  onChange={(e) => setBookId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-light bg-white focus:outline-none focus:border-slate-400"
                >
                  <option value="">-- General Discussion --</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-light text-slate-700 mb-2">Message</label>
                <textarea 
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm font-light focus:outline-none focus:border-slate-400 min-h-[150px]"
                  placeholder="Share your thoughts, questions, or hot takes..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2 rounded-lg text-sm font-light text-slate-600 hover:bg-slate-50 border border-slate-200 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isPending}
                  className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-light shadow-sm hover:bg-slate-800 transition disabled:opacity-50"
                >
                  {isPending ? 'Posting...' : 'Post Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
