# Sendy Integration Guide

## 🚀 Bestemail + Sendy Integration

Bestemail is built to work seamlessly with **Sendy** as its primary email sending infrastructure. This provides you with:
- **Cost-effective email delivery** - Pay only for what you send via Amazon SES
- **High deliverability** - Leverage Amazon's infrastructure
- **Complete control** - Self-hosted on your own server
- **White label ready** - No branding conflicts

## 📋 How It Works

### Architecture Overview
```
Bestemail Platform (Frontend)
       ↓
   API Layer
       ↓
   Sendy API (Backend)
       ↓
  Amazon SES (Delivery)
```

### Email Flow
1. **Campaigns** - Created in Bestemail, sent through Sendy
2. **Contacts** - Managed in Bestemail, synced to Sendy lists
3. **Analytics** - Tracked by both platforms
4. **Templates** - Designed in Bestemail, processed by Sendy

## 🔧 Configuration

### 1. Sendy Installation
First, install Sendy on your server:
- Requirements: PHP 7.4+, MySQL
- Download from: https://sendy.co
- Installation guide: https://sendy.co/installation

### 2. Environment Setup
Configure these in your `.env.local`:

```env
# Enable Sendy Integration
USE_SENDY=true

# Your Sendy Installation
SENDY_API_URL=https://sendy.yourdomain.com
SENDY_API_KEY=your_sendy_api_key_here
SENDY_LIST_ID=your_default_list_id
SENDY_BRAND_ID=1

# Fallback for transactional emails
EMAIL_SERVICE_ENDPOINT=https://api.sendgrid.com/v3/mail/send
EMAIL_SERVICE_API_KEY=your_sendgrid_key
```

### 3. API Key Setup
In Sendy:
1. Go to Settings → API
2. Generate an API key
3. Add to `.env.local` as `SENDY_API_KEY`

### 4. List Configuration
1. Create a list in Sendy for your contacts
2. Copy the List ID (found in list settings)
3. Add to `.env.local` as `SENDY_LIST_ID`

## 🔄 Features Integration

### Contact Management
- ✅ **Auto-sync**: New contacts added in Bestemail automatically sync to Sendy
- ✅ **Import**: Bulk imports sync to Sendy list
- ✅ **Unsubscribes**: Handled by Sendy, reflected in Bestemail
- ✅ **Custom fields**: Map between platforms

### Campaign Sending
- ✅ **Bulk campaigns**: Sent through Sendy's infrastructure
- ✅ **Segmentation**: Applied before sending to Sendy
- ✅ **Templates**: HTML prepared with tracking before Sendy
- ✅ **Scheduling**: Handled by Bestemail, executed by Sendy

### Analytics
- ✅ **Opens**: Tracked via pixel (both platforms)
- ✅ **Clicks**: Link tracking (both platforms)  
- ✅ **Bounces**: Sendy webhooks update Bestemail
- ✅ **Unsubscribes**: Sendy manages, syncs back

## 📊 Sendy List Management

### Segmentation Strategy
Since Sendy doesn't support dynamic segments, Bestemail handles this by:

1. **Master List**: All contacts in one Sendy list
2. **Tag-based**: Use custom fields for segmentation
3. **Pre-send Filter**: Bestemail filters contacts before campaign

### Custom Fields Mapping
```
Bestemail Field → Sendy Field
first_name      → Name
email          → Email  
city           → City (custom)
business_type  → Business (custom)
tags           → Tags (custom)
engagement     → Score (custom)
```

## 🚨 Important Considerations

### 1. Transactional Emails
Sendy is designed for bulk campaigns. For transactional emails:
- Use the fallback service (SendGrid/SES)
- Or create single-recipient Sendy campaigns

### 2. Rate Limiting
- Sendy respects Amazon SES sending limits
- Configure your SES limits properly
- Monitor sending reputation

### 3. Costs
- Sendy license: $69 one-time
- Amazon SES: $0.10 per 1,000 emails
- Much cheaper than traditional ESPs

### 4. Webhooks
Set up Sendy webhooks to sync:
- Unsubscribes → `https://bestemail.in/api/webhooks/sendy/unsubscribe`
- Bounces → `https://bestemail.in/api/webhooks/sendy/bounce`
- Complaints → `https://bestemail.in/api/webhooks/sendy/complaint`

## 🏷️ White Label Configuration

For white label clients:
1. Create separate Sendy brand
2. Configure brand settings
3. Map to Bestemail white label account
4. Use brand-specific lists

## 📈 Monitoring

### Health Checks
- Monitor Sendy cron jobs
- Check SES sending quota
- Verify list growth
- Track deliverability

### Performance
- Typical send speed: 10,000 emails/hour
- Depends on SES limits
- Can scale with multiple Sendy instances

## 🔍 Troubleshooting

### Common Issues

**1. Contacts not syncing**
- Check API key permissions
- Verify list ID is correct
- Check Sendy error logs

**2. Campaigns not sending**
- Verify Sendy crons are running
- Check SES is verified
- Ensure sufficient SES quota

**3. Analytics mismatch**
- Allow time for sync
- Check webhook configuration
- Verify tracking pixels

## 🎯 Best Practices

1. **List Hygiene**
   - Regular bounce cleaning
   - Re-engagement campaigns
   - Sunset policy for inactives

2. **Deliverability**
   - Warm up new domains
   - Monitor sender reputation
   - Use authentication (SPF/DKIM)

3. **Scaling**
   - Start with single Sendy instance
   - Add instances for white label
   - Use dedicated IPs at scale

## 🚀 Advanced Features

### Multi-Brand Setup
```php
// In Sendy config
$brands = [
  'bestemail' => ['id' => 1, 'domain' => 'bestemail.in'],
  'client1' => ['id' => 2, 'domain' => 'client1.com'],
  'client2' => ['id' => 3, 'domain' => 'client2.com'],
];
```

### API Extensions
Bestemail extends Sendy with:
- Dynamic segmentation
- Advanced scheduling
- A/B testing coordination
- Multi-channel (SMS via different provider)

## 📞 Support

- **Sendy Issues**: https://sendy.co/forum
- **Bestemail Issues**: support@bestemail.in
- **Integration Help**: Included in white label package

---

**Note**: This integration makes Bestemail a powerful, cost-effective alternative to expensive email platforms while maintaining full control over your infrastructure.