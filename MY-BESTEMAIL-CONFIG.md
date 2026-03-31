# ✅ Your Bestemail + Sendy Configuration

## 🎯 Your Setup

- **Bestemail UI**: bestemail.in (This platform)
- **Sendy Backend**: my.bestemail.in (Already running!)
- **Email Delivery**: Amazon SES (via Sendy)

## 🔧 Configuration File

Create `.env.local` with these exact settings:

```env
# ===================================
# BESTEMAIL + YOUR SENDY AT my.bestemail.in
# ===================================

# Your Supabase (for Bestemail data)
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Bestemail URLs
NEXT_PUBLIC_APP_URL=https://bestemail.in
NEXTAUTH_URL=https://bestemail.in
NEXTAUTH_SECRET=generate_a_random_32_char_string_here

# YOUR SENDY INSTALLATION
# =======================
USE_SENDY=true
NEXT_PUBLIC_USE_SENDY=true
SENDY_API_URL=https://my.bestemail.in
SENDY_API_KEY=<GET_FROM_SENDY_SETTINGS>
SENDY_LIST_ID=<GET_FROM_YOUR_LIST>
SENDY_BRAND_ID=1

# Email Settings (must match Sendy)
DEFAULT_FROM_EMAIL=hello@bestemail.in
DEFAULT_FROM_NAME=Bestemail

# Optional Features
ENABLE_WHITE_LABEL=true
WHITE_LABEL_DOMAIN=bestemail.in
```

## 📝 Where to Get Sendy Values

### 1. Login to my.bestemail.in

### 2. Get API Key:
```
Settings → API → Your API Key
```

### 3. Get List ID:
```
View All Lists → Click your main list → ID is in the URL
Example: https://my.bestemail.in/subscribers?i=1&l=ABC123
List ID = ABC123
```

### 4. Brand ID:
```
Usually "1" for main brand
Check: Brands section in Sendy
```

## 🚀 Quick Test

Once configured, test the connection:

```bash
# Start development server
npm run dev

# Visit http://localhost:3000/dashboard
# You should see "Sendy Connected" with subscriber count
```

## 📊 How It Works

```
1. Marketing team uses → bestemail.in
2. Creates beautiful campaigns → Saved in Supabase
3. Hits "Send" → API call to my.bestemail.in
4. Sendy processes → Sends via Amazon SES
5. Analytics tracked → Both platforms
```

## 💡 Pro Tips

### For Best Performance:
1. **Ensure Sendy crons are running** on my.bestemail.in
2. **Monitor SES quota** in AWS Console
3. **Check bounce rates** regularly in Sendy
4. **Keep lists clean** - remove hard bounces

### White Label Clients:
1. Create new Brand in Sendy for each client
2. Map Brand ID in Bestemail
3. Client uses: clientname.bestemail.in
4. Emails sent from client's domain

## 🎯 Next Steps

1. ✅ Copy `.env.local.example` to `.env.local`
2. ✅ Fill in your Sendy credentials
3. ✅ Run `npm install`
4. ✅ Run `npm run build`
5. ✅ Deploy to Vercel
6. ✅ Start sending emails for 90% less!

---

**Your Stack:**
- Frontend: Bestemail at bestemail.in
- Backend: Sendy at my.bestemail.in  
- Delivery: Amazon SES
- Cost: ~$0.10 per 1,000 emails 🎉