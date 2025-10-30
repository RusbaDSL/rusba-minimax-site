"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getSupabaseProducts } from "@/lib/supabase-products"

export default function TestProductIds() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getSupabaseProducts()
        setProducts(data)
        console.log("Test page - Products loaded:", data)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading test products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Product IDs Test Page</h1>
          <p className="text-muted-foreground">
            This page helps test the product detail page routing. 
            Click on any product to test if the detail page loads correctly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="text-sm">
                  ID: {product.id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {product.description}
                </p>
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/store/product/${product.id}`}>
                      Test Detail Page
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/store">
                      Back to Store
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {products.length === 0 
              ? "No products found in database" 
              : `${products.length} products loaded from database`
            }
          </p>
        </div>
      </div>
    </div>
  )
}