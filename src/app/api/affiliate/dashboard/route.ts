import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { getAffiliateDashboard } from "@/lib/affiliate"

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

    const dashboard = await getAffiliateDashboard(user.id)

    if (!dashboard) {
      return NextResponse.json(
        { error: "Affiliate dashboard not found or user is not an affiliate" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: dashboard
    })

  } catch (error: any) {
    console.error("Get affiliate dashboard error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch affiliate dashboard" },
      { status: 500 }
    )
  }
}