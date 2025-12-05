-- ====================================
-- OwnIt Database Schema for Supabase
-- Run this in Supabase SQL Editor
-- ====================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== USERS TABLE ==========
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    title TEXT DEFAULT '',
    location TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    photo_url TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    skills JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    griot_audio_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== POSTS TABLE ==========
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'video', 'audio')),
    media_url TEXT,
    audio_url TEXT,
    likes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== POST LIKES TABLE ==========
CREATE TABLE IF NOT EXISTS post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- ========== JOBS TABLE ==========
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poster_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT DEFAULT 'cdi' CHECK (type IN ('cdi', 'cdd', 'freelance', 'stage', 'alternance')),
    salary_min INTEGER,
    salary_max INTEGER,
    description TEXT NOT NULL,
    requirements JSONB DEFAULT '[]'::jsonb,
    audio_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== APPLICATIONS TABLE ==========
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT DEFAULT '',
    voice_message_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'interview', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);

-- ========== CONNECTIONS TABLE ==========
CREATE TABLE IF NOT EXISTS connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT DEFAULT '',
    voice_intro_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    UNIQUE(from_user_id, to_user_id)
);

-- ========== CONVERSATIONS TABLE ==========
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user1_id, user2_id)
);

-- ========== MESSAGES TABLE ==========
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'text' CHECK (type IN ('text', 'voice', 'image')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== INDEXES ==========
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_connections_from_user ON connections(from_user_id);
CREATE INDEX IF NOT EXISTS idx_connections_to_user ON connections(to_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- ========== RPC FUNCTIONS ==========
CREATE OR REPLACE FUNCTION increment_likes(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE posts SET likes = likes + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_likes(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE posts SET likes = GREATEST(0, likes - 1) WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- ========== ROW LEVEL SECURITY ==========
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for public read access (for demo)
CREATE POLICY "Public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Public read access" ON posts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON jobs FOR SELECT USING (true);

-- Policies for authenticated users
CREATE POLICY "Users can insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Authenticated can insert posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated can insert jobs" ON jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own jobs" ON jobs FOR UPDATE USING (auth.uid() = poster_id);

CREATE POLICY "Public read applications" ON applications FOR SELECT USING (true);
CREATE POLICY "Users can apply" ON applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read connections" ON connections FOR SELECT USING (true);
CREATE POLICY "Users can send requests" ON connections FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update connections" ON connections FOR UPDATE USING (true);

CREATE POLICY "Users can view conversations" ON conversations FOR SELECT USING (true);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (true);

-- ========== SAMPLE DATA ==========
-- Insert sample user
INSERT INTO users (email, name, title, location, bio, photo_url, verified, skills) VALUES
('demo@ownit.app', 'Amadou Diallo', 'Développeur Full Stack', 'Dakar, Sénégal', 
 'Passionné par la technologie et l''innovation africaine. 10 ans d''expérience en développement web et mobile.',
 'https://ui-avatars.com/api/?name=Amadou+Diallo&background=D4A373&color=fff&size=200',
 true,
 '[{"name": "JavaScript", "level": 5, "icon": "💻"}, {"name": "Python", "level": 4, "icon": "🐍"}, {"name": "React", "level": 5, "icon": "⚛️"}]'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Insert sample jobs
INSERT INTO jobs (poster_id, title, company, location, type, salary_min, salary_max, description, requirements) 
SELECT id, 'Développeur React Senior', 'TechAfrica', 'Dakar, Sénégal', 'cdi', 800000, 1500000,
       'Rejoignez notre équipe dynamique pour développer des solutions innovantes pour le marché africain.',
       '["3+ ans d''expérience React", "Maîtrise de TypeScript", "Expérience API REST"]'::jsonb
FROM users WHERE email = 'demo@ownit.app'
ON CONFLICT DO NOTHING;

COMMIT;
