# Affiliate System Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Rusba Digital Solutions affiliate system to production.

## Pre-Deployment Checklist

### Environment Variables
Ensure these environment variables are configured in your production environment:

```bash
# Core Application
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secure-nextauth-secret
NEXTAUTH_URL=https://yourdomain.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key

# Payment Processing (Paystack)
PAYSTACK_PUBLIC_KEY=your-paystack-public-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key

# Affiliate System Configuration
AFFILIATE_COMMISSION_RATE=5
AFFILIATE_MINIMUM_PAYOUT=1000000
```

### Database Setup

#### 1. Run Affiliate Schema Migration
Execute the affiliate schema SQL file in your Supabase project:

```sql
-- Copy and run the content of supabase-affiliate-schema.sql
-- This includes all tables, policies, and functions
```

#### 2. Verify Tables Created
```sql
-- Check all affiliate tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%affiliate%';
```

#### 3. Configure RLS Policies
Ensure all RLS policies are active and test permissions:
```sql
-- Test affiliate access
SELECT * FROM affiliate_dashboard WHERE id = 'test-user-id';

-- Test admin access
SELECT * FROM user_profiles WHERE is_admin = true;
```

### Application Configuration

#### 1. Email Service Setup
**Resend Configuration:**
1. Sign up for Resend account
2. Verify your domain
3. Get API key
4. Test email sending with sample template

#### 2. Domain Configuration
**Next.js Configuration:**
```typescript
// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-storage-url'],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
}

module.exports = nextConfig
```

#### 3. Authentication Setup
**Supabase Auth Configuration:**
1. Configure site URL in Supabase dashboard
2. Set up OAuth providers (if needed)
3. Configure email templates

## Deployment Process

### 1. Database Deployment

#### Supabase Project Setup
1. Create production Supabase project
2. Import affiliate schema
3. Configure RLS policies
4. Set up database triggers
5. Create admin user

```sql
-- Create production admin user
INSERT INTO user_profiles (id, email, full_name, is_admin) 
VALUES (
  gen_random_uuid(),
  'admin@yourcompany.com',
  'Production Admin',
  true
);
```

#### Data Migration (if needed)
```bash
# If migrating from development to production
# Export data from development
pg_dump development_db > affiliate_data.sql

# Import to production
psql production_db < affiliate_data.sql
```

### 2. Application Deployment

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Configure environment variables in Vercel dashboard
```

#### Manual Deployment
```bash
# Build production version
npm run build

# Start production server
npm start

# Or use PM2 for process management
pm2 start ecosystem.config.js
```

### 3. Domain and SSL Configuration

#### Domain Setup
1. Point domain DNS to hosting provider
2. Configure SSL certificate (automatic with Vercel)
3. Set up subdomain redirects (www → root)

#### CDN Configuration (if using)
```javascript
// next.config.js with CDN
module.exports = {
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.yourdomain.com' : '',
  // ... other config
}
```

## Post-Deployment Testing

### 1. Basic Functionality Tests
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Affiliate application form accessible
- [ ] Admin dashboard accessible

### 2. Affiliate System Tests
- [ ] New affiliate application submission
- [ ] Email notifications sent
- [ ] Admin approval process
- [ ] Affiliate dashboard loads
- [ ] Link generation works
- [ ] Click tracking functional
- [ ] Purchase attribution working

### 3. Integration Tests
- [ ] Store integration functional
- [ ] Payment processing working
- [ ] Email delivery confirmed
- [ ] Database connections stable

## Monitoring and Maintenance

### Application Monitoring
**Recommended Tools:**
- Vercel Analytics
- Supabase Dashboard
- Resend Analytics
- Error tracking (Sentry)

### Database Monitoring
```sql
-- Monitor affiliate performance
SELECT 
  affiliate_status,
  COUNT(*) as count,
  AVG(total_earnings) as avg_earnings
FROM user_profiles 
WHERE is_affiliate = true
GROUP BY affiliate_status;

-- Monitor link performance
SELECT 
  al.link_code,
  al.clicks,
  al.conversions,
  ar.commission_amount
FROM affiliate_links al
LEFT JOIN affiliate_referrals ar ON al.link_code = ar.link_code
WHERE al.created_at > NOW() - INTERVAL '7 days';
```

### Email Monitoring
- Track delivery rates
- Monitor bounce rates
- Review unsubscribe rates
- Check spam score

## Backup and Recovery

### Database Backups
```bash
# Automated Supabase backups
# Configure in Supabase dashboard
# Schedule: Daily backups with 30-day retention

# Manual backup command
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

### Configuration Backups
```bash
# Backup environment variables (excluding secrets)
vercel env ls
# Save environment variable list for disaster recovery
```

## Security Considerations

### Environment Security
1. Use strong passwords for all accounts
2. Enable 2FA on admin accounts
3. Rotate API keys regularly
4. Monitor access logs

### Database Security
1. RLS policies active and tested
2. Service role key protected
3. Regular security updates
4. Audit log monitoring

### Application Security
1. HTTPS enforced
2. Content Security Policy configured
3. Input validation active
4. SQL injection prevention verified

## Performance Optimization

### Database Optimization
```sql
-- Add indexes for performance
CREATE INDEX CONCURRENTLY idx_affiliate_links_affiliate_id ON affiliate_links(affiliate_id);
CREATE INDEX CONCURRENTLY idx_affiliate_referrals_affiliate_id ON affiliate_referrals(affiliate_id);
CREATE INDEX CONCURRENTLY idx_user_profiles_affiliate_status ON user_profiles(affiliate_status);
```

### Application Optimization
1. Enable Next.js image optimization
2. Configure proper caching headers
3. Use CDN for static assets
4. Optimize bundle size

### Monitoring Performance
```javascript
// Add performance monitoring
export function reportWebVitals(metric) {
  // Send to analytics service
  if (typeof window !== 'undefined') {
    window.gtag && window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
}
```

## Troubleshooting Common Issues

### Database Connection Issues
```bash
# Check connection status
curl -I https://your-project.supabase.co/rest/v1/

# Test database connectivity
psql "postgresql://user:password@db.host:port/database"
```

### Email Delivery Issues
```bash
# Test email sending
curl -X POST "https://api.resend.com/emails" \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from":"test@yourdomain.com","to":"test@example.com","subject":"Test","text":"Hello"}'
```

### Application Errors
```bash
# Check application logs
vercel logs --follow

# Debug mode (development)
npm run dev
```

## Support and Maintenance

### Regular Maintenance Tasks
1. **Weekly:**
   - Review affiliate performance metrics
   - Check email delivery rates
   - Monitor error rates

2. **Monthly:**
   - Review and update commission rates
   - Analyze top-performing affiliates
   - Update marketing materials

3. **Quarterly:**
   - Review and optimize database queries
   - Security audit and updates
   - Performance optimization review

### Support Documentation
- Create affiliate onboarding guide
- Document common affiliate questions
- Maintain admin operation manual
- Keep contact information updated

## Success Metrics

### KPIs to Track
1. **Affiliate Acquisition:**
   - New affiliate applications per month
   - Application approval rate
   - Time from application to approval

2. **Affiliate Performance:**
   - Average clicks per affiliate link
   - Conversion rate
   - Average commission per affiliate

3. **Revenue Impact:**
   - Total affiliate-driven revenue
   - Commission percentage of revenue
   - Affiliate ROI

### Reporting Schedule
- **Daily:** Monitor new applications and approvals
- **Weekly:** Performance review and top performers
- **Monthly:** Comprehensive affiliate report
- **Quarterly:** Business impact analysis

## Legal and Compliance

### Terms and Conditions
- Ensure affiliate terms are legally compliant
- Include clear commission structure
- Define dispute resolution process
- Review data privacy policies

### Tax Considerations
- 1099 forms for US affiliates (if applicable)
- VAT compliance for EU affiliates
- Local tax regulations compliance
- Record keeping requirements

This deployment guide ensures a smooth transition from development to production with proper monitoring, security, and maintenance procedures in place.