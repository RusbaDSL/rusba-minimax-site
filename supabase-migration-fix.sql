-- ==================================================
-- COMPLETE FIX: RLS Policies and Admin System
-- This migration should be run in Supabase SQL Editor
-- ==================================================

-- FIX 1: Add missing RLS policies for products table
-- Drop existing products policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;

-- Create comprehensive products policies
-- 1. Public read access
CREATE POLICY "Products are viewable by everyone" ON products 
  FOR SELECT USING (true);

-- 2. Admin insert policy - allows authenticated users who are admins
CREATE POLICY "Admins can insert products" ON products 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.is_admin = true
    )
  );

-- 3. Admin update policy - allows authenticated users who are admins
CREATE POLICY "Admins can update products" ON products 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.is_admin = true
    )
  );

-- 4. Admin delete policy - allows authenticated users who are admins  
CREATE POLICY "Admins can delete products" ON products 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.is_admin = true
    )
  );

-- FIX 2: Add admin management policies
-- Allow users to update their own admin status (for demo/testing)
CREATE POLICY "Users can update admin status" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to read all user profiles (needed for admin check)
CREATE POLICY "Authenticated users can read profiles" ON user_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- FIX 3: Ensure proper permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- FIX 4: Create a function to easily make users admin
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find user by email
  SELECT auth.users.id INTO target_user_id 
  FROM auth.users 
  WHERE auth.users.email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Update user profile to admin
  UPDATE user_profiles 
  SET is_admin = true, 
      full_name = COALESCE(full_name, 'Admin User'),
      updated_at = NOW()
  WHERE id = target_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FIX 5: Create a view for easy admin status checking
CREATE OR REPLACE VIEW admin_users AS
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.created_at as user_created_at,
  p.is_admin,
  p.phone,
  p.created_at as profile_created_at,
  p.updated_at as profile_updated_at
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
WHERE p.is_admin = true;

-- Grant access to the view
GRANT SELECT ON admin_users TO authenticated;

-- FIX 6: Create sample admin user (if needed)
-- You can run this in the Supabase SQL editor to create a test admin:
-- SELECT make_user_admin('your-admin@example.com');

-- Verify the setup by checking current policies
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE tablename = 'products';
  
  RAISE NOTICE 'Products table now has % RLS policies', policy_count;
  
  IF policy_count < 4 THEN
    RAISE EXCEPTION 'Missing policies - expected at least 4, found %', policy_count;
  ELSE
    RAISE NOTICE '✅ All products RLS policies are in place!';
  END IF;
END;
$$;