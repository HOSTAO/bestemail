# Bestemail Launch Smoke SOP — 20 Minute Pass

Purpose: verify the few launch-critical flows without pretending the platform is fully ready.

## Success condition
You finish this pass with a simple YES/NO status for each launch blocker:
- Auth works
- Settings + Sendy connection works
- Public form works
- Campaign send path works

## Before you start
Have these ready:
- Real `NEXT_PUBLIC_SUPABASE_URL`
- Real `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Strong `SESSION_SECRET`
- Real `SENDY_API_KEY`
- Real `SENDY_LIST_ID`
- Live app URL

If any of those are missing, mark the blocked item and stop there.

---

## 1) Auth smoke test (3 minutes)
1. Open the live app.
2. Log in with a real test account.
3. Confirm dashboard loads.
4. Log out.
5. Log back in.

Pass if:
- login works
- dashboard opens
- logout works
- second login also works

Fail if:
- redirect loop
- blank dashboard
- session dies after refresh

---

## 2) Settings + Sendy connection test (4 minutes)
1. Go to Dashboard → Settings.
2. Enter real Sendy API URL, API key, and list ID.
3. Click **Test Connection**.
4. Save settings.
5. Refresh page and confirm values persist if expected.

Pass if:
- connection test succeeds
- settings save without error

Fail if:
- validation error with real values
- settings do not persist
- Sendy test fails

---

## 3) Public form test (5 minutes)
1. Open one real public form URL.
2. Submit with a fresh test email.
3. Confirm success state/message.
4. Check if the contact appears in dashboard or Sendy-linked flow.

Pass if:
- form page loads
- valid submission succeeds
- contact is recorded

Fail if:
- 500 error
- success message but no contact saved
- invalid routing after submit

---

## 4) Campaign send test (5 minutes)
1. Create one plain test campaign.
2. Send to your own test address or a tiny internal segment.
3. Confirm campaign status updates correctly.
4. Confirm the email arrives.
5. Open the email and click one link.

Pass if:
- campaign can be created
- send completes or queues correctly
- email arrives

Fail if:
- send never starts
- Sendy rejects request
- email not delivered

---

## 5) Final decision (2 minutes)
Use this exact summary format:

- Auth: PASS / FAIL
- Sendy Settings Test: PASS / FAIL
- Public Form: PASS / FAIL
- Campaign Send: PASS / FAIL
- Launch today: YES / NO
- If NO, blocker: <one line>

## Launch rule
Do **not** call it launch-ready unless all 4 tests pass with real credentials in the live environment.
