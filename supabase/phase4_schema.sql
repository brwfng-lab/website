-- Phase 4: Notifications & Live Features

-- 1. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications 
FOR UPDATE USING (auth.uid() = user_id);

-- 3. Enable Realtime for notifications
alter publication supabase_realtime add table public.notifications;

-- 4. Create Trigger to notify all members when a new event is created
CREATE OR REPLACE FUNCTION public.notify_new_event()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message)
  SELECT id, 'New Event Scheduled', 'A new event "' || NEW.title || '" has been scheduled.'
  FROM public.profiles
  WHERE role IN ('member', 'admin', 'owner');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_event ON public.events;
CREATE TRIGGER on_new_event
  AFTER INSERT ON public.events
  FOR EACH ROW
  EXECUTE PROCEDURE public.notify_new_event();
