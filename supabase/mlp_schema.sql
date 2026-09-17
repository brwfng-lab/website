-- MLP Schema Upgrade for BWRF

-- 1. Personalization: Add theme_color to profiles (if it doesn't exist)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme_color text DEFAULT 'scifi';

-- 2. Nested Discussions: Comments table
CREATE TABLE IF NOT EXISTS public.discussion_comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    discussion_id uuid REFERENCES public.discussions(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for comments
ALTER TABLE public.discussion_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are viewable by everyone" ON public.discussion_comments FOR SELECT USING (true);
CREATE POLICY "Users can insert their own comments" ON public.discussion_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Gamification: Badges
CREATE TABLE IF NOT EXISTS public.badges (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    icon_name text NOT NULL
);

-- Seed initial badges
INSERT INTO public.badges (id, name, description, icon_name) VALUES
('first_chapter', 'First Chapter', 'Read your first book with us.', 'BookOpen'),
('debater', 'Debater', 'Leave 10 comments in discussions.', 'MessageSquare'),
('speed_reader', 'Speed Reader', 'Finish a book early.', 'Zap'),
('bookworm', 'Bookworm', 'Read 5 books in a row.', 'Award')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.user_badges (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    badge_id text REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
    awarded_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, badge_id)
);

-- Enable RLS for badges
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges are viewable by everyone" ON public.badges FOR SELECT USING (true);
CREATE POLICY "User badges are viewable by everyone" ON public.user_badges FOR SELECT USING (true);

-- 4. Real-time Sub-Groups
CREATE TABLE IF NOT EXISTS public.subgroups (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    member_count integer DEFAULT 0
);

-- Seed subgroups
INSERT INTO public.subgroups (id, name, description) VALUES
('scifi-geeks', 'The Sci-Fi Geeks', 'Exploring the outer limits of space and time.'),
('nonfiction-nerds', 'Non-Fiction Nerds', 'Biographies, history, and wealth creation.'),
('fantasy-realm', 'Fantasy Realm', 'Dragons, magic, and epic quests.')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.subgroup_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    subgroup_id text REFERENCES public.subgroups(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and Realtime for messages
ALTER TABLE public.subgroups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subgroup_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subgroups viewable by everyone" ON public.subgroups FOR SELECT USING (true);
CREATE POLICY "Messages viewable by everyone" ON public.subgroup_messages FOR SELECT USING (true);
CREATE POLICY "Users can insert messages" ON public.subgroup_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- TURN ON REALTIME FOR subgroup_messages
alter publication supabase_realtime add table public.subgroup_messages;
