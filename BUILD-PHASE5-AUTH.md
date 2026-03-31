# Build Phase 5 - Auth & Session Hardening

## Goal
Tighten launch-readiness around login, session durability, and protected routes without widening scope into a full identity rebuild.

## What was wrong before
- The app was using multiple auth/session schemes at the same time:
  - `session_id`
  - `auth-token`
  - `be_session`
  - `bestemail_auth`
- Route protection and API protection were checking different cookies.
- Some auth paths depended on in-memory `Map` sessions, which are lost on dev server restart or redeploy.
- Protected route logic in `src/proxy.ts` only checked whether a cookie existed, not whether it was valid.
- The login UI exposed the current password directly in the page.
- Logout only cleared part of the session footprint.

## Changes made

### 1) Consolidated session validation around signed cookies
- Reworked `src/lib/auth.ts` to issue and validate HMAC-signed session tokens.
- Session payload now carries:
  - user id
  - email
  - role
  - name
  - expiry timestamp
- This removes the previous in-memory-only session dependency for the main auth path.
- Sessions now survive normal dev reloads/restarts because validation is stateless.

### 2) Unified the login/logout flow onto `session_id`
Updated these routes to use the same durable signed session cookie:
- `src/app/api/auth/login-v2/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout-v2/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/check/route.ts`
- `src/app/api/auth/verify/route.ts`

Behavior now:
- login sets `session_id`
- protected pages read `session_id`
- API auth helpers can also accept legacy cookie names if present
- logout clears `session_id` and legacy auth cookies

### 3) Hardened protected-route behavior
- Updated `src/proxy.ts` to validate the session token, not just check cookie presence.
- Invalid/stale sessions are redirected to `/login`.
- Invalid cookies are cleared during redirect.
- Logged-in users hitting `/login` or `/signup` are redirected to `/dashboard`.

### 4) Reduced flaky dev-only auth behavior
- `src/lib/auth-simple.ts` now delegates to the primary auth implementation instead of maintaining a separate in-memory session store.
- `src/lib/auth-helpers.ts` now reads the same session source used by the dashboard flow.
- This removes one of the biggest causes of "logged in here, unauthorized there" behavior.

### 5) Removed credential leakage from login UI
- `src/app/login/LoginForm.tsx` no longer prints the admin password in helper text.
- Replaced with generic guidance to use authorized admin credentials.

## Config notes
Current auth defaults still support existing local development behavior:
- `ADMIN_EMAIL` defaults to `reji@hostao.com`
- `ADMIN_PASSWORD` defaults to the current local password if env is not set
- `SESSION_SECRET` can be supplied via env
- `AUTH_SECRET` is also accepted as a fallback

Recommended production env setup:
- set `ADMIN_EMAIL`
- set `ADMIN_PASSWORD`
- set a strong `SESSION_SECRET`
- do not rely on built-in fallbacks in production

## Validation run

### Build
- `npm run build` ✅ passed

### Targeted lint for changed auth files
- Ran ESLint on the changed auth/session files to confirm no new lint issues were introduced there.

### Full repo lint
- `npm run lint` ❌ still fails, but mainly due to broader pre-existing repo issues outside this auth pass
- Examples include:
  - legacy `any` usage
  - CommonJS `require()` in test scripts
  - unrelated warnings/errors in `email-sender.ts`, `simple-auth.ts`, `white-label.ts`, and test files

## Done
- Reviewed login/session/protected-route behavior
- Made session handling durable and stateless for the main login path
- Unified route and API auth checks onto the same session model
- Reduced auth inconsistency across dashboard/API/proxy
- Removed obvious dev-only credential leakage in the UI
- Verified production build success

## Pending / next sensible auth step
These were intentionally left out to keep this phase narrow:
- Move admin credentials fully out of code defaults and require env-only production config
- Replace custom signed-cookie auth with a fuller user/session system backed by Supabase/Auth provider if multi-user auth is needed
- Add CSRF protection for state-changing auth-sensitive POST routes if the app expands beyond same-site dashboard usage
- Add rate limiting / lockout for login attempts
- Add server-side role enforcement consistently across every admin-sensitive API route
- Remove or retire dead/legacy auth files and routes (`simple-login`, old auth route variants) after confirming no UI depends on them
