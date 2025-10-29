# 🔍 Supabase Signup Error Analysis & Solution

## 🚨 **Root Cause of 500 Error During Signup**

### **1. Missing RLS Policies**
The original schema had incomplete Row Level Security policies:

**Missing Policies:**
- `orders` table: Missing UPDATE and DELETE policies
- `order_items` table: Missing INSERT policies

**Impact:** When the trigger tries to create user records, Supabase's RLS system blocks the operation, causing a 500 error.

### **2. Trigger Function Error Handling**
Original function `create_cart_for_new_user()` lacked proper error handling:

```sql
-- PROBLEMATIC ORIGINAL VERSION
CREATE OR REPLACE FUNCTION create_cart_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO carts (user_id) VALUES (NEW.id);
  INSERT INTO user_profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Issues:**
- No error handling for database failures
- No EXCEPTION blocks
- Function fails silently, causing signup rollback

### **3. Schema Permission Issues**
Functions weren't explicitly in `public` schema, causing permission conflicts.

## ✅ **Fixed Solution: `supabase-schema-fixed.sql`**

### **Key Improvements:**

1. **Complete RLS Policies**
```sql
-- Added missing policies for all tables
CREATE POLICY "Users can update their own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own cart" ON carts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own order items" ON order_items FOR INSERT WITH CHECK (...);
```

2. **Robust Trigger Function**
```sql
-- FIXED VERSION with error handling
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  INSERT INTO public.carts (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create cart/profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

3. **Proper Schema References**
- All functions explicitly in `public` schema
- Proper DROP/CREATE patterns to avoid conflicts

## 🛠️ **How to Fix the Error**

### **Step 1: Clear Current Schema**
In Supabase SQL Editor, run:
```sql
-- Drop existing functions and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_cart_for_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();
```

### **Step 2: Apply Fixed Schema**
Run the entire `supabase-schema-fixed.sql` file in the Supabase SQL Editor.

### **Step 3: Verify Setup**
1. Go to **Authentication > Settings**
2. Ensure **Enable email confirmations** is enabled (for production)
3. Check **Site URL** is correct (your domain)

### **Step 4: Test Signup**
1. Try signing up a new user
2. Check **Logs** for any remaining errors
3. Verify user appears in **Authentication > Users**

## 🎯 **Expected Result After Fix**

✅ **Successful Signup Flow:**
1. User submits signup form
2. Supabase creates user in `auth.users`
3. Trigger `handle_new_user()` creates cart and profile
4. User receives email confirmation (if enabled)
5. Login works seamlessly

✅ **Database Tables Populated:**
- `user_profiles` - User account info
- `carts` - Shopping cart records
- `products` - Product catalog

## 🔧 **Additional Configuration Needed**

### **Environment Variables (.env.local)**
```bash
# Your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### **Supabase Settings**
1. **Go to Authentication > Settings**
2. **Enable email confirmations** (recommended for production)
3. **Configure Site URL** (e.g., `http://localhost:3000` for development)
4. **Add redirect URLs** for your domain

## 📞 **If Errors Persist**

If you still get errors after applying the fix:

1. **Check Supabase Logs:**
   - Go to **Logs** in Supabase dashboard
   - Look for authentication errors

2. **Verify Environment Variables:**
   - Ensure Supabase URL and key are correct
   - Check for extra spaces or quotes

3. **Test Database Connection:**
   - Run a simple query in SQL Editor: `SELECT * FROM products LIMIT 1;`

4. **Contact Support:**
   - If database setup persists, the issue might be with Supabase project configuration

---

**After applying `supabase-schema-fixed.sql`, your signup should work perfectly! 🎉**