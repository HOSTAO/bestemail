# Vercel Environment Variables - Quick Copy Paste

## How to Add These to Vercel

1. Go to: **https://vercel.com/dashboard**
2. Select: **bestemail-platform** project
3. Go to: **Settings → Environment Variables**
4. For **Production** environment:
   - Click "Add"
   - Paste each line below
   - Select Environment: **Production**
   - Click Save

5. Repeat for **Preview** environment (same values)

---

## Copy-Paste Format for Vercel

Format: `NAME=VALUE`

Replace values marked with `YOUR_XXX_HERE`

---

### Production Environment Variables

```
NEXT_PUBLIC_APP_URL=https://bestemail.in
NEXTAUTH_URL=https://bestemail.in
NEXT_PUBLIC_APP_DOMAIN=bestemail.in
SESSION_SECRET=YOUR_SESSION_SECRET_HERE
NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET_HERE
ENCRYPTION_KEY=YOUR_ENCRYPTION_KEY_HERE
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL_HERE
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
SUPABASE_URL=YOUR_SUPABASE_URL_HERE
DATABASE_URL=YOUR_DATABASE_URL_HERE
USE_SENDY=true
NEXT_PUBLIC_USE_SENDY=true
SENDY_API_URL=https://my.bestemail.in
NEXT_PUBLIC_SENDY_API_URL=https://my.bestemail.in
SENDY_API_KEY=YOUR_SENDY_API_KEY_HERE
SENDY_LIST_ID=YOUR_SENDY_LIST_ID_HERE
SENDY_BRAND_ID=1
ADMIN_EMAIL=admin@bestemail.in
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD_HERE
DEFAULT_FROM_EMAIL=hello@bestemail.in
DEFAULT_FROM_NAME=Bestemail
ENABLE_WHITE_LABEL=true
WHITE_LABEL_DOMAIN=bestemail.in
NEXT_PUBLIC_WHITE_LABEL_ENABLED=true
ALLOW_LOCAL_DATA_FALLBACK=false
NEXT_PUBLIC_ENABLE_FORMS=true
NEXT_PUBLIC_ENABLE_AUTOMATION=true
NEXT_PUBLIC_ENABLE_SMS=true
NEXT_PUBLIC_ENABLE_AB_TESTING=true
DEBUG=false
NEXT_PUBLIC_DEBUG=false
```

---

## Value Mapping

| Variable | Where to Get | Example |
|----------|-------------|---------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase Settings → API | https://xxxxx.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase Settings → API | ey... |
| SUPABASE_SERVICE_ROLE_KEY | Supabase Settings → API | ey... |
| SENDY_API_KEY | Sendy Dashboard → Settings | your-key |
| SENDY_LIST_ID | Sendy Campaign → List ID | numeric-id |
| SESSION_SECRET | Generate: `openssl rand -hex 32` | random-string |
| NEXTAUTH_SECRET | Generate: `openssl rand -hex 32` | random-string |
| ADMIN_PASSWORD | Create yourself | strong-password |

---

## Quick Vercel Dashboard Steps

1. Click "Add" (green button)
2. Under "Name" → paste variable name (e.g., `SENDY_API_KEY`)
3. Under "Value" → paste the secret value
4. Under "Select Environment" → choose **Production**
5. Click "Save"
6. Repeat for each variable

---

## After Adding All Variables

1. Go to **Deployments** tab
2. Click the three dots `...` on latest deployment
3. Click **Redeploy**
4. Wait 2-3 minutes
5. Test at `https://bestemail.in/login`

---

**Do not share these variables with anyone or commit to Git.**
