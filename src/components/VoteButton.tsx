'use client'

import { useState } from 'react'
import { castVote } from './actions'

export default function VoteButton({ 
  bookId, 
  hasVoted, 
  initialCount 
}: { 
  bookId: string, 
  hasVoted: boolean, 
  initialCount: number 
}) {
  const [isPending, setIsPending] = useState(false)
  const [voted, setVoted] = useState(hasVoted)
  const [count, setCount] = useState(initialCount)

  const handleVote = async () => {
    setIsPending(true)
    
    // Optimistic UI update
    setVoted(!voted)
    setCount(voted ? count - 1 : count + 1)
    
    try {
      await castVote(bookId)
    } catch (err) {
      // Revert on error
      setVoted(voted)
      setCount(initialCount)
      alert("Failed to cast vote. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex items-center justify-between w-full mt-auto">
      <span className="bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-light tracking-wide">
        {count} {count === 1 ? 'VOTE' : 'VOTES'}
      </span>
      <button 
        onClick={handleVote}
        disabled={isPending}
        className={`px-5 py-2 rounded-lg transition-all font-light text-sm shadow-sm flex items-center justify-center min-w-[80px] ${
          voted 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
            : 'bg-slate-900 text-white hover:bg-slate-800 border border-slate-900'
        }`}
      >
        {isPending ? '...' : voted ? 'Voted ✓' : 'Vote'}
      </button>
    </div>
  )
}
