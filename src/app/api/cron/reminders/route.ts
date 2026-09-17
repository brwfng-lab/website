import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function GET(request: Request) {
  // We use the service role key to bypass RLS since this is an automated cron job
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key_for_build'
  );

  // Initialize Resend
  const resend = new Resend(process.env.RESEND_API_KEY);

  // 1. Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Find events happening tomorrow
    const tomorrowStart = new Date();
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const { data: events, error: eventsError } = await supabaseAdmin
      .from('events')
      .select('*')
      .gte('date_time', tomorrowStart.toISOString())
      .lte('date_time', tomorrowEnd.toISOString());

    if (eventsError) throw eventsError;

    if (!events || events.length === 0) {
      return NextResponse.json({ message: 'No events tomorrow. No emails sent.' });
    }

    let emailsSent = 0;

    // 3. For each event, find RSVPs and send emails
    for (const event of events) {
      const { data: rsvps, error: rsvpsError } = await supabaseAdmin
        .from('event_rsvps')
        .select('user_id, profiles!inner(email, display_name)')
        .eq('event_id', event.id)
        .eq('status', 'attending');

      if (rsvpsError) {
        console.error('Error fetching RSVPs:', rsvpsError);
        continue;
      }

      for (const rsvp of rsvps || []) {
        const profile = rsvp.profiles as any;
        
        // Use Resend to send the actual email
        if (process.env.RESEND_API_KEY) {
          await resend.emails.send({
            from: 'Book Club <noreply@bwrf.com>', // Update this to your verified Resend domain
            to: profile.email,
            subject: `Reminder: ${event.title} is tomorrow!`,
            html: `<p>Hi ${profile.display_name},</p><p>Don't forget we are meeting tomorrow to discuss the book!</p><p><strong>Event:</strong> ${event.title}<br/><strong>Mode:</strong> ${event.meeting_mode}<br/><strong>Location:</strong> ${event.location}</p>`
          });
          emailsSent++;
        } else {
          console.log(`[MISSING_API_KEY] Would have sent email to ${profile.email}`);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${events.length} events and attempted to send ${emailsSent} reminder emails.` 
    });

  } catch (err: any) {
    console.error('Cron error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
