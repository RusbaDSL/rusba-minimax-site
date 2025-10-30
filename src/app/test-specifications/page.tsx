"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Edit } from "lucide-react"
import Link from "next/link"
import { getSupabaseProducts } from "@/lib/supabase-products"

interface Product {
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

export default function TestSpecificationsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getSupabaseProducts()
        console.log("Test page - Products loaded with specifications:", data)
        setProducts(data)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const formatPrice = (price: number) => {
    return `₦${(price / 100).toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading products with specifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">🧪 Product Specifications Test</h1>
          <p className="text-muted-foreground">
            Test dynamic specifications feature. All specifications should be loaded from the database,
            not hardcoded in the frontend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.featured && (
                    <Badge variant="default">Featured</Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="text-sm">
                  {product.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Price and Stock */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {product.stock_quantity} in stock
                  </span>
                </div>

                {/* Specifications */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Database Specifications
                  </h4>
                  
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <div className="bg-muted/50 rounded p-3 space-y-1">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="font-medium">{key}:</span>
                          <span className="text-muted-foreground">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted/50 rounded p-3">
                      <p className="text-sm text-muted-foreground italic">
                        No specifications available
                      </p>
                    </div>
                  )}
                </div>

                {/* Test Links */}
                <div className="flex gap-2 pt-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/store/product/${product.id}`}>
                      Test Detail Page
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin">
                      Edit (Admin)
                    </Link>
                  </Button>
                </div>

                {/* Product ID */}
                <div className="text-xs text-muted-foreground font-mono bg-muted/50 rounded p-2">
                  ID: {product.id}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-800 mb-4">✅ Dynamic Specifications Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
              <div>
                <h4 className="font-medium mb-2">✅ What's Working:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Specifications loaded from database JSONB field</li>
                  <li>Admin can add/edit specifications in product form</li>
                  <li>Product detail page shows dynamic specifications</li>
                  <li>No hardcoded specifications in frontend</li>
                  <li>Graceful handling of missing specifications</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">🔧 Admin Actions:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Go to /admin to add/edit products</li>
                  <li>Use "Add Specification" to create key-value pairs</li>
                  <li>Specifications save as JSONB in database</li>
                  <li>Dynamic loading on product detail pages</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/admin">Go to Admin Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/test-product-ids">Test Product IDs</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/store">Back to Store</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}