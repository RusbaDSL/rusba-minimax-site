import { supabase } from "./supabase"
import { EmailTemplates, sendEmail, generateAffiliateApplicationEmail, generateAffiliateApprovalEmail, generateAffiliateRejectionEmail } from "@/lib/email"

export interface AffiliateProfile {
  id: string
  full_name: string | null
  email: string
  is_affiliate: boolean
  affiliate_code: string | null
  commission_rate: number
  total_earnings: number
  pending_earnings: number
  affiliate_status: 'pending' | 'approved' | 'rejected' | 'suspended'
  payment_method: string | null
  bank_details: any
  affiliate_application_date: string
  approved_date: string | null
  created_at: string
  updated_at: string
}

export interface AffiliateLink {
  id: string
  affiliate_id: string
  product_id: string
  link_code: string
  original_url: string
  clicks: number
  conversions: number
  commission_earned: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AffiliateReferral {
  id: string
  affiliate_id: string
  order_id: string
  link_code: string
  customer_ip: string | null
  user_agent: string | null
  referrer_url: string | null
  commission_amount: number
  commission_rate: number
  order_total: number
  status: 'pending' | 'completed' | 'cancelled'
  paid_at: string | null
  created_at: string
  updated_at: string
}

export interface AffiliatePayout {
  id: string
  affiliate_id: string
  amount: number
  payment_method: string | null
  transaction_id: string | null
  bank_details: any
  status: 'pending' | 'processing' | 'completed' | 'failed'
  processed_at: string | null
  created_at: string
  updated_at: string
}

export interface AffiliateDashboard {
  id: string
  full_name: string | null
  affiliate_code: string | null
  affiliate_status: string
  commission_rate: number
  total_earnings: number
  pending_earnings: number
  is_affiliate: boolean
  affiliate_application_date: string
  approved_date: string | null
  total_clicks: number
  total_conversions: number
  active_links: number
  pending_referrals: number
  completed_referrals: number
  total_referrals: number
  total_payouts: number
  pending_payouts: number
}

// ======================================
// EMAIL FUNCTIONS
// ======================================

/**
 * Send affiliate application email
 */
export async function sendAffiliateApplicationEmail(userId: string) {
  try {
    // Get user details
    const { data: user } = await supabase.auth.admin.getUserById(userId)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!user.user?.email || !profile) {
      throw new Error("User information not found")
    }

    const template = generateAffiliateApplicationEmail({
      affiliate_name: profile.full_name || user.user.email,
      affiliate_email: user.user.email,
      application_date: new Date().toLocaleDateString()
    })

    return await sendEmail(user.user.email, template)
  } catch (error) {
    console.error("Error sending application email:", error)
    return { success: false, error: "Failed to send application email" }
  }
}

/**
 * Send affiliate approval email
 */
export async function sendAffiliateApprovalEmail(userId: string, affiliateCode: string, commissionRate: number) {
  try {
    // Get user details
    const { data: user } = await supabase.auth.admin.getUserById(userId)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!user.user?.email || !profile) {
      throw new Error("User information not found")
    }

    const template = generateAffiliateApprovalEmail({
      affiliate_name: profile.full_name || user.user.email,
      affiliate_email: user.user.email,
      affiliate_code: affiliateCode,
      commission_rate: commissionRate,
      approval_date: new Date().toLocaleDateString(),
      dashboard_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/affiliate/dashboard`
    })

    return await sendEmail(user.user.email, template)
  } catch (error) {
    console.error("Error sending approval email:", error)
    return { success: false, error: "Failed to send approval email" }
  }
}

/**
 * Send affiliate rejection email
 */
export async function sendAffiliateRejectionEmail(userId: string, feedback?: string) {
  try {
    // Get user details
    const { data: user } = await supabase.auth.admin.getUserById(userId)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!user.user?.email || !profile) {
      throw new Error("User information not found")
    }

    const template = generateAffiliateRejectionEmail({
      affiliate_name: profile.full_name || user.user.email,
      affiliate_email: user.user.email,
      rejection_date: new Date().toLocaleDateString(),
      feedback
    })

    return await sendEmail(user.user.email, template)
  } catch (error) {
    console.error("Error sending rejection email:", error)
    return { success: false, error: "Failed to send rejection email" }
  }
}

// ======================================
// AFFILIATE APPLICATION FUNCTIONS
// ======================================

/**
 * Apply to become an affiliate
 */
export async function applyForAffiliate(
  userId: string,
  paymentMethod: string,
  bankDetails?: any
): Promise<AffiliateProfile> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        is_affiliate: true,
        affiliate_status: 'pending',
        payment_method: paymentMethod,
        bank_details: bankDetails || null,
        affiliate_application_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error applying for affiliate:', error)
      throw new Error(`Failed to apply for affiliate: ${error.message}`)
    }

    // Send application email
    try {
      await sendAffiliateApplicationEmail(userId)
    } catch (emailError) {
      console.warn('Failed to send application email:', emailError)
      // Don't throw error for email failure
    }

    return data as AffiliateProfile
  } catch (error) {
    console.error('Failed to apply for affiliate:', error)
    throw error
  }
}

/**
 * Check if user has affiliate application
 */
export async function checkAffiliateApplication(userId: string): Promise<AffiliateProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      console.error('Error checking affiliate application:', error)
      throw error
    }

    return data as AffiliateProfile
  } catch (error) {
    console.error('Failed to check affiliate application:', error)
    throw error
  }
}

// ======================================
// AFFILIATE APPROVAL FUNCTIONS
// ======================================

/**
 * Approve affiliate application (admin only)
 */
export async function approveAffiliate(userId: string): Promise<AffiliateProfile> {
  try {
    // Check if user is admin
    const { data: userData } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', userId)
      .single()

    if (!userData?.is_admin) {
      throw new Error('Access denied. Admin privileges required.')
    }

    // Get the affiliate application to approve
    const { data: affiliateData, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .eq('is_affiliate', true)
      .single()

    if (fetchError) {
      throw new Error('Affiliate application not found')
    }

    // Generate unique affiliate code
    const affiliateCode = await generateUniqueAffiliateCode()

    // Approve the affiliate
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        affiliate_status: 'approved',
        affiliate_code: affiliateCode,
        approved_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error approving affiliate:', error)
      throw new Error(`Failed to approve affiliate: ${error.message}`)
    }

    // Send approval email
    try {
      await sendAffiliateApprovalEmail(userId, affiliateCode, 5) // Default 5% commission
    } catch (emailError) {
      console.warn('Failed to send approval email:', emailError)
      // Don't throw error for email failure
    }

    return data as AffiliateProfile
  } catch (error) {
    console.error('Failed to approve affiliate:', error)
    throw error
  }
}

/**
 * Reject affiliate application (admin only)
 */
export async function rejectAffiliate(userId: string): Promise<AffiliateProfile> {
  try {
    // Check if user is admin
    const { data: userData } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', userId)
      .single()

    if (!userData?.is_admin) {
      throw new Error('Access denied. Admin privileges required.')
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        affiliate_status: 'rejected',
        is_affiliate: false,
        affiliate_code: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error rejecting affiliate:', error)
      throw new Error(`Failed to reject affiliate: ${error.message}`)
    }

    // Send rejection email
    try {
      await sendAffiliateRejectionEmail(userId)
    } catch (emailError) {
      console.warn('Failed to send rejection email:', emailError)
      // Don't throw error for email failure
    }

    return data as AffiliateProfile
  } catch (error) {
    console.error('Failed to reject affiliate:', error)
    throw error
  }
}

/**
 * Generate unique affiliate code
 */
async function generateUniqueAffiliateCode(): Promise<string> {
  try {
    const { data, error } = await supabase
      .rpc('generate_affiliate_code')

    if (error) {
      console.error('Error generating affiliate code:', error)
      throw error
    }

    return data as string
  } catch (error) {
    console.error('Failed to generate affiliate code:', error)
    throw error
  }
}

// ======================================
// AFFILIATE LINK FUNCTIONS
// ======================================

/**
 * Generate affiliate link for a product
 */
export async function generateAffiliateLink(
  affiliateId: string,
  productId: string,
  customUrl?: string
): Promise<AffiliateLink> {
  try {
    // Get affiliate profile to verify approval
    const { data: affiliateData, error: affiliateError } = await supabase
      .from('user_profiles')
      .select('affiliate_status, affiliate_code')
      .eq('id', affiliateId)
      .single()

    if (affiliateError || affiliateData?.affiliate_status !== 'approved') {
      throw new Error('Affiliate not approved or does not exist')
    }

    if (!affiliateData?.affiliate_code) {
      throw new Error('Affiliate code not found')
    }

    // Generate unique link code
    const linkCode = await generateUniqueLinkCode()

    // Get product details for URL
    const { data: productData } = await supabase
      .from('products')
      .select('name, slug')
      .eq('id', productId)
      .single()

    if (!productData) {
      throw new Error('Product not found')
    }

    // Construct the affiliate URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rusbadigital.com'
    const productSlug = productData.slug || productId
    const affiliateUrl = `${baseUrl}/store/product/${productSlug}?ref=${affiliateData.affiliate_code}&product=${productId}`

    const { data, error } = await supabase
      .from('affiliate_links')
      .insert({
        affiliate_id: affiliateId,
        product_id: productId,
        link_code: linkCode,
        original_url: affiliateUrl
      })
      .select()
      .single()

    if (error) {
      console.error('Error generating affiliate link:', error)
      throw new Error(`Failed to generate affiliate link: ${error.message}`)
    }

    return data as AffiliateLink
  } catch (error) {
    console.error('Failed to generate affiliate link:', error)
    throw error
  }
}

/**
 * Generate unique link code
 */
async function generateUniqueLinkCode(): Promise<string> {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  
  // Check if code already exists
  const { data: existing } = await supabase
    .from('affiliate_links')
    .select('id')
    .eq('link_code', result)
    .single()
  
  if (existing) {
    return generateUniqueLinkCode() // Recursively generate new code
  }
  
  return result
}

/**
 * Get all affiliate links for an affiliate
 */
export async function getAffiliateLinks(affiliateId: string): Promise<AffiliateLink[]> {
  try {
    const { data, error } = await supabase
      .from('affiliate_links')
      .select(`
        *,
        products (
          id,
          name,
          price,
          category,
          image_url
        )
      `)
      .eq('affiliate_id', affiliateId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching affiliate links:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch affiliate links:', error)
    throw error
  }
}

/**
 * Toggle affiliate link active status
 */
export async function toggleAffiliateLink(linkId: string, affiliateId: string): Promise<AffiliateLink> {
  try {
    const { data, error } = await supabase
      .from('affiliate_links')
      .update({
        is_active: true, // Will be toggled by RLS policy
        updated_at: new Date().toISOString()
      })
      .eq('id', linkId)
      .eq('affiliate_id', affiliateId)
      .select()
      .single()

    if (error) {
      console.error('Error toggling affiliate link:', error)
      throw error
    }

    return data as AffiliateLink
  } catch (error) {
    console.error('Failed to toggle affiliate link:', error)
    throw error
  }
}

// ======================================
// CLICK TRACKING FUNCTIONS
// ======================================

/**
 * Track affiliate link click
 */
export async function trackAffiliateClick(linkCode: string, ipAddress?: string, userAgent?: string, referrer?: string): Promise<boolean> {
  try {
    // First get the current clicks count
    const { data: currentLink, error: fetchError } = await supabase
      .from('affiliate_links')
      .select('clicks')
      .eq('link_code', linkCode)
      .eq('is_active', true)
      .single()

    if (fetchError) {
      console.error('Error fetching current clicks:', fetchError)
      return false
    }

    const { data, error } = await supabase
      .from('affiliate_links')
      .update({
        clicks: (currentLink.clicks || 0) + 1
      })
      .eq('link_code', linkCode)
      .eq('is_active', true)
      .select('id')
      .single()

    if (error) {
      console.error('Error tracking affiliate click:', error)
      return false
    }

    // Store click details for analytics
    if (data) {
      await supabase
        .from('affiliate_referrals')
        .insert({
          link_code: linkCode,
          customer_ip: ipAddress || null,
          user_agent: userAgent || null,
          referrer_url: referrer || null,
          commission_amount: 0, // Will be calculated on conversion
          commission_rate: 0, // Will be set on conversion
          order_total: 0 // Will be set on conversion
        })
        .select()
        .single()
    }

    return true
  } catch (error) {
    console.error('Failed to track affiliate click:', error)
    return false
  }
}

// ======================================
// REFERRAL FUNCTIONS
// ======================================

/**
 * Process affiliate referral after successful order
 */
export async function processAffiliateReferral(
  orderId: string,
  affiliateCode: string,
  orderTotal: number,
  ipAddress?: string,
  userAgent?: string
): Promise<AffiliateReferral> {
  try {
    // Get affiliate details
    const { data: affiliateData, error: affiliateError } = await supabase
      .from('user_profiles')
      .select('id, commission_rate')
      .eq('affiliate_code', affiliateCode)
      .eq('affiliate_status', 'approved')
      .single()

    if (affiliateError || !affiliateData) {
      throw new Error('Invalid affiliate code or affiliate not approved')
    }

    // Calculate commission
    const commissionAmount = Math.floor(orderTotal * (affiliateData.commission_rate / 100))

    // Create referral record
    const { data, error } = await supabase
      .from('affiliate_referrals')
      .insert({
        affiliate_id: affiliateData.id,
        order_id: orderId,
        link_code: affiliateCode,
        customer_ip: ipAddress || null,
        user_agent: userAgent || null,
        commission_amount: commissionAmount,
        commission_rate: affiliateData.commission_rate,
        order_total: orderTotal,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Error processing affiliate referral:', error)
      throw error
    }

    // Update order with affiliate information
    await supabase
      .from('orders')
      .update({
        affiliate_id: affiliateData.id,
        referral_code: affiliateCode
      })
      .eq('id', orderId)

    return data as AffiliateReferral
  } catch (error) {
    console.error('Failed to process affiliate referral:', error)
    throw error
  }
}

/**
 * Get affiliate referrals for an affiliate
 */
export async function getAffiliateReferrals(affiliateId: string, status?: string): Promise<AffiliateReferral[]> {
  try {
    let query = supabase
      .from('affiliate_referrals')
      .select(`
        *,
        orders (
          id,
          total_amount,
          status,
          created_at,
          user_id
        )
      `)
      .eq('affiliate_id', affiliateId)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching affiliate referrals:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch affiliate referrals:', error)
    throw error
  }
}

// ======================================
// DASHBOARD FUNCTIONS
// ======================================

/**
 * Get affiliate dashboard data
 */
export async function getAffiliateDashboard(affiliateId: string): Promise<AffiliateDashboard | null> {
  try {
    const { data, error } = await supabase
      .from('affiliate_dashboard')
      .select('*')
      .eq('id', affiliateId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      console.error('Error fetching affiliate dashboard:', error)
      throw error
    }

    return data as AffiliateDashboard
  } catch (error) {
    console.error('Failed to fetch affiliate dashboard:', error)
    throw error
  }
}

// ======================================
// PAYOUT FUNCTIONS
// ======================================

/**
 * Request payout
 */
export async function requestPayout(affiliateId: string, amount: number): Promise<AffiliatePayout> {
  try {
    // Verify minimum payout
    const { data: settingsData } = await supabase
      .from('affiliate_settings')
      .select('setting_value')
      .eq('setting_key', 'minimum_payout')
      .single()

    const minimumPayout = parseInt(settingsData?.setting_value || '1000000') // Default ₦10,000

    if (amount < minimumPayout) {
      throw new Error(`Minimum payout amount is ₦${(minimumPayout / 100).toLocaleString()}`)
    }

    // Check available earnings
    const { data: affiliateData } = await supabase
      .from('user_profiles')
      .select('pending_earnings')
      .eq('id', affiliateId)
      .single()

    if (!affiliateData || affiliateData.pending_earnings < amount) {
      throw new Error('Insufficient pending earnings')
    }

    // Create payout request
    const { data, error } = await supabase
      .from('affiliate_payouts')
      .insert({
        affiliate_id: affiliateId,
        amount: amount,
        payment_method: 'bank_transfer',
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Error requesting payout:', error)
      throw error
    }

    return data as AffiliatePayout
  } catch (error) {
    console.error('Failed to request payout:', error)
    throw error
  }
}

/**
 * Get payout history for an affiliate
 */
export async function getAffiliatePayouts(affiliateId: string): Promise<AffiliatePayout[]> {
  try {
    const { data, error } = await supabase
      .from('affiliate_payouts')
      .select('*')
      .eq('affiliate_id', affiliateId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching affiliate payouts:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch affiliate payouts:', error)
    throw error
  }
}

// ======================================
// UTILITY FUNCTIONS
// ======================================

/**
 * Check if user is approved affiliate
 */
export async function isApprovedAffiliate(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('affiliate_status')
      .eq('id', userId)
      .single()

    if (error || !data) {
      return false
    }

    return data.affiliate_status === 'approved'
  } catch (error) {
    console.error('Error checking affiliate status:', error)
    return false
  }
}

/**
 * Get affiliate settings
 */
export async function getAffiliateSettings(): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase
      .from('affiliate_settings')
      .select('setting_key, setting_value')

    if (error) {
      console.error('Error fetching affiliate settings:', error)
      throw error
    }

    const settings: Record<string, string> = {}
    data?.forEach(setting => {
      settings[setting.setting_key] = setting.setting_value
    })

    return settings
  } catch (error) {
    console.error('Failed to fetch affiliate settings:', error)
    throw error
  }
}

/**
 * Parse affiliate code from URL or cookie
 */
export function parseAffiliateCode(url: URL): string | null {
  return url.searchParams.get('ref')
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number): string {
  return `₦${(amount / 100).toLocaleString()}`
}

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(clicks: number, conversions: number): number {
  if (clicks === 0) return 0
  return Math.round((conversions / clicks) * 100 * 100) / 100
}