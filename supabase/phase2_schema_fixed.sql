-- Phase 2: Guest Logic & Attendance Tracking

-- 0. Update ENUM to support new roles
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'guest';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'suspended';
COMMIT;

-- 1. Ensure event_rsvps table exists and has 'attended' column
CREATE TABLE IF NOT EXISTS public.event_rsvps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'attending',
    attended BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, event_id)
);

-- Note: We migrate data from rsvps if it exists, then drop it.
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'rsvps') THEN
    INSERT INTO public.event_rsvps (id, user_id, event_id, status, created_at)
    SELECT id, user_id, event_id, status, created_at FROM public.rsvps
    ON CONFLICT DO NOTHING;
    
    DROP TABLE public.rsvps;
  END IF;
END $$;

ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read event_rsvps" ON public.event_rsvps FOR SELECT USING (true);
CREATE POLICY "Users can insert own event_rsvps" ON public.event_rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own event_rsvps" ON public.event_rsvps FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update event_rsvps" ON public.event_rsvps FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
);

-- 2. Modify New User Signup to default to 'guest'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role, status)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'display_name',
    'guest', -- CHANGED from 'member' to 'guest'
    'pending'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create function to Auto-Promote guests to members when they hit 2 attendances
CREATE OR REPLACE FUNCTION public.check_guest_promotion()
RETURNS trigger AS $$
DECLARE
  attendance_count INT;
  user_role user_role;
BEGIN
  -- Only care if attended was flipped to true
  IF NEW.attended = true AND OLD.attended = false THEN
    -- Check if user is a guest
    SELECT role INTO user_role FROM public.profiles WHERE id = NEW.user_id;
    
    IF user_role = 'guest' THEN
      -- Count total attended
      SELECT count(*) INTO attendance_count FROM public.event_rsvps WHERE user_id = NEW.user_id AND attended = true;
      
      IF attendance_count >= 2 THEN
        -- Promote to member!
        UPDATE public.profiles SET role = 'member' WHERE id = NEW.user_id;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_attendance_marked ON public.event_rsvps;
CREATE TRIGGER on_attendance_marked
  AFTER UPDATE OF attended ON public.event_rsvps
  FOR EACH ROW
  EXECUTE PROCEDURE public.check_guest_promotion();
