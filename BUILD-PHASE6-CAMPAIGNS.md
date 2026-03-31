# BUILD PHASE 6 — Campaign + Sendy flow hardening

Date: 2026-03-11

## Scope completed

This phase stayed intentionally narrow: fix campaign create/edit/send rough edges, make Sendy behavior safer, and improve operator-visible failure handling without broad rewrites.

### 1) Campaign create/edit/send flow cleaned up

- Added `GET` + `PUT` route at `src/app/api/campaigns/[id]/route.ts`.
- Campaign editor (`/dashboard/campaigns/new`) now supports loading an existing campaign via `?id=...`.
- Draft save now updates an existing campaign instead of always creating duplicates.
- Send/schedule flow now updates the current campaign when editing instead of creating a second record first.
- Dashboard campaign list now exposes an edit/reuse action.
- Scheduling input is validated before save/send.

### 2) Sendy integration/config hardened

- `src/lib/sendy.ts` no longer silently falls back to fake `dummy_*` Sendy credentials.
- Sendy helpers now return explicit failure reasons for:
  - missing config
  - network error
  - Sendy/API error
- Sendy API URLs are normalized to avoid double-slash path issues.
- Campaign sending now uses secure per-user settings loaded from `secure-settings`, instead of only checking raw environment variables.
- Send route passes configured brand/list/api settings directly into Sendy calls.

### 3) Failure/status handling improved

- `/api/campaigns/send` now returns actionable config errors when Sendy is not configured, instead of pretending success in “demo mode”.
- Failed sends return non-200 status and preserve/reset campaign state to `draft`.
- Successful scheduled sends keep campaign status as `scheduled`.
- Immediate successful sends mark status as `sent`.
- Frontend send flow now surfaces backend error messages instead of always showing the same generic toast.

## Files changed

- `src/app/api/campaigns/[id]/route.ts` (new)
- `src/app/api/campaigns/send/route.ts`
- `src/app/dashboard/campaigns/new/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/lib/db.ts`
- `src/lib/sendy.ts`
- `src/lib/store.ts`

## Checks run

- `npm run build`
- `npm run lint`

## Current known limits / still pending

These were intentionally not expanded in this pass:

- No dedicated campaign detail page yet.
- No delete/archive action yet.
- No recipient count resolution per segment at send-time yet.
- No background worker / queue for scheduled sends yet; status can be stored as `scheduled`, but execution orchestration still needs a real scheduler.
- No deeper Sendy response parsing beyond core success/error text handling.
- No analytics reconciliation or send history sync from Sendy yet.

## Launch-readiness effect

This phase removes the most misleading behavior from the campaign path: sending no longer fakes success when Sendy is not configured, and campaign drafts can now be reopened and updated safely. That makes the flow much more honest and usable for launch, while keeping code movement contained.
