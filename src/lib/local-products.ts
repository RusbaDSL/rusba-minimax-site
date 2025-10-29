// Temporary local storage system for products until Supabase is properly configured

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

// Sample products for demonstration
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "water-pump-v1",
    name: "Rusba Water Pump Smart Switch Version 1",
    description: "WiFi controller for your water pump. Never run out of water again!",
    price: 2500000, // ₦25,000 in kobo
    category: "IoT Devices",
    stock_quantity: 50,
    created_at: new Date().toISOString(),
  },
  {
    id: "water-pump-v2", 
    name: "Rusba Water Pump Smart Switch Version 2",
    description: "WiFi controller + Screen for your water pump. Never run out of water again!",
    price: 2500000,
    category: "IoT Devices",
    stock_quantity: 30,
    created_at: new Date().toISOString(),
  },
  {
    id: "water-pump-v3",
    name: "Rusba Water Pump Smart Switch Version 3", 
    description: "WiFi controller + Indoor Unit (Touchscreen) for your water pump. Never run out of water again!",
    price: 2500000,
    category: "IoT Devices",
    stock_quantity: 20,
    created_at: new Date().toISOString(),
  }
]

const STORAGE_KEY = 'rusba_products'

function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error)
  }
  
  // Initialize with default products
  setStoredProducts(DEFAULT_PRODUCTS)
  return DEFAULT_PRODUCTS
}

function setStoredProducts(products: Product[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

export async function getProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredProducts())
    }, 100) // Simulate network delay
  })
}

export async function createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const products = getStoredProducts()
        const newProduct: Product = {
          ...productData,
          id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        products.push(newProduct)
        setStoredProducts(products)
        resolve(newProduct)
      } catch (error) {
        reject(error)
      }
    }, 100)
  })
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const products = getStoredProducts()
        const index = products.findIndex(p => p.id === id)
        
        if (index === -1) {
          throw new Error('Product not found')
        }
        
        products[index] = {
          ...products[index],
          ...updates,
          updated_at: new Date().toISOString(),
        }
        
        setStoredProducts(products)
        resolve(products[index])
      } catch (error) {
        reject(error)
      }
    }, 100)
  })
}

export async function deleteProduct(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const products = getStoredProducts()
        const filtered = products.filter(p => p.id !== id)
        
        if (filtered.length === products.length) {
          throw new Error('Product not found')
        }
        
        setStoredProducts(filtered)
        resolve()
      } catch (error) {
        reject(error)
      }
    }, 100)
  })
}

// Function to switch back to Supabase when ready
export function setupSupabaseFallback(supabaseProducts: any) {
  // This would be called when Supabase is properly configured
  console.log('Ready to switch to Supabase products')
}

// Reset to defaults (useful for testing)
export function resetProducts(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
  getStoredProducts() // This will reinitialize with defaults
}