'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleRsvp(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to RSVP.')
  }

  // First try to select existing RSVP
  const { data: existingRsvp, error: selectError } = await supabase
    .from('event_rsvps')
    .select('id')
    .eq('user_id', user.id)
    .eq('event_id', eventId)
    .maybeSingle()
    
  if (selectError && selectError.code !== 'PGRST116') {
    // Note: if event_rsvps table does not exist, this will throw.
    // For prototype purposes, if it fails, we will catch it in the client.
    throw new Error('Could not fetch RSVP: ' + selectError.message)
  }

  if (existingRsvp) {
    // Delete RSVP
    await supabase.from('event_rsvps').delete().eq('id', existingRsvp.id)
  } else {
    // Create RSVP
    await supabase.from('event_rsvps').insert({ user_id: user.id, event_id: eventId, status: 'attending' })
  }

  revalidatePath('/events')
}
