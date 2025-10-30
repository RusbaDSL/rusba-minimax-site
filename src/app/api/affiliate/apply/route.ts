import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { applyForAffiliate } from "@/lib/affiliate"

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
    const { payment_method, bank_details } = body

    if (!payment_method) {
      return NextResponse.json(
        { error: "Payment method is required" },
        { status: 400 }
      )
    }

    const result = await applyForAffiliate(
      user.id,
      payment_method,
      bank_details
    )

    return NextResponse.json({
      success: true,
      message: "Affiliate application submitted successfully",
      data: result
    })

  } catch (error: any) {
    console.error("Affiliate application error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to submit affiliate application" },
      { status: 500 }
    )
  }
}