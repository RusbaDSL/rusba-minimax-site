# Affiliate System Testing Guide

## Overview
This guide provides comprehensive testing scenarios for the Rusba Digital Solutions affiliate system, ensuring all components work correctly together.

## Testing Prerequisites

### Environment Setup
1. Ensure Supabase database has affiliate tables and policies applied
2. Configure Resend API key for email testing (or use test mode)
3. Set up test users and admin accounts
4. Install dependencies: `npm install`

### Test Environment Variables
```bash
# Add to .env.local for testing
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=your_test_resend_key
```

## Test Scenarios

### 1. Affiliate Application Process

#### 1.1 New Affiliate Application
**Test User Journey:**
1. User creates account or logs in
2. Navigates to `/affiliate/signup`
3. Fills out affiliate application form
4. Submits application

**Expected Results:**
- Application submitted successfully
- Email confirmation sent (if Resend configured)
- User status changed to 'pending'
- No affiliate links available until approved

**Database Verification:**
```sql
-- Check user profile updated
SELECT id, full_name, email, is_affiliate, affiliate_status, affiliate_application_date
FROM user_profiles
WHERE is_affiliate = true;
```

#### 1.2 Duplicate Application Prevention
**Test:**
1. User applies for affiliate status
2. Attempts to apply again immediately
3. Attempts after status change

**Expected Results:**
- Second application blocked if already applied
- Proper error messages displayed

### 2. Admin Approval Process

#### 2.1 Affiliate Approval
**Test Admin Journey:**
1. Admin logs in with admin privileges
2. Navigates to `/admin/affiliates`
3. Views pending applications
4. Approves a pending affiliate

**Expected Results:**
- Affiliate status changes to 'approved'
- Unique affiliate code generated
- Approval email sent (if Resend configured)
- Affiliate dashboard becomes accessible

**Database Verification:**
```sql
-- Check affiliate approval
SELECT id, affiliate_code, affiliate_status, approved_date
FROM user_profiles
WHERE affiliate_status = 'approved';
```

#### 2.2 Affiliate Rejection
**Test:**
1. Admin rejects pending affiliate
2. Checks rejection email sent

**Expected Results:**
- Status changes to 'rejected'
- Email sent with feedback (if configured)

### 3. Affiliate Dashboard Testing

#### 3.1 Dashboard Access
**Test:**
1. Approved affiliate logs in
2. Navigates to `/affiliate/dashboard`

**Expected Results:**
- Dashboard loads with affiliate statistics
- No errors or missing data
- Responsive design works on mobile

**UI Elements to Verify:**
- Total earnings display
- Pending earnings display
- Click statistics
- Conversion rates
- Active links count
- Commission rate

#### 3.2 Dashboard Data Accuracy
**Test Data to Verify:**
```sql
-- Manual verification queries
SELECT COUNT(*) as total_links FROM affiliate_links WHERE affiliate_id = 'user_id';
SELECT SUM(clicks) as total_clicks FROM affiliate_links WHERE affiliate_id = 'user_id';
SELECT SUM(conversions) as total_conversions FROM affiliate_links WHERE affiliate_id = 'user_id';
SELECT total_earnings FROM affiliate_dashboard WHERE id = 'user_id';
```

### 4. Affiliate Link Generation

#### 4.1 Link Creation
**Test:**
1. Approved affiliate accesses `/affiliate/links`
2. Creates new affiliate link for a product
3. Views link details

**Expected Results:**
- Unique link code generated
- Affiliate URL created correctly
- Link appears in affiliate dashboard
- Copy-to-clipboard functionality works

**Database Verification:**
```sql
-- Check link creation
SELECT link_code, original_url, clicks, conversions, is_active
FROM affiliate_links
WHERE affiliate_id = 'user_id';
```

#### 4.2 Link URL Format
**Expected URL Structure:**
```
http://localhost:3000/store/product/product-id?ref=AFFILIATE_CODE&product=product-id
```

**Verify URL Components:**
- Base URL from environment
- Product identifier
- Affiliate code parameter
- Product parameter

### 5. Click Tracking System

#### 5.1 Link Click Tracking
**Test Process:**
1. Generate affiliate link
2. Copy link URL
3. Open in incognito browser (simulating external visitor)
4. Click through to product page

**Expected Results:**
- Click count increases in database
- Referrer information captured
- No errors in click tracking

**Database Verification:**
```sql
-- Check click tracking
SELECT link_code, clicks, conversions
FROM affiliate_links
WHERE link_code = 'link_code';

-- Check referral record
SELECT link_code, customer_ip, user_agent, referrer_url
FROM affiliate_referrals
WHERE link_code = 'link_code';
```

#### 5.2 Multiple Click Scenarios
**Test:**
1. Click same link multiple times
2. Click different links from same affiliate
3. Click links from different affiliates

**Expected Results:**
- Click counts accurate for each link
- No cross-contamination between links
- IP and user agent captured correctly

### 6. Purchase Integration Testing

#### 6.1 Order Completion with Affiliate
**Test Process:**
1. Use affiliate link to reach product page
2. Add product to cart
3. Complete purchase process
4. Check if affiliate receives credit

**Expected Results:**
- Affiliate referral created
- Commission calculated correctly
- Order linked to affiliate code
- Affiliate dashboard updates

**Database Verification:**
```sql
-- Check referral creation
SELECT affiliate_id, commission_amount, commission_rate, status
FROM affiliate_referrals
WHERE order_id = 'order_id';

-- Check order affiliate link
SELECT affiliate_id, referral_code
FROM orders
WHERE id = 'order_id';
```

#### 6.2 Conversion Rate Calculation
**Test:**
1. Generate multiple clicks (track manually)
2. Complete purchases (1-2 conversions)
3. Verify conversion rate calculation

**Expected Conversion Rates:**
- 0% if no clicks
- 50% if 2 clicks, 1 conversion
- 33.33% if 3 clicks, 1 conversion

### 7. Payout System Testing

#### 7.1 Payout Request
**Test:**
1. Affiliate has pending earnings
2. Requests payout
3. Admin processes payout

**Expected Results:**
- Payout request created
- Pending earnings reduce
- Status updates correctly

### 8. Email System Testing

#### 8.1 Email Template Testing
**Test Email Scenarios:**
1. Affiliate application received
2. Affiliate approved
3. Affiliate rejected
4. Payout notifications

**Verify Email Content:**
- Correct affiliate information
- Proper formatting
- Links functional
- Responsive design

**Email Testing Commands:**
```bash
# Test email sending (manual)
curl -X POST http://localhost:3000/api/affiliate/apply \
  -H "Content-Type: application/json" \
  -d '{"payment_method": "bank_transfer", "bank_details": {}}'
```

### 9. Security Testing

#### 9.1 Access Control
**Test Scenarios:**
1. Non-affiliate trying to access affiliate dashboard
2. Affiliate trying to access admin functions
3. SQL injection attempts
4. XSS prevention

**Expected Results:**
- Proper access denied messages
- No unauthorized data access
- Input sanitization working

#### 9.2 Data Validation
**Test:**
1. Invalid affiliate codes in URLs
2. Expired links
3. Deleted affiliate accounts

**Expected Results:**
- Graceful handling of invalid data
- No application crashes
- Appropriate error messages

### 10. Mobile Responsiveness Testing

**Test Devices:**
- iPhone/Android phones
- Tablets
- Desktop browsers
- Different screen resolutions

**Test Features:**
- Dashboard navigation
- Link generation
- Form submissions
- Email readability

## Test Data Setup

### Sample Test Users
```sql
-- Create test affiliate users
INSERT INTO user_profiles (id, email, full_name, is_admin) VALUES
('test-affiliate-1', 'affiliate1@test.com', 'Test Affiliate 1', false),
('test-affiliate-2', 'affiliate2@test.com', 'Test Affiliate 2', false),
('test-admin', 'admin@test.com', 'Test Admin', true);
```

### Sample Products
```sql
-- Ensure these products exist for testing
SELECT id, name FROM products LIMIT 3;
```

## Automated Testing Commands

### 1. Test Application Process
```bash
# Test affiliate application
curl -X POST http://localhost:3000/api/affiliate/apply \
  -H "Authorization: Bearer [user_token]" \
  -H "Content-Type: application/json" \
  -d '{"payment_method": "bank_transfer"}'
```

### 2. Test Link Generation
```bash
# Test link creation
curl -X POST http://localhost:3000/api/affiliate/links \
  -H "Authorization: Bearer [affiliate_token]" \
  -H "Content-Type: application/json" \
  -d '{"product_id": "product-id"}'
```

### 3. Test Click Tracking
```bash
# Test click tracking
curl -X POST http://localhost:3000/api/affiliate/track \
  -H "Content-Type: application/json" \
  -d '{"link_code": "test-link-code"}'
```

## Performance Testing

### Load Testing
- Multiple concurrent affiliate applications
- High click volumes on popular links
- Admin approval processes under load

### Database Performance
- Query optimization for affiliate dashboard
- Index usage verification
- Slow query identification

## Error Handling Testing

### Network Errors
- Email service failures
- Database connection issues
- API timeouts

### User Error Scenarios
- Invalid form submissions
- Missing required fields
- Corrupted session data

## Monitoring and Logging

### Database Monitoring
- Check for orphaned referrals
- Verify data consistency
- Monitor performance metrics

### Application Logs
- Affiliate application events
- Email sending status
- Click tracking accuracy
- Purchase attribution

## Success Criteria

### Functional Requirements
- [ ] Affiliate applications work end-to-end
- [ ] Admin approval/rejection process functional
- [ ] Link generation and tracking working
- [ ] Purchase attribution accurate
- [ ] Email notifications sent
- [ ] Dashboard displays correct data
- [ ] Payout system operational

### Performance Requirements
- [ ] Page load times under 2 seconds
- [ ] Database queries optimized
- [ ] Mobile responsive design
- [ ] Error handling graceful

### Security Requirements
- [ ] Access control enforced
- [ ] Input validation working
- [ ] No sensitive data exposure
- [ ] SQL injection prevention

## Common Issues and Solutions

### Database Issues
1. **Missing tables**: Run affiliate schema migration
2. **RLS policy errors**: Check user permissions
3. **Foreign key constraints**: Verify table relationships

### Email Issues
1. **Resend API errors**: Check API key configuration
2. **Template rendering**: Verify email template syntax
3. **Delivery failures**: Check spam folders

### Integration Issues
1. **Store integration**: Verify order completion triggers
2. **Click tracking**: Check URL parameter parsing
3. **Dashboard data**: Verify view queries

## Testing Checklist

### Pre-Deployment
- [ ] All test scenarios pass
- [ ] Database schema applied
- [ ] Environment variables configured
- [ ] Email templates tested
- [ ] Security measures verified
- [ ] Performance benchmarks met
- [ ] Mobile responsiveness confirmed

### Post-Deployment
- [ ] Production affiliate application
- [ ] Real email delivery verified
- [ ] Payment processing integration
- [ ] Analytics tracking active
- [ ] Error monitoring enabled
- [ ] Support documentation available

This testing guide ensures comprehensive coverage of all affiliate system functionality and integration points.