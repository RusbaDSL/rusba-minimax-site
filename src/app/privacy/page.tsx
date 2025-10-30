"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Shield, Eye, Lock, Database, Globe, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  const lastUpdated = "October 30, 2025"

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              
              <div className="glass-card p-8 rounded-lg mb-12">
                <h2 className="text-2xl font-bold mb-4 text-primary">Quick Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Eye className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">What We Collect</h4>
                      <p className="text-sm text-muted-foreground">Basic account info, order details, device usage data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">How We Protect It</h4>
                      <p className="text-sm text-muted-foreground">Encryption, secure servers, strict access controls</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">How We Use It</h4>
                      <p className="text-sm text-muted-foreground">Order processing, product improvements, customer support</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-orange-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Your Rights</h4>
                      <p className="text-sm text-muted-foreground">Access, update, delete your data anytime</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
                  <p className="mb-4">We collect information you provide directly to us, such as when you:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Create an account or profile</li>
                    <li>Make a purchase from our store</li>
                    <li>Subscribe to our services</li>
                    <li>Contact us for support</li>
                    <li>Apply to become an affiliate</li>
                    <li>Subscribe to our newsletter</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Information We Collect Automatically</h3>
                  <p className="mb-4">When you use our services, we automatically collect certain information:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent, click patterns)</li>
                    <li>Location data (general location based on IP address)</li>
                    <li>Referral information (how you found our site)</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">IoT Device Data</h3>
                  <p className="mb-4">For our smart home devices, we may collect:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Device status and usage patterns</li>
                    <li>Performance data and diagnostics</li>
                    <li>Configuration settings (with your consent)</li>
                    <li>Network connectivity information</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                  
                  <p className="mb-4">We use the information we collect for various purposes:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li><strong>Order Processing:</strong> To process your purchases and deliver products</li>
                    <li><strong>Account Management:</strong> To maintain your user account and preferences</li>
                    <li><strong>Customer Support:</strong> To provide technical assistance and answer questions</li>
                    <li><strong>Product Improvement:</strong> To analyze usage patterns and improve our products</li>
                    <li><strong>Communication:</strong> To send order updates, marketing communications (with consent)</li>
                    <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security incidents</li>
                    <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">3. Information Sharing and Disclosure</h2>
                  
                  <p className="mb-4">We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>
                  
                  <h3 className="text-xl font-semibold mb-3">Service Providers</h3>
                  <p className="mb-4">We work with trusted third-party service providers who assist us in operating our business:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Payment processors (Paystack, etc.)</li>
                    <li>Shipping and logistics companies</li>
                    <li>Cloud hosting providers (Supabase)</li>
                    <li>Email service providers (Resend)</li>
                    <li>Analytics services (with anonymized data)</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Legal Requirements</h3>
                  <p className="mb-4">We may disclose your information if required by law or in response to valid legal processes.</p>

                  <h3 className="text-xl font-semibold mb-3">Business Transfers</h3>
                  <p className="mb-4">In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                  
                  <p className="mb-4">We implement appropriate security measures to protect your personal information:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Secure servers with regular security updates</li>
                    <li>Access controls and authentication measures</li>
                    <li>Regular security audits and monitoring</li>
                    <li>Employee training on data protection</li>
                  </ul>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> While we strive to protect your personal information, no method of transmission over the internet is 100% secure. Please use strong passwords and keep your account credentials confidential.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
                  
                  <p className="mb-4">We retain your personal information for as long as necessary to:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Provide our services and fulfill orders</li>
                    <li>Comply with legal obligations</li>
                    <li>Resolve disputes and enforce agreements</li>
                    <li>Improve our products and services</li>
                  </ul>
                  
                  <p className="mb-4">Account information is typically retained for the duration of your account plus 7 years for legal and tax purposes. Device data may be retained longer for warranty and support purposes.</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">6. Your Rights and Choices</h2>
                  
                  <p className="mb-4">You have the following rights regarding your personal information:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                    <li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
                    <li><strong>Restriction:</strong> Request limits on how we use your data</li>
                    <li><strong>Objection:</strong> Object to certain uses of your data</li>
                  </ul>
                  
                  <p className="mb-4">To exercise these rights, please contact us using the information provided below.</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">7. Cookies and Tracking</h2>
                  
                  <p className="mb-4">We use cookies and similar technologies to enhance your experience:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                    <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                    <li><strong>Preferences Cookies:</strong> Remember your settings and preferences</li>
                  </ul>
                  
                  <p className="mb-4">You can control cookie settings through your browser preferences. Please note that disabling certain cookies may affect site functionality.</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
                  
                  <p className="mb-4">Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">9. International Transfers</h2>
                  
                  <p className="mb-4">Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
                  
                  <p className="mb-4">We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Posting the updated policy on our website</li>
                    <li>Sending email notification to registered users</li>
                    <li>Displaying a notice on our website</li>
                  </ul>
                  
                  <p className="mb-4">The "Last updated" date at the top of this policy indicates when the most recent changes were made.</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
                  
                  <p className="mb-4">If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Rusba Digital Solutions Limited</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">privacy@rusbadigitalsolutions.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">+234 XXX 123 456</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Website</p>
                          <p className="text-sm text-muted-foreground">
                            <Link href="/contact" className="text-primary hover:underline">
                              Contact Form
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Your Privacy Matters</h3>
                  <p className="text-sm">
                    We are committed to protecting your privacy and being transparent about our data practices. 
                    This policy reflects our dedication to earning and maintaining your trust.
                  </p>
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