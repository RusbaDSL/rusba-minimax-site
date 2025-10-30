"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Truck, 
  Clock, 
  MapPin, 
  Package, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  Info,
  Search,
  Phone,
  Mail,
  Globe,
  ArrowRight,
  Shield,
  Zap,
  Plane,
  Truck as DeliveryTruck,
  ArrowLeft,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface ShippingMethod {
  id: string
  name: string
  description: string
  estimatedDays: string
  cost: string
  icon: React.ComponentType<any>
  available: boolean
}

interface TrackingStep {
  id: string
  title: string
  description: string
  estimatedTime: string
  icon: React.ComponentType<any>
}

const shippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "Reliable delivery within Nigeria",
    estimatedDays: "3-5 business days",
    cost: "₦2,000 - ₦5,000",
    icon: Truck,
    available: true
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "Fast delivery for urgent orders",
    estimatedDays: "1-2 business days", 
    cost: "₦5,000 - ₦10,000",
    icon: Zap,
    available: true
  },
  {
    id: "pickup",
    name: "Local Pickup",
    description: "Pick up from our Lagos office",
    estimatedDays: "Same day (if ordered before 2PM)",
    cost: "Free",
    icon: MapPin,
    available: true
  },
  {
    id: "international",
    name: "International Shipping",
    description: "Worldwide delivery service",
    estimatedDays: "7-14 business days",
    cost: "Varies by destination",
    icon: Plane,
    available: false
  }
]

const trackingSteps: TrackingStep[] = [
  {
    id: "processing",
    title: "Order Processing",
    description: "Your order is being prepared",
    estimatedTime: "1-2 hours",
    icon: Package
  },
  {
    id: "shipped",
    title: "Shipped",
    description: "Package has left our facility",
    estimatedTime: "Same day",
    icon: Truck
  },
  {
    id: "transit",
    title: "In Transit",
    description: "Package is on its way to you",
    estimatedTime: "1-3 days",
    icon: DeliveryTruck
  },
  {
    id: "out-for-delivery",
    title: "Out for Delivery",
    description: "Delivery person has your package",
    estimatedTime: "2-4 hours",
    icon: MapPin
  },
  {
    id: "delivered",
    title: "Delivered",
    description: "Package has been delivered",
    estimatedTime: "Complete",
    icon: CheckCircle
  }
]

export default function ShippingPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [activeMethod, setActiveMethod] = useState("standard")

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to tracking page or show tracking modal
    console.log("Tracking:", trackingNumber)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Shipping & Delivery</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Fast, reliable, and secure delivery for all your orders
            </p>
            
            {/* Tracking Form */}
            <div className="max-w-md mx-auto">
              <form onSubmit={handleTrackOrder} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="lg">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                Your tracking number was sent via email after order confirmation
              </p>
            </div>
          </div>
        </section>

        {/* Shipping Methods */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Shipping Options</h2>
              <p className="text-lg text-muted-foreground">
                Choose the delivery method that works best for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {shippingMethods.map((method) => {
                const Icon = method.icon
                return (
                  <Card 
                    key={method.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      activeMethod === method.id ? 'ring-2 ring-primary' : ''
                    } ${!method.available ? 'opacity-50' : ''}`}
                    onClick={() => method.available && setActiveMethod(method.id)}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        method.available ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{method.name}</CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center pt-0">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{method.estimatedDays}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{method.cost}</span>
                        </div>
                        {!method.available && (
                          <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Shipping Details */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6">Shipping Details</h3>
                <div className="space-y-6">
                  <div className="glass-card p-6 rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      What's Included
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Order tracking and notifications</li>
                      <li>• Secure packaging</li>
                      <li>• Insurance coverage</li>
                      <li>• Customer support throughout delivery</li>
                    </ul>
                  </div>

                  <div className="glass-card p-6 rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      Important Notes
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Orders placed after 2PM will ship next business day</li>
                      <li>• Delivery times are estimates, not guarantees</li>
                      <li>• Remote areas may experience longer delivery times</li>
                      <li>• Signature may be required for high-value orders</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6">Delivery Areas</h3>
                <div className="glass-card p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">We Deliver To</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Nigeria</h5>
                      <p className="text-sm text-muted-foreground">
                        All 36 states + Federal Capital Territory
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Major Cities</h5>
                      <p className="text-sm text-muted-foreground">
                        Lagos, Abuja, Port Harcourt, Kano, Ibadan, Benin City, Kaduna, Jos, Warri, Enugu
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">International</h5>
                      <p className="text-sm text-muted-foreground">
                        Coming soon to select countries
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 glass-card p-6 rounded-lg">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Pickup Locations
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">Lagos Office</p>
                      <p className="text-sm text-muted-foreground">
                        123 Victoria Island, Lagos, Nigeria
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Monday - Friday: 9AM - 6PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tracking Timeline */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Order Tracking</h2>
              <p className="text-lg text-muted-foreground">
                Track your order every step of the way
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
              
              <div className="space-y-8">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={step.id} className="relative flex items-start gap-6">
                      <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{step.title}</h3>
                          <Badge variant="outline">{step.estimatedTime}</Badge>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Shipping Costs Calculator */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Shipping Costs</h2>
              <p className="text-lg text-muted-foreground">
                Shipping costs are calculated based on location and order value
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Standard Shipping</CardTitle>
                  <CardDescription>Most economical option</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Order Value</span>
                      <span>Shipping Cost</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Under ₦50,000</span>
                      <span>₦2,500</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>₦50,000 - ₦100,000</span>
                      <span>₦1,500</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Over ₦100,000</span>
                      <span>Free</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Express Shipping</CardTitle>
                  <CardDescription>Fast delivery option</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Order Value</span>
                      <span>Shipping Cost</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Under ₦50,000</span>
                      <span>₦7,500</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>₦50,000 - ₦100,000</span>
                      <span>₦5,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Over ₦100,000</span>
                      <span>₦3,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">International Shipping</CardTitle>
                  <CardDescription>Coming soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-full py-8">
                    <div className="text-center">
                      <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        International shipping launching in 2026
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Shipping FAQ</h2>
              <p className="text-lg text-muted-foreground">
                Common questions about shipping and delivery
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How long does shipping take?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Standard shipping within Nigeria typically takes 3-5 business days. Express shipping takes 1-2 business days. 
                    Local pickup is available same day for orders placed before 2PM.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I change my shipping address after placing an order?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Address changes may be possible if the order hasn't shipped yet. Please contact our customer service team 
                    immediately at +234 XXX 123 456 to request an address change.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What if I'm not home when my package arrives?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    For high-value orders, a signature is required. If you're not home, the carrier will leave a notice with 
                    instructions for re-delivery or pickup. You can also arrange for the package to be left with a neighbor.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you offer free shipping?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! Orders over ₦100,000 qualify for free standard shipping. This offer is valid for deliveries within Nigeria only.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How do I track my order?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You'll receive a tracking number via email once your order ships. You can use this number to track your package 
                    on our website or the carrier's website. You can also check your order status in your account dashboard.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help with Shipping?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our customer service team is here to assist you
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Call Us</CardTitle>
                  <CardDescription>Speak directly with support</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <a href="tel:+234XXX123456">
                      +234 XXX 123 456
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Email Us</CardTitle>
                  <CardDescription>Get detailed assistance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <a href="mailto:shipping@rusbadigitalsolutions.com">
                      shipping@rusbadigitalsolutions.com
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Live Chat</CardTitle>
                  <CardDescription>Chat with our team</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                Need to return an item?{" "}
                <Link href="/help" className="text-primary hover:underline">
                  Check our return policy
                </Link>{" "}
                or{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  contact support
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}