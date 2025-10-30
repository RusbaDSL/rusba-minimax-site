"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { getLocalCart, addToCart, removeFromCart, clearCart } from "@/lib/cart"

export default function TestCartPage() {
  const [cart, setCart] = useState(getLocalCart())

  useEffect(() => {
    // Listen for cart updates
    const handleCartUpdate = () => {
      setCart(getLocalCart())
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    window.addEventListener("storage", handleCartUpdate)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
      window.removeEventListener("storage", handleCartUpdate)
    }
  }, [])

  const handleAddItem = () => {
    const sampleItems = [
      { id: "test-1", name: "Water Pump Switch v1", price: 25000 },
      { id: "test-2", name: "Water Pump Switch v2", price: 25000 },
      { id: "test-3", name: "Water Pump Switch v3", price: 25000 }
    ]
    
    const randomItem = sampleItems[Math.floor(Math.random() * sampleItems.length)]
    addToCart(randomItem.id, randomItem.name, randomItem.price, 1, "/placeholder-product.jpg")
    
    // Trigger update event
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId)
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const handleClearCart = () => {
    clearCart()
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">🛒 Cart Functionality Test</h1>
          <p className="text-muted-foreground">
            Test the cart functionality and verify that the cart icon count updates correctly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart Test Controls
              </CardTitle>
              <CardDescription>
                Use these buttons to test cart functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleAddItem} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Random Item
              </Button>
              
              <Button onClick={handleClearCart} variant="outline" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Test URLs:</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <Link href="/cart" className="text-primary hover:underline">
                      → View Cart Page
                    </Link>
                  </div>
                  <div>
                    <Link href="/checkout" className="text-primary hover:underline">
                      → Checkout Page
                    </Link>
                  </div>
                  <div>
                    <Link href="/store" className="text-primary hover:underline">
                      → Store Page
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Cart State */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Current Cart State</CardTitle>
              <CardDescription>
                Live cart data and item count
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="font-medium">Items in Cart:</span>
                  <Badge variant={cart.itemCount > 0 ? "default" : "secondary"}>
                    {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="font-medium">Total:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(cart.total)}
                  </span>
                </div>

                {cart.items.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Cart Items:</h4>
                    {cart.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                        <span className="flex-1">{item.name}</span>
                        <span className="text-muted-foreground">Qty: {item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">✅ Testing Checklist</h3>
            <div className="text-sm text-green-700 space-y-1">
              <div>✓ Cart page loads without 404 error</div>
              <div>✓ Cart icon shows item count in header</div>
              <div>✓ Add items increases count</div>
              <div>✓ Remove items decreases count</div>
              <div>✓ Cart page displays items correctly</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}