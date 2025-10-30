-- Temporary fix for infinite recursion in RLS policies
-- This file can be run directly in Supabase SQL editor to fix the admin recognition issue

-- 1. Drop all policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can manage affiliate profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage affiliate settings" ON affiliate_settings;
DROP POLICY IF EXISTS "Admins can manage all affiliate links" ON affiliate_links;
DROP POLICY IF EXISTS "Admins can manage all affiliate referrals" ON affiliate_referrals;
DROP POLICY IF EXISTS "Admins can manage all affiliate payouts" ON affiliate_payouts;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;

-- 2. Recreate simpler user_profiles policies without recursion
-- Users can always view their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile  
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Allow admin operations using a simple function call approach
-- Grant admin access to a specific email (replace with your admin email)
-- You can run this SQL command directly:
-- SELECT make_user_admin('your-admin-email@example.com');

-- 4. Create a function to grant admin privilege
CREATE OR REPLACE FUNCTION make_user_admin(email_input TEXT)
RETURNS VOID AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find user by email in auth.users
  SELECT au.id INTO target_user_id 
  FROM auth.users au 
  WHERE au.email = email_input;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', email_input;
  END IF;
  
  -- Grant admin privilege by updating user_profiles
  INSERT INTO user_profiles (id, is_admin, updated_at)
  VALUES (target_user_id, true, NOW())
  ON CONFLICT (id) 
  DO UPDATE SET 
    is_admin = true,
    updated_at = NOW();
  
  RAISE NOTICE 'Admin privilege granted to %', email_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;