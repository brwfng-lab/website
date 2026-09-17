'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markAttended(rsvpId: string, attended: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authorized")

  // Verify acting user is admin or owner
  const { data: actingProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (actingProfile?.role !== 'owner' && actingProfile?.role !== 'admin') {
    throw new Error("Only admins can mark attendance.")
  }

  const { error } = await supabase
    .from('event_rsvps')
    .update({ attended })
    .eq('id', rsvpId)

  if (error) throw new Error(error.message)

  revalidatePath('/BWRF-admin')
}
