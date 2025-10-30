"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  Book, 
  Phone, 
  Mail, 
  MessageCircle, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Smartphone, 
  Globe, 
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  product?: string
}

const faqs: FAQ[] = [
  {
    id: "1",
    category: "Orders & Products",
    question: "How do I track my order?",
    answer: "You can track your order by logging into your account and visiting the 'Orders' section. You'll receive a tracking number via email once your order ships. You can also track orders using our order tracking page with your order ID.",
    product: "All Products"
  },
  {
    id: "2",
    category: "Water Pump Controllers",
    question: "What is the range of the WiFi connection for the water pump controllers?",
    answer: "The water pump controllers have a WiFi range of up to 30 meters (98 feet) from your router. For best performance, ensure your router is positioned centrally and avoid interference from metal objects or thick walls.",
    product: "Water Pump Smart Switches"
  },
  {
    id: "3",
    category: "Installation",
    question: "Do I need an electrician to install the water pump controller?",
    answer: "Our water pump controllers are designed for easy DIY installation. Each device comes with detailed installation instructions. However, if you're not comfortable with electrical work, we recommend hiring a qualified electrician.",
    product: "Water Pump Smart Switches"
  },
  {
    id: "4",
    category: "Payment",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and mobile payment options like Paystack. All transactions are secure and encrypted for your protection.",
    product: "All Products"
  },
  {
    id: "5",
    category: "Shipping",
    question: "How long does shipping take?",
    answer: "Standard shipping within Nigeria takes 3-5 business days. Express shipping (1-2 business days) is available for an additional fee. International shipping takes 7-14 business days.",
    product: "All Products"
  },
  {
    id: "6",
    category: "Technical Support",
    question: "My water pump controller isn't connecting to WiFi. What should I do?",
    answer: "First, ensure your WiFi router is within range and the 2.4GHz network is enabled (controllers don't support 5GHz). Check that the device is in pairing mode and reset if necessary. Contact our support team if issues persist.",
    product: "Water Pump Smart Switches"
  },
  {
    id: "7",
    category: "Returns & Refunds",
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for unused products in original packaging. For water pump controllers, we also offer a 1-year warranty. Please contact support to initiate a return or warranty claim.",
    product: "All Products"
  },
  {
    id: "8",
    category: "Mobile Apps",
    question: "Is the mobile app free?",
    answer: "Yes, our mobile app for controlling water pump controllers is completely free to download and use. It's available on both iOS and Android app stores. The app is regularly updated with new features.",
    product: "Mobile Apps"
  },
  {
    id: "9",
    category: "Web Development",
    question: "Do you provide custom web development services?",
    answer: "Yes! We specialize in custom web development for businesses. Our services include e-commerce platforms, business websites, web applications, and more. Contact us to discuss your project requirements and get a quote.",
    product: "Web Development"
  },
  {
    id: "10",
    category: "IoT Solutions",
    question: "Can you create custom IoT solutions for my business?",
    answer: "Absolutely! We design and develop custom IoT solutions for various industries. Whether you need smart home automation, industrial monitoring, or other connected devices, our team can create tailored solutions to meet your specific needs.",
    product: "IoT Solutions"
  }
]

const helpCategories = [
  {
    title: "Orders & Products",
    icon: ShoppingCart,
    count: faqs.filter(faq => faq.category === "Orders & Products").length,
    color: "bg-blue-100 text-blue-800"
  },
  {
    title: "Water Pump Controllers", 
    icon: Zap,
    count: faqs.filter(faq => faq.category === "Water Pump Controllers").length,
    color: "bg-yellow-100 text-yellow-800"
  },
  {
    title: "Payment",
    icon: CreditCard,
    count: faqs.filter(faq => faq.category === "Payment").length,
    color: "bg-green-100 text-green-800"
  },
  {
    title: "Shipping",
    icon: Truck,
    count: faqs.filter(faq => faq.category === "Shipping").length,
    color: "bg-purple-100 text-purple-800"
  },
  {
    title: "Installation",
    icon: HelpCircle,
    count: faqs.filter(faq => faq.category === "Installation").length,
    color: "bg-red-100 text-red-800"
  },
  {
    title: "Technical Support",
    icon: Smartphone,
    count: faqs.filter(faq => faq.category === "Technical Support").length,
    color: "bg-indigo-100 text-indigo-800"
  },
  {
    title: "Returns & Refunds",
    icon: Book,
    count: faqs.filter(faq => faq.category === "Returns & Refunds").length,
    color: "bg-pink-100 text-pink-800"
  },
  {
    title: "Web Development",
    icon: Globe,
    count: faqs.filter(faq => faq.category === "Web Development").length,
    color: "bg-orange-100 text-orange-800"
  },
  {
    title: "Mobile Apps",
    icon: Smartphone,
    count: faqs.filter(faq => faq.category === "Mobile Apps").length,
    color: "bg-cyan-100 text-cyan-800"
  },
  {
    title: "IoT Solutions",
    icon: Zap,
    count: faqs.filter(faq => faq.category === "IoT Solutions").length,
    color: "bg-emerald-100 text-emerald-800"
  }
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to your questions about our products and services
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for help articles, products, or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        !selectedCategory 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">All Categories</span>
                        <Badge variant="secondary">{faqs.length}</Badge>
                      </div>
                    </button>
                    
                    {helpCategories.map((category) => {
                      const Icon = category.icon
                      return (
                        <button
                          key={category.title}
                          onClick={() => setSelectedCategory(category.title)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedCategory === category.title
                              ? 'bg-primary text-primary-foreground border-primary' 
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4" />
                              <span className="text-sm font-medium">{category.title}</span>
                            </div>
                            <Badge className={category.color}>{category.count}</Badge>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {selectedCategory && (
                  <div className="mb-6">
                    <Badge className="mb-2">
                      {helpCategories.find(c => c.title === selectedCategory)?.icon && 
                        (() => {
                          const Icon = helpCategories.find(c => c.title === selectedCategory)!.icon
                          return <Icon className="h-4 w-4 mr-1" />
                        })()
                      }
                      {selectedCategory}
                    </Badge>
                  </div>
                )}

                <div className="space-y-4">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => (
                      <Card key={faq.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader 
                          className="pb-3"
                          onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg leading-tight mb-2">
                                {faq.question}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {faq.category}
                                </Badge>
                                {faq.product && (
                                  <Badge variant="secondary" className="text-xs">
                                    {faq.product}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {expandedFaq === faq.id ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground mt-1" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                            )}
                          </div>
                        </CardHeader>
                        
                        {expandedFaq === faq.id && (
                          <CardContent className="pt-0">
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                              <p className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your search terms or browse by category.
                      </p>
                      <Button onClick={() => { setSearchTerm(""); setSelectedCategory(null) }}>
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
              <p className="text-lg text-muted-foreground">
                Our support team is here to assist you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Email Support</CardTitle>
                  <CardDescription>
                    Get detailed help via email
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Response within 24 hours
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <a href="mailto:support@rusbadigitalsolutions.com">
                      <Mail className="h-4 w-4 mr-2" />
                      support@rusbadigitalsolutions.com
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Live Chat</CardTitle>
                  <CardDescription>
                    Chat with our support team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Available Monday - Friday, 9AM - 6PM
                  </p>
                  <Button className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Phone Support</CardTitle>
                  <CardDescription>
                    Speak directly with our team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Monday - Friday, 9AM - 6PM WAT
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <a href="tel:+234XXX123456">
                      <Phone className="h-4 w-4 mr-2" />
                      +234 XXX 123 456
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <p className="text-sm text-muted-foreground">
                Can't find what you're looking for?{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact us directly
                </Link>{" "}
                or check our{" "}
                <Link href="/faq" className="text-primary hover:underline">
                  comprehensive FAQ
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