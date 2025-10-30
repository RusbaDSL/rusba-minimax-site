-- ======================================
-- AFFILIATE SYSTEM DATABASE SCHEMA
-- Phase 1: Database Schema Implementation
-- ======================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================================
-- 1. EXTEND USER_PROFILES TABLE
-- ======================================

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_affiliate BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS affiliate_code VARCHAR(50) UNIQUE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2) DEFAULT 5.00;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS total_earnings INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS pending_earnings INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS affiliate_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS bank_details JSONB;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS affiliate_application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS approved_date TIMESTAMP WITH TIME ZONE;

-- ======================================
-- 2. AFFILIATE LINKS TABLE
-- ======================================

CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  affiliate_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  link_code VARCHAR(50) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  commission_earned INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ======================================
-- 3. AFFILIATE REFERRALS TABLE
-- ======================================

CREATE TABLE IF NOT EXISTS affiliate_referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  affiliate_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  link_code VARCHAR(50) NOT NULL,
  customer_ip INET,
  user_agent TEXT,
  referrer_url TEXT,
  commission_amount INTEGER NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  order_total INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ======================================
-- 4. AFFILIATE PAYOUTS TABLE
-- ======================================

CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  affiliate_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  payment_method VARCHAR(100),
  transaction_id VARCHAR(100),
  bank_details JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ======================================
-- 5. EXTEND ORDERS TABLE
-- ======================================

ALTER TABLE orders ADD COLUMN IF NOT EXISTS affiliate_id UUID REFERENCES user_profiles(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS commission_paid BOOLEAN DEFAULT FALSE;

-- ======================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- ======================================

-- User profiles affiliate indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_affiliate_code ON user_profiles(affiliate_code) WHERE affiliate_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_affiliate_status ON user_profiles(affiliate_status) WHERE is_affiliate = TRUE;

-- Affiliate links indexes
CREATE INDEX IF NOT EXISTS idx_affiliate_links_affiliate_id ON affiliate_links(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_product_id ON affiliate_links(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_link_code ON affiliate_links(link_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_active ON affiliate_links(is_active) WHERE is_active = TRUE;

-- Affiliate referrals indexes
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_affiliate_id ON affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_order_id ON affiliate_referrals(order_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_status ON affiliate_referrals(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_link_code ON affiliate_referrals(link_code);

-- Affiliate payouts indexes
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_affiliate_id ON affiliate_payouts(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_status ON affiliate_payouts(status);

-- Orders affiliate indexes
CREATE INDEX IF NOT EXISTS idx_orders_affiliate_id ON orders(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_orders_referral_code ON orders(referral_code);

-- ======================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ======================================

-- Enable RLS on all affiliate tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Recreate user_profiles policies (extend existing ones)
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Admin policies for user_profiles (extend to include affiliate management)
CREATE POLICY "Admins can manage affiliate profiles" ON user_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Affiliate link policies
CREATE POLICY "Affiliates can view their own links" ON affiliate_links FOR SELECT USING (affiliate_id = auth.uid());
CREATE POLICY "Affiliates can insert their own links" ON affiliate_links FOR INSERT WITH CHECK (affiliate_id = auth.uid());
CREATE POLICY "Affiliates can update their own links" ON affiliate_links FOR UPDATE USING (affiliate_id = auth.uid());
CREATE POLICY "Admins can manage all affiliate links" ON affiliate_links FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Affiliate referral policies
CREATE POLICY "Affiliates can view their own referrals" ON affiliate_referrals FOR SELECT USING (affiliate_id = auth.uid());
CREATE POLICY "System can insert affiliate referrals" ON affiliate_referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Affiliates can update their own referrals" ON affiliate_referrals FOR UPDATE USING (affiliate_id = auth.uid());
CREATE POLICY "Admins can manage all affiliate referrals" ON affiliate_referrals FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Affiliate payout policies
CREATE POLICY "Affiliates can view their own payouts" ON affiliate_payouts FOR SELECT USING (affiliate_id = auth.uid());
CREATE POLICY "Affiliates can insert their own payout requests" ON affiliate_payouts FOR INSERT WITH CHECK (affiliate_id = auth.uid());
CREATE POLICY "Admins can manage all affiliate payouts" ON affiliate_payouts FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Orders policies (extend existing ones to include affiliate tracking)
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;

CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ======================================
-- 8. UTILITY FUNCTIONS
-- ======================================

-- Function to generate unique affiliate codes
CREATE OR REPLACE FUNCTION generate_affiliate_code()
RETURNS TEXT AS $$
DECLARE
  characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(characters, floor(random() * length(characters) + 1)::integer, 1);
  END LOOP;
  
  -- Check if code already exists, if so, generate again
  WHILE EXISTS (SELECT 1 FROM user_profiles WHERE affiliate_code = result) LOOP
    result := '';
    FOR i IN 1..8 LOOP
      result := result || substr(characters, floor(random() * length(characters) + 1)::integer, 1);
    END LOOP;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate commission
CREATE OR REPLACE FUNCTION calculate_commission(order_total INTEGER, commission_rate DECIMAL)
RETURNS INTEGER AS $$
BEGIN
  RETURN FLOOR(order_total * (commission_rate / 100));
END;
$$ LANGUAGE plpgsql;

-- Function to update affiliate earnings
CREATE OR REPLACE FUNCTION update_affiliate_earnings(affiliate_uuid UUID)
RETURNS VOID AS $$
DECLARE
  total_earned INTEGER;
  pending_amount INTEGER;
BEGIN
  -- Calculate total earnings from completed referrals
  SELECT COALESCE(SUM(commission_amount), 0) INTO total_earned
  FROM affiliate_referrals 
  WHERE affiliate_id = affiliate_uuid AND status = 'completed';
  
  -- Calculate pending earnings
  SELECT COALESCE(SUM(commission_amount), 0) INTO pending_amount
  FROM affiliate_referrals 
  WHERE affiliate_id = affiliate_uuid AND status = 'pending';
  
  -- Update user profile
  UPDATE user_profiles 
  SET 
    total_earnings = total_earned,
    pending_earnings = pending_amount,
    updated_at = NOW()
  WHERE id = affiliate_uuid;
END;
$$ LANGUAGE plpgsql;

-- ======================================
-- 9. TRIGGERS FOR AUTOMATIC UPDATES
-- ======================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_affiliate_links_updated_at 
  BEFORE UPDATE ON affiliate_links 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_referrals_updated_at 
  BEFORE UPDATE ON affiliate_referrals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_payouts_updated_at 
  BEFORE UPDATE ON affiliate_payouts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================================
-- 10. INITIAL DATA AND SETUP
-- ======================================

-- Insert default commission rates configuration
CREATE TABLE IF NOT EXISTS affiliate_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  setting_key VARCHAR(50) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default affiliate settings
INSERT INTO affiliate_settings (setting_key, setting_value, description) VALUES
('default_commission_rate', '5.00', 'Default commission rate for new affiliates'),
('minimum_payout', '1000000', 'Minimum payout amount in kobo (₦10,000)'),
('payout_frequency', 'monthly', 'Payout frequency: weekly, biweekly, monthly'),
('cookie_duration', '30', 'Cookie duration in days for tracking referrals')
ON CONFLICT (setting_key) DO NOTHING;

-- Create trigger for affiliate_settings updated_at
CREATE TRIGGER update_affiliate_settings_updated_at 
  BEFORE UPDATE ON affiliate_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on affiliate_settings
ALTER TABLE affiliate_settings ENABLE ROW LEVEL SECURITY;

-- Policies for affiliate_settings
CREATE POLICY "Anyone can view affiliate settings" ON affiliate_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage affiliate settings" ON affiliate_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ======================================
-- 11. VIEW FOR AFFILIATE DASHBOARD
-- ======================================

CREATE OR REPLACE VIEW affiliate_dashboard AS
SELECT 
  up.id,
  up.full_name,
  up.affiliate_code,
  up.affiliate_status,
  up.commission_rate,
  up.total_earnings,
  up.pending_earnings,
  up.is_affiliate,
  up.affiliate_application_date,
  up.approved_date,
  -- Link statistics
  COALESCE(link_stats.total_clicks, 0) as total_clicks,
  COALESCE(link_stats.total_conversions, 0) as total_conversions,
  COALESCE(link_stats.active_links, 0) as active_links,
  -- Referral statistics
  COALESCE(referral_stats.pending_referrals, 0) as pending_referrals,
  COALESCE(referral_stats.completed_referrals, 0) as completed_referrals,
  COALESCE(referral_stats.total_referrals, 0) as total_referrals,
  -- Payout statistics
  COALESCE(payout_stats.total_payouts, 0) as total_payouts,
  COALESCE(payout_stats.pending_payouts, 0) as pending_payouts
FROM user_profiles up
LEFT JOIN (
  SELECT 
    affiliate_id,
    SUM(clicks) as total_clicks,
    SUM(conversions) as total_conversions,
    COUNT(*) as active_links
  FROM affiliate_links 
  WHERE is_active = TRUE
  GROUP BY affiliate_id
) link_stats ON up.id = link_stats.affiliate_id
LEFT JOIN (
  SELECT 
    affiliate_id,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_referrals,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_referrals,
    COUNT(*) as total_referrals
  FROM affiliate_referrals
  GROUP BY affiliate_id
) referral_stats ON up.id = referral_stats.affiliate_id
LEFT JOIN (
  SELECT 
    affiliate_id,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as total_payouts,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payouts
  FROM affiliate_payouts
  GROUP BY affiliate_id
) payout_stats ON up.id = payout_stats.affiliate_id
WHERE up.is_affiliate = TRUE;

-- Enable RLS on the view (creates a policy automatically)
ALTER VIEW affiliate_dashboard SET (security_invoker = true);

-- ======================================
-- SCHEMA IMPLEMENTATION COMPLETE
-- ======================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Affiliate System Database Schema Successfully Implemented!' as status;