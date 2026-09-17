import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardClient from '@/components/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Fetch the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch current book
  const { data: currentBook } = await supabase
    .from('books')
    .select('*')
    .eq('status', 'current')
    .maybeSingle();

  // Fetch next event
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('date_time', new Date().toISOString())
    .order('date_time', { ascending: true })
    .limit(1);
  const nextEvent = events?.[0] || null;

  return (
    <DashboardClient 
      profile={profile} 
      email={user.email || ''} 
      currentBook={currentBook} 
      nextEvent={nextEvent} 
    />
  );
}
