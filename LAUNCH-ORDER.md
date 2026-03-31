# Launch Order

This is the shortest founder-friendly path to a safe first launch.

## Do these in order

### 1. Finish production settings
Open the production environment and set every required secret from `PRODUCTION-ENV-CHECKLIST.md`.

### 2. Open the dashboard and check health
Go to **Dashboard → Settings**. Do not continue until the core checks show ready.

### 3. Import a small contact list
Start with your own team or a tiny internal list. Do not begin with a full customer send.

### 4. Create one campaign
Use a simple internal subject line and send content only to yourself or a tiny internal test group first.

### 5. Verify the full email path
Confirm the email is delivered, renders correctly, and links work.

### 6. Verify forms only if forms matter for launch
If forms are part of the public launch, submit one real test entry and confirm it lands in storage. If forms are not part of launch, keep them secondary.

### 7. Only then widen access
After one clean live test, you can open the product more confidently. Keep automation, A/B testing, team, and broader integrations out of the core sales promise until they are fully verified.

## Founder version: what actually matters

If you only remember one sentence, remember this:

**Settings first, then contacts, then one real campaign test, then launch.**

## Avoid these launch mistakes

- Launching with placeholder Supabase or Sendy values
- Treating beta UI as finished backend capability
- Sending the first campaign to a full list instead of a controlled test group
- Leaving test/demo routes accessible in production
- Claiming launch-ready before one full end-to-end send succeeds
