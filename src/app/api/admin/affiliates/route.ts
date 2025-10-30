import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!userData?.is_admin) {
      return NextResponse.json(
        { error: "Admin privileges required" },
        { status: 403 }
      )
    }

    // Fetch all affiliates with dashboard data
    const { data, error } = await supabase
      .from('affiliate_dashboard')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching affiliates:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })

  } catch (error: any) {
    console.error("Get affiliates error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch affiliates" },
      { status: 500 }
    )
  }
}