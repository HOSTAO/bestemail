# Bestemail Platform - Deployment Guide

## Quick Start (Development)

1. **Clone and Install**
```bash
git clone [your-repo]
cd bestemail-platform
npm install
```

2. **Setup Supabase**
- Create a new Supabase project at https://supabase.com
- Run migrations:
```bash
npx supabase db push
```

3. **Configure Environment**
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

4. **Run Development Server**
```bash
npm run dev
# Open http://localhost:3000
```

## Production Deployment (Vercel)

### 1. Prepare Your Repository
- Push code to GitHub/GitLab/Bitbucket
- Ensure all migrations are in `supabase/migrations/`

### 2. Deploy to Vercel
1. Go to https://vercel.com/new
2. Import your repository
3. Configure environment variables (copy from .env.example)
4. Deploy!

### 3. Setup Custom Domain
1. In Vercel dashboard → Settings → Domains
2. Add `bestemail.in`
3. Add wildcard subdomain: `*.bestemail.in` (for white label)
4. Update DNS records:
   ```
   A     @        76.76.21.21
   A     www      76.76.21.21
   CNAME *        cname.vercel-dns.com
   ```

### 4. Configure Email Service

#### Option A: SendGrid (Recommended)
1. Sign up at https://sendgrid.com
2. Create API key
3. Verify sender domain
4. Add to environment variables

#### Option B: AWS SES
1. Verify domain in AWS SES
2. Move out of sandbox
3. Create IAM user with SES permissions
4. Add credentials to environment

### 5. Database Setup
1. In Supabase dashboard:
   - Enable Row Level Security (RLS)
   - Run all migrations
   - Create database functions

2. Set up scheduled jobs for:
   - Sending scheduled campaigns
   - Cleaning old analytics data
   - Updating engagement scores

## White Label Setup

### 1. Subdomain Configuration
For each white label client:

1. **Create Account**
```sql
INSERT INTO white_label_accounts (
  account_name,
  subdomain,
  branding_config,
  features_config
) VALUES (
  'Client Name',
  'client',
  '{"primaryColor": "#007bff", "logo": "/logos/client.png"}',
  '{"maxContacts": 5000, "maxEmailsPerMonth": 50000}'
);
```

2. **DNS Setup**
Client adds CNAME: `mail.theirdomain.com → client.bestemail.in`

### 2. Email Authentication
For each white label domain:

1. **SPF Record**
```
v=spf1 include:sendgrid.net ~all
```

2. **DKIM Records**
```
s1._domainkey.theirdomain.com → [SendGrid DKIM]
s2._domainkey.theirdomain.com → [SendGrid DKIM]
```

3. **DMARC Record**
```
v=DMARC1; p=none; rua=mailto:dmarc@bestemail.in
```

## Production Checklist

### Security
- [ ] Enable Supabase RLS policies
- [ ] Set strong JWT secrets
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set up WAF (Cloudflare)

### Performance
- [ ] Enable CDN for static assets
- [ ] Set up Redis for caching
- [ ] Configure image optimization
- [ ] Enable gzip compression
- [ ] Set up monitoring (Vercel Analytics)

### Email Deliverability
- [ ] Warm up sending IPs
- [ ] Set up feedback loops
- [ ] Configure bounce handling
- [ ] Implement double opt-in
- [ ] Monitor sender reputation

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up alerts for:
  - High bounce rates
  - Low open rates
  - API errors
  - Database issues

## Scaling Considerations

### Phase 1 (0-10K contacts)
- Single Vercel deployment
- Supabase free tier
- SendGrid free tier (100/day)

### Phase 2 (10K-100K contacts)
- Vercel Pro
- Supabase Pro
- SendGrid Basic ($15/mo)
- Redis for job queues

### Phase 3 (100K+ contacts)
- Multiple Vercel deployments
- Supabase Pro with read replicas
- SendGrid Pro or AWS SES
- Dedicated Redis cluster
- CDN for all assets

## Common Issues

### 1. Emails Going to Spam
- Check SPF/DKIM/DMARC records
- Warm up sending domain
- Monitor sender score
- Use dedicated IP (high volume)

### 2. Slow Dashboard
- Enable Supabase connection pooling
- Add database indexes
- Implement pagination
- Cache frequent queries

### 3. White Label SSL Issues
- Use Vercel automatic SSL
- Or implement Let's Encrypt
- Ensure wildcard certificate covers subdomains

## Support

- Documentation: `/docs`
- API Reference: `/api-docs`
- Status Page: `status.bestemail.in`
- Support: `support@bestemail.in`

## Next Steps

1. Set up billing (Razorpay/Stripe)
2. Implement SMS marketing
3. Add marketing automation workflows
4. Build mobile app
5. Create affiliate program