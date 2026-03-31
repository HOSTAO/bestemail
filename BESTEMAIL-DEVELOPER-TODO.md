# Bestemail Developer TODO

_Date:_ 2026-03-11

This is the implementation checklist for turning Bestemail into a serious product.

---

## 0. Product North Star

Bestemail should become:
- a ConvertKit-style email marketing platform
- powered by Sendy for low-cost delivery
- extended with Chatwoot for inbox/live chat
- packaged as a white-label SaaS for businesses and agencies

---

## 1. Immediate Fixes (Do First)

These are the highest-leverage cleanup tasks before major feature building.

### 1.1 Clean secrets and unsafe docs
- [ ] remove any real-looking passwords, API keys, and admin credentials from docs
- [ ] rotate exposed credentials if they were ever real
- [ ] move all examples to `.env.example` with placeholders only
- [ ] review README and setup docs for unsafe hardcoded values

### 1.2 Unify storage model
- [ ] stop mixing local JSON store and Supabase for production features
- [ ] decide canonical storage for forms, campaigns, contacts, settings
- [ ] migrate all production paths to Supabase-backed storage
- [ ] keep local JSON only for dev/demo if needed

### 1.3 Normalize domain language
- [ ] choose `subscribers` as the core entity instead of `contacts`
- [ ] refactor UI copy to use one consistent model
- [ ] map legacy `contacts` into new subscriber structure

### 1.4 Dashboard cleanup
- [ ] split demo-like dashboard tabs into proper route-based modules
- [ ] remove dead links and placeholder routes
- [ ] align dashboard nav with roadmap structure
- [ ] ensure each visible module has a real backend contract

---

## 2. Foundation Rebuild

### 2.1 Database expansion
Create the missing tables needed for real product growth.

- [ ] `subscribers`
- [ ] `tags`
- [ ] `subscriber_tags`
- [ ] `custom_fields`
- [ ] `subscriber_custom_field_values`
- [ ] `subscriber_events`
- [ ] `suppression_list`
- [ ] `broadcasts`
- [ ] `broadcast_variants`
- [ ] `broadcast_recipients`
- [ ] `sequences`
- [ ] `sequence_emails`
- [ ] `subscriber_sequences`
- [ ] `automations`
- [ ] `automation_nodes`
- [ ] `automation_edges`
- [ ] `automation_runs`
- [ ] `automation_run_steps`
- [ ] `form_submissions`
- [ ] `landing_pages`
- [ ] `lead_magnets`
- [ ] `integration_accounts`
- [ ] `sendy_sync_logs`
- [ ] `chat_contacts`
- [ ] `chat_conversations`
- [ ] `chat_messages`
- [ ] `subscriber_chat_links`

### 2.2 Data migration
- [ ] migrate existing contacts to subscriber model
- [ ] migrate campaign data cleanly
- [ ] preserve tags from contacts table
- [ ] backfill subscriber source where possible
- [ ] backfill created/updated timestamps consistently

### 2.3 Core service layer cleanup
- [ ] separate business logic from route handlers
- [ ] create service modules for subscribers, campaigns, sequences, automations, forms
- [ ] create typed models/interfaces for each domain
- [ ] remove duplicate auth/settings logic where possible

---

## 3. Make Sendy First-Class

Sendy should be the real sending backbone.

### 3.1 Connection and configuration
- [ ] build proper Sendy integration settings page
- [ ] support API URL, API key, brand ID, default list ID
- [ ] add real connection test and error handling
- [ ] show connected/disconnected health state

### 3.2 List sync
- [ ] fetch lists from Sendy
- [ ] create lists from Bestemail if needed
- [ ] map Bestemail segments/audiences to Sendy lists
- [ ] show list sync logs and last sync time

### 3.3 Campaign sending lifecycle
- [ ] improve draft → scheduled → sending → sent states
- [ ] persist Sendy campaign metadata/id
- [ ] support retry and failure handling
- [ ] support test send with clear UI feedback

### 3.4 Event reconciliation
- [ ] sync unsubscribes back into Bestemail
- [ ] sync bounces back into Bestemail
- [ ] sync complaints if supported
- [ ] maintain suppression state centrally

### 3.5 Future Sendy improvements
- [ ] support multi-list sending strategy
- [ ] support per-tenant Sendy configuration
- [ ] add Sendy webhook support if available
- [ ] add delivery diagnostics UI

---

## 4. Build Real Audience CRM

### 4.1 Subscribers
- [ ] subscriber list page
- [ ] subscriber detail page
- [ ] subscriber profile summary
- [ ] source attribution
- [ ] engagement status
- [ ] note field or internal notes

### 4.2 Tags and custom fields
- [ ] tag CRUD
- [ ] assign/unassign tags
- [ ] custom field definitions
- [ ] subscriber custom field editing
- [ ] bulk tag operations

### 4.3 Segments
- [ ] segment builder UI
- [ ] rules by tag
- [ ] rules by source
- [ ] rules by date
- [ ] rules by campaign engagement
- [ ] saved dynamic segments

### 4.4 Subscriber activity timeline
- [ ] subscriber created
- [ ] form submitted
- [ ] campaign received
- [ ] email opened
- [ ] email clicked
- [ ] tag added/removed
- [ ] sequence joined/completed
- [ ] chat conversation linked

---

## 5. Broadcasts Upgrade

### 5.1 Composer
- [ ] subject line
- [ ] preview text
- [ ] rich text / template editor
- [ ] test email
- [ ] mobile/desktop preview
- [ ] duplicate campaign

### 5.2 Audience targeting
- [ ] choose segment
- [ ] choose tag(s)
- [ ] estimate recipient count before send
- [ ] exclude suppression list

### 5.3 Sending options
- [ ] send now
- [ ] schedule send
- [ ] timezone-safe scheduling
- [ ] later: send window optimization

### 5.4 Analytics
- [ ] total recipients
- [ ] opens
- [ ] clicks
- [ ] CTR
- [ ] unsubscribes
- [ ] bounces
- [ ] top links

---

## 6. Sequences System

This is a major missing feature.

### 6.1 Sequence data model
- [ ] create sequence tables
- [ ] create sequence enrollment state
- [ ] define step delays and publish states

### 6.2 Sequence UI
- [ ] sequences list page
- [ ] sequence detail page
- [ ] email step editor
- [ ] reorder steps
- [ ] pause/resume sequence

### 6.3 Enrollment logic
- [ ] manual enroll subscriber
- [ ] enroll from form submit
- [ ] enroll from tag trigger
- [ ] enroll from Chatwoot actions later

### 6.4 Sequence processing
- [ ] background runner for due emails
- [ ] completion/exit logic
- [ ] per-step analytics

---

## 7. Forms and Landing Pages

### 7.1 Forms
- [ ] replace hardcoded demo forms with real DB-backed forms
- [ ] real create/edit/delete flow
- [ ] form field editor
- [ ] embed code generation
- [ ] hosted public form endpoint
- [ ] form submission capture
- [ ] success/redirect settings
- [ ] spam protection

### 7.2 Form automation hooks
- [ ] tag on submit
- [ ] add to sequence on submit
- [ ] source attribution on submit
- [ ] lead magnet delivery option

### 7.3 Landing pages
- [ ] create `landing_pages` model
- [ ] landing page editor
- [ ] slug and publish state
- [ ] mobile-friendly templates
- [ ] analytics per page

### 7.4 Suggested form/page extras
- [ ] popup trigger rules
- [ ] exit-intent forms
- [ ] countdown timer block
- [ ] testimonial blocks
- [ ] embedded video block
- [ ] A/B testing for forms/pages later

---

## 8. Automation Engine

Currently mostly placeholder — needs a real backend.

### 8.1 V1 automation triggers
- [ ] subscriber created
- [ ] form submitted
- [ ] tag added
- [ ] campaign clicked
- [ ] sequence completed

### 8.2 V1 automation actions
- [ ] add tag
- [ ] remove tag
- [ ] set custom field
- [ ] subscribe to sequence
- [ ] unsubscribe from sequence
- [ ] send internal notification

### 8.3 V1 automation conditions
- [ ] has tag
- [ ] field equals value
- [ ] source equals
- [ ] opened campaign
- [ ] clicked campaign

### 8.4 Infrastructure
- [ ] event queue
- [ ] workflow persistence
- [ ] run logs
- [ ] step-by-step debug view

### 8.5 Later automation suggestions
- [ ] visual drag-and-drop builder
- [ ] branching logic
- [ ] wait-until date/time
- [ ] webhook triggers
- [ ] goal completion logic
- [ ] re-entry rules

---

## 9. Chatwoot Integration

Completely new workstream.

### 9.1 Core connection
- [ ] connect Chatwoot workspace/inbox
- [ ] save account credentials securely
- [ ] verify connection health

### 9.2 Contact mapping
- [ ] create subscriber from chat lead
- [ ] match incoming chat by email/phone if possible
- [ ] link chat contact to subscriber profile

### 9.3 Inbox workflow
- [ ] dashboard Inbox module
- [ ] conversation list
- [ ] conversation details
- [ ] labels/tags sync
- [ ] internal notes support

### 9.4 Automation hooks from chat
- [ ] tag from conversation label
- [ ] manual add to sequence from chat
- [ ] trigger automation when conversation starts
- [ ] trigger automation when conversation resolved

### 9.5 Suggested Chatwoot extras
- [ ] lead scoring from chat activity
- [ ] chat transcript on subscriber profile
- [ ] support vs sales conversation type
- [ ] assign conversation owner
- [ ] SLA / response reporting later

---

## 10. White-Label SaaS Layer

### 10.1 Tenant model
- [ ] create proper tenant/account isolation
- [ ] tenant branding config
- [ ] tenant-level settings pages
- [ ] tenant user roles and permissions

### 10.2 Branding
- [ ] custom logo
- [ ] color palette
- [ ] email footer branding
- [ ] custom sender defaults
- [ ] branded login experience

### 10.3 Domain support
- [ ] custom subdomains
- [ ] custom domains
- [ ] branded tracking domain later
- [ ] branded form/landing page domains

### 10.4 Feature/plan controls
- [ ] plan-based feature flags
- [ ] campaign/subscriber limits
- [ ] team seat limits
- [ ] Chatwoot/automation access by plan

### 10.5 Suggested white-label extras
- [ ] reseller admin dashboard
- [ ] client workspace switcher
- [ ] invoice/billing export
- [ ] usage metering dashboard

---

## 11. Analytics and Reporting

### 11.1 Core analytics
- [ ] subscriber growth chart
- [ ] source breakdown
- [ ] broadcast performance
- [ ] sequence performance
- [ ] form conversions
- [ ] landing page conversions

### 11.2 Subscriber-level reporting
- [ ] engagement score
- [ ] last active date
- [ ] open/click history
- [ ] sequence history
- [ ] chat history summary

### 11.3 Suggested analytics extras
- [ ] cohort retention
- [ ] best send-time suggestions
- [ ] re-engagement audience auto-build
- [ ] deliverability health score
- [ ] monthly executive summary report

---

## 12. Extra Feature Suggestions Worth Adding

These are not mandatory for v1, but they can make Bestemail stronger.

### 12.1 Commerce / revenue features
- [ ] purchase event tracking
- [ ] customer vs lead segmentation
- [ ] post-purchase sequences
- [ ] revenue attribution by campaign
- [ ] Stripe/Gumroad/Lemon Squeezy hooks later

### 12.2 Content and templates
- [ ] template marketplace/gallery
- [ ] festival templates for India
- [ ] business-type-specific templates
- [ ] reusable content blocks
- [ ] saved brand snippets

### 12.3 Deliverability / ops features
- [ ] domain verification checklist
- [ ] SPF/DKIM/DMARC guidance UI
- [ ] sender reputation reminders
- [ ] bounce-risk alerts
- [ ] unhealthy list warnings

### 12.4 Collaboration features
- [ ] draft approval flow
- [ ] campaign comments
- [ ] internal notes on subscribers
- [ ] audit log
- [ ] task assignment for team members

### 12.5 AI features later
- [ ] subject line suggestions
- [ ] rewrite and shorten tools
- [ ] audience segment suggestions
- [ ] campaign improvement suggestions
- [ ] automated summary of campaign results

### 12.6 Local market opportunities
- [ ] WhatsApp capture-to-email workflows
- [ ] festival campaign packs
- [ ] bilingual email templates (English/Hindi first, more later)
- [ ] India-friendly SMB onboarding templates

---

## 13. Recommended Build Order

### Phase A — cleanup and safety
- [ ] secrets cleanup
- [ ] architecture cleanup
- [ ] storage unification
- [ ] subscriber model decision

### Phase B — strong core
- [ ] Sendy first-class integration
- [ ] subscriber CRM
- [ ] better broadcasts

### Phase C — true product depth
- [ ] sequences
- [ ] forms
- [ ] landing pages

### Phase D — differentiation
- [ ] automations
- [ ] Chatwoot integration
- [ ] white-label controls

### Phase E — premium polish
- [ ] analytics upgrades
- [ ] collaboration
- [ ] AI features
- [ ] deliverability tooling

---

## 14. Best Possible Positioning

If implemented well, Bestemail can be positioned as:

**A modern email marketing and customer communication platform with Sendy-powered low-cost delivery, ConvertKit-style automation, Chatwoot-powered conversations, and agency-ready white-label SaaS controls.**

That is much stronger than just "an email sender."
