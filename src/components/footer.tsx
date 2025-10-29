import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full glass border-t mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rusba Digital Solutions</h3>
            <p className="text-sm text-muted-foreground">
              Leading provider of web and mobile apps, embedded systems, and IoT solutions for smart home automation.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services#web" className="hover:text-primary">Web Development</Link></li>
              <li><Link href="/services#mobile" className="hover:text-primary">Mobile Apps</Link></li>
              <li><Link href="/services#iot" className="hover:text-primary">IoT Solutions</Link></li>
              <li><Link href="/services#embedded" className="hover:text-primary">Embedded Systems</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/shipping" className="hover:text-primary">Shipping Info</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Rusba Digital Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}