"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Calendar, Package, CreditCard, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function ProfilePage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }

    if (user) {
      loadUserProfile()
      loadOrders()
    }
  }, [user, authLoading, router])

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user?.id)
        .single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      setUserProfile(data || {
        id: user?.id,
        full_name: user?.user_metadata?.full_name || "",
        phone: "",
        is_admin: isAdmin || false
      })
    } catch (error) {
      console.error("Error loading profile:", error)
      setMessage("Failed to load profile")
    }
  }

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (
              name,
              price
            )
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error loading orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!userProfile) return

    try {
      const { error } = await supabase
        .from("user_profiles")
        .upsert({
          id: user?.id,
          full_name: userProfile.full_name,
          phone: userProfile.phone,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setMessage("Profile updated successfully!")
      setEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage("Failed to update profile")
    }
  }

  const formatPrice = (price: number) => {
    return `₦${(price / 100).toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-muted-foreground mt-2">
                  Manage your account information and view your orders
                </p>
              </div>
              {isAdmin && (
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Administrator
                </Badge>
              )}
            </div>

            {message && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>
                        Update your personal details and contact information
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditing(!editing)}
                    >
                      {editing ? "Cancel" : "Edit"}
                    </Button>
                  </CardHeader>
                  
                  <CardContent>
                    {editing ? (
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                              id="full_name"
                              value={userProfile?.full_name || ""}
                              onChange={(e) => setUserProfile({
                                ...userProfile,
                                full_name: e.target.value
                              })}
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={userProfile?.phone || ""}
                              onChange={(e) => setUserProfile({
                                ...userProfile,
                                phone: e.target.value
                              })}
                              placeholder="Enter your phone number"
                            />
                          </div>
                        </div>
                        <Button type="submit">Save Changes</Button>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Full Name</p>
                              <p className="text-sm text-muted-foreground">
                                {userProfile?.full_name || "Not provided"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Email</p>
                              <p className="text-sm text-muted-foreground">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Phone</p>
                              <p className="text-sm text-muted-foreground">
                                {userProfile?.phone || "Not provided"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Member Since</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(user?.created_at || new Date().toISOString())}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order History
                    </CardTitle>
                    <CardDescription>
                      View your past orders and their status
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-6">
                          Start shopping to see your orders here
                        </p>
                        <Button asChild>
                          <Link href="/store">Shop Now</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium">Order #{order.id.slice(0, 8)}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(order.created_at)}
                                </p>
                              </div>
                              <Badge 
                                variant={
                                  order.status === "completed" ? "default" :
                                  order.status === "processing" ? "secondary" :
                                  "outline"
                                }
                              >
                                {order.status}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              {order.order_items?.map((item: any, index: number) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{item.products?.name} × {item.quantity}</span>
                                  <span>{formatPrice(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                              <span>Total</span>
                              <span>{formatPrice(order.total_amount)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Account Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Summary</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Orders</span>
                      <span className="font-medium">{orders.length}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Type</span>
                      <span className="font-medium">
                        {isAdmin ? "Administrator" : "Customer"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since</span>
                      <span className="font-medium">
                        {formatDate(user?.created_at || new Date().toISOString())}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {isAdmin && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Admin Panel</CardTitle>
                      <CardDescription>
                        Quick access to administrative functions
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <Button asChild className="w-full">
                        <Link href="/admin">
                          <Settings className="h-4 w-4 mr-2" />
                          Go to Admin Panel
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                    <CardDescription>
                      Get in touch with our support team
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/contact">
                        Contact Support
                      </Link>
                    </Button>
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