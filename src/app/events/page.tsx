import { createClient } from '@/utils/supabase/server'
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react'
import RsvpButton from './RsvpButton'

export const revalidate = 0;

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch upcoming events
  const { data: events } = await supabase
    .from('events')
    .select('*, books(title)')
    .order('date_time', { ascending: true })

  // Fetch user's RSVPs (handle potential error if table doesn't exist yet)
  let userRsvps = new Set<string>()
  if (user) {
    const { data: rsvps } = await supabase
      .from('event_rsvps')
      .select('event_id')
      .eq('user_id', user.id)
      
    rsvps?.forEach(r => userRsvps.add(r.event_id))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light text-slate-900">Events Calendar</h1>
      </div>

      <div className="space-y-6">
        {events?.map((event) => {
          const date = new Date(event.date_time)
          return (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-lg p-4 min-w-[100px]">
                <span className="text-sm font-light uppercase">{date.toLocaleDateString(undefined, { month: 'short' })}</span>
                <span className="text-3xl font-thin">{date.getDate()}</span>
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-light text-slate-900 mb-2">{event.title}</h2>
                {event.books && (
                  <span className="inline-block bg-slate-100 border border-slate-200 text-slate-500 px-2 py-1 rounded text-xs mb-3">
                    Discussing: {event.books.title}
                  </span>
                )}
                <p className="text-slate-500 mb-4">{event.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {event.meeting_mode === 'physical' ? (
                      <span className="capitalize">Physical: {event.location || 'TBD'}</span>
                    ) : (
                      <span>Online: {event.location || 'Video Call'}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center sm:items-end">
                <RsvpButton 
                  eventId={event.id} 
                  hasRsvpd={userRsvps.has(event.id)} 
                />
                <button className="text-blue-600 text-sm hover:underline">
                  Add to Calendar
                </button>
              </div>
            </div>
          )
        })}

        {(!events || events.length === 0) && (
          <div className="text-center text-slate-400 py-12 bg-white rounded-xl border border-gray-200">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No upcoming events scheduled.</p>
          </div>
        )}
      </div>
    </div>
  )
}
