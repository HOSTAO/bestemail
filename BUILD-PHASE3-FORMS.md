# BUILD-PHASE3-FORMS.md

## What changed

This phase moved the forms area from mostly demo UI toward a real backend-backed module without attempting a full visual builder.

### 1) Forms API now uses the shared DB abstraction
- Replaced direct `readDb/writeDb` usage in `src/app/api/forms/route.ts` with `db.getForms()` and `db.createForm()`.
- This makes forms follow the same storage pattern as contacts/campaigns:
  - **Supabase** when admin credentials are configured
  - **local fallback** only when allowed by runtime config
- Added input validation for:
  - required form name
  - allowed form types (`popup`, `embedded`, `landing`)
  - optional redirect URL must be a valid absolute URL
- `POST /api/forms` now returns `201` on successful create.

### 2) Real create/list behavior added in DB layer
Added new methods in `src/lib/db.ts`:
- `createForm(userId, data)`
- `getForms(userId, limit)`

Behavior:
- Supabase-backed create/list when configured
- Local create/list for safe development fallback
- Default form fields are auto-seeded for practical first use:
  - `email` (required)
  - `name` (optional)
- Embed code is generated consistently from the saved form ID.
- Basic form metadata is stored in a production-friendlier shape:
  - form type
  - target list
  - success message
  - redirect URL
  - submissions count
  - draft/active status

### 3) Local store schema upgraded for forms
Updated `src/lib/store.ts` form type so local fallback is closer to Supabase-backed behavior.

Local forms now include:
- `type`
- `fields`
- `settings`
- `submissionsCount`
- `status`
- `updatedAt`

This reduces drift between local/dev mode and the Supabase data model.

### 4) Dashboard forms page now loads real data
Rebuilt `src/app/dashboard/forms/page.tsx` so it no longer depends on hard-coded sample forms.

New behavior:
- Loads forms from `/api/forms`
- Displays real counts from actual records
- Shows empty state when there are no forms
- Supports creating a new form from the dashboard
- Includes lightweight template shortcuts that prefill the create form
- Supports copying generated embed code
- Surfaces backend/load/create errors in the UI

### 5) Scope intentionally kept practical
Not implemented in this phase:
- full drag-and-drop builder
- submission inbox/detail pages
- live public form rendering pipeline
- analytics breakdowns beyond submission count
- landing-page designer

That was intentional. The goal here was to make forms storage and dashboard behavior more production-consistent today, not to overbuild.

## Files changed
- `src/app/api/forms/route.ts`
- `src/app/dashboard/forms/page.tsx`
- `src/lib/db.ts`
- `src/lib/store.ts`
- `BUILD-PHASE3-FORMS.md`

## Notes
- Supabase `forms` records already exist in `supabase-schema.sql`, so this phase builds on that instead of inventing a parallel structure.
- In Supabase mode, extra form metadata is stored inside the existing `settings` JSON object to avoid a schema migration for now.
- The local fallback remains useful in development, but the runtime path is now aligned with the main DB abstraction rather than ad hoc file handling in the route.
