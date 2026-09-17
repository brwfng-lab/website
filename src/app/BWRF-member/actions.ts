'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateThemePreference(theme: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authorized")

  const { error } = await supabase.from('profiles').update({ theme_color: theme }).eq('id', user.id)
  if (error) throw new Error(error.message)

  revalidatePath('/BWRF-member')
}
