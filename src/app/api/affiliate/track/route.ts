import { NextRequest, NextResponse } from "next/server"
import { trackAffiliateClick } from "@/lib/affiliate"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { link_code, ip_address, user_agent, referrer_url } = body

    if (!link_code) {
      return NextResponse.json(
        { error: "Link code is required" },
        { status: 400 }
      )
    }

    const success = await trackAffiliateClick(
      link_code,
      ip_address,
      user_agent,
      referrer_url
    )

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Click tracked successfully"
      })
    } else {
      return NextResponse.json(
        { error: "Failed to track click" },
        { status: 400 }
      )
    }

  } catch (error: any) {
    console.error("Click tracking error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to track click" },
      { status: 500 }
    )
  }
}