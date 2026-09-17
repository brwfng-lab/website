'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateClubSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authorized")

  // Verify acting user is admin or owner
  const { data: actingProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (actingProfile?.role !== 'owner' && actingProfile?.role !== 'admin') {
    throw new Error("Only admins can update settings.")
  }

  const club_name = formData.get('club_name') as string
  const club_tagline = formData.get('club_tagline') as string
  const default_theme = formData.get('default_theme') as string

  const { error } = await supabase
    .from('club_settings')
    .update({ 
      club_name, 
      club_tagline,
      default_theme,
      updated_at: new Date().toISOString()
    })
    .eq('id', 1)

  if (error) throw new Error(error.message)

  // Revalidate entire site to update Navbars everywhere
  revalidatePath('/', 'layout')
}
