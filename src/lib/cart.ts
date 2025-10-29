"use client"

import { supabase } from "./supabase"

export interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// Local storage key
const CART_STORAGE_KEY = "rusba-cart"

// Get cart from localStorage
export function getLocalCart(): Cart {
  if (typeof window === "undefined") return { items: [], total: 0, itemCount: 0 }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) return { items: [], total: 0, itemCount: 0 }

    const items: CartItem[] = JSON.parse(stored)
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    return { items, total, itemCount }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error)
    return { items: [], total: 0, itemCount: 0 }
  }
}

// Save cart to localStorage
export function saveLocalCart(cart: Cart) {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.items))
  } catch (error) {
    console.error("Error saving cart to localStorage:", error)
  }
}

// Add item to cart
export function addToCart(productId: string, name: string, price: number, quantity: number = 1, image?: string) {
  const cart = getLocalCart()

  const existingItem = cart.items.find(item => item.product_id === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    const newItem: CartItem = {
      id: `${productId}-${Date.now()}`,
      product_id: productId,
      name,
      price,
      quantity,
      image
    }
    cart.items.push(newItem)
  }

  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  saveLocalCart(cart)
  return cart
}

// Remove item from cart
export function removeFromCart(itemId: string) {
  const cart = getLocalCart()
  cart.items = cart.items.filter(item => item.id !== itemId)

  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  saveLocalCart(cart)
  return cart
}

// Update item quantity
export function updateCartItemQuantity(itemId: string, quantity: number) {
  const cart = getLocalCart()
  const item = cart.items.find(item => item.id === itemId)

  if (item) {
    item.quantity = Math.max(0, quantity)
    if (item.quantity === 0) {
      cart.items = cart.items.filter(i => i.id !== itemId)
    }
  }

  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  saveLocalCart(cart)
  return cart
}

// Clear cart
export function clearCart() {
  const emptyCart = { items: [], total: 0, itemCount: 0 }
  saveLocalCart(emptyCart)
  return emptyCart
}

// Supabase cart functions (for authenticated users)
export async function syncCartToSupabase(userId: string, cart: Cart) {
  try {
    // First, ensure user has a cart
    let userCart: { id: string } | null = null
    const { data: existingCart, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .single()

    if (cartError && cartError.code === "PGRST116") {
      // Cart doesn't exist, create one
      const { data: newCart, error: createError } = await supabase
        .from("carts")
        .insert({ user_id: userId })
        .select("id")
        .single()

      if (createError) throw createError
      userCart = newCart
    } else if (cartError) {
      throw cartError
    } else {
      userCart = existingCart
    }

    if (!userCart) {
      throw new Error("Failed to create or retrieve cart")
    }

    // Clear existing cart items
    await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", userCart.id)

    // Add current cart items
    if (cart.items.length > 0) {
      const cartItems = cart.items.map(item => ({
        cart_id: userCart.id,
        product_id: item.product_id,
        quantity: item.quantity
      }))

      const { error: itemsError } = await supabase
        .from("cart_items")
        .insert(cartItems)

      if (itemsError) throw itemsError
    }

    return true
  } catch (error) {
    console.error("Error syncing cart to Supabase:", error)
    return false
  }
}

export async function loadCartFromSupabase(userId: string): Promise<Cart> {
  try {
    const { data: cartData, error: cartError } = await supabase
      .from("carts")
      .select(`
        id,
        cart_items (
          product_id,
          quantity,
          products (
            name,
            price
          )
        )
      `)
      .eq("user_id", userId)
      .single()

    if (cartError) {
      if (cartError.code === "PGRST116") {
        return { items: [], total: 0, itemCount: 0 }
      }
      throw cartError
    }

    // Type the Supabase response properly
    interface SupabaseCartItem {
      product_id: string;
      quantity: number;
      products: {
        name: string;
        price: number;
      } | null;
    }

    const items: CartItem[] = cartData.cart_items.map((item: SupabaseCartItem) => ({
      id: `${item.product_id}-${Date.now()}`,
      product_id: item.product_id,
      name: item.products?.name || "Unknown Product",
      price: (item.products?.price || 0) / 100, // Convert from kobo to naira
      quantity: item.quantity
    }))

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    return { items, total, itemCount }
  } catch (error) {
    console.error("Error loading cart from Supabase:", error)
    return { items: [], total: 0, itemCount: 0 }
  }
}