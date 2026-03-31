# Bestemail Final Deployment Checklist — Ready to Launch

**Status: Ready for production** ✅

---

## 🚀 STEP 1: Prepare Your Secrets (5 mins)

### Get these values ready:
1. **Supabase**
   - Project URL: `https://your-project.supabase.co`
   - Anon Key: Find in Supabase Dashboard → Settings → API Keys
   - Service Role Key: Same location

2. **Sendy**
   - API URL: `https://my.bestemail.in` (your Sendy installation)
   - API Key: Find in Sendy Dashboard → Settings → API
   - List ID: Find in Sendy → Campaigns → (any campaign) → List ID

3. **Admin Account**
   - Email: `admin@bestemail.in` (or your choice)
   - Password: Create a strong one (16+ chars, mix of upper/lower/numbers/symbols)

### Save them somewhere safe (not in chat)

---

## 🌐 STEP 2: Update Vercel Environment Variables (3 mins)

**Link:** https://vercel.com/dashboard

1. Go to: **bestemail-platform project → Settings → Environment Variables**

2. For **Production** environment, add/update these:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = paste_your_anon_key
SUPABASE_SERVICE_ROLE_KEY = paste_your_service_role_key
SENDY_API_KEY = paste_your_sendy_api_key
SENDY_LIST_ID = paste_your_sendy_list_id
SESSION_SECRET = aBcD1eF2gH3iJ4kL5mN6oPqRsTuVwXyZ
NEXTAUTH_SECRET = xYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCd
ADMIN_EMAIL = admin@bestemail.in
ADMIN_PASSWORD = your_strong_password_here
DEFAULT_FROM_EMAIL = hello@bestemail.in
DEFAULT_FROM_NAME = Bestemail
ALLOW_LOCAL_DATA_FALLBACK = false
```

3. Click "Save" for each

4. Also add **same variables to Preview** environment (copy from Production)

---

## 🏠 STEP 3: Connect Domain to Vercel (2 mins)

**Link:** https://vercel.com/dashboard

1. Go to: **bestemail-platform → Settings → Domains**

2. Click "Add Domain"

3. Enter: `bestemail.in`

4. Enter: `www.bestemail.in` (optional but recommended)

5. Follow Vercel's DNS instructions (next step)

---

## 🔗 STEP 4: Update DNS (Wherever bestemail.in is Registered) (2 mins)

**Where:** Your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.)

1. Vercel will show you DNS records to add (usually `CNAME` or `ALIAS`)

2. Copy those exact records from Vercel

3. Paste into your registrar's DNS settings

4. Save and wait 5-15 minutes for DNS to propagate

**Common registrars:**
- **Namecheap**: Domain List → bestemail.in → DNS
- **GoDaddy**: My Domains → bestemail.in → DNS
- **Cloudflare**: DNS → Add Record
- **AWS Route53**: Hosted Zones → bestemail.in

---

## 🔄 STEP 5: Redeploy (1 min)

1. Go to: **Vercel → bestemail-platform → Deployments**

2. Find the latest deployment (should say "Ready")

3. Click the three dots `...` → **Redeploy**

4. Wait 2-3 minutes for deployment to finish

---

## ✅ STEP 6: Smoke Test (5 mins)

### Test 1: Visit the site
```
https://bestemail.in/login
```
- Should load without errors
- Should NOT be the WordPress site

### Test 2: Login
- Email: `admin@bestemail.in`
- Password: (your password from Step 2)
- Should land on `/dashboard`

### Test 3: Create a test campaign
1. Click "Campaigns" in sidebar
2. Click "New Campaign"
3. Choose a template
4. Write a subject line
5. Click "Preview"
6. Should show email preview

### Test 4: Import test contacts
1. Click "Contacts" → "Import"
2. Upload a small CSV with 2-3 emails
3. Should import without errors

### Test 5: Send a test email
1. Create a campaign
2. Click "Send"
3. Should send to test contacts
4. Should appear in Sendy dashboard

---

## 🟢 STEP 7: You're Live! 

**Congratulations!** Bestemail is now running on `https://bestemail.in`

### Next steps (this week):
1. Import your real email list
2. Create your first real campaign
3. Set up SPF/DKIM records (for better deliverability)
4. Connect payment gateway (Razorpay) if offering paid plans
5. Announce on LinkedIn/Twitter

---

## 📋 Quick Reference

| What | Where | Action |
|------|-------|--------|
| Add env vars | Vercel Settings → Environment Variables | Copy from Step 2 |
| Connect domain | Vercel Settings → Domains | Add bestemail.in |
| Update DNS | Your registrar | Follow Vercel's records |
| Redeploy | Vercel Deployments | Click "Redeploy" |
| Test login | bestemail.in/login | Use admin credentials |
| Test campaign | /dashboard/campaigns/new | Create & preview |

---

## ❌ Troubleshooting

### "Domain not found" or old WordPress site shows
- DNS hasn't propagated yet (wait 5-10 mins)
- Or DNS records were entered incorrectly (double-check in Vercel)

### "Login fails" or "Invalid credentials"
- Double-check ADMIN_EMAIL and ADMIN_PASSWORD in Vercel env
- Make sure they're set for **Production** (not just Preview)

### "Supabase error" or "Database connection failed"
- Check SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY are correct
- Confirm Supabase project exists and is active

### "Sendy emails not sending"
- Check SENDY_API_KEY and SENDY_LIST_ID are correct
- Confirm Sendy is accessible at https://my.bestemail.in
- Check Sendy list exists

### "CSS/styling looks broken"
- Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Or wait 1 minute and try again (deployment caching)

---

## 🎯 Time Estimate

- Steps 1-5: **15 minutes**
- Step 6 (smoke test): **5 minutes**
- **Total time to live: 20 minutes**

---

## 📞 Support

If you hit any issues:
1. Check the troubleshooting section above
2. Read the deployment logs in Vercel
3. Verify all environment variables are correct and spelled exactly
4. Wait 5 minutes for DNS propagation if domain issues

---

**You've got this. The platform is production-ready. Just fill in your secrets and deploy.** 🚀
