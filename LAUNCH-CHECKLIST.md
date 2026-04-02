# BestEmail Platform — Launch Checklist

_Last audited: 2026-04-02 (Tao build audit)_
_Build status: ✅ PASSING — 0 errors, 128 pages compiled (Turbopack)_

---

## 🚨 CRITICAL: Rotate These Secrets NOW

These were exposed in git-tracked files (now removed). Rotate before going live:

| Secret | What to do |
|--------|-----------|
| `ADMIN_PASSWORD` | Was `Devon007@gmail` in tracked files. Change to a new strong password |
| `SESSION_SECRET` | Was `bestemail_reji_2026_X9kL2pQ7mT4vN8s_secure` — generate new: `openssl rand -hex 32` |
| `ENCRYPTION_KEY` | Was `HF5EOT76s0Ixv-SEfU1wpSM1b-P2brrOb8GkgripXS6ZLa7BU6iBER1MG35Cfgec` — generate new: `openssl rand -hex 32` |
| `NEXTAUTH_SECRET` | Was `pnPj3YBCagKVfZt5vmnayKEeRopq8c3BtqYYtibUzZPcUC6OMh0BBtJuQfThl6QX` — generate new: `openssl rand -hex 32` |
| `SENDY_API_KEY` | Key `jiRiaoatQF1mC0dtQdIO` was in tracked file. Regenerate in Sendy settings or confirm it's disposable |
| GitHub PAT | Token was in git remote config. Revoke at github.com/settings/tokens |

---

## 🔴 BLOCKER: Missing DATABASE_URL in Production

The app uses direct PostgreSQL (`src/lib/postgres.ts` via `pg` package).
Vercel production env has **no `DATABASE_URL`** set → all contact, campaign, form, and segment operations WILL FAIL.

**Fix:**
1. Go to [Supabase Dashboard](https://app.supabase.com) → your project
2. Settings → Database → Connection string → URI
3. Copy the PostgreSQL connection string (looks like: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`)
4. Set in Vercel: `DATABASE_URL=<your-connection-string>`

Note: `NEXT_PUBLIC_SUPABASE_URL` is set but **unused** (Supabase JS client was removed; app uses direct pg connection).

---

## ✅ Build Status

- ✅ `npm run build` — **PASSING**, 0 TypeScript errors
- ✅ 128 pages compiled (static + dynamic)
- ✅ Turbopack compilation successful in ~2.7s
- ✅ No hardcoded secrets found in source files
- ✅ All process.env references properly used (~47 env calls across codebase)

---

## ✅ Top 3 Things Ready and Working

1. **Full build + routing** — All 128 routes compile cleanly. Auth middleware (`proxy.ts`) protects dashboard routes. Login → session cookie → dashboard flow is wired correctly.
2. **Sendy email integration** — API wiring complete; `USE_SENDY=true` in prod env; list IDs, from-email all set. Campaigns can send via Sendy once `DATABASE_URL` is added.
3. **Complete public marketing site** — Homepage, pricing, features, integrations, blog (17+ posts), docs, about/contact/legal pages all render. Site is fully presentable to the public.

---

## 🔴 Top 3 Things Still Broken or Incomplete

1. **DATABASE_URL not set in production** — Without this, all data operations (contacts, campaigns, forms, segments) fail silently on Vercel. This is the #1 launch blocker.
2. **Secrets need rotation** — ADMIN_PASSWORD, SESSION_SECRET, ENCRYPTION_KEY, NEXTAUTH_SECRET, SENDY_API_KEY were all exposed in git history. Must rotate every one before going live.
3. **Major features are UI-only scaffolds** — Automations engine, Sequences/drip system, SMS module, Analytics depth, and Landing Pages are all placeholder/demo UI with no real backend logic. Not blockers for soft launch, but users will hit dead ends.

---

## 🟡 Required Vercel Environment Variables (Full Production List)

Set these in: Vercel → Project Settings → Environment Variables → Production

### Mandatory (app won't function without these)

```
DATABASE_URL=postgresql://postgres.[ref]:[password]@pooler.supabase.com:6543/postgres
ADMIN_EMAIL=reji@hostao.com
ADMIN_PASSWORD=<new-strong-password>
SESSION_SECRET=<openssl rand -hex 32>
ENCRYPTION_KEY=<openssl rand -hex 32>
NEXTAUTH_SECRET=<openssl rand -hex 32>
NEXTAUTH_URL=https://bestemail-platform.vercel.app
NEXT_PUBLIC_APP_URL=https://bestemail-platform.vercel.app
```

### Required for email sending

```
USE_SENDY=true
NEXT_PUBLIC_USE_SENDY=true
SENDY_API_URL=https://my.bestemail.in
SENDY_API_KEY=<rotated-key>
SENDY_LIST_ID=E6hyqdm763T892otWIWlheCeAQ
DEFAULT_FROM_EMAIL=hello@bestemail.in
DEFAULT_FROM_NAME=BEST EMAIL
```

### Optional (white-label / misc)

```
ENABLE_WHITE_LABEL=true
WHITE_LABEL_DOMAIN=bestemail.in
ALLOW_LOCAL_DATA_FALLBACK=false
NODE_ENV=production
```

### Optional (if using SMS, payments, analytics)

```
INSTASENT_API_TOKEN=your_instasent_api_token
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
MIXPANEL_PROJECT_TOKEN=your_mixpanel_token
SENTRY_DSN=your_sentry_dsn
S3_BUCKET=bestemail-assets
S3_ACCESS_KEY=your_s3_access_key
S3_SECRET_KEY=your_s3_secret_key
S3_REGION=ap-south-1
CDN_URL=https://cdn.bestemail.in
REDIS_URL=redis://localhost:6379
```

---

## 🗄️ Database Setup (PostgreSQL via Supabase)

Before launch, run the schema against your Supabase PostgreSQL:

```bash
psql $DATABASE_URL -f supabase-schema.sql
```

Or use Supabase SQL Editor → paste contents of `supabase-schema.sql`.

Tables created: `users`, `contacts`, `campaigns`, `segments`, `templates`, `forms`

---

## 🔧 Pre-Deploy Steps (When Ready)

1. **Rotate all secrets** listed in the CRITICAL section above
2. **Set DATABASE_URL** in Vercel production env
3. **Run schema migration** against production Supabase
4. Confirm `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars are set (admin login uses these — no DB needed)
5. `npm run build` — confirm still 0 errors
6. `vercel deploy --prebuilt --prod` (with valid Vercel token)
7. Test login at https://bestemail.in/login
8. Test campaign creation and Sendy send

---

## 📋 Post-Deploy Smoke Tests

- [ ] `/login` → login with admin email → redirects to `/dashboard`
- [ ] `/dashboard` without login → redirects to `/login`
- [ ] Create a contact → appears in contacts list
- [ ] Create a campaign (draft) → appears in campaigns list
- [ ] Settings → Sendy → Test connection → shows connected
- [ ] Create a form → appears in forms list
- [ ] Logout → redirects to `/login`

---

## ⚠️ Known Limitations (Not Blockers for Launch)

- **Automations:** UI only, no real backend engine
- **Sequences:** UI scaffold, no drip-send engine
- **SMS:** uses demo data, IntraSent API optional
- **Analytics:** basic, no deep per-contact tracking
- **Landing pages:** not implemented as a real module
- **Chatwoot integration:** not implemented
- **Multi-tenant/white-label:** basic config only, not full SaaS
- **Activity feed:** combines real campaign events with mock data

These are Phase 2+ roadmap items per BESTEMAIL-GAP-AUDIT.md.

---

## 🔒 Security Notes

- All dashboard routes protected by `proxy.ts` middleware
- Auth uses HMAC-signed session tokens (no database lookup on validate)
- Password hashing uses SHA-256 (consider upgrading to bcrypt for user-registered accounts)
- `ALLOW_LOCAL_DATA_FALLBACK=false` set in prod — no file-based storage fallback
- `httpOnly` cookies used for session — XSS-safe

---

## 📝 DEPLOYMENT COMMAND (when Reji gives the go-ahead)

```bash
cd /Users/rejimodiyil/.openclaw/workspace/bestemail-platform
npm run build
vercel deploy --prebuilt --prod
```

**DO NOT deploy without Reji's explicit approval.**
