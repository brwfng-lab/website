'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addComment(discussionId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to comment.')
  }

  const { error } = await supabase.from('discussion_comments').insert({
    discussion_id: discussionId,
    user_id: user.id,
    content
  })

  if (error) {
    throw new Error('Failed to post comment: ' + error.message)
  }

  revalidatePath(`/discussions/${discussionId}`)
}
