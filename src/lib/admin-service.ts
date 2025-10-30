import { supabase } from "./supabase"

export async function grantAdminPrivilege(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get the user ID from email
    const { data: { user }, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      return { success: false, message: "Unable to access user management" }
    }

    const targetUser = user.users.find(u => u.email === email)
    if (!targetUser) {
      return { success: false, message: "User not found" }
    }

    // Add to admin_users table
    const { error: adminError } = await supabase
      .from("admin_users")
      .insert({ id: targetUser.id })

    if (adminError && !adminError.message.includes('duplicate')) {
      return { success: false, message: `Failed to grant admin privilege: ${adminError.message}` }
    }

    // Also update user_profiles for backwards compatibility
    const { error: profileError } = await supabase
      .from("user_profiles")
      .update({ is_admin: true })
      .eq("id", targetUser.id)

    if (profileError) {
      return { success: false, message: `Failed to update user profile: ${profileError.message}` }
    }

    return { success: true, message: "Admin privilege granted successfully" }
  } catch (error) {
    return { success: false, message: `Error granting admin privilege: ${error}` }
  }
}

export async function revokeAdminPrivilege(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get the user ID from email
    const { data: { user }, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      return { success: false, message: "Unable to access user management" }
    }

    const targetUser = user.users.find(u => u.email === email)
    if (!targetUser) {
      return { success: false, message: "User not found" }
    }

    // Remove from admin_users table
    const { error: adminError } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", targetUser.id)

    if (adminError) {
      return { success: false, message: `Failed to revoke admin privilege: ${adminError.message}` }
    }

    // Update user_profiles for backwards compatibility
    const { error: profileError } = await supabase
      .from("user_profiles")
      .update({ is_admin: false })
      .eq("id", targetUser.id)

    if (profileError) {
      return { success: false, message: `Failed to update user profile: ${profileError.message}` }
    }

    return { success: true, message: "Admin privilege revoked successfully" }
  } catch (error) {
    return { success: false, message: `Error revoking admin privilege: ${error}` }
  }
}