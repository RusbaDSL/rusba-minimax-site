"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { UserPlus, DollarSign, TrendingUp, Shield, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AffiliateSignup() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    payment_method: "",
    bank_name: "",
    account_number: "",
    account_name: "",
    phone_number: "",
    agree_terms: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.payment_method) {
      setError("Please select a payment method")
      return
    }

    if (formData.payment_method === "bank_transfer" && (!formData.bank_name || !formData.account_number || !formData.account_name)) {
      setError("Please complete your bank details")
      return
    }

    if (!formData.agree_terms) {
      setError("Please agree to the terms and conditions")
      return
    }

    setLoading(true)

    try {
      const bankDetails = formData.payment_method === "bank_transfer" ? {
        bank_name: formData.bank_name,
        account_number: formData.account_number,
        account_name: formData.account_name,
        phone_number: formData.phone_number
      } : null

      const response = await fetch("/api/affiliate/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_method: formData.payment_method,
          bank_details: bankDetails
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
      } else {
        setError(data.error || "Failed to submit application")
      }
    } catch (error: any) {
      setError(error.message || "Failed to submit application")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
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
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to apply for the affiliate program.
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

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle>Application Submitted!</CardTitle>
              <CardDescription>
                Your affiliate application has been submitted successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                We will review your application and notify you within 2-3 business days.
                You'll receive an email once your application is approved.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/">Go Home</Link>
                </Button>
                <Button asChild>
                  <Link href="/affiliate/dashboard">Check Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Join Our Affiliate Program</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Earn commissions by referring customers to Rusba Digital Solutions. 
                Start earning passive income today!
              </p>
            </div>

            {/* Benefits Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center p-6">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Earn Commissions</h3>
                <p className="text-muted-foreground">
                  Earn up to 10% commission on every sale you generate
                </p>
              </Card>

              <Card className="text-center p-6">
                <TrendingUp className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Track Performance</h3>
                <p className="text-muted-foreground">
                  Real-time analytics and detailed performance tracking
                </p>
              </Card>

              <Card className="text-center p-6">
                <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                <p className="text-muted-foreground">
                  Reliable monthly payouts directly to your bank account
                </p>
              </Card>
            </div>

            {/* Commission Structure */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Commission Structure</CardTitle>
                <CardDescription>Progressive commission rates based on your performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-2">Tier 1</Badge>
                    <div className="text-2xl font-bold text-primary">5%</div>
                    <p className="text-sm text-muted-foreground">0-10 sales</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="default" className="mb-2">Tier 2</Badge>
                    <div className="text-2xl font-bold text-primary">7%</div>
                    <p className="text-sm text-muted-foreground">11-50 sales</p>
                  </div>
                  <div className="text-center">
                    <Badge className="mb-2">Tier 3</Badge>
                    <div className="text-2xl font-bold text-primary">10%</div>
                    <p className="text-sm text-muted-foreground">51+ sales</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Affiliate Application
                </CardTitle>
                <CardDescription>
                  Fill out the form below to apply for our affiliate program
                </CardDescription>
              </CardHeader>

              <CardContent>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="payment_method">Payment Method *</Label>
                    <Select
                      value={formData.payment_method}
                      onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="paystack">Paystack Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.payment_method === "bank_transfer" && (
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium">Bank Details</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bank_name">Bank Name *</Label>
                          <Input
                            id="bank_name"
                            value={formData.bank_name}
                            onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                            placeholder="e.g., First Bank"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="account_number">Account Number *</Label>
                          <Input
                            id="account_number"
                            value={formData.account_number}
                            onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                            placeholder="e.g., 1234567890"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="account_name">Account Name *</Label>
                          <Input
                            id="account_name"
                            value={formData.account_name}
                            onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone_number">Phone Number</Label>
                          <Input
                            id="phone_number"
                            value={formData.phone_number}
                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                            placeholder="e.g., +234 123 456 7890"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agree_terms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agree_terms: checked as boolean })}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Link href="/affiliate/terms" className="text-primary hover:underline">
                        Affiliate Terms & Conditions
                      </Link>{" "}
                      and understand that commissions will be paid monthly
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Submitting Application..." : "Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}