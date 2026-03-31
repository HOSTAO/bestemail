# 🚀 QUICK COMMANDS - COPY & PASTE

## 1️⃣ TEST SECURITY FIX LOCALLY
```bash
cd /Users/rejimodiyil/.openclaw/workspace/bestemail-platform
npm run dev
# Open: http://localhost:3000/dashboard
# Should redirect to login!
```

## 2️⃣ BUILD FOR PRODUCTION
```bash
npm run build
npm run start
# Test again at localhost:3000
```

## 3️⃣ GENERATE ENCRYPTION KEY
```bash
echo "ENCRYPTION_KEY=$(openssl rand -hex 32)" >> .env.local
grep "ENCRYPTION_KEY" .env.local
# SAVE THIS KEY FOR VERCEL!
```

## 4️⃣ DEPLOY TO VERCEL
```bash
vercel --prod
# Get your live URL
```

## 5️⃣ TEST LIVE SECURITY
Open these URLs - ALL should redirect to login:
- https://bestemail-platform.vercel.app/dashboard
- https://bestemail-platform.vercel.app/dashboard/settings
- https://bestemail-platform.vercel.app/dashboard/campaigns/new

## 6️⃣ LOGIN CREDENTIALS
```
Email: reji@hostao.com
Password: Sherlymodiyil@007
```

## ⚠️ AFTER LOGIN - DO THIS!
1. Go to Settings
2. Add Sendy credentials
3. Test connection
4. Change password in auth.ts

## 🔧 IF SOMETHING GOES WRONG
```bash
# Clear everything and rebuild
rm -rf .next node_modules
npm install
npm run build

# Check logs
vercel logs bestemail-platform.vercel.app
```

---
**REMEMBER**: Dashboard should NEVER be accessible without login!