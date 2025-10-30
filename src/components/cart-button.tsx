"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { getLocalCart } from "@/lib/cart"

export function CartButton() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Listen for cart updates
    const handleCartUpdate = () => {
      const cart = getLocalCart()
      setCartCount(cart.itemCount)
    }

    // Listen for cart changes
    window.addEventListener("cartUpdated", handleCartUpdate)
    window.addEventListener("storage", handleCartUpdate)
    
    // Initial cart load
    handleCartUpdate()

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
      window.removeEventListener("storage", handleCartUpdate)
    }
  }, [])

  return (
    <Button variant="ghost" size="sm" asChild className="relative hover:bg-secondary/10 hover:text-secondary">
      <Link href="/cart" className="flex items-center space-x-2">
        <ShoppingCart className="h-4 w-4" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
            {cartCount}
          </span>
        )}
        <span className="sr-only">Shopping cart</span>
      </Link>
    </Button>
  )
}