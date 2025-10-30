import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { generateAffiliateLink, getAffiliateLinks } from "@/lib/affiliate"

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

    const links = await getAffiliateLinks(user.id)

    return NextResponse.json({
      success: true,
      data: links
    })

  } catch (error: any) {
    console.error("Get affiliate links error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch affiliate links" },
      { status: 500 }
    )
  }
}

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
    const { product_id, custom_url } = body

    if (!product_id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    const link = await generateAffiliateLink(
      user.id,
      product_id,
      custom_url
    )

    return NextResponse.json({
      success: true,
      message: "Affiliate link generated successfully",
      data: link
    })

  } catch (error: any) {
    console.error("Generate affiliate link error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate affiliate link" },
      { status: 500 }
    )
  }
}