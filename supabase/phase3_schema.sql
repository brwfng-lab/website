-- Phase 3: Club Configuration

CREATE TABLE IF NOT EXISTS public.club_settings (
    id INT PRIMARY KEY DEFAULT 1, -- Only one row
    club_name TEXT NOT NULL DEFAULT 'Book Review With Friends',
    club_tagline TEXT NOT NULL DEFAULT 'A community book club',
    default_theme TEXT NOT NULL DEFAULT 'scifi',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CHECK (id = 1) -- Enforce single row
);

-- Insert the default row if it doesn't exist
INSERT INTO public.club_settings (id, club_name, club_tagline)
VALUES (1, 'Book Review With Friends', 'A community book club')
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE public.club_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read club_settings" ON public.club_settings FOR SELECT USING (true);
CREATE POLICY "Admins update club_settings" ON public.club_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
);
