"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Zap } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useParams } from "next/navigation"
import { addToCart } from "@/lib/cart"
import { useRouter } from "next/navigation"

const products = [
  {
    id: "water-pump-v1",
    name: "Rusba Water Pump Smart Switch Version 1",
    description: "WiFi controller for your water pump. Never run out of water again!",
    longDescription: `
      The Rusba Water Pump Smart Switch Version 1 is your gateway to automated water management.
      This intelligent device connects to your existing water pump system via WiFi, allowing you
      to control it remotely through our mobile app.

      Key Features:
      • Remote control via smartphone app
      • Automatic water level monitoring
      • Scheduled operation
      • Energy-efficient design
      • Easy installation
      • Compatible with most standard water pumps
    `,
    price: 25000,
    category: "IoT Devices",
    stock: 50,
    image: "/placeholder-product.jpg",
    specifications: {
      "Power Supply": "AC 220V, 50Hz",
      "WiFi": "2.4GHz",
      "Mobile App": "iOS & Android",
      "Warranty": "1 Year",
      "Dimensions": "120mm x 80mm x 40mm"
    }
  },
  {
    id: "water-pump-v2",
    name: "Rusba Water Pump Smart Switch Version 2",
    description: "WiFi controller + Screen for your water pump. Never run out of water again!",
    longDescription: `
      Upgrade to Version 2 with an integrated touchscreen display for enhanced control and monitoring.
      This advanced smart switch features a built-in LCD screen that shows real-time water levels,
      pump status, and system diagnostics.

      Key Features:
      • Built-in touchscreen display
      • Real-time water level monitoring
      • Remote control via smartphone app
      • Automated scheduling
      • System diagnostics
      • Voice control compatible
      • Energy monitoring
    `,
    price: 25000,
    category: "IoT Devices",
    stock: 30,
    image: "/placeholder-product.jpg",
    specifications: {
      "Power Supply": "AC 220V, 50Hz",
      "WiFi": "2.4GHz & 5GHz",
      "Display": "2.4\" TFT Touchscreen",
      "Mobile App": "iOS & Android",
      "Voice Control": "Alexa & Google Assistant",
      "Warranty": "1 Year",
      "Dimensions": "140mm x 90mm x 45mm"
    }
  },
  {
    id: "water-pump-v3",
    name: "Rusba Water Pump Smart Switch Version 3",
    description: "WiFi controller + Indoor Unit (Touchscreen) for your water pump. Never run out of water again!",
    longDescription: `
      The premium Version 3 offers the most comprehensive smart water management solution.
      Featuring a separate indoor touchscreen control unit and advanced automation features,
      this system provides complete control over your water supply.

      Key Features:
      • Separate indoor touchscreen control unit
      • Advanced automation algorithms
      • Multi-tank monitoring
      • Energy usage analytics
      • Backup power support
      • Advanced scheduling options
      • Integration with smart home systems
    `,
    price: 25000,
    category: "IoT Devices",
    stock: 20,
    image: "/placeholder-product.jpg",
    specifications: {
      "Power Supply": "AC 220V, 50Hz",
      "WiFi": "2.4GHz & 5GHz",
      "Display": "4\" TFT Touchscreen (Indoor Unit)",
      "Mobile App": "iOS & Android",
      "Voice Control": "Alexa & Google Assistant",
      "Smart Home": "HomeKit, Google Home, SmartThings",
      "Warranty": "2 Years",
      "Dimensions": "Indoor Unit: 160mm x 100mm x 25mm"
    }
  }
]

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<typeof products[0] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params?.id) {
      const foundProduct = products.find(p => p.id === params.id)
      if (foundProduct) {
        setProduct(foundProduct)
      } else {
        notFound()
      }
      setLoading(false)
    }
  }, [params])

  const handleAddToCart = () => {
    if (product) {
      // Add item to cart
      addToCart(product.id, product.name, product.price, 1, product.image)
      
      // Trigger cart update event
      window.dispatchEvent(new Event("cartUpdated"))
      
      // Show success message
      alert(`Added ${product.name} to cart!`)
    }
  }

  const handleBuyNow = () => {
    if (product) {
      // Add item to cart and redirect to checkout
      addToCart(product.id, product.name, product.price, 1, product.image)
      window.dispatchEvent(new Event("cartUpdated"))
      
      // Redirect to checkout
      router.push("/checkout")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
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
              <span className="text-muted-foreground">{product.name}</span>
            </nav>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <Zap className="h-32 w-32 text-primary" />
                </div>
                <div className="flex gap-2">
                  <div className="aspect-square w-20 bg-muted rounded flex items-center justify-center cursor-pointer hover:bg-muted/80">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <div className="aspect-square w-20 bg-muted rounded flex items-center justify-center cursor-pointer hover:bg-muted/80">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <div className="aspect-square w-20 bg-muted rounded flex items-center justify-center cursor-pointer hover:bg-muted/80">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                  <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                  <p className="text-xl text-muted-foreground">{product.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-primary">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </Badge>
                </div>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="flex-1"
                    disabled={product.stock === 0}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={product.stock === 0}
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                </div>

                {/* Specifications */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Specifications</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border/50">
                        <span className="font-medium">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="mt-16 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <div className="prose prose-lg max-w-none">
                  {product.longDescription.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-muted-foreground">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}