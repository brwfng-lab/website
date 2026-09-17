'use client'

import { useState } from 'react'
import { toggleRsvp } from './actions'

export default function RsvpButton({ 
  eventId, 
  hasRsvpd 
}: { 
  eventId: string, 
  hasRsvpd: boolean 
}) {
  const [isPending, setIsPending] = useState(false)
  const [attending, setAttending] = useState(hasRsvpd)

  const handleRsvp = async () => {
    setIsPending(true)
    
    // Optimistic UI
    setAttending(!attending)
    
    try {
      await toggleRsvp(eventId)
    } catch (err: any) {
      // Revert on error
      setAttending(hasRsvpd)
      if (err.message && err.message.includes('relation "event_rsvps" does not exist')) {
        alert("The event_rsvps table hasn't been created in the database yet!")
      } else {
        alert("Failed to update RSVP. Please try again.")
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button 
      onClick={handleRsvp}
      disabled={isPending}
      className={`px-6 py-2 rounded-lg transition-all font-light text-sm shadow-sm flex items-center justify-center min-w-[120px] w-full sm:w-auto mb-2 ${
        attending 
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
          : 'bg-slate-900 text-white hover:bg-slate-800 border border-slate-900'
      }`}
    >
      {isPending ? '...' : attending ? 'Attending ✓' : 'RSVP'}
    </button>
  )
}
