-- Fix infinite recursion in RLS policies
-- This file fixes the circular dependency issue in the affiliate system

-- 1. Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can manage affiliate profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage affiliate settings" ON affiliate_settings;
DROP POLICY IF EXISTS "Admins can manage all affiliate links" ON affiliate_links;
DROP POLICY IF EXISTS "Admins can manage all affiliate referrals" ON affiliate_referrals;
DROP POLICY IF EXISTS "Admins can manage all affiliate payouts" ON affiliate_payouts;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;

-- 2. Drop existing user_profiles policies before recreating them
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- 3. Create a simple admin_list table to avoid recursion
CREATE TABLE IF NOT EXISTS admin_list (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grant permissions on admin_list
GRANT ALL ON admin_list TO anon, authenticated;

-- 4. Recreate user_profiles policies without recursion
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Create new policies using admin_list table
CREATE POLICY "Admin policies for user_profiles" ON user_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_list WHERE id = auth.uid())
);

-- Update affiliate links policies to use admin_list table
CREATE POLICY "Admins can manage all affiliate links" ON affiliate_links FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_list WHERE id = auth.uid())
);

-- Update affiliate referrals policies
CREATE POLICY "Admins can manage all affiliate referrals" ON affiliate_referrals FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_list WHERE id = auth.uid())
);

-- Update affiliate payouts policies
CREATE POLICY "Admins can manage all affiliate payouts" ON affiliate_payouts FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_list WHERE id = auth.uid())
);

-- Update orders policies
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_list WHERE id = auth.uid())
);

-- Update affiliate settings policies
CREATE POLICY "Admins can manage affiliate settings" ON affiliate_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_list WHERE id = auth.uid())
);

-- Add function to make users admin (this will be used by existing admin users)
CREATE OR REPLACE FUNCTION make_user_admin_admin_method(user_email TEXT)
RETURNS VOID AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the user ID from email (this requires elevated permissions)
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NOT NULL THEN
    INSERT INTO admin_list (id) VALUES (user_id)
    ON CONFLICT (id) DO NOTHING;
    
    -- Also update user_profiles.is_admin for backwards compatibility
    UPDATE user_profiles SET is_admin = true WHERE id = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is admin (for backwards compatibility)
CREATE OR REPLACE FUNCTION check_is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admin_list WHERE id = user_id)
      OR EXISTS (SELECT 1 FROM user_profiles WHERE id = user_id AND is_admin = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;