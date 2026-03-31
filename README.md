# Bestemail Platform - Phase 1 Build

A practical early build of Bestemail focused on campaigns, contacts, settings, and Sendy-based sending. Treat this repo as a launch candidate for the core workflow only — not a claim that every visible module is production-complete.

## Start Here

If you want the shortest path to launch, use these two files first:

1. `PRODUCTION-ENV-CHECKLIST.md`
2. `LAUNCH-ORDER.md`

The founder-friendly version is simple: **finish settings, import contacts, send one real test, then launch.**

## 🚀 Features

- ✅ **Core website and dashboard shell** - Main marketing pages and dashboard routes exist
- ✅ **Campaign creation basics** - Create campaigns and route sends through Sendy
- ✅ **Contacts and settings basics** - Contact import/list flows and provider settings are present
- ⚠️ **SMS** - Early integration work exists, but should be treated as beta until fully verified
- ⚠️ **Automation, forms, A/B testing, integrations, team** - Present in UI but not production-complete yet
- ✅ **Authentication** - Login and signup flows exist
- ✅ **Responsive UI** - Layouts work across screen sizes

## 📄 Pages Implemented

### Public Pages
- **Homepage** (`/`) - Hero, features, testimonials, CTA
- **Features** (`/features`) - Interactive feature showcase
- **Pricing** (`/pricing`) - Pricing plans with billing toggle
- **Solutions** (`/solutions`) - Industry-specific solutions
- **Integrations** (`/integrations`) - 100+ integrations showcase
- **Security** (`/security`) - Security features and certifications
- **Customers** (`/customers`) - Case studies and success stories
- **Blog** (`/blog`) - SEO-optimized blog with categories
- **About** (`/about`) - Company story, team, and timeline
- **Contact** (`/contact`) - Contact form and office locations
- **Documentation** (`/docs`) - Comprehensive user guides
- **Privacy Policy** (`/privacy`) - GDPR-compliant privacy policy
- **Terms of Service** (`/terms`) - Legal terms and conditions

### Authentication Pages
- **Login** (`/login`) - Secure login with admin credentials
- **Signup** (`/signup`) - User registration with validation

### Dashboard Pages
- **Dashboard** (`/dashboard`) - Main dashboard overview
- **Campaigns** (`/dashboard`) - Basic campaign listing from the main dashboard
- **New Campaign** (`/dashboard/campaigns/new`) - Create and send/schedule a campaign
- **Contacts** (`/dashboard`) - Basic contact list view from the main dashboard
- **Forms** (`/dashboard/forms`) - Available MVP flow, but still needs real smoke testing
- **Settings** (`/dashboard/settings`) - Main delivery/configuration control area
- **SMS Marketing** (`/dashboard/sms`) - Secondary/beta SMS composer work
- **Automation** (`/dashboard/automation`) - Planned/beta workflow UI
- **A/B Testing** (`/dashboard/ab-testing`) - Planned/beta testing UI
- **Integrations** (`/dashboard/integrations`) - Planned integration catalog UI
- **Team** (`/dashboard/team`) - Planned multi-user UI

## 🔐 Security Features

- ✅ Session-based authentication
- ✅ Password hashing (bcrypt)
- ✅ CSRF protection
- ✅ API key encryption (AES-256)
- ✅ Rate limiting on login attempts
- ✅ Secure HTTP headers
- ✅ Input validation and sanitization

## 🚀 Deployment Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase)
- Sendy installation at `my.bestemail.in`
- Instasent API token

### Environment Variables

Create `.env.local` with:

```env
# Core app
NEXT_PUBLIC_APP_URL=https://bestemail.in
NEXTAUTH_URL=https://bestemail.in
SESSION_SECRET=your_strong_random_session_secret
NEXTAUTH_SECRET=optional_if_you_still_need_it
ENCRYPTION_KEY=your_32_character_encryption_key

# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ALLOW_LOCAL_DATA_FALLBACK=false

# Sendy configuration
USE_SENDY=true
NEXT_PUBLIC_USE_SENDY=true
SENDY_API_URL=https://my.bestemail.in
NEXT_PUBLIC_SENDY_API_URL=https://my.bestemail.in
SENDY_API_KEY=your_sendy_api_key
SENDY_LIST_ID=your_default_list_id
DEFAULT_FROM_EMAIL=hello@bestemail.in
DEFAULT_FROM_NAME=Bestemail

# Admin credentials
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=generate_a_strong_unique_password

# Instasent SMS
INSTASENT_API_TOKEN=your_instasent_token
```

### Installation

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Build for production
npm run build

# Start production server
npm start
```

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
# Or deploy directly
vercel --prod
```

## 🔑 Admin Access

- **URL**: `https://bestemail.in/login`
- Create your initial admin user from your own configured credentials or seeded setup.
- Never commit real passwords or operational login credentials into repository docs.

## 🛠️ Configuration

### Sendy Setup
1. Login to dashboard
2. Go to Settings
3. Enter your Sendy API credentials
4. Test connection
5. Save settings

### SMS Setup (Instasent)
1. Go to Settings > SMS
2. Enter Instasent API token
3. Configure sender ID
4. Test SMS sending
5. Save configuration

## 📧 Email Sending

The platform uses Sendy.co for all email delivery:
- Transactional emails
- Marketing campaigns
- Automated workflows
- Welcome emails

Cost: $0.10 per 1,000 emails (via Amazon SES)

## 📱 SMS Marketing

SMS features via Instasent:
- Bulk SMS campaigns
- SMS templates
- Character counting
- Cost calculation
- Delivery reports

Cost: ₹0.30 per SMS segment

## 🔗 API Integration

For developers:
- RESTful API available
- API documentation at `/docs/api-overview`
- Webhook support
- Rate limiting: 100 requests/minute

## 🏢 Company Information

**Hostao L.L.C.**
- Registration: Delaware, USA (#5671234)
- Headquarters: San Francisco, CA
- Support: +91 747 0111 222
- Email: support@bestemail.in

## ✅ Production Checklist

Use this as an honest pre-launch checklist, not as a claim that everything below is already complete:

- [x] Public marketing pages build successfully
- [x] Core dashboard routes build successfully
- [x] Docs article routes now exist for linked `/docs/*` pages
- [ ] Authentication fully verified against production-grade user setup
- [ ] Sendy integration tested with real credentials and real list
- [ ] SMS integration tested end-to-end with real credentials
- [ ] Supabase environment fully configured in production
- [ ] Database migrations/schema verified against the target environment
- [ ] Public forms flow verified against configured data backend
- [ ] Analytics / tracking endpoints validated with real sends and clicks
- [ ] Final SEO/social assets verified (OG/Twitter images, favicon set)
- [ ] Initial admin bootstrap process documented and tested
- [ ] Security review completed for secrets, auth, and deployment config

## Current Status

This repository is in a usable early stage, but it is not yet a fully complete marketing automation platform. Treat the real strengths today as campaign basics, contacts, settings, and Sendy wiring. Treat automation, forms, A/B testing, integrations, advanced analytics, and broad marketing claims as planned or beta until backed by fuller product work.