"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductFormProps {
  onSubmit?: (product: any) => void
  initialData?: any
}

export function ProductForm({ onSubmit, initialData }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category: initialData?.category || "",
    stock_quantity: initialData?.stock_quantity || 0,
    image_url: initialData?.image_url || ""
  })
  const [loading, setLoading] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  // Update form data when initialData changes
  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      category: initialData?.category || "",
      stock_quantity: initialData?.stock_quantity || 0,
      image_url: initialData?.image_url || ""
    })
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Set a timeout to reset loading state after 10 seconds
    const timeout = setTimeout(() => {
      console.log("ProductForm - Timeout reached, resetting loading state")
      setLoading(false)
    }, 10000)

    setTimeoutId(timeout)

    try {
      const productData = {
        ...formData,
        price: Math.round(Number(formData.price) * 100), // Convert to kobo
        updated_at: new Date().toISOString()
      }
      
      console.log("ProductForm - Submitting data:", productData)
      
      if (onSubmit) {
        const result = await onSubmit(productData)
        console.log("ProductForm - Submission result:", result)
        return result
      }
    } catch (error) {
      console.error("Error submitting product:", error)
      // Don't re-throw, let the form handle it gracefully
    } finally {
      // Always reset loading state and clear timeout
      console.log("ProductForm - Resetting loading state")
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    console.log("ProductForm - Input change:", field, value)
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Product" : "Add New Product"}
        </CardTitle>
        <CardDescription>
          {initialData ? "Update product information" : "Fill in the product details"}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                placeholder="e.g., IoT Devices"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter product description"
              className="w-full p-3 border rounded-md bg-background"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (Naira) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", Number(e.target.value))}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity *</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange("stock_quantity", Number(e.target.value))}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => handleInputChange("image_url", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Saving..." : (initialData ? "Update Product" : "Add Product")}
          </Button>
          {loading && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                console.log("Manual reset of loading state")
                setLoading(false)
                if (timeoutId) {
                  clearTimeout(timeoutId)
                }
              }}
            >
              Reset
            </Button>
          )}
          <Button type="button" variant="outline" className="flex-1">
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}