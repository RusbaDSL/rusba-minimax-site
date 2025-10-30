import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase" // Using regular client for testing

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Simple affiliates API called")
    
    // For testing, let's try without authentication first
    // Check if we can fetch from the affiliate_dashboard view
    const { data, error } = await supabase
      .from('affiliate_dashboard')
      .select('*')
      .limit(10)

    if (error) {
      console.error('Error fetching affiliates:', error)
      throw error
    }

    console.log('✅ Fetched affiliates:', data?.length || 0)

    return NextResponse.json({
      success: true,
      data: data || [],
      message: "Simple affiliate fetch successful"
    })

  } catch (error: any) {
    console.error("Simple affiliates error:", error)
    return NextResponse.json(
      { 
        error: error.message || "Failed to fetch affiliates",
        details: "Using simple API without complex authentication",
        success: false
      },
      { status: 500 }
    )
  }
}