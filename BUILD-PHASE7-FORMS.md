# BUILD-PHASE7-FORMS.md

## Phase 7 focus
Public form submission flow hardening with minimal-risk changes only.

## What changed

### 1) Public form API added
- Added `GET /api/forms/public/[id]`
  - returns safe public form metadata only for active forms
- Added `POST /api/forms/public/[id]`
  - validates email
  - accepts optional `name`, `city`, `businessType`, `tags`
  - writes submission into the contact layer instead of creating an isolated dead-end record
  - increments form submission count
  - returns success message + redirect URL for frontend/embed usage

### 2) Form submissions now connect to contacts + list/form context
- Public submissions now create/update a contact tied to the form owner.
- Submission tags are derived and merged automatically:
  - `source:form`
  - `list:<targetList>`
  - `form:<formId>`
  - `form-type:<type>`
  - `form-name:<slug>`
- This gives the CRM/contact side usable context without a broad schema rewrite.

### 3) Supabase contact writes hardened
- `db.createContact()` now uses upsert semantics in Supabase mode on `(user_id, email)`.
- This avoids duplicate-contact failure paths for repeat public submissions.
- Local fallback behavior remains merge/update-oriented.

### 4) Form settings/tracking improved lightly
- New forms now persist lightweight submission/tracking-oriented settings:
  - tracking enabled marker
  - default submission contact tags
- Each public submission updates lightweight last-submission metadata on the form settings:
  - last submission time
  - target list
  - source

### 5) Local fallback cleanup
- `db.getForms(userId)` now filters local fallback forms more safely by user shape instead of returning the whole local collection blindly.

## Notes
- I intentionally did **not** introduce a brand-new submissions table in this phase. That would be the next bigger step, but it increases schema and migration risk.
- Current implementation favors launch-readiness and safer iteration over broad architectural expansion.

## Suggested next step
1. Add a real `form_submissions` table for audit/history.
2. Add dashboard controls to edit active/draft status and form field definitions.
3. Add a small hosted embed renderer or public landing page per form.
4. Optionally sync qualifying public submissions directly to Sendy.
