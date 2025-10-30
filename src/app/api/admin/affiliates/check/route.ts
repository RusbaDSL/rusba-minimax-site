import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase" // Using regular client for testing

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Database check API called")
    
    // Check what tables exist
    console.log("📋 Checking affiliate tables...")
    
    // Check user_profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)
    
    console.log("👤 User profiles table:", profileError ? `Error: ${profileError.message}` : "✅ Working")

    // Check affiliate_dashboard view
    const { data: dashboardData, error: dashboardError } = await supabase
      .from('affiliate_dashboard')
      .select('*')
      .limit(1)
    
    console.log("📊 Affiliate dashboard view:", dashboardError ? `Error: ${dashboardError.message}` : "✅ Working")

    // Try to fetch any affiliates that exist
    if (!dashboardError && dashboardData) {
      const { data: allAffiliates, error: fetchError } = await supabase
        .from('affiliate_dashboard')
        .select('*')
      
      if (!fetchError) {
        console.log("📈 Total affiliates found:", allAffiliates?.length || 0)
      }
    }

    const status = {
      profile_table: profileError ? "ERROR" : "WORKING",
      dashboard_view: dashboardError ? "ERROR" : "WORKING",
      total_affiliates: dashboardError ? 0 : (dashboardData ? dashboardData.length : 0)
    }

    return NextResponse.json({
      success: true,
      status,
      message: "Database check completed"
    })

  } catch (error: any) {
    console.error("Database check error:", error)
    return NextResponse.json(
      { 
        error: error.message || "Database check failed",
        success: false
      },
      { status: 500 }
    )
  }
}