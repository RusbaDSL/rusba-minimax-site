"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (session?.user) {
        // Check if user is admin
        try {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single()
          
          setIsAdmin(profile?.is_admin || false)
        } catch (error) {
          // If user_profiles table doesn't exist, default to not admin
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        // Provide more helpful error messages
        if (error.message.includes("Database error") || error.status === 500) {
          return { error: "Authentication service is temporarily unavailable. Please contact support." }
        }
        if (error.message.includes("Invalid login credentials")) {
          return { error: "Invalid email or password. Please check your credentials." }
        }
        return { error: error.message }
      }
      return {}
    } catch (error) {
      return { error: "Unable to connect to the authentication service. Please check your internet connection." }
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) {
        // Provide more helpful error messages
        if (error.message.includes("Database error") || error.status === 500) {
          return { error: "Unable to create account. The authentication service is temporarily unavailable. Please try again later or contact support." }
        }
        if (error.message.includes("already registered")) {
          return { error: "An account with this email already exists. Please try logging in instead." }
        }
        if (error.message.includes("invalid")) {
          return { error: "Please provide a valid email address and password (minimum 6 characters)." }
        }
        return { error: error.message }
      }
      return {}
    } catch (error) {
      return { error: "Unable to create account. Please check your internet connection and try again." }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}