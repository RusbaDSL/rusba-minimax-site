-- Add specifications column to products table
ALTER TABLE products 
ADD COLUMN specifications JSONB DEFAULT '{}'::jsonb;

-- Update existing products with default specifications based on their name
UPDATE products 
SET specifications = 
  CASE 
    WHEN name ILIKE '%version 1%' THEN 
      '{"Power Supply": "AC 220V, 50Hz", "WiFi": "2.4GHz", "Mobile App": "iOS & Android", "Warranty": "1 Year"}'::jsonb
    WHEN name ILIKE '%version 2%' THEN 
      '{"Power Supply": "AC 220V, 50Hz", "WiFi": "2.4GHz & 5GHz", "Display": "2.4\" TFT Touchscreen", "Mobile App": "iOS & Android", "Voice Control": "Alexa & Google Assistant", "Warranty": "1 Year"}'::jsonb
    WHEN name ILIKE '%version 3%' THEN 
      '{"Power Supply": "AC 220V, 50Hz", "WiFi": "2.4GHz & 5GHz", "Display": "4\" TFT Touchscreen (Indoor Unit)", "Mobile App": "iOS & Android", "Voice Control": "Alexa & Google Assistant", "Smart Home": "HomeKit, Google Home, SmartThings", "Warranty": "2 Years", "Dimensions": "Indoor Unit: 160mm x 100mm x 25mm"}'::jsonb
    ELSE 
      '{"Power Supply": "AC 220V, 50Hz", "Warranty": "1 Year"}'::jsonb
  END
WHERE specifications = '{}'::jsonb;