import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { approveAffiliate, rejectAffiliate } from "@/lib/affiliate"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const body = await request.json()
    const { action, reason } = body
    const { id } = await params

    if (!action || !['approve', 'reject', 'suspend'].includes(action)) {
      return NextResponse.json(
        { error: "Valid action is required (approve, reject, suspend)" },
        { status: 400 }
      )
    }

    let result
    switch (action) {
      case 'approve':
        result = await approveAffiliate(id)
        break
      case 'reject':
        result = await rejectAffiliate(id)
        break
      case 'suspend':
        // Suspend affiliate
        const { data: suspendData, error: suspendError } = await supabase
          .from('user_profiles')
          .update({
            affiliate_status: 'suspended',
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()

        if (suspendError) {
          throw new Error(`Failed to suspend affiliate: ${suspendError.message}`)
        }
        result = suspendData
        break
      default:
        throw new Error('Invalid action')
    }

    return NextResponse.json({
      success: true,
      message: `Affiliate ${action}d successfully`,
      data: result
    })

  } catch (error: any) {
    console.error("Affiliate action error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to perform affiliate action" },
      { status: 500 }
    )
  }
}