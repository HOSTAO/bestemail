# Build Phase 2 - Production Data Foundation

Date: 2026-03-11

## Goal of this phase

Tighten the app's production data behavior after cleanup without doing a risky deep rewrite.

Focus areas:
1. Audit Supabase and env usage
2. Reduce browser/local-file fallback in core production paths
3. Make configuration behavior more predictable
4. Document what still must be configured

## What I found

### 1) Supabase env usage was inconsistent
The codebase used a mix of:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Some files only checked one variant, which made behavior differ between client/server and between routes.

### 2) Core settings were stored in browser localStorage
`src/app/dashboard/settings/page.tsx` was loading and saving `bestemail_settings` in localStorage.

That is fine for a quick demo, but it is a bad production foundation because:
- secrets live in the browser
- behavior changes per browser/device
- server-side features do not reliably see the same config
- production debugging becomes messy

### 3) Some core API routes still bypassed auth/db abstraction
These routes were still writing directly to local JSON storage:
- `src/app/api/forms/route.ts`
- `src/app/api/segments/route.ts`
- `src/app/api/contacts/import/route.ts`

That meant production behavior could silently fall back to file storage depending on env state.

### 4) Local fallback was too implicit
The app warned about "using local storage fallback" when Supabase vars were missing, but there was no clear runtime policy separating:
- local/dev convenience
- intentional production behavior
- accidentally unconfigured production

## What changed

### A. Added centralized runtime config
New file:
- `src/lib/runtime-config.ts`

This now centralizes:
- resolved Supabase env values
- Sendy env values
- InstaSent env values
- production/dev detection
- local fallback policy via `ALLOW_LOCAL_DATA_FALLBACK`

### B. Production data mode is now explicit
New behavior:
- **development**: local fallback remains allowed by default
- **production**: local fallback is treated as disabled unless `ALLOW_LOCAL_DATA_FALLBACK=true`

That means core data paths will now fail loudly instead of silently writing to local JSON when production is missing Supabase admin config.

### C. Updated Supabase config handling
Updated:
- `src/lib/supabase.ts`
- `src/lib/settings.ts`
- `src/lib/secure-settings.ts`

Improvements:
- consistent env resolution
- accepts `SUPABASE_URL` as server alias while preferring `NEXT_PUBLIC_SUPABASE_URL`
- more predictable fallback to env-backed Sendy settings

### D. Tightened core DB fallback behavior
Updated:
- `src/lib/db.ts`

Core user/contact/campaign/segment reads+writes now:
- use Supabase when configured
- use local JSON only when fallback is explicitly allowed
- otherwise throw a clear configuration error in production

### E. Settings page no longer depends on browser localStorage
Updated:
- `src/app/dashboard/settings/page.tsx`
- `src/app/api/settings/secure/route.ts`

New behavior:
- settings load from secure server route
- settings save through secure server route
- the page shows whether data came from database or environment defaults
- stale `bestemail_settings` localStorage is cleaned up on load

Note: SMS values on that page are still UI/session-level unless a dedicated SMS settings persistence path is added later. But email/Sendy settings no longer rely on browser storage.

### F. Isolated risky local JSON routes
Updated:
- `src/app/api/forms/route.ts`
- `src/app/api/segments/route.ts`
- `src/app/api/contacts/import/route.ts`

Improvements:
- auth required before access
- segments/import now go through the shared DB layer where possible
- forms route now refuses production writes when local fallback is not allowed

### G. Clarified env examples
Updated:
- `.env.example`
- `.env.local.example`

Added/clarified:
- `ALLOW_LOCAL_DATA_FALLBACK`
- preferred Supabase variable names
- production expectation that Supabase backs core data paths

## Required environment variables after this phase

## Must-have for predictable production behavior

### App/security
- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `ENCRYPTION_KEY`

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional alias on server:
- `SUPABASE_URL`

### Sendy
- `USE_SENDY=true`
- `SENDY_API_URL`
- `SENDY_API_KEY`
- `SENDY_LIST_ID`
- `SENDY_BRAND_ID` (usually `1`)
- `DEFAULT_FROM_EMAIL`
- `DEFAULT_FROM_NAME`

## Optional
- `ALLOW_LOCAL_DATA_FALLBACK` (default false in production, true in dev)
- `INSTASENT_API_TOKEN`
- `NEXT_PUBLIC_INSTASENT_API_TOKEN`
- white-label / analytics / storage / billing extras

## Production behavior now

### If Supabase is configured correctly
- core data goes to Supabase
- settings can be loaded/saved through secure server routes
- dashboard behavior is more predictable across devices

### If Supabase is NOT configured in production
- core production data paths now fail clearly instead of silently drifting into local JSON fallback
- environment-based defaults can still be read for Sendy settings display
- saving secure settings requires Supabase admin config

### If you intentionally want file fallback outside Supabase
Set:
- `ALLOW_LOCAL_DATA_FALLBACK=true`

That is now an explicit choice, not an accidental side effect.

## Checks run

Planned/expected checks for this phase:
- `npm run build`
- `npm run lint`

See the latest task report for actual output/results from this build pass.

## Recommended next small phase

Best next practical step:
1. move forms persistence from JSON into Supabase tables
2. add a small persisted SMS settings model if SMS is meant to be production-ready
3. replace in-memory auth sessions with durable session storage

That would finish the foundation shift without jumping into major new features.
