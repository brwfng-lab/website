'use client'

import { useState } from 'react'
import { addBook, updateBookStatus } from './actions'

export function AddBookForm() {
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setIsPending(true)
    try {
      await addBook(new FormData(form))
      form.reset()
      alert("Book added successfully!")
    } catch (err: any) {
      alert("Failed to add book: " + err.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div>
        <label className="block text-sm font-light text-slate-700 mb-1">Book Title</label>
        <input required name="title" type="text" className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm" placeholder="e.g. Dune" />
      </div>
      <div>
        <label className="block text-sm font-light text-slate-700 mb-1">Author</label>
        <input required name="author" type="text" className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm" placeholder="e.g. Frank Herbert" />
      </div>
      <div>
        <label className="block text-sm font-light text-slate-700 mb-1">Cover Image URL</label>
        <input name="cover_image_url" type="text" className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm" placeholder="https://... or /image.jpg" />
      </div>
      <div>
        <label className="block text-sm font-light text-slate-700 mb-1">Initial Status</label>
        <select name="status" className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm bg-white">
          <option value="nominated">Nominated (for voting)</option>
          <option value="current">Current Book</option>
          <option value="past">Past Book</option>
        </select>
      </div>
      <button disabled={isPending} type="submit" className="w-full bg-slate-900 text-white px-4 py-2 rounded-md font-light hover:bg-slate-800 transition disabled:opacity-50 mt-4">
        {isPending ? 'Adding...' : 'Add Book'}
      </button>
    </form>
  )
}

export function StatusSelect({ bookId, currentStatus }: { bookId: string, currentStatus: string }) {
  const [isPending, setIsPending] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsPending(true)
    try {
      await updateBookStatus(bookId, e.target.value)
    } catch (err: any) {
      alert("Failed to update status")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <select 
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="px-2 py-1 border border-slate-200 rounded bg-white text-xs font-light text-slate-700 focus:outline-none"
    >
      <option value="nominated">Nominated</option>
      <option value="current">Current</option>
      <option value="past">Past</option>
    </select>
  )
}

import { updateUserRole } from './actions/members'

export function RoleSelect({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [isPending, setIsPending] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsPending(true)
    try {
      await updateUserRole(userId, e.target.value)
    } catch (err: any) {
      alert("Failed to update role: " + err.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <select 
      value={currentRole || 'member'}
      onChange={handleChange}
      disabled={isPending}
      className={`px-2 py-1 border rounded text-xs font-medium focus:outline-none ${
        currentRole === 'owner' ? 'bg-purple-50 text-purple-700 border-purple-200' :
        currentRole === 'admin' ? 'bg-blue-50 text-blue-700 border-blue-200' :
        currentRole === 'suspended' ? 'bg-red-50 text-red-700 border-red-200' :
        'bg-slate-50 text-slate-700 border-slate-200'
      }`}
    >
      <option value="member">Member</option>
      <option value="admin">Moderator/Admin</option>
      <option value="owner">Owner</option>
      <option value="suspended">Suspended</option>
    </select>
  )
}

import { createEvent, deleteEvent } from './actions/events'

export function AddEventForm({ books }: { books: any[] }) {
  const [isPending, setIsPending] = useState(false)
  const [mode, setMode] = useState('online')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setIsPending(true)
    try {
      await createEvent(new FormData(form))
      form.reset()
      setMode('online')
      alert('Event added successfully!')
    } catch (err: any) {
      alert('Failed to add event: ' + err.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div>
        <label className="block text-sm font-light text-slate-700 mb-1">Event Title</label>
        <input required name="title" type="text" className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm" placeholder="e.g. End of Month Discussion" />
      </div>
      <div>
        <label className="block text-sm font-light text-slate-700 mb-1">Date & Time</label>
        <input required name="date_time" type="datetime-local" className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-light text-slate-700 mb-1">Meeting Mode</label>
          <select 
            name="meeting_mode" 
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm bg-white"
          >
            <option value="online">Online</option>
            <option value="physical">Physical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-light text-slate-700 mb-1">Location / Link</label>
          <input 
            required 
            name="location" 
            type="text" 
            className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm" 
            placeholder={mode === 'online' ? "e.g. Jitsi / Zoom / Google Meet" : "e.g. 123 Main St, NY"} 
            defaultValue={mode === 'online' ? "Online Video Call" : ""}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-light text-slate-700 mb-1">Related Book (Optional)</label>
        <select name="book_id" className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm bg-white">
          <option value="">-- No specific book --</option>
          {books.map(b => (
            <option key={b.id} value={b.id}>{b.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-light text-slate-700 mb-1">Description</label>
        <textarea required name="description" rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm" placeholder="Join us as we discuss..." />
      </div>
      <button disabled={isPending} type="submit" className="w-full bg-slate-900 text-white px-4 py-2 rounded-md font-light hover:bg-slate-800 transition disabled:opacity-50 mt-4">
        {isPending ? 'Adding...' : 'Schedule Event'}
      </button>
    </form>
  )
}

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const [isPending, setIsPending] = useState(false)

  return (
    <button 
      disabled={isPending}
      onClick={async () => {
        if (!confirm('Are you sure you want to delete this event?')) return
        setIsPending(true)
        try {
          await deleteEvent(eventId)
        } catch (e: any) {
          alert('Failed to delete')
        } finally {
          setIsPending(false)
        }
      }}
      className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
    >
      {isPending ? 'Deleting...' : 'Cancel Event'}
    </button>
  )
}

import { markAttended } from './actions/attendance'

export function AttendanceCheckbox({ rsvpId, initialAttended }: { rsvpId: string, initialAttended: boolean }) {
  const [isPending, setIsPending] = useState(false)
  const [attended, setAttended] = useState(initialAttended)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked
    setAttended(newValue)
    setIsPending(true)
    try {
      await markAttended(rsvpId, newValue)
    } catch (err: any) {
      setAttended(!newValue) // revert on failure
      alert('Failed to mark attendance: ' + err.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input 
        type="checkbox" 
        checked={attended}
        onChange={handleChange}
        disabled={isPending}
        className="w-3 h-3 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer disabled:opacity-50"
      />
      <span className="text-[10px] text-slate-500 font-medium">Attended</span>
    </label>
  )
}

import { updateClubSettings } from './actions/settings'

export function ClubSettingsForm({ settings }: { settings: any }) {
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    try {
      await updateClubSettings(new FormData(e.currentTarget))
      alert('Settings updated successfully!')
    } catch (err: any) {
      alert('Failed to update settings: ' + err.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div>
        <label className="block text-sm font-light text-slate-700 mb-1">Club Name</label>
        <input required name="club_name" defaultValue={settings?.club_name} type="text" className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm" />
      </div>
      <div>
        <label className="block text-sm font-light text-slate-700 mb-1">Tagline</label>
        <input required name="club_tagline" defaultValue={settings?.club_tagline} type="text" className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm" />
      </div>
      <div>
        <label className="block text-sm font-light text-slate-700 mb-1">Default App Theme</label>
        <select required name="default_theme" defaultValue={settings?.default_theme} className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm bg-white">
          <option value="scifi">Sci-Fi (Blue)</option>
          <option value="fantasy">Fantasy (Emerald)</option>
          <option value="romance">Romance (Rose)</option>
          <option value="thriller">Thriller (Violet)</option>
          <option value="mystery">Mystery (Slate)</option>
        </select>
        <p className="text-xs text-slate-400 mt-1 font-light">This is the theme that unauthenticated visitors and brand new users will see.</p>
      </div>
      
      <button disabled={isPending} type="submit" className="w-full bg-slate-900 text-white px-4 py-2 rounded-md font-light hover:bg-slate-800 transition disabled:opacity-50 mt-4">
        {isPending ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  )
}

import { createMerch, deleteMerch } from './actions/merch'

export function AddMerchForm() {
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setIsPending(true)
    try {
      await createMerch(new FormData(form))
      form.reset()
      alert('Merchandise added successfully!')
    } catch (err: any) {
      alert('Failed to add merchandise: ' + err.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div>
        <label className="block text-sm font-light text-slate-700 mb-1">Product Name</label>
        <input required name="name" type="text" className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm" placeholder="e.g. Classic BWRF Hoodie" />
      </div>
      <div>
        <label className="block text-sm font-light text-slate-700 mb-1">Description</label>
        <textarea required name="description" rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm" placeholder="Cozy cotton blend..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-light text-slate-700 mb-1">Price ($)</label>
          <input required name="price" type="number" step="0.01" min="0" className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm" placeholder="29.99" />
        </div>
        <div>
          <label className="block text-sm font-light text-slate-700 mb-1">Image URL</label>
          <input required name="image_url" type="text" className="w-full px-3 py-2 border border-slate-200 rounded-md font-light text-sm" placeholder="https://... or /image.jpg" />
        </div>
      </div>
      <button disabled={isPending} type="submit" className="w-full bg-slate-900 text-white px-4 py-2 rounded-md font-light hover:bg-slate-800 transition disabled:opacity-50 mt-4">
        {isPending ? 'Adding...' : 'Add Merchandise'}
      </button>
    </form>
  )
}

export function DeleteMerchButton({ merchId }: { merchId: string }) {
  const [isPending, setIsPending] = useState(false)

  return (
    <button 
      disabled={isPending}
      onClick={async () => {
        if (!confirm('Are you sure you want to delete this merchandise?')) return
        setIsPending(true)
        try {
          await deleteMerch(merchId)
        } catch (e: any) {
          alert('Failed to delete')
        } finally {
          setIsPending(false)
        }
      }}
      className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}

export function DeleteBookButton({ bookId }: { bookId: string }) {
  const [isPending, setIsPending] = useState(false)
  const { deleteBook } = require('./actions')

  return (
    <button 
      disabled={isPending}
      onClick={async () => {
        if (!confirm('Are you sure you want to delete this book?')) return
        setIsPending(true)
        try {
          await deleteBook(bookId)
        } catch (e: any) {
          alert('Failed to delete')
        } finally {
          setIsPending(false)
        }
      }}
      className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50 ml-4"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}
