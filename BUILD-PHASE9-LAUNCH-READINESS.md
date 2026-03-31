# BUILD PHASE 9 - LAUNCH READINESS

Date: 2026-03-11

## Honest status

Bestemail is **closer, but not truly launch-ready yet**.

**Updated readiness: 68%**

That score reflects:
- public site builds successfully
- core dashboard routes build successfully
- obvious docs route mismatch fixed
- repository truth/docs improved
- basic local smoke pass completed
- but core launch blockers still remain around environment completeness, public-form production behavior, real provider verification, and lint/code-health debt

## What I changed in this pass

### 1) Fixed a real broken route path
Added:
- `src/app/docs/[slug]/page.tsx`

Why:
- `/docs` linked to article pages like `/docs/api-overview` and `/docs/getting-started`
- those article routes did **not** exist before this pass
- result: footer/docs links could claim content that would 404

Outcome:
- `/docs/api-overview` now resolves successfully
- future `/docs/<slug>` article links now land on a working page instead of a missing route

### 2) Reduced dashboard navigation truth gaps in `CorporateHeader`
Updated links to point at existing dashboard tab-driven routes instead of nonexistent standalone paths:
- `/dashboard/campaigns` -> `/dashboard?tab=campaigns`
- `/dashboard/contacts` -> `/dashboard?tab=contacts`
- `/dashboard/analytics` -> `/dashboard?tab=campaigns` (safe fallback, since no real analytics route exists)

Note:
- `CorporateHeader` does not appear to be actively wired into the current app shell, so this is a preventive cleanup rather than a verified user-facing fix.

### 3) Fixed repository truth / security hygiene in `README.md`
Sanitized or corrected:
- removed hardcoded real-looking admin credentials from docs
- replaced launch-overclaim checklist with an honest pre-launch checklist
- clarified that the repo is still a launch-candidate work in progress, not a fully verified production release

Why this matters:
- launch docs should not contain secrets
- launch docs should not claim “all pages functional / no broken links / env set” when that is not actually verified

## What I verified

### Build
Ran:
- `npm run build`

Result:
- **PASS**
- production build completes successfully
- route manifest now includes `ƒ /docs/[slug]`

### Local smoke review
Started local server with:
- `PORT=3211 npm run start`

Verified via local HTTP requests:
- `GET /` -> **200**
- `GET /docs` -> **200**
- `GET /docs/api-overview` -> **200**
- `GET /features` -> **200**
- `GET /dashboard/quick-start` -> **200**
- `GET /api/auth/check` -> **401** with `{ "authenticated": false }` when not logged in -> **expected**
- `POST /api/settings/test-sendy` with missing fields -> **400** -> **expected validation behavior**
- `POST /api/forms/public/test-form` with invalid email -> **400** -> **expected validation behavior**

## Environment/config reality found

Sanitized `.env.local` inspection showed:
- `NEXT_PUBLIC_SUPABASE_URL` -> **missing**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` -> **missing**
- `SUPABASE_SERVICE_ROLE_KEY` -> **set**
- `DATABASE_URL` -> **set**
- `ALLOW_LOCAL_DATA_FALLBACK` -> **missing**
- `SENDY_API_URL` -> **set**
- `SENDY_API_KEY` -> **placeholder**
- `SENDY_LIST_ID` -> **placeholder**
- `SENDY_BRAND_ID` -> **set**
- `DEFAULT_FROM_EMAIL` -> **set**
- `DEFAULT_FROM_NAME` -> **set**

### What that means

#### Supabase is only partially configured
Build succeeds, but the app logs this repeatedly:
- `Supabase public environment variables not set. Public data features will be limited until configuration is completed.`

That is not cosmetic. It directly affects launch confidence.

#### Public forms are blocked in production-style mode right now
Observed:
- `GET /api/forms/public/test-form` returned **500** with a configuration error

Exact behavior:
- production-mode public form access requires either:
  - full Supabase env config, or
  - explicit `ALLOW_LOCAL_DATA_FALLBACK=true`

This is an **actual launch blocker** if any public form/embed flow is expected to work on launch.

#### Sendy is not launch-verified yet
Current local env status indicates:
- Sendy base URL is present
- Sendy API key and list ID are still placeholders

So campaign sending is **not actually verified end-to-end** in this environment.

## Important blockers still preventing a real launch

### Blocker 1: Supabase public env is incomplete
Need in production:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- likely `DATABASE_URL` as well for migration/admin workflows

Without this, parts of the app fall back, degrade, or fail depending on route and environment.

### Blocker 2: Public forms are not launch-safe yet
Right now, public form route behavior proves:
- production-style form access can fail hard when backend config is incomplete

If forms or embeddable signup capture are part of launch messaging, this must be resolved before launch.

### Blocker 3: Sendy sending has not been proven with real credentials
Need a real test of:
- settings save/load
- connection test
- draft campaign creation
- actual Sendy campaign create/send/schedule response
- any required tracking behavior after send

Until then, email delivery is still assumed rather than verified.

### Blocker 4: lint/code-health debt is still high
Ran:
- `npm run lint`

Result:
- **FAIL**
- reported **118 problems** (**67 errors, 51 warnings**)

Examples from current output:
- `no-explicit-any`
- unused vars
- `prefer-const`
- CommonJS `require()` in test scripts
- `@next/next/no-img-element`

This did not stop build, but it is still a launch risk because it signals unresolved code quality and maintenance debt.

### Blocker 5: README / repo docs had truth drift
Partially fixed in this pass, but this is a warning sign:
- repo docs had overclaims and embedded credentials
- there may be more truth drift in other docs not yet fully audited

## Recommended next steps before launch

1. **Finish Supabase config properly**
   - set `NEXT_PUBLIC_SUPABASE_URL`
   - set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - verify `SUPABASE_SERVICE_ROLE_KEY`
   - verify schema/tables against expected routes

2. **Decide the data-mode policy clearly**
   - production with Supabase only, or
   - intentional fallback with `ALLOW_LOCAL_DATA_FALLBACK=true`
   - document that decision clearly

3. **Run a real Sendy smoke test**
   - save real settings
   - run connection test from settings page/API
   - create campaign
   - send or schedule one real campaign
   - verify response and resulting status

4. **Run a real auth smoke test**
   - signup/login/logout
   - auth check
   - dashboard access after login
   - confirm first-admin/bootstrap story

5. **Resolve at least the highest-signal lint errors**
   - especially `any` types and broken test-script linting
   - either fix or intentionally exclude ad-hoc scripts from lint scope

6. **Verify public forms if they are part of launch scope**
   - create active form
   - GET public form
   - POST valid submission
   - confirm contact creation and success/redirect behavior

## Files changed in this pass

- `src/app/docs/[slug]/page.tsx` (new)
- `src/components/CorporateHeader.tsx`
- `README.md`
- `BUILD-PHASE9-LAUNCH-READINESS.md` (new)

## Bottom line

**What is genuinely ready now:**
- public site builds
- core marketing pages load
- docs article links no longer hard-fail
- some API validation behavior is working as expected

**What still blocks launch:**
- incomplete Supabase public env setup
- public forms failing in production-style configuration state
- Sendy not verified with real credentials
- large lint/code-health backlog
- incomplete end-to-end auth/provider smoke testing

**Final honest readiness: 68%**
