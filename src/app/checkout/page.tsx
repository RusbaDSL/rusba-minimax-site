"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"
import { getLocalCart, clearCart } from "@/lib/cart"

export default function CheckoutPage() {
  const cart = getLocalCart()
  
  const shippingCost = 2000 // ₦2,000 for Lagos delivery
  const totalWithShipping = cart.total + shippingCost

  const handlePaystackPayment = () => {
    // This would integrate with Paystack in a real implementation
    // For now, we'll simulate a successful payment
    alert("Payment simulation - In real implementation, this would integrate with Paystack!")
    clearCart()
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add some items to your cart before checking out.</p>
            <Button asChild>
              <Link href="/store">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="py-4 px-4 sm:px-6 lg:px-8 border-b">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <Link href="/store" className="hover:text-primary">Store</Link>
              <span>/</span>
              <span className="text-muted-foreground">Checkout</span>
            </nav>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" asChild>
                <Link href="/store">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Checkout</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Order Summary */}
              <div className="glass-card p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ₦{item.price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <div className="font-semibold">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-6 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{cart.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₦{shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₦{totalWithShipping.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment & Shipping Form */}
              <div className="space-y-8">
                {/* Shipping Information */}
                <div className="glass-card p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="Doe"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Address</label>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <input
                        type="text"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="Lagos"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State</label>
                      <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary">
                        <option value="">Select State</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Abuja">Abuja</option>
                        <option value="Kano">Kano</option>
                        <option value="Port Harcourt">Port Harcourt</option>
                        <option value="Ibadan">Ibadan</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="glass-card p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <input type="radio" name="payment" defaultChecked className="text-primary" />
                      <CreditCard className="h-5 w-5" />
                      <span>Credit/Debit Card (Paystack)</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg opacity-50">
                      <input type="radio" name="payment" disabled className="text-primary" />
                      <span>Bank Transfer</span>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handlePaystackPayment}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ₦{totalWithShipping.toLocaleString()} with Paystack
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  By placing this order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}