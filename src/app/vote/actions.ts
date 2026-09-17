'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function castVote(bookId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to vote.')
  }

  // Check if they already voted for this book
  const { data: existingVote } = await supabase
    .from('votes')
    .select('id')
    .eq('user_id', user.id)
    .eq('book_id', bookId)
    .maybeSingle()

  if (existingVote) {
    // Remove vote (toggle)
    await supabase.from('votes').delete().eq('id', existingVote.id)
  } else {
    // Add vote
    await supabase.from('votes').insert({ user_id: user.id, book_id: bookId })
  }

  revalidatePath('/vote')
}
