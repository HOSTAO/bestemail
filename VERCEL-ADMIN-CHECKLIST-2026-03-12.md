# Bestemail Vercel Admin Checklist — 2026-03-12

This is the shortest honest path to a real launch.

## What is already true

- Local `npm run build` passes.
- The repo is already linked to Vercel project `bestemail-platform`.
- Vercel CLI is authenticated.
- Production deployments already exist and are `Ready`.
- The default Vercel URL works: `https://bestemail-platform.vercel.app`

## What is blocking a clean launch right now

1. `bestemail.in` is **not** pointing at this Vercel project right now.
   - Public check shows `https://bestemail.in` is still serving a WordPress site.
   - Current Vercel production alias is `https://bestemail-platform.vercel.app`
2. Production Vercel env is missing core Supabase variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Production Vercel env is missing direct Sendy env values for first-run env-backed launch:
   - `SENDY_API_KEY`
   - `SENDY_LIST_ID`
4. Production currently has `ALLOW_LOCAL_DATA_FALLBACK="true"`.
   - That is okay for temporary survival mode.
   - It is **not** the setting you want for a proper production launch.
5. Preview environment has no project env vars configured.

## Manual actions in Vercel dashboard

### 1) Fix production environment variables

In **Vercel → bestemail-platform → Settings → Environment Variables**, add/update these for **Production**:

#### Required for honest launch
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SENDY_API_KEY`
- `SENDY_LIST_ID`
- `SESSION_SECRET` (keep strong, unique, 32+ chars)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `DEFAULT_FROM_EMAIL`
- `DEFAULT_FROM_NAME`

#### Keep / verify
- `NEXT_PUBLIC_APP_URL=https://bestemail.in` after domain cutover
- `NEXTAUTH_URL=https://bestemail.in` after domain cutover
- `SENDY_API_URL=https://my.bestemail.in`
- `NEXT_PUBLIC_SENDY_API_URL=https://my.bestemail.in`
- `USE_SENDY=true`
- `NEXT_PUBLIC_USE_SENDY=true`
- `ENABLE_WHITE_LABEL=true`
- `WHITE_LABEL_DOMAIN=bestemail.in`
- `ENCRYPTION_KEY` (keep existing if already in use)

#### Change this before final launch
- `ALLOW_LOCAL_DATA_FALLBACK=false`

### 2) Add preview env vars too

At minimum copy the same core variables into **Preview** so preview deployments behave like production.

Minimum preview set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SENDY_API_URL`
- `SENDY_API_KEY`
- `SENDY_LIST_ID`
- `SESSION_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `DEFAULT_FROM_EMAIL`
- `DEFAULT_FROM_NAME`

### 3) Attach the real domain

In **Vercel → bestemail-platform → Settings → Domains**:
- Add `bestemail.in`
- Add `www.bestemail.in` if wanted
- Follow Vercel DNS instructions exactly

Right now `bestemail.in` is not attached in this Vercel account/project.

### 4) Cut over DNS

Wherever `bestemail.in` DNS is managed:
- point apex/root to Vercel using the record Vercel shows
- point `www` to Vercel as recommended
- remove conflicting old WordPress origin routing after cutover is confirmed

### 5) Redeploy after env/domain fixes

After env vars are corrected:
- trigger a fresh production redeploy from Vercel dashboard
- then test on both:
  - `https://bestemail-platform.vercel.app`
  - `https://bestemail.in` (after DNS is live)

## Manual actions outside Vercel

### Supabase
- confirm the project exists
- confirm the schema/tables used by the app exist
- make sure the service role key is the real one

### Sendy
- confirm `https://my.bestemail.in` is reachable from Vercel runtime
- confirm API key is valid
- confirm list ID is correct
- confirm sender email/domain is authorized in Sendy

## Smoke test after cutover

1. Visit `/login`
2. Login with admin credentials
3. Open `/dashboard/settings`
4. Confirm all status checks show ready
5. Import a tiny CSV
6. Create one test campaign
7. Send one test email to a real inbox
8. Submit one live form and confirm it lands in storage/Sendy

## Reji version

Do these in order:

1. Add missing Supabase + Sendy env vars in Vercel Production
2. Set `ALLOW_LOCAL_DATA_FALLBACK=false`
3. Copy the same env vars to Preview
4. Connect `bestemail.in` to this Vercel project
5. Point DNS to Vercel
6. Redeploy
7. Login and run one real smoke test
