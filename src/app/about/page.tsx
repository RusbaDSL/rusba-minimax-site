import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Award, Zap, Target } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              About
              <span className="text-primary"> Rusba Digital</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Leading the future of smart home automation and digital solutions
              across Nigeria and beyond.
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Founded with a vision to revolutionize home automation in Nigeria, 
                  Rusba Digital Solutions has been at the forefront of IoT innovation 
                  since our inception. We recognized the growing need for reliable, 
                  affordable smart home solutions in our region.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  Our flagship product, the Rusba Water Pump Smart Switch series, 
                  has transformed how thousands of Nigerian households manage their 
                  water supply, never having to worry about running out of water again.
                </p>
                <p className="text-lg text-muted-foreground">
                  With a team of passionate engineers and developers, we continue to 
                  push the boundaries of what's possible in smart home technology.
                </p>
              </div>
              <div className="glass-card p-8 rounded-lg">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">5000+</div>
                    <div className="text-sm text-muted-foreground">Smart Homes Automated</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">50+</div>
                    <div className="text-sm text-muted-foreground">Projects Delivered</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">15+</div>
                    <div className="text-sm text-muted-foreground">Team Members</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">4+</div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="glass-card p-6 rounded-lg">
                  <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                  <p className="text-muted-foreground">
                    Constantly pushing boundaries to create cutting-edge solutions
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="glass-card p-6 rounded-lg">
                  <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Customer First</h3>
                  <p className="text-muted-foreground">
                    Your needs drive our innovation and service delivery
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="glass-card p-6 rounded-lg">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Reliability</h3>
                  <p className="text-muted-foreground">
                    Building products you can trust for years to come
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="glass-card p-6 rounded-lg">
                  <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                  <p className="text-muted-foreground">
                    Delivering exceptional quality in everything we create
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet the passionate people behind Rusba Digital Solutions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Tech Leadership</h3>
                <p className="text-muted-foreground">
                  Experienced engineers and developers driving innovation
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Product Team</h3>
                <p className="text-muted-foreground">
                  Designing solutions that meet real-world needs
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Support Team</h3>
                <p className="text-muted-foreground">
                  Dedicated to exceptional customer service
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Home?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have already automated 
              their homes with Rusba Digital Solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/store">Shop Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
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