import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  // In Next.js 15, cookies() is async and returns a Promise
  const cookieStorePromise = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStorePromise.then(cookieStore => {
            try {
              return cookieStore.getAll()
            } catch (error) {
              console.error('Error getting cookies:', error)
              return []
            }
          })
        },
        setAll(cookiesToSet) {
          cookieStorePromise.then(cookieStore => {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                try {
                  cookieStore.set(name, value, options)
                } catch (error) {
                  console.warn('Failed to set cookie:', name, error)
                }
              })
            } catch (error) {
              console.warn('Failed to set cookies:', error)
            }
          })
        },
      },
    }
  )
}