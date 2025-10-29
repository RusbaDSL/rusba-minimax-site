"use client"

import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { CartButton } from "@/components/cart-button"
import { User, Menu, LogOut, Settings } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut, isAdmin } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full glass-nav border-b border-primary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group">
              <div className="relative">
                <Image 
                  src="/rusba-logo.png" 
                  alt="Rusba Digital Solutions" 
                  width={40} 
                  height={40}
                  className="h-8 w-auto group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              </div>
              <span className="text-xl font-bold gradient-text">
                Rusba Digital Solutions
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-2">
            <Link 
              href="/" 
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 hover:scale-105 border border-transparent hover:border-primary/20"
            >
              Home
            </Link>
            <Link 
              href="/store" 
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 hover:scale-105 border border-transparent hover:border-primary/20"
            >
              Store
            </Link>
            {isAdmin && (
              <Link 
                href="/admin" 
                className="px-4 py-2 text-sm font-medium text-secondary hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all duration-300 hover:scale-105 border border-transparent hover:border-secondary/20"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <CartButton />
            {user ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary">
                  <Link href="/profile">
                    <User className="h-4 w-4" />
                    <span className="sr-only">Profile</span>
                  </Link>
                </Button>
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild className="hover:bg-secondary/10 hover:text-secondary">
                    <Link href="/admin">
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Admin</span>
                    </Link>
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => signOut()}
                  title="Sign out"
                  className="hover:bg-red-500/10 hover:text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Sign out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-to-r from-primary to-primary/90">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-primary/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <nav className="flex flex-col space-y-3 pb-4">
              <Link 
                href="/" 
                className="px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 border border-transparent hover:border-primary/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/store" 
                className="px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 border border-transparent hover:border-primary/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Store
              </Link>
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="px-4 py-3 text-sm font-medium text-secondary hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all duration-300 border border-transparent hover:border-secondary/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {!user && (
                <>
                  <Link 
                    href="/auth/login" 
                    className="px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 border border-transparent hover:border-primary/20"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="px-4 py-3 text-sm font-medium bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}