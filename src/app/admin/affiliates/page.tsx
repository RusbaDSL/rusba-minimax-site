"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  UserCheck, 
  UserX,
  Eye,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  Search,
  Filter,
  BarChart3,
  Award,
  ExternalLink,
  Clock,
  AlertTriangle
} from "lucide-react"
import { formatCurrency } from "@/lib/affiliate"

interface Affiliate {
  id: string
  full_name: string | null
  email: string
  is_affiliate: boolean
  affiliate_code: string | null
  commission_rate: number
  total_earnings: number
  pending_earnings: number
  affiliate_status: 'pending' | 'approved' | 'rejected' | 'suspended'
  payment_method: string | null
  affiliate_application_date: string
  approved_date: string | null
  total_clicks: number
  total_conversions: number
  active_links: number
  pending_referrals: number
  completed_referrals: number
  total_referrals: number
  total_payouts: number
}

export default function AdminAffiliates() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (user && !authLoading) {
      if (!isAdmin) {
        router.push("/")
        return
      }
      fetchAffiliates()
    }
  }, [user, authLoading, isAdmin, router])

  const fetchAffiliates = async () => {
    try {
      // For testing, let's fetch directly without API calls
      console.log("🔍 Fetching affiliates directly...")
      
      // Use direct Supabase client for now
      const { supabase } = await import("@/lib/supabase")
      
      const { data, error } = await supabase
        .from('affiliate_dashboard')
        .select('*')
        .limit(10)

      if (error) {
        console.error('❌ Error fetching affiliates:', error)
        setError(`Database error: ${error.message}`)
        return
      }

      console.log('✅ Affiliates fetched successfully:', data?.length || 0, 'affiliates found')
      setAffiliates(data || [])
      
    } catch (error: any) {
      console.error("❌ Fetch affiliates error:", error)
      setError(error.message || "Failed to fetch affiliates")
    } finally {
      setLoading(false)
    }
  }

  const handleAffiliateAction = async (affiliateId: string, action: 'approve' | 'reject' | 'suspend', reason?: string) => {
    setActionLoading(affiliateId)
    try {
      const response = await fetch(`/api/admin/affiliates/${affiliateId}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          reason
        })
      })

      const data = await response.json()

      if (response.ok) {
        fetchAffiliates()
      } else {
        setError(data.error || "Failed to perform action")
      }
    } catch (error: any) {
      setError(error.message || "Failed to perform action")
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <UserCheck className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'rejected':
        return <UserX className="h-4 w-4 text-red-600" />
      case 'suspended':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Users className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = !searchTerm || 
      affiliate.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.affiliate_code?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || affiliate.affiliate_status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: affiliates.length,
    pending: affiliates.filter(a => a.affiliate_status === 'pending').length,
    approved: affiliates.filter(a => a.affiliate_status === 'approved').length,
    totalEarnings: affiliates.reduce((sum, a) => sum + a.total_earnings, 0)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading affiliate management...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You need admin privileges to access this page.
            </p>
            <Button onClick={() => router.push("/")}>
              Go Home
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
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Affiliate Management</h1>
                <p className="text-muted-foreground">
                  Manage affiliate applications, track performance, and handle payouts
                </p>
              </div>
              <Button onClick={fetchAffiliates} variant="outline">
                Refresh
              </Button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Affiliates</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    Active and pending affiliates
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved Affiliates</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
                  <p className="text-xs text-muted-foreground">
                    Paid to affiliates
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by name, email, or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Affiliates List */}
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Applications & Management</CardTitle>
                <CardDescription>
                  {filteredAffiliates.length} affiliate{filteredAffiliates.length !== 1 ? 's' : ''} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredAffiliates.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAffiliates.map((affiliate) => (
                      <div key={affiliate.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {/* Affiliate Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(affiliate.affiliate_status)}
                              <h3 className="text-lg font-semibold">
                                {affiliate.full_name || 'Anonymous Affiliate'}
                              </h3>
                              {getStatusBadge(affiliate.affiliate_status)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Email</p>
                                <p className="font-medium">{affiliate.email}</p>
                              </div>
                              {affiliate.affiliate_code && (
                                <div>
                                  <p className="text-muted-foreground">Affiliate Code</p>
                                  <p className="font-medium">{affiliate.affiliate_code}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-muted-foreground">Commission Rate</p>
                                <p className="font-medium">{affiliate.commission_rate}%</p>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Clicks</p>
                                <p className="font-medium">{affiliate.total_clicks}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Conversions</p>
                                <p className="font-medium">{affiliate.total_conversions}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Total Earnings</p>
                                <p className="font-medium">{formatCurrency(affiliate.total_earnings)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Pending</p>
                                <p className="font-medium">{formatCurrency(affiliate.pending_earnings)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Applied</p>
                                <p className="font-medium">
                                  {new Date(affiliate.affiliate_application_date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            {affiliate.affiliate_status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleAffiliateAction(affiliate.id, 'approve')}
                                  disabled={actionLoading === affiliate.id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleAffiliateAction(affiliate.id, 'reject')}
                                  disabled={actionLoading === affiliate.id}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </>
                            )}
                            
                            {affiliate.affiliate_status === 'approved' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleAffiliateAction(affiliate.id, 'suspend')}
                                disabled={actionLoading === affiliate.id}
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Suspend
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                            >
                              <a href={`/admin/affiliates/${affiliate.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Affiliates Found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== "all" 
                        ? "Try adjusting your search or filter criteria." 
                        : "No affiliate applications have been submitted yet."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}