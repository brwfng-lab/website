'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createDiscussion(title: string, content: string, bookId: string | null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to create a discussion.')
  }

  // Insert discussion
  const { data: newDiscussion, error } = await supabase
    .from('discussions')
    .insert({
      title,
      content,
      user_id: user.id,
      book_id: bookId || null
    })
    .select()
    .single()

  if (error) {
    if (error.code === '42P01') {
      throw new Error('Database tables for discussions are not created yet.')
    }
    throw new Error('Failed to create discussion: ' + error.message)
  }

  revalidatePath('/discussions')
  return newDiscussion
}
