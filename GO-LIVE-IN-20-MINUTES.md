# 🚀 GO LIVE IN 20 MINUTES

**Complete step-by-step guide to launch Bestemail on bestemail.in**

---

## ⏱️ Timeline: 20 Minutes Total

| Step | Time | What |
|------|------|------|
| 1 | 2 min | Gather secrets |
| 2 | 5 min | Fill .env.production.local |
| 3 | 3 min | Add to Vercel |
| 4 | 2 min | Connect domain |
| 5 | 2 min | Update DNS |
| 6 | 3 min | Redeploy & test |
| 7 | 1 min | Go live! |

---

## 📋 What You Need Ready

- [ ] Supabase project URL and keys
- [ ] Sendy API key and list ID
- [ ] Admin email (e.g., admin@bestemail.in)
- [ ] Admin password (16+ chars)
- [ ] Access to Vercel dashboard
- [ ] Access to domain DNS (registrar)

---

## 🔑 STEP 1: Get Your Secrets (2 mins)

### From Supabase:
1. Go to **https://app.supabase.com**
2. Select your project
3. Go to **Settings → API**
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### From Sendy:
1. Go to **https://my.bestemail.in**
2. Go to **Settings → API**
3. Copy API key → `SENDY_API_KEY`
4. Go to any campaign → copy **List ID** → `SENDY_LIST_ID`

### Generate Random Secrets:
Open Terminal and run:
```bash
# For SESSION_SECRET
openssl rand -hex 32

# For NEXTAUTH_SECRET
openssl rand -hex 32

# For ENCRYPTION_KEY
openssl rand -hex 16
```

---

## ✏️ STEP 2: Fill .env.production.local (5 mins)

**File location:** `~/.openclaw/workspace/bestemail-platform/.env.production.local`

Open the file and replace ALL `your_xxx_here_replace_me` with actual values:

```env
# Keep these as-is
NEXT_PUBLIC_APP_URL=https://bestemail.in
NEXTAUTH_URL=https://bestemail.in

# Replace these with your Supabase values
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey... (your anon key)
SUPABASE_SERVICE_ROLE_KEY=ey... (your service role key)

# Replace with your Sendy values
SENDY_API_KEY=your-sendy-api-key
SENDY_LIST_ID=your-sendy-list-id

# Replace with random generated values from Terminal
SESSION_SECRET=aBcD1eF2gH3iJ4... (32 chars)
NEXTAUTH_SECRET=xYzAbCdEfGhIjK... (32 chars)
ENCRYPTION_KEY=7f9e8d7c6b5a4f... (16 chars)

# Replace with your admin credentials
ADMIN_EMAIL=admin@bestemail.in
ADMIN_PASSWORD=YourStrongPassword123!

# Keep these as-is
DEFAULT_FROM_EMAIL=hello@bestemail.in
DEFAULT_FROM_NAME=Bestemail
SENDY_API_URL=https://my.bestemail.in
ALLOW_LOCAL_DATA_FALLBACK=false
```

**Save the file.** ✅

---

## 🔗 STEP 3: Add to Vercel (3 mins)

1. Open **https://vercel.com/dashboard**
2. Click **bestemail-platform** project
3. Go to **Settings → Environment Variables**
4. For **Production** environment:
   - Click "Add" (green button)
   - Copy each line from your .env file
   - Paste as: `NAME=VALUE`
   - Select Environment: **Production**
   - Click Save

**Quick reference of variables to add:**
```
NEXT_PUBLIC_APP_URL=https://bestemail.in
NEXTAUTH_URL=https://bestemail.in
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SESSION_SECRET=...
NEXTAUTH_SECRET=...
ENCRYPTION_KEY=...
SENDY_API_KEY=...
SENDY_LIST_ID=...
ADMIN_EMAIL=admin@bestemail.in
ADMIN_PASSWORD=...
DEFAULT_FROM_EMAIL=hello@bestemail.in
DEFAULT_FROM_NAME=Bestemail
SENDY_API_URL=https://my.bestemail.in
ALLOW_LOCAL_DATA_FALLBACK=false
```

**Repeat the same for Preview environment** (copy from Production).

✅ All variables saved.

---

## 🏠 STEP 4: Connect Domain in Vercel (2 mins)

1. In Vercel, go to **Settings → Domains**
2. Click "Add"
3. Enter: `bestemail.in`
4. Click "Add"
5. Vercel shows DNS records → **copy them**
6. Keep this page open (you'll need it next)

---

## 🔧 STEP 5: Update DNS at Your Registrar (2 mins)

**Where:** Wherever bestemail.in is registered (Namecheap, GoDaddy, Cloudflare, etc.)

**What to do:**
1. Go to your registrar's DNS settings for `bestemail.in`
2. Find the DNS records Vercel showed you (usually CNAME or ALIAS records)
3. Add/update those records
4. Save

**Example (may differ for your registrar):**
- If Vercel says: Add CNAME `alias.vercel.sh` to `bestemail.in`
- Go to your registrar and create that CNAME record
- Save and wait 5-10 minutes

---

## 🔄 STEP 6: Redeploy & Test (3 mins)

1. Go back to **Vercel → Deployments**
2. Find the latest deployment (green "Ready" badge)
3. Click the `...` (three dots) → **Redeploy**
4. Wait 2-3 minutes

### Quick Tests:
```
1. Visit: https://bestemail.in/login
   → Should load (not WordPress site)
   
2. Login with:
   Email: admin@bestemail.in
   Password: (your admin password)
   → Should see dashboard
   
3. Go to: /dashboard/campaigns/new
   → Create a test campaign
   → Should load campaign builder
   
4. Go to: /dashboard/contacts
   → Upload a test CSV
   → Should import without errors
```

---

## 🎉 STEP 7: You're Live! (1 min)

**Bestemail is now running on https://bestemail.in**

### Next Steps:
1. ✅ Import your real email list
2. ✅ Create your first campaign
3. ✅ Send a test email
4. ✅ Check analytics dashboard
5. ✅ Announce on LinkedIn

---

## 🆘 Troubleshooting

### Domain shows old WordPress site
**Solution:** DNS hasn't propagated yet. Wait 5-10 minutes and refresh.

### Login fails with "Invalid credentials"
**Solution:** 
- Double-check ADMIN_EMAIL and ADMIN_PASSWORD in Vercel env
- Make sure they're set for **Production** environment

### "Supabase connection error"
**Solution:**
- Verify SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY are correct
- Copy exactly from Supabase dashboard

### "Can't send emails" or Sendy errors
**Solution:**
- Verify SENDY_API_KEY and SENDY_LIST_ID are correct
- Test Sendy connection at https://my.bestemail.in
- Confirm list exists in Sendy

### "CSS looks broken"
**Solution:** Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

---

## ✅ Checklist Before Going Live

- [ ] All secrets gathered (Supabase, Sendy)
- [ ] .env.production.local filled in completely
- [ ] All variables added to Vercel Production
- [ ] Same variables added to Vercel Preview
- [ ] Domain connected to Vercel
- [ ] DNS updated at registrar
- [ ] Vercel redeployed
- [ ] Smoke tests passed
- [ ] Can login to admin
- [ ] Can create campaign
- [ ] Can import contacts

---

## 📞 Key Contacts

- **Vercel Issues:** https://vercel.com/support
- **Supabase Issues:** https://supabase.com/support
- **Sendy Issues:** Check https://my.bestemail.in settings

---

## 🎯 You've Got This!

**20 minutes from now: Bestemail will be live at bestemail.in** 🚀

If you hit any issues, check the Troubleshooting section or contact Vercel/Supabase support.

Good luck! 💪
