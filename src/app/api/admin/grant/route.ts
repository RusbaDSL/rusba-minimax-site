import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Get the current authenticated user
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Check if current user is already admin
    const { data: currentUserProfile } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (!currentUserProfile?.is_admin) {
      return NextResponse.json(
        { error: "Admin privileges required" },
        { status: 403 }
      )
    }

    // Find the target user by email
    const { data: targetUserProfile } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("full_name", email) // We use full_name field to store email for admin lookup
      .single()

    if (!targetUserProfile) {
      return NextResponse.json(
        { error: "User not found. Make sure the email is in the user profile." },
        { status: 404 }
      )
    }

    // Grant admin privilege
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ is_admin: true })
      .eq("id", targetUserProfile.id)

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to grant admin privilege: ${updateError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Admin privilege granted to ${email}`
    })

  } catch (error) {
    console.error("Error granting admin privilege:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}