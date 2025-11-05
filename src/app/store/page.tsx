"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Zap, ShoppingCart, Database } from "lucide-react"
import { getSupabaseProducts } from "@/lib/supabase-products"
import { addToCart } from "@/lib/cart"
import type { Product } from "@/lib/supabase-products"

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setError(null)
        const data = await getSupabaseProducts()
        setProducts(data)
        console.log("Products loaded from Supabase:", data)
      } catch (error: any) {
        console.error("Error loading products:", error)
        setError(error.message || "Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const formatPrice = (price: number) => {
    return `₦${(price / 100).toLocaleString()}`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Store Header */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Our Store</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our range of smart home automation products designed to make your life easier
              </p>
            </div>
          </div>
        </section>

        {/* Database Status Banner */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <Database className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Powered by Supabase Database
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Products loaded from your live database with real-time updates.
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading products from database...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Products</h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow glass-card">
                    <CardHeader className="pb-3">
                      <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full flex items-center justify-center ${product.image_url ? 'hidden' : ''}`}>
                          <Zap className="h-16 w-16 text-primary" />
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {product.stock_quantity} in stock
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild className="flex-1">
                          <Link href={`/store/product/${product.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            addToCart(product.id, product.name, product.price / 100, 1, product.image_url || "/placeholder-product.jpg")
                            window.dispatchEvent(new Event("cartUpdated"))
                            alert(`Added ${product.name} to cart!`)
                          }}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Need Custom Solutions?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We also offer custom web development, mobile apps, and IoT solutions
              tailored to your specific business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">Get a Quote</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}