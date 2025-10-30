import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export interface AffiliateApplicationEmail {
  affiliate_name: string
  affiliate_email: string
  application_date: string
}

export interface AffiliateApprovalEmail {
  affiliate_name: string
  affiliate_email: string
  affiliate_code: string
  commission_rate: number
  approval_date: string
  dashboard_url: string
}

export interface AffiliateRejectionEmail {
  affiliate_name: string
  affiliate_email: string
  rejection_date: string
  feedback?: string
}

export interface AffiliatePayoutEmail {
  affiliate_name: string
  affiliate_email: string
  amount: number
  payout_date: string
  transaction_id: string
}

// Generate affiliate application confirmation email
export function generateAffiliateApplicationEmail(data: AffiliateApplicationEmail): EmailTemplate {
  const subject = "Affiliate Application Received - Rusba Digital Solutions"
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Affiliate Application Received</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .highlight { background: #dbeafe; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Affiliate Application Received</h1>
                <p>Thank you for joining our affiliate program!</p>
            </div>
            
            <div class="content">
                <h2>Hello ${data.affiliate_name},</h2>
                
                <p>Thank you for submitting your affiliate application to Rusba Digital Solutions. We have successfully received your application and it is currently under review.</p>
                
                <div class="highlight">
                    <strong>Application Details:</strong><br>
                    • Applied on: ${data.application_date}<br>
                    • Status: Under Review<br>
                    • Expected Review Time: 2-3 business days
                </div>
                
                <h3>What happens next?</h3>
                <ul>
                    <li>Our team will review your application within 2-3 business days</li>
                    <li>You will receive an email notification once your application is approved or if we need additional information</li>
                    <li>Upon approval, you will receive your unique affiliate code and dashboard access</li>
                    <li>You can start earning commissions immediately after approval</li>
                </ul>
                
                <p>If you have any questions during this process, please don't hesitate to contact our support team.</p>
                
                <div class="footer">
                    <p>Best regards,<br>
                    <strong>The Rusba Digital Solutions Team</strong></p>
                    <p>📧 support@rusbadigitalsolutions.com | 📞 +234 XXX XXX XXXX</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `

  const text = `
Affiliate Application Received - Rusba Digital Solutions

Hello ${data.affiliate_name},

Thank you for submitting your affiliate application to Rusba Digital Solutions. We have successfully received your application and it is currently under review.

Application Details:
- Applied on: ${data.application_date}
- Status: Under Review
- Expected Review Time: 2-3 business days

What happens next?
- Our team will review your application within 2-3 business days
- You will receive an email notification once your application is approved or if we need additional information
- Upon approval, you will receive your unique affiliate code and dashboard access
- You can start earning commissions immediately after approval

If you have any questions during this process, please don't hesitate to contact our support team.

Best regards,
The Rusba Digital Solutions Team
📧 support@rusbadigitalsolutions.com | 📞 +234 XXX XXX XXXX
  `

  return { subject, html, text }
}

// Generate affiliate approval email
export function generateAffiliateApprovalEmail(data: AffiliateApprovalEmail): EmailTemplate {
  const subject = "🎉 Affiliate Application Approved - Start Earning Commissions!"
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Affiliate Application Approved</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f0fdf4; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
            .code-box { background: #065f46; color: #ecfdf5; padding: 20px; border-radius: 8px; text-align: center; font-family: monospace; font-size: 24px; font-weight: bold; margin: 20px 0; }
            .feature-list { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Congratulations!</h1>
                <p>Your affiliate application has been approved!</p>
            </div>
            
            <div class="content">
                <h2>Hello ${data.affiliate_name},</h2>
                
                <p>We're thrilled to welcome you to the Rusba Digital Solutions affiliate program! Your application has been approved and you can now start earning commissions on every sale you generate.</p>
                
                <div class="code-box">
                    Your Affiliate Code:<br>
                    ${data.affiliate_code}
                </div>
                
                <div class="highlight">
                    <strong>Your Commission Rate: ${data.commission_rate}%</strong><br>
                    Approved on: ${data.approval_date}
                </div>
                
                <h3>🚀 Getting Started</h3>
                <div class="feature-list">
                    <ul>
                        <li><strong>Access Your Dashboard:</strong> Log in to track clicks, conversions, and earnings</li>
                        <li><strong>Create Affiliate Links:</strong> Generate unique links for any product</li>
                        <li><strong>Share & Earn:</strong> Share your links on social media, blogs, or email</li>
                        <li><strong>Track Performance:</strong> Monitor your success in real-time</li>
                        <li><strong>Get Paid:</strong> Receive monthly payouts via your preferred method</li>
                    </ul>
                </div>
                
                <div style="text-align: center;">
                    <a href="${data.dashboard_url}" class="button">Access Your Dashboard</a>
                </div>
                
                <h3>💡 Success Tips</h3>
                <ul>
                    <li>Share links on your social media platforms</li>
                    <li>Create engaging content around our products</li>
                    <li>Focus on products you genuinely recommend</li>
                    <li>Track your performance and optimize your strategy</li>
                </ul>
                
                <p>Welcome to the team! We're excited to see your success.</p>
                
                <div class="footer">
                    <p>Best regards,<br>
                    <strong>The Rusba Digital Solutions Team</strong></p>
                    <p>📧 support@rusbadigitalsolutions.com | 📞 +234 XXX XXX XXXX</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `

  const text = `
🎉 Affiliate Application Approved - Start Earning Commissions!

Hello ${data.affiliate_name},

We're thrilled to welcome you to the Rusba Digital Solutions affiliate program! Your application has been approved and you can now start earning commissions on every sale you generate.

Your Affiliate Code: ${data.affiliate_code}
Your Commission Rate: ${data.commission_rate}%
Approved on: ${data.approval_date}

🚀 Getting Started:
• Access Your Dashboard: Log in to track clicks, conversions, and earnings
• Create Affiliate Links: Generate unique links for any product
• Share & Earn: Share your links on social media, blogs, or email
• Track Performance: Monitor your success in real-time
• Get Paid: Receive monthly payouts via your preferred method

Visit your dashboard: ${data.dashboard_url}

💡 Success Tips:
• Share links on your social media platforms
• Create engaging content around our products
• Focus on products you genuinely recommend
• Track your performance and optimize your strategy

Welcome to the team! We're excited to see your success.

Best regards,
The Rusba Digital Solutions Team
📧 support@rusbadigitalsolutions.com | 📞 +234 XXX XXX XXXX
  `

  return { subject, html, text }
}

// Generate affiliate rejection email
export function generateAffiliateRejectionEmail(data: AffiliateRejectionEmail): EmailTemplate {
  const subject = "Affiliate Application Update - Rusba Digital Solutions"
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Affiliate Application Update</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fef2f2; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .feedback { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Application Update</h1>
                <p>Thank you for your interest in our affiliate program</p>
            </div>
            
            <div class="content">
                <h2>Hello ${data.affiliate_name},</h2>
                
                <p>Thank you for applying to become an affiliate with Rusba Digital Solutions. After careful review, we have decided not to approve your application at this time.</p>
                
                <p>Rejection Date: ${data.rejection_date}</p>
                
                ${data.feedback ? `
                <div class="feedback">
                    <h3>Feedback & Next Steps:</h3>
                    <p>${data.feedback}</p>
                </div>
                ` : ''}
                
                <h3>You can reapply in the future if:</h3>
                <ul>
                    <li>You have a stronger online presence or platform</li>
                    <li>You can demonstrate your marketing capabilities</li>
                    <li>Your content aligns better with our brand values</li>
                    <li>You can show potential for driving quality traffic</li>
                </ul>
                
                <p>We encourage you to reapply after addressing any areas of improvement. We're always looking for quality partners who can help us grow our community.</p>
                
                <p>If you have any questions about this decision or would like feedback on your application, please don't hesitate to contact our support team.</p>
                
                <div class="footer">
                    <p>Best regards,<br>
                    <strong>The Rusba Digital Solutions Team</strong></p>
                    <p>📧 support@rusbadigitalsolutions.com | 📞 +234 XXX XXX XXXX</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `

  const text = `
Affiliate Application Update - Rusba Digital Solutions

Hello ${data.affiliate_name},

Thank you for applying to become an affiliate with Rusba Digital Solutions. After careful review, we have decided not to approve your application at this time.

Rejection Date: ${data.rejection_date}

${data.feedback ? `Feedback & Next Steps: ${data.feedback}` : ''}

You can reapply in the future if:
• You have a stronger online presence or platform
• You can demonstrate your marketing capabilities
• Your content aligns better with our brand values
• You can show potential for driving quality traffic

We encourage you to reapply after addressing any areas of improvement. We're always looking for quality partners who can help us grow our community.

If you have any questions about this decision or would like feedback on your application, please don't hesitate to contact our support team.

Best regards,
The Rusba Digital Solutions Team
📧 support@rusbadigitalsolutions.com | 📞 +234 XXX XXX XXXX
  `

  return { subject, html, text }
}

// Send email function
export async function sendEmail(
  to: string,
  template: EmailTemplate,
  from: string = 'noreply@rusbadigitalsolutions.com'
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await resend.emails.send({
      from,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    if (result.error) {
      console.error('Resend error:', result.error)
      return { success: false, error: result.error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}

// Email templates for different affiliate events
export const EmailTemplates = {
  applicationReceived: generateAffiliateApplicationEmail,
  approval: generateAffiliateApprovalEmail,
  rejection: generateAffiliateRejectionEmail,
}