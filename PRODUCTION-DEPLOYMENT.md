# Production Deployment Guide for Bestemail

## 🎯 Pre-Deployment Checklist

### 1. Domain Setup
- [ ] Domain `bestemail.in` pointed to Vercel
- [ ] SSL certificate auto-configured by Vercel
- [ ] Subdomain `my.bestemail.in` pointed to Sendy server
- [ ] Email DNS records configured (SPF, DKIM, DMARC)

### 2. Database Setup (Supabase)
```bash
# Run all migrations in order
npm run db:migrate
```

Migrations included:
- `001_initial_schema.sql` - Core tables
- `002_white_label.sql` - White label support
- `003_settings_table.sql` - User settings
- `004_users_table.sql` - Users and sessions

### 3. Sendy Configuration
1. Ensure Sendy is installed at `https://my.bestemail.in`
2. Create API key in Sendy settings
3. Create default list for new users
4. Configure Amazon SES in Sendy

### 4. Environment Variables
```env
# Production values for Vercel
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

USE_SENDY=true
NEXT_PUBLIC_USE_SENDY=true
SENDY_API_URL=https://my.bestemail.in
SENDY_API_KEY=your-sendy-api-key
SENDY_LIST_ID=default-list-id

ENCRYPTION_KEY=generate-32-char-random-string

# Optional: Override in production
NEXTAUTH_URL=https://bestemail.in
NEXTAUTH_SECRET=generate-random-secret
```

### 5. Build Verification
```bash
# Test build locally
npm run build

# Check for any errors
npm run build 2>&1 | grep -i error
```

## 🚀 Vercel Deployment Steps

### Step 1: GitHub Repository
```bash
# Initialize git if not already
git init

# Add all files
git add .

# Commit
git commit -m "Production-ready Bestemail platform"

# Add remote
git remote add origin https://github.com/yourusername/bestemail-platform.git

# Push
git push -u origin main
```

### Step 2: Vercel Setup
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Step 3: Environment Variables in Vercel
1. Go to Project Settings > Environment Variables
2. Add all variables from `.env.local`
3. Ensure "Production" environment is selected
4. Click "Save"

### Step 4: Domain Configuration
1. Go to Project Settings > Domains
2. Add `bestemail.in`
3. Add `www.bestemail.in` 
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning

### Step 5: Deploy
```bash
# Deploy via CLI
vercel --prod

# Or trigger via GitHub push
git push origin main
```

## 🔍 Post-Deployment Verification

### 1. Website Functionality
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Mobile responsive design works
- [ ] Forms submit properly
- [ ] Images load correctly

### 2. Authentication
- [ ] Login page works
- [ ] Admin login successful
- [ ] Session persistence works
- [ ] Logout functionality works

### 3. Dashboard
- [ ] Dashboard loads after login
- [ ] Sendy settings configurable
- [ ] SMS settings save properly
- [ ] All dashboard pages accessible

### 4. SEO & Performance
- [ ] Meta tags present
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt configured
- [ ] Page load speed < 3 seconds
- [ ] Core Web Vitals passing

### 5. Security
- [ ] HTTPS enforced
- [ ] Secure headers configured
- [ ] API keys encrypted in database
- [ ] Rate limiting active

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
- Verify Supabase URL and keys
- Check if migrations ran successfully
- Ensure RLS policies are correct

### Sendy Integration Issues
- Verify Sendy API endpoint accessibility
- Check API key validity
- Test with curl:
```bash
curl -X POST https://my.bestemail.in/api/subscribers/subscribe.php \
  -d "api_key=YOUR_KEY&email=test@example.com&list=LIST_ID"
```

### Email Deliverability
- Verify SPF record: `v=spf1 include:amazonses.com ~all`
- Check DKIM is enabled in SES
- Configure DMARC: `v=DMARC1; p=quarantine; rua=mailto:dmarc@bestemail.in`

## 📊 Monitoring Setup

### 1. Vercel Analytics
- Enable in Vercel dashboard
- Monitor real user metrics

### 2. Error Tracking (Optional)
```javascript
// Add to app/layout.tsx
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});
```

### 3. Uptime Monitoring
- Use Vercel's built-in monitoring
- Or setup external monitor (UptimeRobot, Pingdom)

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🎉 Launch Checklist

- [ ] All features tested
- [ ] Admin account working
- [ ] Email sending verified
- [ ] SMS integration tested
- [ ] Payment integration ready (if applicable)
- [ ] Support email configured
- [ ] Documentation complete
- [ ] Backup strategy in place
- [ ] Monitoring active
- [ ] Team trained on platform

## 🚀 You're Ready to Launch!

Once all checks pass, your Bestemail platform is ready for production use. The platform will automatically scale with Vercel's infrastructure.

For support: support@bestemail.in