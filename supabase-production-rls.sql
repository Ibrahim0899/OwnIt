-- ====================================
-- OwnIt Production RLS Policies
-- Run this in Supabase SQL Editor
-- ====================================

-- ============ USERS TABLE ============
-- Drop existing policies first
DROP POLICY IF EXISTS "Anyone can create profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can delete own profile" ON users;
DROP POLICY IF EXISTS "Anyone can read profiles" ON users;
DROP POLICY IF EXISTS "Public read access" ON users;
DROP POLICY IF EXISTS "Users can insert" ON users;
DROP POLICY IF EXISTS "Users can update own" ON users;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Public read - anyone can see profiles
CREATE POLICY "users_select_public" ON users 
    FOR SELECT USING (true);

-- Insert - anyone can create (for signup)
CREATE POLICY "users_insert_public" ON users 
    FOR INSERT WITH CHECK (true);

-- Update - only own profile
CREATE POLICY "users_update_own" ON users 
    FOR UPDATE USING (
        auth.uid()::text = id::text 
        OR auth.jwt() ->> 'email' = email
    );

-- Delete - only own profile
CREATE POLICY "users_delete_own" ON users 
    FOR DELETE USING (auth.uid()::text = id::text);


-- ============ POSTS TABLE ============
DROP POLICY IF EXISTS "posts_select_public" ON posts;
DROP POLICY IF EXISTS "posts_insert_auth" ON posts;
DROP POLICY IF EXISTS "posts_update_own" ON posts;
DROP POLICY IF EXISTS "posts_delete_own" ON posts;

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read posts
CREATE POLICY "posts_select_public" ON posts 
    FOR SELECT USING (true);

-- Only authenticated users can create posts
CREATE POLICY "posts_insert_auth" ON posts 
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Only author can update their posts
CREATE POLICY "posts_update_own" ON posts 
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Only author can delete their posts
CREATE POLICY "posts_delete_own" ON posts 
    FOR DELETE USING (auth.uid()::text = user_id::text);


-- ============ MESSAGES TABLE ============
DROP POLICY IF EXISTS "messages_select_own" ON messages;
DROP POLICY IF EXISTS "messages_insert_auth" ON messages;

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can only see messages they sent or received
CREATE POLICY "messages_select_own" ON messages 
    FOR SELECT USING (
        auth.uid()::text = sender_id::text 
        OR auth.uid()::text = receiver_id::text
    );

-- Authenticated users can send messages
CREATE POLICY "messages_insert_auth" ON messages 
    FOR INSERT WITH CHECK (
        auth.uid()::text = sender_id::text
    );


-- ============ CONVERSATIONS TABLE ============
DROP POLICY IF EXISTS "conversations_select_participant" ON conversations;
DROP POLICY IF EXISTS "conversations_insert_auth" ON conversations;

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Users can see conversations they're part of
CREATE POLICY "conversations_select_participant" ON conversations 
    FOR SELECT USING (
        auth.uid()::text = ANY(string_to_array(participants::text, ','))
        OR participants::text LIKE '%' || auth.uid()::text || '%'
    );

-- Authenticated users can create conversations
CREATE POLICY "conversations_insert_auth" ON conversations 
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);


-- ============ CONNECTIONS TABLE ============
DROP POLICY IF EXISTS "connections_select_own" ON connections;
DROP POLICY IF EXISTS "connections_insert_auth" ON connections;
DROP POLICY IF EXISTS "connections_update_own" ON connections;
DROP POLICY IF EXISTS "connections_delete_own" ON connections;

ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Users can see their own connections
CREATE POLICY "connections_select_own" ON connections 
    FOR SELECT USING (
        auth.uid()::text = user_id::text 
        OR auth.uid()::text = connected_user_id::text
    );

-- Authenticated users can create connection requests
CREATE POLICY "connections_insert_auth" ON connections 
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Users can update connections they initiated or received
CREATE POLICY "connections_update_own" ON connections 
    FOR UPDATE USING (
        auth.uid()::text = user_id::text 
        OR auth.uid()::text = connected_user_id::text
    );

-- Users can delete their own connections
CREATE POLICY "connections_delete_own" ON connections 
    FOR DELETE USING (
        auth.uid()::text = user_id::text 
        OR auth.uid()::text = connected_user_id::text
    );


-- ============ JOBS TABLE ============
DROP POLICY IF EXISTS "jobs_select_public" ON jobs;
DROP POLICY IF EXISTS "jobs_insert_auth" ON jobs;

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Anyone can read job listings
CREATE POLICY "jobs_select_public" ON jobs 
    FOR SELECT USING (true);

-- Only authenticated users (companies) can post jobs
CREATE POLICY "jobs_insert_auth" ON jobs 
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);


-- ============ SITE VISITS (ANALYTICS) ============
DROP POLICY IF EXISTS "visits_insert_public" ON site_visits;
DROP POLICY IF EXISTS "visits_select_admin" ON site_visits;

ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

-- Anyone can insert visits (for tracking)
CREATE POLICY "visits_insert_public" ON site_visits 
    FOR INSERT WITH CHECK (true);

-- Only admin can read analytics (TODO: add admin check)
CREATE POLICY "visits_select_public" ON site_visits 
    FOR SELECT USING (true);


-- ============ VERIFICATION ============
-- Run this to check all policies are in place
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
