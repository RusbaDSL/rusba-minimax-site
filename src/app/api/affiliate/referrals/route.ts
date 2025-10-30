import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { getAffiliateReferrals } from "@/lib/affiliate"

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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined

    const referrals = await getAffiliateReferrals(user.id, status || undefined)

    return NextResponse.json({
      success: true,
      data: referrals
    })

  } catch (error: any) {
    console.error("Get affiliate referrals error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch affiliate referrals" },
      { status: 500 }
    )
  }
}