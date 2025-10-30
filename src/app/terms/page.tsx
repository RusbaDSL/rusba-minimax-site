"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  CalendarDays, 
  Scale, 
  Shield, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  Truck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Mail,
  Phone,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  const lastUpdated = "October 30, 2025"
  const effectiveDate = "November 1, 2025"

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-muted-foreground mb-6">
              These terms govern your use of Rusba Digital Solutions products and services.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>Last updated: {lastUpdated}</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-muted-foreground rounded-full" />
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>Effective: {effectiveDate}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              
              <div className="glass-card p-8 rounded-lg mb-12">
                <h2 className="text-2xl font-bold mb-4 text-primary">Quick Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">What You Can Do</h4>
                      <p className="text-sm text-muted-foreground">Use our products, create accounts, make purchases</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">What You Cannot Do</h4>
                      <p className="text-sm text-muted-foreground">Violate laws, harm others, misuse our services</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Your Responsibilities</h4>
                      <p className="text-sm text-muted-foreground">Provide accurate info, protect your account</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Our Obligations</h4>
                      <p className="text-sm text-muted-foreground">Provide services, protect your data</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
                  
                  <p className="mb-4">
                    By accessing or using Rusba Digital Solutions website, mobile applications, or any of our products and services 
                    (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms").
                  </p>
                  
                  <p className="mb-4">
                    If you do not agree to these Terms, please do not use our Services. By using our Services, you represent 
                    that you are at least 18 years old and have the legal capacity to enter into these Terms.
                  </p>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>Important:</strong> These Terms apply to all users of our Services, including customers, 
                      affiliates, website visitors, and mobile app users.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">2. Description of Services</h2>
                  
                  <p className="mb-4">Rusba Digital Solutions provides:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li><strong>E-commerce Platform:</strong> Online store for smart home IoT devices, particularly water pump controllers</li>
                    <li><strong>Web Development Services:</strong> Custom websites and web applications for businesses</li>
                    <li><strong>Mobile App Development:</strong> Native and cross-platform mobile applications</li>
                    <li><strong>IoT Solutions:</strong> Smart home automation systems and custom IoT devices</li>
                    <li><strong>Affiliate Program:</strong> Partnership opportunities for marketing our products</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">3. User Accounts and Registration</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Account Creation</h3>
                  <p className="mb-4">To access certain features, you may need to create an account. You agree to:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Maintain the security of your account and password</li>
                    <li>Accept all responsibility for activities under your account</li>
                    <li>Notify us immediately of any unauthorized use</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Account Security</h3>
                  <p className="mb-4">You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Use strong, unique passwords</li>
                    <li>Not share your account credentials with others</li>
                    <li>Log out from shared devices</li>
                    <li>Report suspicious activity immediately</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">4. Purchases and Payments</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Orders and Pricing</h3>
                  <p className="mb-4">When you place an order, you agree to:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Pay the stated price plus any applicable taxes and shipping fees</li>
                    <li>Provide accurate shipping and billing information</li>
                    <li>Accept responsibility for order accuracy</li>
                    <li>Comply with all applicable laws regarding your purchase</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Payment Methods</h3>
                  <p className="mb-4">We accept:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Credit cards (Visa, MasterCard, American Express)</li>
                    <li>Debit cards</li>
                    <li>Mobile payment platforms</li>
                    <li>Other methods as displayed at checkout</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Pricing Accuracy</h3>
                  <p className="mb-4">We strive for accurate pricing but reserve the right to correct any pricing errors. If a pricing error is discovered after order processing, we will:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Notify you of the error</li>
                    <li>Offer the option to cancel the order</li>
                    <li>Process cancellations and refunds if requested</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">5. Shipping and Delivery</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Shipping Information</h3>
                  <p className="mb-4">For detailed shipping information, please visit our{" "}
                    <Link href="/shipping" className="text-primary hover:underline">
                      Shipping Policy page
                    </Link>.
                  </p>

                  <p className="mb-4">Key shipping terms:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Shipping times are estimates and not guaranteed</li>
                    <li>Risk of loss passes to you upon delivery to carrier</li>
                    <li>You are responsible for customs duties and taxes (international orders)</li>
                    <li>Signature confirmation may be required for high-value orders</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">6. Returns and Refunds</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Return Policy</h3>
                  <p className="mb-4">We offer a 30-day return policy for most products. Returns must be:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>In original condition and packaging</li>
                    <li>Accompanied by proof of purchase</li>
                    <li>Authorized by our customer service team</li>
                    <li>Returned using approved shipping methods</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Refunds</h3>
                  <p className="mb-4">Refunds will be processed to the original payment method within 5-10 business days of receiving and inspecting the returned item.</p>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Certain products like custom IoT devices may have different return policies. 
                      Check individual product pages for specific terms.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">7. Product Warranties</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Warranty Coverage</h3>
                  <p className="mb-4">Our products come with the following warranty coverage:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li><strong>IoT Devices:</strong> 1-year limited warranty covering manufacturing defects</li>
                    <li><strong>Software:</strong> 30-day warranty for bugs and malfunctions</li>
                    <li><strong>Services:</strong> 90-day warranty on completed work</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Warranty Exclusions</h3>
                  <p className="mb-4">Warranties do not cover:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Damage from misuse, accidents, or natural disasters</li>
                    <li>Normal wear and tear</li>
                    <li>Unauthorized modifications or repairs</li>
                    <li>Software issues caused by user errors</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">8. Affiliate Program</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Affiliate Terms</h3>
                  <p className="mb-4">Our affiliate program has specific terms that apply to all affiliates:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Application and approval process</li>
                    <li>Commission structure and payment terms</li>
                    <li>Marketing and promotional guidelines</li>
                    <li>Performance tracking and reporting</li>
                    <li>Termination conditions</li>
                  </ul>

                  <p className="mb-4">Affiliate program details are available through our affiliate dashboard and separate affiliate agreement.</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">9. User Conduct</h2>
                  
                  <p className="mb-4">You agree not to use our Services to:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Transmit harmful, offensive, or illegal content</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with the proper functioning of our Services</li>
                    <li>Engage in fraudulent or deceptive practices</li>
                    <li>Harass, threaten, or harm other users</li>
                    <li>Use automated systems to access our Services</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">10. Intellectual Property</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Our Intellectual Property</h3>
                  <p className="mb-4">Our Services, content, and products are protected by intellectual property laws. You may not:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Copy, modify, or distribute our content without permission</li>
                    <li>Use our trademarks or brand without authorization</li>
                    <li>Reverse engineer our products or software</li>
                    <li>Create competing products based on our technology</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">User Content</h3>
                  <p className="mb-4">You retain ownership of content you submit to our Services. By submitting content, you grant us a license to use, display, and distribute that content in connection with our Services.</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">11. Privacy</h2>
                  
                  <p className="mb-4">Your privacy is important to us. Our{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>{" "}
                    explains how we collect, use, and protect your information. By using our Services, you agree to the terms of our Privacy Policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">12. Disclaimers and Limitations</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Service Disclaimers</h3>
                  <p className="mb-4">Our Services are provided "as is" without warranties. We disclaim all warranties, including:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Merchantability and fitness for a particular purpose</li>
                    <li>Uninterrupted or error-free operation</li>
                    <li>Security or freedom from harmful components</li>
                    <li>Accuracy or completeness of content</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Limitation of Liability</h3>
                  <p className="mb-4">To the fullest extent permitted by law, Rusba Digital Solutions shall not be liable for:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Indirect, incidental, or consequential damages</li>
                    <li>Lost profits or business opportunities</li>
                    <li>Data loss or business interruption</li>
                    <li>Damages exceeding the amount paid for the service</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">13. Termination</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Termination by You</h3>
                  <p className="mb-4">You may stop using our Services and request account deletion at any time. Certain obligations may survive termination, including payment obligations.</p>

                  <h3 className="text-xl font-semibold mb-3">Termination by Us</h3>
                  <p className="mb-4">We may suspend or terminate your account if you:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Violate these Terms</li>
                    <li>Engage in fraudulent or illegal activity</li>
                    <li>Breach payment obligations</li>
                    <li>Create multiple accounts to circumvent restrictions</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">14. Dispute Resolution</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Informal Resolution</h3>
                  <p className="mb-4">Before pursuing formal dispute resolution, we encourage you to contact us directly to resolve issues informally.</p>

                  <h3 className="text-xl font-semibold mb-3">Governing Law</h3>
                  <p className="mb-4">These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes will be subject to the exclusive jurisdiction of Nigerian courts.</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">15. Changes to Terms</h2>
                  
                  <p className="mb-4">We may update these Terms from time to time. When we do:</p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>We will post the updated Terms on our website</li>
                    <li>Material changes will be notified via email</li>
                    <li>Your continued use constitutes acceptance of updated Terms</li>
                    <li>If you don't agree with changes, you may terminate your account</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">16. Contact Information</h2>
                  
                  <p className="mb-4">For questions about these Terms, please contact us:</p>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Rusba Digital Solutions Limited</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">legal@rusbadigitalsolutions.com</p>
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
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Contact Form</p>
                          <p className="text-sm text-muted-foreground">
                            <Link href="/contact" className="text-primary hover:underline">
                              Submit inquiry
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Agreement Confirmation</h3>
                  <p className="text-sm mb-4">
                    By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
                    Your continued use of our Services constitutes ongoing acceptance of these terms.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-700 dark:text-green-400">These terms are effective as of {effectiveDate}</span>
                  </div>
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