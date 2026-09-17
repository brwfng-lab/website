'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addBook(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authorized")

  const title = formData.get('title') as string
  const author = formData.get('author') as string
  const cover_image_url = formData.get('cover_image_url') as string
  const status = formData.get('status') as string

  const { error } = await supabase.from('books').insert({
    title,
    author,
    cover_image_url,
    status
  })

  if (error) throw new Error(error.message)

  revalidatePath('/BWRF-admin')
  revalidatePath('/vote')
}

export async function updateBookStatus(bookId: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('books').update({ status }).eq('id', bookId)
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/BWRF-admin')
  revalidatePath('/vote')
  revalidatePath('/')
}

export async function deleteBook(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authorized")
  const { error } = await supabase.from('books').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/BWRF-admin')
  revalidatePath('/')
}
