"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductForm } from "@/components/admin/product-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Package, AlertCircle, CheckCircle, Database, Shield, Star } from "lucide-react"
import { getSupabaseProducts, createSupabaseProduct, updateSupabaseProduct, deleteSupabaseProduct, toggleProductFeatured, checkUserAdminStatus, makeUserAdmin } from "@/lib/supabase-products"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  description: string | null
  price: number // in kobo
  category: string | null
  stock_quantity: number
  image_url: string | null
  featured: boolean
  created_at: string
  updated_at?: string
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && user) {
      // Check admin status
      checkUserAdminStatus()
        .then(adminStatus => {
          setIsAdmin(adminStatus)
          setCheckingAdmin(false)
          
          if (adminStatus) {
            loadProducts()
          } else {
            setLoading(false)
          }
        })
        .catch(error => {
          console.error("Error checking admin status:", error)
          setIsAdmin(false)
          setCheckingAdmin(false)
          setLoading(false)
        })
    } else if (!authLoading && !user) {
      setCheckingAdmin(false)
      setLoading(false)
      router.push("/")
    }
  }, [user, authLoading, router])

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const loadProducts = async () => {
    try {
      console.log("Loading products from Supabase...")
      const data = await getSupabaseProducts()
      console.log("Products loaded from Supabase:", data)
      setProducts(data || [])
    } catch (error: any) {
      console.error("Error loading products from Supabase:", error)
      setMessage(`Failed to load products: ${error.message}`)
      setMessageType("error")
      
      // If it's a permission error, show specific message
      if (error.message.includes('Permission denied')) {
        setMessage("Access denied: You need admin privileges to manage products. Contact your administrator.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitProduct = async (productData: any) => {
    try {
      console.log("Submitting product data to Supabase:", productData)
      
      if (editingProduct) {
        // Update existing product
        console.log("Updating product:", editingProduct.id)
        const updatedProduct = await updateSupabaseProduct(editingProduct.id, productData)
        console.log("Update successful:", updatedProduct)
        setMessage("Product updated successfully!")
        setMessageType("success")
      } else {
        // Create new product
        console.log("Creating new product")
        const newProduct = await createSupabaseProduct(productData)
        console.log("Insert successful:", newProduct)
        setMessage("Product created successfully!")
        setMessageType("success")
      }

      setShowForm(false)
      setEditingProduct(null)
      await loadProducts()
    } catch (error: any) {
      console.error("Error saving product to Supabase:", error)
      const errorMessage = error?.message || "Failed to save product"
      
      // Provide specific error messages
      if (errorMessage.includes('Permission denied')) {
        setMessage("Access denied: You need admin privileges to modify products.")
      } else {
        setMessage(errorMessage)
      }
      
      setMessageType("error")
    }
  }

  const handleToggleFeatured = async (product: Product) => {
    try {
      console.log("Toggling featured status for product:", product.id)
      await toggleProductFeatured(product.id, !product.featured)
      setMessage(`Product ${!product.featured ? 'added to' : 'removed from'} featured products!`)
      setMessageType("success")
      await loadProducts()
    } catch (error: any) {
      console.error("Error toggling featured status:", error)
      const errorMessage = error?.message || "Failed to update featured status"
      
      if (errorMessage.includes('Permission denied')) {
        setMessage("Access denied: You need admin privileges to modify products.")
      } else {
        setMessage(errorMessage)
      }
      
      setMessageType("error")
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      console.log("Deleting product:", productId)
      await deleteSupabaseProduct(productId)
      console.log("Delete successful")
      setMessage("Product deleted successfully!")
      setMessageType("success")
      await loadProducts()
    } catch (error: any) {
      console.error("Error deleting product:", error)
      const errorMessage = error?.message || "Failed to delete product"
      
      if (errorMessage.includes('Permission denied')) {
        setMessage("Access denied: You need admin privileges to delete products.")
      } else {
        setMessage(errorMessage)
      }
      
      setMessageType("error")
    }
  }

  const handleMakeSelfAdmin = async () => {
    if (!user?.email) return
    
    try {
      console.log("Making user admin:", user.email)
      await makeUserAdmin(user.email)
      setMessage("You have been granted admin privileges! Reloading...")
      setMessageType("success")
      
      // Reload after 2 seconds
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      console.error("Error making user admin:", error)
      setMessage(`Failed to grant admin privileges: ${error.message}`)
      setMessageType("error")
    }
  }

  const formatPrice = (price: number) => {
    return `₦${(price / 100).toLocaleString()}`
  }

  if (authLoading || loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">
            {checkingAdmin ? "Checking admin privileges..." : "Loading..."}
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground">Please sign in to access the admin dashboard.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
            <p className="text-muted-foreground mb-6">
              You don't have admin privileges to access this page. 
              You need to be granted admin access by another administrator.
            </p>
            <div className="space-y-4">
              <Button onClick={handleMakeSelfAdmin}>
                Request Admin Access
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Go Home
              </Button>
            </div>
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
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Manage your products and featured products
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
                <Button variant="outline" onClick={loadProducts}>
                  <Database className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <Database className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Connected to Supabase Database
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                All changes are stored in your Supabase database with full admin authentication.
              </p>
            </div>

            {message && (
              <div className={`mb-4 p-4 border rounded-md flex items-center gap-2 ${
                messageType === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}>
                {messageType === "success" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>{message}</span>
              </div>
            )}

            {showForm && (
              <div className="mb-8">
                <ProductForm
                  initialData={editingProduct}
                  onSubmit={handleSubmitProduct}
                />
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowForm(false)
                      setEditingProduct(null)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Featured Products ({products.filter(p => p.featured).length})</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Toggle the star icon to make products appear in the homepage featured section.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group relative">
                  {product.featured && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full p-1 shadow-lg">
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">
                          {product.name}
                        </CardTitle>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="secondary">{product.category}</Badge>
                          {product.featured && (
                            <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Package className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {product.description || `${product.category} - Smart Home Automation`}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-semibold text-primary">
                          {formatPrice(product.price)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {product.stock_quantity} in stock
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFeatured(product)}
                          title={product.featured ? "Remove from featured" : "Add to featured"}
                          className={product.featured ? "border-yellow-400 text-yellow-600 hover:bg-yellow-50" : ""}
                        >
                          <Star className={`h-4 w-4 ${product.featured ? "fill-current text-yellow-500" : ""}`} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log("Edit clicked for:", product)
                            setEditingProduct(product)
                            setShowForm(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log("Delete clicked for:", product.id)
                            handleDeleteProduct(product.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {products.length === 0 && !showForm && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No products yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by adding your first product
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}