'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(targetUserId: string, newRole: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authorized")

  // Verify acting user is owner
  const { data: actingProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (actingProfile?.role !== 'owner') {
    throw new Error("Only owners can change roles.")
  }

  // Update role
  const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', targetUserId)
  if (error) throw new Error(error.message)

  revalidatePath('/BWRF-admin')
}
