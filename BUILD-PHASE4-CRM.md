# BUILD-PHASE4-CRM

## Scope
Practical launch-readiness cleanup for subscriber CRM/contact flows, kept intentionally narrow:

1. Clean up contacts/subscribers local data model where safe
2. Reduce demo/local-only behavior in contacts / segments / import flows
3. Make dashboard behavior more production-consistent
4. Avoid risky broad rewrites
5. Verify with build + targeted checks

## What changed

### 1) Local CRM data model cleanup
Updated local fallback storage to behave more like per-user CRM data:

- `src/lib/store.ts`
  - Added optional `userId` on local `Contact` and `Segment`
  - Added contact `status` (`active | unsubscribed | bounced`)
  - Added `updatedAt` on contacts and segments
  - Expanded DB normalization so older `db.json` files self-heal on read:
    - lowercases emails
    - ensures tags arrays exist
    - ensures segment rules arrays exist
    - backfills `status` and `updatedAt`

- `src/lib/db.ts`
  - Local `createContact()` now:
    - stores `userId`
    - deduplicates by `userId + email`
    - merges tags on repeat adds
    - updates existing local contacts instead of blindly duplicating them
  - Local `getContacts()` now filters/sorts by user more consistently
  - Local `importContacts()` now:
    - updates existing same-email contacts in local fallback mode
    - merges tags
    - stores `status`, `updatedAt`, and `userId`
  - Local `createSegment()` now stores `userId` + `updatedAt`
  - Local `getSegments()` now filters by user and sorts newest-first

### 2) Contacts API cleanup
- `src/app/api/contacts/route.ts`
  - Added email validation
  - Sanitizes `name`, `city`, `businessType`, and `tags`
  - Returns `201` on successful create
  - Returns `400` for invalid email input instead of generic failure
  - Returns `401` properly for unauthorized requests

### 3) Contact import flow cleanup
- `src/app/api/contacts/import/route.ts`
  - Moved import flow onto authenticated DB abstraction instead of raw local file mutation
  - Validates and normalizes email addresses
  - Skips invalid rows cleanly
  - Returns `skipped` count in response
  - Keeps Sendy sync as best-effort
  - Still supports local fallback safely, but in a less demo-only way

### 4) Broken dashboard import entry fixed
The dashboard linked to `/dashboard/contacts/import`, but that page did not exist.

- Added: `src/app/dashboard/contacts/import/page.tsx`
  - CSV paste importer UI
  - optional Sendy sync checkbox
  - result summary (`imported`, `skipped`, `sendySynced`)
  - sample CSV reset
  - supported column guidance

This removes a clear broken-path issue from the contacts workflow.

### 5) Campaign recipient flow made less demo-like
- `src/app/dashboard/campaigns/new/page.tsx`
  - Removed hardcoded demo-style recipient numbers (`All contacts (150)`)
  - Removed hardcoded segment presets (`engaged`, `new`, `inactive`, `vip`) from the UI
  - Now loads real contacts count from `/api/contacts`
  - Now loads real saved segments from `/api/segments`
  - Prevents segment send when no segment exists / none is selected
  - Keeps behavior small and safe without redesigning the campaign system

### 6) Dashboard behavior made more consistent
- `src/app/dashboard/page.tsx`
  - Added support for `?tab=` query handling so existing pushes like `/dashboard?tab=campaigns` actually land on the expected section
  - Implemented with `window.location.search` inside client effect to avoid Next 16 `useSearchParams()` suspense build issue

### 7) Campaign API kept aligned with recipient selection
- `src/app/api/campaigns/route.ts`
  - Passes through `segment_id` to DB create layer instead of dropping it

## Verification run

### Build
Ran:

```bash
npm run build
```

Result:
- **Passed**
- Confirmed route generation includes:
  - `/dashboard`
  - `/dashboard/campaigns/new`
  - `/dashboard/contacts/import`
  - `/api/contacts`
  - `/api/contacts/import`
  - `/api/segments`

### Targeted checks
Ran focused checks for CRM paths and current local data state:

- Confirmed import route exists and dashboard links still point to it
- Confirmed campaign page no longer contains hardcoded `All contacts (150)` recipient label
- Confirmed local `db.json` currently contains:
  - contacts: 0
  - segments: 0
  - forms: 0

### Lint
Ran:

```bash
npm run lint -- --quiet
```

Result:
- **Fails**, but due to broad pre-existing repo issues outside this phase
- Examples include:
  - many legacy `any` types
  - unescaped entities in unrelated UI files
  - CommonJS `require()` in test scripts
- I did **not** do a repo-wide lint cleanup because that would have turned this into a much broader rewrite

## Done vs pending

### Done
- Safe local CRM/contact schema cleanup
- Safer contact create/import behavior
- Duplicate reduction in local fallback imports
- Real segment loading in campaign composer
- Real contacts count in campaign composer
- Dashboard tab query behavior fixed
- Broken contacts import page added
- Build passing

### Still pending / not addressed in this phase
- True subscriber lifecycle model beyond `active/unsubscribed/bounced`
- Dedicated contacts list CRUD pages beyond import + dashboard table
- UI to create/manage segments from the main dashboard
- Real segment rule evaluation during send path (current send logic is still mixed / partially placeholder depending on path and environment)
- Full production send flow consistency between local fallback, Supabase mode, and Sendy mode
- Repo-wide lint cleanup
- More robust CSV parser (quoted commas / escaped values are still not handled)

## Notes for next phase
Best next practical CRM step:

1. Add a small real segment management UI (create/list/delete)
2. Normalize send-path recipient resolution so campaign send uses saved segment definitions consistently
3. Add contact status filtering and unsubscribe-safe handling in local fallback mode
4. Replace naive CSV splitting with a proper parser only if import complexity increases
