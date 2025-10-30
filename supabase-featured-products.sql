-- Add featured column to products table
ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT FALSE;

-- Create index for faster featured product queries
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;

-- Update existing products to have some featured
UPDATE products SET featured = TRUE WHERE name LIKE '%Water Pump Smart Switch Version 1%';

-- Enable RLS for the new column (inherits existing policies)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Update RLS policies to handle featured column
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert products" ON products;
CREATE POLICY "Admins can insert products" ON products FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.is_admin = true
  )
);

DROP POLICY IF EXISTS "Admins can update products" ON products;
CREATE POLICY "Admins can update products" ON products FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.is_admin = true
  )
);

DROP POLICY IF EXISTS "Admins can delete products" ON products;
CREATE POLICY "Admins can delete products" ON products FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.is_admin = true
  )
);