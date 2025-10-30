import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { requestPayout } from "@/lib/affiliate"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { amount } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      )
    }

    const payout = await requestPayout(user.id, amount)

    return NextResponse.json({
      success: true,
      message: "Payout request submitted successfully",
      data: payout
    })

  } catch (error: any) {
    console.error("Payout request error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to submit payout request" },
      { status: 500 }
    )
  }
}