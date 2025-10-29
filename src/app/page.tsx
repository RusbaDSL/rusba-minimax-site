"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardBlue, CardOrange, CardCyan } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Smartphone, Globe, Cpu, Zap, Star, Users, Award, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full glass border border-primary/20 mb-8">
                <Zap className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm font-medium gradient-text">Smart IoT Solutions for Modern Living</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
                <span className="gradient-text">Smart Solutions</span>
                <br />
                <span className="text-foreground">for a </span>
                <span className="text-primary">Connected</span>
                <span className="text-secondary"> World</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Rusba Digital Solutions specializes in web and mobile applications,
                embedded systems, and IoT solutions for smart home automation.
                Never run out of water again with our innovative water pump controllers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90" asChild>
                  <Link href="/store">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="glass border-secondary/30 text-secondary hover:bg-secondary/10" asChild>
                  <Link href="/services">Our Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 gradient-text">Our Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive digital solutions tailored to your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <CardBlue className="p-6 text-center group hover:scale-105 transition-all duration-500">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Web Development</h3>
                <p className="text-muted-foreground">
                  Modern, responsive websites and web applications with cutting-edge technology
                </p>
              </CardBlue>

              <CardOrange className="p-6 text-center group hover:scale-105 transition-all duration-500">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4 group-hover:bg-secondary/20 transition-colors">
                  <Smartphone className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-secondary">Mobile Apps</h3>
                <p className="text-muted-foreground">
                  Native and cross-platform mobile applications for iOS and Android
                </p>
              </CardOrange>

              <CardCyan className="p-6 text-center group hover:scale-105 transition-all duration-500">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                  <Cpu className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-accent">Embedded Systems</h3>
                <p className="text-muted-foreground">
                  Custom hardware and firmware development for specialized applications
                </p>
              </CardCyan>

              <CardBlue className="p-6 text-center group hover:scale-105 transition-all duration-500">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary">IoT Solutions</h3>
                <p className="text-muted-foreground">
                  Smart home automation and connected device solutions for modern living
                </p>
              </CardBlue>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 gradient-text">Featured Products</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our range of smart home automation products
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((version) => (
                <Card key={version} className="group hover:scale-105 transition-all duration-500">
                  <CardHeader className="pb-3">
                    <div className="aspect-square glass rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform bg-primary/5 group-hover:bg-primary/10">
                      <Zap className="h-16 w-16 text-primary" />
                    </div>
                    <CardTitle className="text-xl">
                      Water Pump Smart Switch v{version}
                    </CardTitle>
                    <CardDescription>
                      {version === 1 && "Basic WiFi controller for your water pump"}
                      {version === 2 && "WiFi controller + Screen for enhanced monitoring"}
                      {version === 3 && "WiFi controller + Indoor Unit (Touchscreen)"}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {version === 1 && "Never run out of water again! Control your pump remotely with our basic WiFi solution."}
                      {version === 2 && "Never run out of water again! Enhanced with built-in screen for real-time monitoring."}
                      {version === 3 && "Never run out of water again! Premium touchscreen interface for complete control."}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">₦25,000</span>
                      <Button className="bg-gradient-to-r from-primary to-primary/90">
                        <Link href={`/store/product/water-pump-v${version}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" variant="accent" asChild>
                <Link href="/store">View All Products</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold gradient-text">500+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 mb-3">
                  <Star className="h-6 w-6 text-secondary" />
                </div>
                <div className="text-2xl font-bold gradient-text">4.9</div>
                <div className="text-sm text-muted-foreground">Customer Rating</div>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-3">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div className="text-2xl font-bold gradient-text">50+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold gradient-text">100%</div>
                <div className="text-sm text-muted-foreground">Secure & Reliable</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 gradient-text">What Our Clients Say</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Trusted by businesses and individuals across Nigeria
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The water pump controller has been a game-changer. No more worrying about water supply!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">JA</span>
                  </div>
                  <div>
                    <div className="font-semibold">John Adebayo</div>
                    <div className="text-sm text-muted-foreground">Lagos, Nigeria</div>
                  </div>
                </div>
              </Card>

              <CardOrange className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Professional service and excellent mobile app development. Highly recommended!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-secondary font-semibold">SO</span>
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Okon</div>
                    <div className="text-sm text-muted-foreground">Abuja, Nigeria</div>
                  </div>
                </div>
              </CardOrange>

              <Card className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Their IoT solutions helped automate our entire home. Outstanding work!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-accent font-semibold">ME</span>
                  </div>
                  <div>
                    <div className="font-semibold">Michael Eze</div>
                    <div className="text-sm text-muted-foreground">Port Harcourt, Nigeria</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied customers who have transformed their homes with our smart solutions.
              Get started today and never worry about water supply again!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90" asChild>
                <Link href="/store">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="glass border-primary/30" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
