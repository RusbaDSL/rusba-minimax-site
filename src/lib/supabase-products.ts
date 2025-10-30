import { supabase } from "./supabase"

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: string | null
  stock_quantity: number
  image_url: string | null
  featured: boolean
  specifications: Record<string, string>
  created_at: string
  updated_at: string
}

// Get all products
export async function getSupabaseProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch products:', error)
    throw error
  }
}

// Get featured products only
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching featured products:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch featured products:', error)
    throw error
  }
}

// Get a single product by ID
export async function getSupabaseProduct(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to fetch product:', error)
    throw error
  }
}

// Create a new product (admin only)
export async function createSupabaseProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  try {
    // Check if user is admin
    const { data: userData } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single()

    if (!userData?.is_admin) {
      throw new Error('Access denied. Admin privileges required.')
    }

    // Ensure specifications are included with default empty object if not provided
    const productData = {
      ...product,
      specifications: product.specifications || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to create product:', error)
    throw error
  }
}

// Update a product (admin only)
export async function updateSupabaseProduct(id: string, updates: Partial<Product>): Promise<Product> {
  try {
    // Check if user is admin
    const { data: userData } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single()

    if (!userData?.is_admin) {
      throw new Error('Access denied. Admin privileges required.')
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to update product:', error)
    throw error
  }
}

// Delete a product (admin only)
export async function deleteSupabaseProduct(id: string): Promise<void> {
  try {
    // Check if user is admin
    const { data: userData } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single()

    if (!userData?.is_admin) {
      throw new Error('Access denied. Admin privileges required.')
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  } catch (error) {
    console.error('Failed to delete product:', error)
    throw error
  }
}

// Toggle product featured status (admin only)
export async function toggleProductFeatured(id: string, featured: boolean): Promise<Product> {
  try {
    // Check if user is admin
    const { data: userData } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single()

    if (!userData?.is_admin) {
      throw new Error('Access denied. Admin privileges required.')
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        featured,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error toggling product featured status:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to toggle product featured status:', error)
    throw error
  }
}

// Make a user admin (admin only)
export async function makeUserAdmin(email: string): Promise<void> {
  try {
    // Check if current user is admin
    const { data: currentUserData } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single()

    if (!currentUserData?.is_admin) {
      throw new Error('Access denied. Admin privileges required.')
    }

    // Find user by email and make them admin
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        is_admin: true,
        updated_at: new Date().toISOString()
      })
      .eq('email', email)

    if (error) {
      console.error('Error making user admin:', error)
      throw error
    }
  } catch (error) {
    console.error('Failed to make user admin:', error)
    throw error
  }
}

// Check if current user is admin
export async function checkUserAdminStatus(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data, error } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error checking admin status:', error)
      return false
    }

    return data?.is_admin || false
  } catch (error) {
    console.error('Failed to check admin status:', error)
    return false
  }
}

// Get user profile by email (for admin creation)
export async function getUserProfileByEmail(email: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    return null
  }
}