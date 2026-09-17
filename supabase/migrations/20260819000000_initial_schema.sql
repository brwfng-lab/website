-- Create custom types
CREATE TYPE user_role AS ENUM ('member', 'moderator', 'owner');
CREATE TYPE user_status AS ENUM ('pending', 'approved');
CREATE TYPE book_status AS ENUM ('nominated', 'current', 'past');
CREATE TYPE rsvp_status AS ENUM ('attending', 'maybe', 'declined');

-- Profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'member',
  status user_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Books
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_image_url TEXT,
  status book_status DEFAULT 'nominated',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discussions
CREATE TABLE discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES profiles ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES discussions ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_spoiler BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(book_id, user_id)
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date_time TIMESTAMPTZ NOT NULL,
  book_id UUID REFERENCES books ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSVPs
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  status rsvp_status DEFAULT 'attending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
-- Profiles: Anyone can read approved profiles. Users can read/update their own. Owner can do all.
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Books: Anyone can read. Only owners/moderators can create/update.
CREATE POLICY "Books are viewable by everyone." ON books FOR SELECT USING (true);
CREATE POLICY "Owners can insert books." ON books FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'moderator'))
);
CREATE POLICY "Owners can update books." ON books FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'moderator'))
);

-- Discussions & Comments: Anyone can read. Authenticated users can create. Users can update own.
CREATE POLICY "Discussions are viewable by everyone." ON discussions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert discussions." ON discussions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own discussion." ON discussions FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Comments are viewable by everyone." ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert comments." ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own comment." ON comments FOR UPDATE USING (auth.uid() = author_id);

-- Votes: Viewable by everyone. Authenticated can vote.
CREATE POLICY "Votes viewable by everyone." ON votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote." ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Events: Viewable by everyone. Owners/moderators can create.
CREATE POLICY "Events viewable by everyone." ON events FOR SELECT USING (true);
CREATE POLICY "Owners can insert events." ON events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'moderator'))
);

-- RSVPs: Viewable by everyone. Authenticated can RSVP.
CREATE POLICY "RSVPs viewable by everyone." ON rsvps FOR SELECT USING (true);
CREATE POLICY "Authenticated users can RSVP." ON rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own RSVP." ON rsvps FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role, status)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'display_name',
    'member',
    'pending'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable realtime
alter publication supabase_realtime add table discussions;
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table votes;
