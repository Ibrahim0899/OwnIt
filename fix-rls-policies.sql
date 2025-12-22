-- ====================================
-- OwnIt RLS Policy Fix
-- Run this in Supabase SQL Editor
-- ====================================

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can insert" ON users;
DROP POLICY IF EXISTS "Users can update own" ON users;

-- Recreate with proper permissions
-- Allow anyone (including anonymous/signing up users) to insert into users table
CREATE POLICY "Anyone can create profile" ON users 
    FOR INSERT 
    WITH CHECK (true);

-- Allow users to update their own profile (match by email for flexibility during signup)
CREATE POLICY "Users can update own profile" ON users 
    FOR UPDATE 
    USING (
        auth.uid()::text = id::text 
        OR auth.jwt() ->> 'email' = email
    );

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile" ON users 
    FOR DELETE 
    USING (auth.uid()::text = id::text);

-- Ensure all authenticated users can read all profiles
DROP POLICY IF EXISTS "Public read access" ON users;
CREATE POLICY "Anyone can read profiles" ON users 
    FOR SELECT 
    USING (true);
