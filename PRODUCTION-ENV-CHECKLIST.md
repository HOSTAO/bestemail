# Production Environment Checklist

Use this before launch. If any required item is missing, do not call the product production-ready yet.

## Required secrets and config

Set these in your production environment provider (for example Vercel). Do not keep real values in Git.

### Authentication and session security

- `SESSION_SECRET` — required, strong random secret, at least 32 characters
- `ADMIN_EMAIL` — required for the first admin login flow if your setup uses env-based bootstrap
- `ADMIN_PASSWORD` — required only if you are intentionally using env-based bootstrap; use a unique strong password and rotate it after first secure setup if possible

### Supabase

- `NEXT_PUBLIC_SUPABASE_URL` — required
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required
- `SUPABASE_SERVICE_ROLE_KEY` — required for privileged server operations; never expose client-side

### Sendy

- `SENDY_API_URL` — required
- `NEXT_PUBLIC_SENDY_API_URL` — keep aligned with `SENDY_API_URL` if the UI reads a public version
- `SENDY_API_KEY` — required
- `SENDY_LIST_ID` — required
- `USE_SENDY=true`
- `NEXT_PUBLIC_USE_SENDY=true`

### Sender identity

- `DEFAULT_FROM_EMAIL` — required for live sends
- `DEFAULT_FROM_NAME` — required for live sends

### Encryption

- `ENCRYPTION_KEY` — required if settings or provider secrets are encrypted at rest; use a 32-byte key or the exact format expected by the code

## Security-safe defaults

- Use unique secrets for production only
- Never reuse local test passwords in production
- Never commit `.env.local` or production values
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only
- Keep test-only routes disabled from production
- Do not present beta areas as core launch features

## Minimum verification before launch

1. Login works with the intended admin user
2. Settings page shows all required checks as ready
3. Contacts import works with a small CSV
4. One campaign can be saved, previewed, and sent
5. One test email arrives correctly in a real inbox
6. If forms are part of launch, one live form submission reaches storage correctly

## Minimum credentials still needed from Reji

The app cannot be honestly launched without these real values:

- Real Supabase project URL
- Real Supabase anon key
- Real Supabase service role key
- Real Sendy API URL
- Real Sendy API key
- Real Sendy list ID
- Strong production `SESSION_SECRET`
- Real sender identity (`DEFAULT_FROM_EMAIL`, `DEFAULT_FROM_NAME`)
- Real admin bootstrap credential decision if env-based admin setup is still being used
