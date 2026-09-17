'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createEvent(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const date_time = formData.get('date_time') as string
  const book_id = formData.get('book_id') as string
  const meeting_mode = formData.get('meeting_mode') as string || 'online'
  const location = formData.get('location') as string || 'Online Video Call'

  const { error } = await supabase.from('events').insert({
    title,
    description,
    date_time,
    book_id: book_id ? book_id : null,
    meeting_mode,
    location
  })

  if (error) throw new Error(error.message)

  revalidatePath('/BWRF-admin')
  revalidatePath('/events')
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('events').delete().eq('id', eventId)

  if (error) throw new Error(error.message)

  revalidatePath('/BWRF-admin')
  revalidatePath('/events')
}
