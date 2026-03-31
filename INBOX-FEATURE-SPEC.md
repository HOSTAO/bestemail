# Feature: Multi-Inbox Email Account Management

## What it does
Lets users connect their own Gmail, Yahoo, Outlook and other email accounts
to send campaigns FROM their personal/business email.

Traditional business owners want to send from ceo@gmail.com or
business@yahoo.com — not from a random sending service.

## User-facing flow

1. Go to Settings → Email Accounts (or "Sending Accounts")
2. Click "Add Email Account"
3. Choose provider:
   - Gmail (OAuth button - one click)
   - Outlook / Hotmail (OAuth button - one click)
   - Yahoo (SMTP manual config)
   - Other / Custom SMTP (manual config)
4. Authenticate / enter credentials
5. Account added — shown in list with:
   - Email address
   - Provider icon (Gmail/Outlook/Yahoo)
   - Status: Connected ✅ / Error ❌
   - Set as Default button
   - Remove button
6. When creating a campaign, select which account to send from

## Multiple Accounts
- Users can add multiple accounts (e.g., 3 Gmail, 1 Yahoo)
- Set one as default for sending
- Switch per-campaign

## Technical Implementation

### Gmail OAuth
- Use Google OAuth 2.0 with Gmail send scope
- Scope: https://www.googleapis.com/auth/gmail.send
- Store refresh_token in Supabase email_accounts table
- Send via Gmail API (not SMTP)
- Package: googleapis

### Outlook OAuth  
- Use Microsoft OAuth with mail.send scope
- Scope: https://graph.microsoft.com/Mail.Send
- Store refresh_token in Supabase
- Send via Microsoft Graph API

### Yahoo / Custom SMTP
- Manual SMTP configuration:
  - SMTP Host, Port, Username, Password
  - TLS/SSL toggle
- Test connection before saving
- Send via nodemailer

### Database table needed (add to Supabase):
```sql
CREATE TABLE IF NOT EXISTS email_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- gmail, outlook, yahoo, custom
  email VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  is_default BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'active', -- active, error, disconnected
  -- OAuth fields
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  -- SMTP fields (for manual config)
  smtp_host VARCHAR(255),
  smtp_port INTEGER,
  smtp_username VARCHAR(255),
  smtp_password TEXT, -- encrypted
  smtp_secure BOOLEAN DEFAULT true,
  -- Metadata
  last_used_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_email_accounts_user_id ON email_accounts(user_id);
```

### Files to create:
- src/app/dashboard/email-accounts/page.tsx — manage connected accounts
- src/app/api/email-accounts/route.ts — CRUD for accounts
- src/app/api/email-accounts/gmail/auth/route.ts — Gmail OAuth init
- src/app/api/email-accounts/gmail/callback/route.ts — Gmail OAuth callback
- src/app/api/email-accounts/outlook/auth/route.ts — Outlook OAuth init
- src/app/api/email-accounts/outlook/callback/route.ts — Outlook OAuth callback
- src/app/api/email-accounts/test/route.ts — test SMTP connection
- src/lib/email-sender.ts — unified send function (picks Gmail API vs Outlook API vs SMTP)

### Navigation
Add "Email Accounts" under Settings sidebar section
Label it: "Your Email Inboxes" for non-tech users

### Plain English copy:
- "Connect your Gmail to send emails" (not "Configure SMTP")
- "Use your own email address" (not "Sender identity")
- "Connected and working ✅" (not "Authenticated")
- "Something went wrong ❌ — reconnect" (not "Token expired")

## Priority
Build this AFTER the main 7-feature rebuild is done.
The agent working on the rebuild should read this file and implement it as Feature #8.
