import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Globe, Smartphone, Cpu, Zap, ArrowRight, CheckCircle } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      icon: Globe,
      title: "Web Development",
      description: "Modern, responsive websites and web applications built with cutting-edge technologies.",
      features: [
        "Responsive design for all devices",
        "SEO optimization and performance",
        "Content management systems",
        "E-commerce platforms",
        "Progressive web apps"
      ]
    },
    {
      icon: Smartphone,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android.",
      features: [
        "Native iOS and Android apps",
        "React Native cross-platform",
        "Flutter development",
        "App store optimization",
        "Ongoing maintenance and updates"
      ]
    },
    {
      icon: Cpu,
      title: "Embedded Systems",
      description: "Custom hardware and firmware development for specialized applications.",
      features: [
        "Microcontroller programming",
        "PCB design and prototyping",
        "Firmware development",
        "Hardware testing and validation",
        "IoT device integration"
      ]
    },
    {
      icon: Zap,
      title: "IoT Solutions",
      description: "Smart home automation and IoT device development for modern living.",
      features: [
        "Smart home automation",
        "IoT device connectivity",
        "Cloud-based monitoring",
        "Energy management systems",
        "Remote control and monitoring"
      ]
    }
  ]

  const processes = [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "We start by understanding your requirements and creating a comprehensive project plan."
    },
    {
      step: "02",
      title: "Design & Prototyping",
      description: "Our designers create wireframes and prototypes to visualize the solution."
    },
    {
      step: "03",
      title: "Development & Testing",
      description: "We build the solution with rigorous testing at every stage of development."
    },
    {
      step: "04",
      title: "Deployment & Support",
      description: "We deploy your solution and provide ongoing support and maintenance."
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Our
              <span className="text-primary"> Services</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Comprehensive digital solutions designed to transform your business
              and enhance your daily life with smart technology.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From concept to deployment, we provide end-to-end solutions
                tailored to your specific needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => {
                const IconComponent = service.icon
                return (
                  <Card key={index} className="group hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="glass-card p-3 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <IconComponent className="h-8 w-8" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{service.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {service.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Showcasing our expertise through successful project implementations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <Zap className="h-16 w-16 text-primary" />
                  </div>
                  <CardTitle>Smart Water Pump System</CardTitle>
                  <CardDescription>
                    IoT-enabled water pump automation system with mobile app control
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <Globe className="h-16 w-16 text-primary" />
                  </div>
                  <CardTitle>E-commerce Platform</CardTitle>
                  <CardDescription>
                    Full-featured online store with payment integration and inventory management
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <Smartphone className="h-16 w-16 text-primary" />
                  </div>
                  <CardTitle>Business Mobile App</CardTitle>
                  <CardDescription>
                    Cross-platform mobile application for business process automation
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Process</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A proven methodology that ensures successful project delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processes.map((process, index) => (
                <div key={index} className="text-center">
                  <div className="glass-card p-6 rounded-lg mb-4">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {process.step}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{process.title}</h3>
                    <p className="text-muted-foreground">{process.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Why Choose Rusba Digital?</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Expert Team</h3>
                      <p className="text-muted-foreground">
                        Experienced professionals with proven track record
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Quality Assurance</h3>
                      <p className="text-muted-foreground">
                        Rigorous testing and quality control at every stage
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Ongoing Support</h3>
                      <p className="text-muted-foreground">
                        Continued maintenance and support after deployment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Competitive Pricing</h3>
                      <p className="text-muted-foreground">
                        High-quality solutions at competitive market rates
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-6">Ready to Get Started?</h3>
                <p className="text-muted-foreground mb-6">
                  Let's discuss your project and see how we can help bring 
                  your vision to life with our expertise and innovation.
                </p>
                <div className="space-y-4">
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/contact">
                      Get a Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" size="lg" asChild>
                    <Link href="/store">View Our Products</Link>
                  </Button>
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