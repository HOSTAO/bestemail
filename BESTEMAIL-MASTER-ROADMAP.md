# Bestemail Master Roadmap

## Product Direction

Bestemail should become a modern email marketing and customer communication platform with four core layers:

1. **ConvertKit-style product experience**
2. **Sendy-powered email delivery infrastructure**
3. **Chatwoot-powered inbox and live chat**
4. **White-label SaaS controls for agencies and businesses**

In simple terms:

- **Bestemail = product + UX + automations + CRM + analytics**
- **Sendy = low-cost sending engine**
- **Chatwoot = conversations and support inbox**

---

## Core Goals

Bestemail must support:

- subscriber CRM
- tags and segments
- broadcasts and scheduled campaigns
- sequences and drip emails
- automations and triggers
- forms and landing pages
- lead magnets
- analytics and engagement tracking
- Sendy delivery integration
- Chatwoot contact and conversation integration
- white-label branding and tenant controls

---

## Main Product Modules

### 1. Audience CRM

Build the subscriber model as the center of the platform.

**Needs:**
- subscribers
- tags
- segments
- custom fields
- subscriber profile page
- engagement status
- source attribution
- subscriber activity timeline
- unsubscribe / bounce / complaint states
- imports and exports
- suppression list

**Subscriber statuses:**
- active
- unsubscribed
- bounced
- complained
- archived

**Subscriber sources:**
- manual
- import
- form
- landing page
- API
- Chatwoot
- Sendy sync

---

### 2. Broadcast Campaigns

This is the one-time send workflow.

**Needs:**
- draft campaigns
- subject + preview text
- target segment selection
- send now
- schedule send
- duplicate campaign
- test email
- A/B subject test later
- campaign analytics

**Campaign states:**
- draft
- scheduled
- sending
- sent
- paused
- archived

---

### 3. Sequences

This is the drip / autoresponder system.

**Needs:**
- sequence builder
- multiple emails in order
- delay controls between emails
- subscribe people into sequence
- pause / resume sequence
- remove subscriber from sequence
- per-email analytics
- enrollment source tracking

---

### 4. Automations

This is where Bestemail becomes more than a basic sender.

**Triggers:**
- form submitted
- tag added
- subscriber created
- custom field changed
- sequence completed
- broadcast clicked
- Chatwoot conversation started
- Chatwoot conversation labeled

**Actions:**
- add tag
- remove tag
- set field
- subscribe to sequence
- unsubscribe from sequence
- send internal notification
- send email
- create task/webhook event

**Conditions:**
- has tag
- in segment
- field matches value
- opened email
- clicked email
- has Chatwoot label

---

### 5. Forms and Landing Pages

These should drive audience growth.

**Forms:**
- embedded forms
- popup forms
- hosted forms
- thank-you message or redirect
- tag on submit
- add to sequence on submit
- double opt-in option
- spam protection
- UTM/source tracking

**Landing pages:**
- hosted page templates
- custom slug
- responsive design
- SEO title/description
- form block integration
- thank-you flow
- analytics per page

---

### 6. Lead Magnets

Useful for creator and business funnels.

**Needs:**
- file/asset upload
- gated signup flow
- automatic delivery email
- tag subscriber after download
- optional sequence enrollment

---

### 7. Inbox and Live Chat

Chatwoot should power the conversation layer.

**Needs:**
- website chat widget
- inbox access
- conversation view
- chat contact → subscriber mapping
- create subscriber from chat
- conversation labels → subscriber tags
- manual “add to sequence” from conversation
- support/sales note tracking

---

### 8. Analytics

Need both high-level and per-contact analytics.

**Overview analytics:**
- subscriber growth
- new subscribers by source
- campaign send performance
- sequence performance
- form conversions
- landing page conversions
- unsubscribes / bounces / complaints

**Subscriber analytics:**
- emails received
- opens
- clicks
- tags
- sequence memberships
- chat activity

---

### 9. White-Label Controls

This is critical for future agency use.

**Needs:**
- tenant branding
- logo and color settings
- custom domain / subdomain
- branded sender identities
- per-tenant feature flags
- plan limits
- team seats
- integration settings per tenant

---

## Integration Architecture

## Sendy Integration

Sendy should remain a core infrastructure component.

### Sendy should handle:
- email sending
- list sync / storage strategy
- unsubscribes
- bounces
- complaint handling where supported
- Amazon SES-backed delivery economy

### Bestemail should handle:
- product UX
- campaign creation
- sequence logic
- automation logic
- audience CRM
- analytics dashboards
- white-label controls

### Sendy integration features:
- connect Sendy account
- verify API connection
- fetch/create lists
- map Bestemail segments to Sendy lists
- send campaigns through Sendy
- sync unsubscribes/bounces back into Bestemail
- send test email
- show sync logs and delivery status

---

## Chatwoot Integration

Chatwoot should become the customer communication layer.

### Chatwoot should handle:
- website live chat widget
- inbox and conversation handling
- support / sales conversations

### Bestemail should add:
- map chat users to subscribers
- create subscriber from chat lead
- apply tags from conversation labels
- trigger automations from chat events
- show linked conversation history on subscriber profile

### Chatwoot integration features:
- connect Chatwoot workspace/inbox
- embed widget on hosted pages or customer sites
- conversation → subscriber matching
- manual lead conversion
- label sync to tags
- sequence enrollment from chat

---

## Recommended Sidebar / Navigation

- Dashboard
- Audience
  - Subscribers
  - Segments
  - Tags
  - Imports
- Campaigns
  - Broadcasts
  - Templates
  - A/B Tests
- Automations
  - Workflows
  - Sequences
- Growth
  - Forms
  - Landing Pages
  - Lead Magnets
- Inbox
  - Conversations
  - Live Chat
- Analytics
  - Overview
  - Campaigns
  - Sequences
  - Forms
- Integrations
  - Sendy
  - Chatwoot
  - SES
  - Webhooks
- Settings
  - Branding
  - Domains
  - Team
  - Billing
  - API Keys

---

## Database Plan

### Core account tables
- users
- teams
- team_members
- tenants

### Audience tables
- subscribers
- tags
- subscriber_tags
- custom_fields
- subscriber_custom_field_values
- segments
- segment_rules
- subscriber_events
- suppression_list

### Campaign tables
- broadcasts
- broadcast_variants
- broadcast_recipients
- campaign_templates

### Sequence tables
- sequences
- sequence_emails
- subscriber_sequences
- sequence_email_events

### Automation tables
- automations
- automation_nodes
- automation_edges
- automation_runs
- automation_run_steps

### Growth tables
- forms
- form_fields
- form_submissions
- landing_pages
- lead_magnets

### Chat / inbox tables
- chat_contacts
- chat_conversations
- chat_messages
- chat_labels
- subscriber_chat_links

### Integration tables
- integration_accounts
- sendy_lists
- sendy_sync_logs
- chatwoot_inboxes
- webhook_logs

### Analytics tables
- email_events
- page_views
- form_analytics_daily
- campaign_analytics_daily

---

## API Route Plan

### Audience
- `/api/subscribers`
- `/api/subscribers/import`
- `/api/subscribers/:id`
- `/api/tags`
- `/api/segments`

### Campaigns
- `/api/broadcasts`
- `/api/broadcasts/:id/send`
- `/api/broadcasts/:id/test`
- `/api/templates`

### Sequences
- `/api/sequences`
- `/api/sequences/:id`
- `/api/sequences/:id/enroll`

### Automations
- `/api/automations`
- `/api/automations/:id/run`
- `/api/automation-events`

### Forms / pages
- `/api/forms`
- `/api/forms/:id/submit`
- `/api/landing-pages`

### Sendy integration
- `/api/integrations/sendy/connect`
- `/api/integrations/sendy/test`
- `/api/integrations/sendy/sync`

### Chatwoot integration
- `/api/integrations/chatwoot/connect`
- `/api/integrations/chatwoot/webhook`

### Analytics
- `/api/analytics/overview`
- `/api/analytics/campaigns`
- `/api/analytics/forms`

---

## Phased Build Plan

## Phase 1 — Foundation and stability

**Goal:** make the existing app production-safe and structurally ready.

**Tasks:**
- fix Supabase environment consistency
- verify production auth fully works
- clean up contact/subscriber model
- stabilize current campaigns/settings flow
- review existing Sendy integration code and remove weak placeholders

**Deliverable:**
A stable production base with one clear subscriber model and reliable settings/auth.

---

## Phase 2 — Make Sendy first-class

**Goal:** turn Sendy into the real sending backbone.

**Tasks:**
- Sendy connection manager
- Sendy API connection test page
- list fetch/create/mapping
- campaign send pipeline through Sendy
- unsubscribe/bounce sync
- test send flow
- sync logs and status UI

**Deliverable:**
Bestemail can reliably send and sync through Sendy.

---

## Phase 3 — Audience CRM upgrade

**Goal:** make subscribers the core entity.

**Tasks:**
- subscriber profiles
- tags
- custom fields
- dynamic segments
- activity timeline
- source tracking
- suppression list
- import/export improvements

**Deliverable:**
A usable audience CRM instead of just a contact list.

---

## Phase 4 — ConvertKit-style core features

**Goal:** make the product feel like a real email marketing platform.

**Tasks:**
- broadcast polish
- scheduling
- preview text
- duplicate campaign
- test email
- sequence builder
- sequence enrollment flow
- per-sequence email stats

**Deliverable:**
Bestemail supports one-off campaigns and drip sequences well.

---

## Phase 5 — Growth system

**Goal:** let users grow lists inside Bestemail.

**Tasks:**
- embedded forms
- popup forms
- hosted forms
- landing pages
- lead magnets
- thank-you flows
- UTM/source capture

**Deliverable:**
Bestemail can capture leads and feed them into lists and sequences.

---

## Phase 6 — Automation engine

**Goal:** connect user actions and subscriber behavior into workflows.

**Tasks:**
- workflow schema
- trigger/action engine
- conditions
- wait/delay nodes
- automation run logs
- debug view
- event processing

**Deliverable:**
A functional automation builder with subscriber and campaign triggers.

---

## Phase 7 — Chatwoot integration

**Goal:** add live conversation and support workflows.

**Tasks:**
- Chatwoot connection settings
- widget integration
- inbox entry point in dashboard
- chat contact → subscriber mapping
- label → tag sync
- add-to-sequence from chat
- chat-triggered automations

**Deliverable:**
Bestemail supports both email marketing and real-time customer communication.

---

## Phase 8 — White-label scale

**Goal:** make the platform agency-ready and multi-tenant.

**Tasks:**
- tenant branding
- custom domains/subdomains
- sender identity branding
- plan limits
- feature flags
- tenant-level Sendy config
- tenant-level Chatwoot config
- team/seat management

**Deliverable:**
A white-label SaaS version of Bestemail suitable for client resale.

---

## MVP Definition

Bestemail MVP should include:

- subscriber CRM
- tags and segments
- Sendy-powered broadcasts
- test send + scheduled send
- sequences
- forms
- landing pages
- automation v1
- Chatwoot connection + contact sync
- analytics basics

If those are working, Bestemail becomes a serious product instead of just a deployed UI.

---

## Immediate Developer Task List

### Now
- audit existing schema and pages against this roadmap
- identify what already exists vs placeholder UI
- normalize `contacts` vs `subscribers`
- confirm Sendy integration points
- confirm auth/data flow in production

### Next
- build Sendy settings + sync logs
- implement subscriber/tag/segment tables
- build subscriber profile page
- improve campaign send flow
- add sequence schema and UI

### After that
- forms + landing pages
- automations
- Chatwoot integration
- white-label controls

---

## Final Positioning

Bestemail should be positioned as:

**A modern email marketing + customer messaging platform with low-cost Sendy delivery, ConvertKit-style workflows, Chatwoot-powered conversations, and white-label SaaS controls.**

That combination is stronger than building a plain newsletter tool.
