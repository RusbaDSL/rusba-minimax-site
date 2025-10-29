import { supabase } from './supabase'

export interface Product {
  id: string
  name: string
  description: string
  price: number // in kobo
  category: string
  stock_quantity: number
  image_url?: string
  created_at: string
  updated_at?: string
}

// Enhanced Supabase products system with admin checks and error handling
export async function getSupabaseProducts(): Promise<Product[]> {
  try {
    console.log('Fetching products from Supabase...')
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error fetching products:', error)
      throw new Error(`Failed to fetch products: ${error.message}`)
    }

    console.log('Products fetched successfully:', data)
    return data || []
  } catch (error) {
    console.error('Error in getSupabaseProducts:', error)
    throw error
  }
}

export async function createSupabaseProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  try {
    console.log('Creating product in Supabase:', productData)
    
    // Check if user is admin first
    const isAdmin = await checkUserAdminStatus()
    if (!isAdmin) {
      throw new Error('Access denied: Admin privileges required')
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...productData,
        price: Math.round(Number(productData.price)), // Ensure it's in kobo
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error creating product:', error)
      
      // Provide specific error messages for common issues
      if (error.code === '42501') {
        throw new Error('Permission denied: You need admin access to create products')
      }
      if (error.code === '23505') {
        throw new Error('Product with this ID already exists')
      }
      
      throw new Error(`Failed to create product: ${error.message}`)
    }

    console.log('Product created successfully:', data)
    return data
  } catch (error) {
    console.error('Error in createSupabaseProduct:', error)
    throw error
  }
}

export async function updateSupabaseProduct(id: string, updates: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product> {
  try {
    console.log('Updating product in Supabase:', { id, updates })
    
    // Check if user is admin first
    const isAdmin = await checkUserAdminStatus()
    if (!isAdmin) {
      throw new Error('Access denied: Admin privileges required')
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        price: updates.price ? Math.round(Number(updates.price)) : undefined, // Ensure it's in kobo
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error updating product:', error)
      
      // Provide specific error messages for common issues
      if (error.code === '42501') {
        throw new Error('Permission denied: You need admin access to update products')
      }
      if (error.code === '23514') {
        throw new Error('Product ID not found')
      }
      
      throw new Error(`Failed to update product: ${error.message}`)
    }

    console.log('Product updated successfully:', data)
    return data
  } catch (error) {
    console.error('Error in updateSupabaseProduct:', error)
    throw error
  }
}

export async function deleteSupabaseProduct(id: string): Promise<void> {
  try {
    console.log('Deleting product from Supabase:', id)
    
    // Check if user is admin first
    const isAdmin = await checkUserAdminStatus()
    if (!isAdmin) {
      throw new Error('Access denied: Admin privileges required')
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error deleting product:', error)
      
      // Provide specific error messages for common issues
      if (error.code === '42501') {
        throw new Error('Permission denied: You need admin access to delete products')
      }
      
      throw new Error(`Failed to delete product: ${error.message}`)
    }

    console.log('Product deleted successfully')
  } catch (error) {
    console.error('Error in deleteSupabaseProduct:', error)
    throw error
  }
}

// Check if current user has admin privileges
export async function checkUserAdminStatus(): Promise<boolean> {
  try {
    console.log('Checking admin status...')
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('No authenticated user found')
      return false
    }

    // Query user_profiles to check is_admin status
    const { data, error } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error checking admin status:', error)
      
      // If no profile exists, create one (this handles first-time users)
      if (error.code === 'PGRST116') { // No rows returned
        console.log('Creating user profile for new user...')
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{
            id: user.id,
            full_name: user.user_metadata?.full_name || '',
            is_admin: false // Default to non-admin
          }])
        
        if (profileError) {
          console.error('Error creating user profile:', profileError)
        }
        
        return false
      }
      
      return false
    }

    const isAdmin = data?.is_admin || false
    console.log('Admin status checked:', isAdmin)
    return isAdmin
    
  } catch (error) {
    console.error('Error in checkUserAdminStatus:', error)
    return false
  }
}

// Make a user admin (for testing/demo purposes)
export async function makeUserAdmin(userEmail: string): Promise<boolean> {
  try {
    console.log('Making user admin:', userEmail)
    
    // Check if current user is admin first
    const isCurrentUserAdmin = await checkUserAdminStatus()
    if (!isCurrentUserAdmin) {
      throw new Error('Access denied: Only admins can make other users admin')
    }

    // Find user by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      throw new Error(`Failed to fetch users: ${userError.message}`)
    }

    const targetUser = userData.users.find(user => user.email === userEmail)
    
    if (!targetUser) {
      throw new Error(`User with email ${userEmail} not found`)
    }

    // Update user profile to admin
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        is_admin: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', targetUser.id)

    if (updateError) {
      throw new Error(`Failed to update admin status: ${updateError.message}`)
    }

    console.log('User made admin successfully')
    return true
    
  } catch (error) {
    console.error('Error in makeUserAdmin:', error)
    throw error
  }
}

// Test Supabase connection
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    console.log('Testing Supabase connection...')
    
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Supabase connection test failed:', error)
      return false
    }

    console.log('Supabase connection test successful')
    return true
    
  } catch (error) {
    console.error('Error testing Supabase connection:', error)
    return false
  }
}

// Get admin users list (for admin management)
export async function getAdminUsers(): Promise<any[]> {
  try {
    console.log('Fetching admin users...')
    
    // Check if current user is admin
    const isAdmin = await checkUserAdminStatus()
    if (!isAdmin) {
      throw new Error('Access denied: Admin privileges required')
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        id,
        full_name,
        is_admin,
        created_at,
        updated_at,
        auth.users(email)
      `)
      .eq('is_admin', true)

    if (error) {
      console.error('Error fetching admin users:', error)
      throw error
    }

    return data || []
    
  } catch (error) {
    console.error('Error in getAdminUsers:', error)
    throw error
  }
}