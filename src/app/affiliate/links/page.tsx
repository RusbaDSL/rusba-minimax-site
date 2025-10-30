"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Copy, 
  ExternalLink, 
  Eye, 
  MousePointer, 
  ShoppingCart,
  Share2,
  BarChart3,
  Trash2,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon
} from "lucide-react"
import Link from "next/link"
import { formatCurrency, calculateConversionRate } from "@/lib/affiliate"

interface AffiliateLink {
  id: string
  affiliate_id: string
  product_id: string
  link_code: string
  original_url: string
  clicks: number
  conversions: number
  commission_earned: number
  is_active: boolean
  created_at: string
  products?: {
    id: string
    name: string
    price: number
    category: string
    image_url: string | null
  }
}

interface Product {
  id: string
  name: string
  price: number
  category: string
  image_url: string | null
}

export default function AffiliateLinks() {
  const { user, loading: authLoading } = useAuth()
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("")

  useEffect(() => {
    if (user) {
      fetchLinks()
      fetchProducts()
    }
  }, [user])

  const fetchLinks = async () => {
    try {
      const response = await fetch("/api/affiliate/links")
      const data = await response.json()

      if (response.ok) {
        setLinks(data.data || [])
      } else {
        setError(data.error || "Failed to fetch links")
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch links")
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/affiliate/products")
      const data = await response.json()

      if (response.ok) {
        setProducts(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
      // Fallback to static products for demo
      setProducts([
        {
          id: "1",
          name: "Water Pump Smart Switch v1",
          price: 2500000,
          category: "IoT Devices",
          image_url: null
        },
        {
          id: "2",
          name: "Water Pump Smart Switch v2", 
          price: 2500000,
          category: "IoT Devices",
          image_url: null
        },
        {
          id: "3",
          name: "Water Pump Smart Switch v3",
          price: 2500000,
          category: "IoT Devices", 
          image_url: null
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const createLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/affiliate/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: selectedProduct
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Affiliate link created successfully!")
        setSelectedProduct("")
        setShowCreateForm(false)
        fetchLinks()
      } else {
        setError(data.error || "Failed to create link")
      }
    } catch (error: any) {
      setError(error.message || "Failed to create link")
    } finally {
      setCreating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess("Link copied to clipboard!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const toggleLinkStatus = async (linkId: string, currentStatus: boolean) => {
    try {
      // This would need an API endpoint to toggle link status
      setError("Link status toggle not implemented yet")
    } catch (error: any) {
      setError(error.message || "Failed to toggle link status")
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading links...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to manage your affiliate links.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/signup">Sign Up</Link>
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
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Affiliate Links</h1>
                <p className="text-muted-foreground">
                  Create and manage your affiliate referral links
                </p>
              </div>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="mt-4 md:mt-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Link
              </Button>
            </div>

            {/* Notifications */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span>{success}</span>
              </div>
            )}

            {/* Create Link Form */}
            {showCreateForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Create New Affiliate Link
                  </CardTitle>
                  <CardDescription>
                    Generate a unique affiliate link for any product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createLink} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="product">Select Product *</Label>
                      <Select
                        value={selectedProduct}
                        onValueChange={setSelectedProduct}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a product to create affiliate link for" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{product.name}</span>
                                <span className="text-muted-foreground ml-2">
                                  {formatCurrency(product.price)}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button type="submit" disabled={creating || !selectedProduct}>
                        {creating ? "Creating..." : "Create Link"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowCreateForm(false)
                          setSelectedProduct("")
                          setError("")
                          setSuccess("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Links Grid */}
            {links.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {links.map((link) => (
                  <Card key={link.id} className="group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {link.products?.name || "Product Link"}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {link.products?.category} • Created {new Date(link.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant={link.is_active ? "default" : "secondary"}>
                          {link.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Link URL */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Affiliate Link</Label>
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <code className="flex-1 text-sm truncate">
                            {link.original_url}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(link.original_url)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Link Code */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Link Code</Label>
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                            {link.link_code}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(link.link_code)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {link.clicks}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <MousePointer className="h-3 w-3" />
                            Clicks
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {link.conversions}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <ShoppingCart className="h-3 w-3" />
                            Sales
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {calculateConversionRate(link.clicks, link.conversions)}%
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <BarChart3 className="h-3 w-3" />
                            Rate
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button size="sm" asChild>
                          <Link href={`/store/product/${link.products?.id || link.product_id}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Product
                          </Link>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(link.original_url)}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleLinkStatus(link.id, link.is_active)}
                        >
                          {link.is_active ? (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <LinkIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Affiliate Links Yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Create your first affiliate link to start earning commissions on referrals.
                  </p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Link
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Tips Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Tips for Success</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Share Effectively</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Share links on social media platforms</li>
                      <li>• Include links in blog posts or articles</li>
                      <li>• Use links in email newsletters</li>
                      <li>• Create engaging content around products</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Track Performance</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Monitor click-through rates</li>
                      <li>• Focus on high-converting products</li>
                      <li>• Test different promotional strategies</li>
                      <li>• Analyze your audience preferences</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}