"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getLocalCart, removeFromCart, updateCartItemQuantity, clearCart } from "@/lib/cart"

export default function CartPage() {
  const [cart, setCart] = useState(getLocalCart())
  const [loading, setLoading] = useState(false)

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

  const handleRemoveItem = (itemId: string) => {
    const updatedCart = removeFromCart(itemId)
    setCart(updatedCart)
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId)
      return
    }

    const updatedCart = updateCartItemQuantity(itemId, newQuantity)
    setCart(updatedCart)
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const handleClearCart = () => {
    const emptyCart = clearCart()
    setCart(emptyCart)
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/store">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/">Go Home</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-b">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                <p className="text-muted-foreground">
                  {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/store">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Cart Content */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <Card key={item.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold truncate">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Product ID: {item.product_id}
                          </p>
                          <p className="text-lg font-semibold text-primary mt-1">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={loading}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Badge variant="secondary" className="px-3 py-1">
                            {item.quantity}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={loading}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={loading}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Clear Cart */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={handleClearCart}
                    disabled={loading}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Cart
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="glass-card sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(cart.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span className="text-muted-foreground">Calculated at checkout</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(cart.total)}</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <Button size="lg" className="w-full" asChild>
                        <Link href="/checkout">
                          Proceed to Checkout
                        </Link>
                      </Button>
                      <Button variant="outline" size="lg" className="w-full" asChild>
                        <Link href="/store">
                          Continue Shopping
                        </Link>
                      </Button>
                    </div>

                    {/* Secure checkout info */}
                    <div className="pt-4 text-center">
                      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span>Secure checkout with SSL encryption</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}