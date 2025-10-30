"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  MousePointer, 
  ExternalLink,
  Plus,
  Copy,
  Eye,
  BarChart3,
  Wallet,
  Award,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Star
} from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/affiliate"

interface AffiliateDashboard {
  id: string
  full_name: string | null
  affiliate_code: string | null
  affiliate_status: string
  commission_rate: number
  total_earnings: number
  pending_earnings: number
  is_affiliate: boolean
  affiliate_application_date: string
  approved_date: string | null
  total_clicks: number
  total_conversions: number
  active_links: number
  pending_referrals: number
  completed_referrals: number
  total_referrals: number
  total_payouts: number
  pending_payouts: number
}

export default function AffiliateDashboard() {
  const { user, loading: authLoading } = useAuth()
  const [dashboard, setDashboard] = useState<AffiliateDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [referralLinks, setReferralLinks] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      fetchDashboard()
      fetchReferralLinks()
    }
  }, [user])

  const fetchDashboard = async () => {
    try {
      const response = await fetch("/api/affiliate/dashboard")
      const data = await response.json()

      if (response.ok) {
        setDashboard(data.data)
      } else {
        setError(data.error || "Failed to fetch dashboard")
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch dashboard")
    } finally {
      setLoading(false)
    }
  }

  const fetchReferralLinks = async () => {
    try {
      const response = await fetch("/api/affiliate/links")
      const data = await response.json()

      if (response.ok) {
        setReferralLinks(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch referral links:", error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const calculateConversionRate = (clicks: number, conversions: number) => {
    if (clicks === 0) return 0
    return Math.round((conversions / clicks) * 100 * 100) / 100
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
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
              Please sign in to access your affiliate dashboard.
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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Dashboard Error</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">No Affiliate Account</h1>
            <p className="text-muted-foreground mb-6">
              You don't have an affiliate account yet. Apply to become an affiliate.
            </p>
            <Button asChild>
              <Link href="/affiliate/signup">Apply for Affiliate</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Affiliate Dashboard</h1>
                <div className="flex items-center gap-4">
                  <p className="text-muted-foreground">
                    Welcome back, {dashboard.full_name || 'Affiliate'}
                  </p>
                  {dashboard.affiliate_code && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        Code: {dashboard.affiliate_code}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(dashboard.affiliate_code!)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                {getStatusBadge(dashboard.affiliate_status)}
                {dashboard.affiliate_status === 'approved' && (
                  <Button asChild>
                    <Link href="/affiliate/links">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Link
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboard.total_earnings)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +12% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboard.pending_earnings)}</div>
                  <p className="text-xs text-muted-foreground">
                    Ready for payout
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboard.total_clicks}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-blue-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8% from last week
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboard.total_conversions}</div>
                  <p className="text-xs text-muted-foreground">
                    {calculateConversionRate(dashboard.total_clicks, dashboard.total_conversions)}% conversion rate
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            {dashboard.affiliate_status === 'approved' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Generate New Link
                    </CardTitle>
                    <CardDescription>
                      Create affiliate links for any product
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href="/affiliate/links">Create Link</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      View Analytics
                    </CardTitle>
                    <CardDescription>
                      Detailed performance tracking
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/affiliate/analytics">View Analytics</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      Request Payout
                    </CardTitle>
                    <CardDescription>
                      Withdraw your earnings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/affiliate/earnings">Manage Earnings</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Activity & Referral Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest affiliate performance</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboard.total_referrals > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">Recent Conversions</p>
                          <p className="text-sm text-muted-foreground">
                            {dashboard.completed_referrals} completed referrals
                          </p>
                        </div>
                        <Badge variant="secondary">{formatCurrency(dashboard.total_earnings)}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">Pending Referrals</p>
                          <p className="text-sm text-muted-foreground">
                            {dashboard.pending_referrals} waiting for confirmation
                          </p>
                        </div>
                        <Badge variant="outline">{formatCurrency(dashboard.pending_earnings)}</Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No activity yet. Start by creating your first affiliate link!
                      </p>
                      <Button asChild>
                        <Link href="/affiliate/links">Create Your First Link</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Links</CardTitle>
                  <CardDescription>
                    {dashboard.active_links} active links
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {referralLinks.length > 0 ? (
                    <div className="space-y-4">
                      {referralLinks.slice(0, 3).map((link, index) => (
                        <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium truncate max-w-xs">
                              {link.products?.name || 'Product Link'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-muted-foreground">
                                {link.clicks} clicks
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {link.conversions} conversions
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/store/product/${link.products?.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyToClipboard(link.original_url)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/affiliate/links">
                          View All Links
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ExternalLink className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No affiliate links yet.
                      </p>
                      <Button asChild>
                        <Link href="/affiliate/links">Create Your First Link</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Commission Rate Info */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Your Commission Rate
                </CardTitle>
                <CardDescription>
                  Current commission tier based on your performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-primary">
                      {dashboard.commission_rate}%
                    </div>
                    <p className="text-muted-foreground">
                      Current commission rate
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Progress to next tier
                    </p>
                    <div className="w-32 bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (dashboard.total_conversions / (dashboard.commission_rate === 5 ? 11 : dashboard.commission_rate === 7 ? 51 : 100)) * 100)}%` 
                        }}
                      ></div>
                    </div>
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