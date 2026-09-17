'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createMerch(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const image_url = formData.get('image_url') as string

  const { error } = await supabase.from('merchandise').insert({
    name,
    description,
    price,
    image_url
  })

  if (error) throw new Error(error.message)

  revalidatePath('/BWRF-admin')
  revalidatePath('/merchandise')
}

export async function deleteMerch(merchId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('merchandise').delete().eq('id', merchId)

  if (error) throw new Error(error.message)

  revalidatePath('/BWRF-admin')
  revalidatePath('/merchandise')
}
