-- ==================================================
-- FIXED: Missing RLS Policies for Products Table
-- ==================================================

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

-- Create a default admin user (you can change the UUID after first admin signup)
-- This policy allows first admin to be created during user creation
CREATE POLICY "Enable admin creation" ON user_profiles
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own admin status (for demo purposes)
CREATE POLICY "Users can update admin status" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Grant permissions for operations
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;