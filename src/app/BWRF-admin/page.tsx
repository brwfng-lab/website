import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboardClient from '@/components/AdminDashboardClient'

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  
  if (profile?.role !== 'owner' && profile?.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-light text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-500 font-light">You do not have permission to view the Admin Dashboard.</p>
        </div>
      </div>
    )
  }

  // Fetch all necessary data
  const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  const { data: books } = await supabase.from('books').select('*').order('created_at', { ascending: false })
  
  // Wait to fetch events if table exists, otherwise empty array
  let events: any[] = []
  let rsvps: any[] = []
  try {
    const { data: eventData } = await supabase.from('events').select('*').order('date_time', { ascending: true })
    if (eventData) events = eventData

    const { data: rsvpData } = await supabase.from('event_rsvps').select('*, profiles(display_name)')
    if (rsvpData) rsvps = rsvpData
  } catch (e) {
    console.error(e)
  }

  // Fetch settings
  let settings = {}
  try {
    const { data: settingsData } = await supabase.from('club_settings').select('*').eq('id', 1).single()
    if (settingsData) settings = settingsData
  } catch (e) {}

  let merchandise: any[] = []
  try {
    const { data: merchData } = await supabase.from('merchandise').select('*').order('created_at', { ascending: false })
    if (merchData) merchandise = merchData
  } catch (e) {}

  return (
    <AdminDashboardClient 
      profiles={profiles || []} 
      books={books || []} 
      events={events} 
      rsvps={rsvps}
      settings={settings}
      merchandise={merchandise}
    />
  )
}
