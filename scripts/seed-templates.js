#!/usr/bin/env node
/**
 * Seed 12 system templates into the templates table.
 *
 * Usage:
 *   DATABASE_URL=postgres://... node scripts/seed-templates.js
 *
 * Or if you have .env / .env.local with DATABASE_URL set:
 *   node -e "require('dotenv').config({path:'.env.local'})" -e "" && node scripts/seed-templates.js
 *
 * Requires: pg (already in project dependencies)
 */

const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function htmlTemplate(body, bgColor) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4">
<tr><td align="center" style="padding:40px 20px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%">
<tr><td style="background:${bgColor};padding:40px 30px;text-align:center;color:#ffffff">
${body.header}
</td></tr>
<tr><td style="padding:30px;color:#333333;font-size:16px;line-height:1.6">
${body.content}
</td></tr>
<tr><td style="padding:20px 30px 30px;text-align:center">
${body.cta || ''}
</td></tr>
<tr><td style="padding:20px 30px;background:#f8f8f8;text-align:center;font-size:12px;color:#999999">
<p style="margin:0">Sent by {{company_name}}</p>
<p style="margin:8px 0 0"><a href="{{unsubscribe_url}}" style="color:#999999">Unsubscribe</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

const templates = [
  // ─── Business ───
  {
    name: 'Welcome Email',
    category: 'Business',
    subcategory: 'Welcome',
    subject: 'Welcome to {{company_name}}!',
    preview_text: 'We are thrilled to have you on board',
    tags: ['welcome', 'onboarding', 'business'],
    industry_tags: ['general', 'technology', 'retail'],
    thumbnail_color: '#00B4D8',
    is_featured: true,
    html_body: htmlTemplate({
      header: '<h1 style="margin:0;font-size:28px">Welcome, {{first_name}}!</h1><p style="margin:12px 0 0;font-size:16px;opacity:0.9">We are excited to have you join us</p>',
      content: '<p>Hi {{first_name}},</p><p>Thank you for signing up with <strong>{{company_name}}</strong>. We are thrilled to have you on board!</p><p>Here is what you can do next:</p><ul><li>Complete your profile</li><li>Explore our features</li><li>Reach out if you need help</li></ul><p>We are here to help you succeed.</p>',
      cta: '<a href="{{dashboard_url}}" style="display:inline-block;background:#00B4D8;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px">Get Started</a>',
    }, '#00B4D8'),
  },
  {
    name: 'Thank You Email',
    category: 'Business',
    subcategory: 'Thank You',
    subject: 'Thank you for your purchase, {{first_name}}!',
    preview_text: 'Your order has been confirmed',
    tags: ['thank-you', 'purchase', 'transactional'],
    industry_tags: ['retail', 'general'],
    thumbnail_color: '#10b981',
    is_featured: false,
    html_body: htmlTemplate({
      header: '<h1 style="margin:0;font-size:28px">Thank You!</h1><p style="margin:12px 0 0;font-size:16px;opacity:0.9">We appreciate your business</p>',
      content: '<p>Hi {{first_name}},</p><p>Thank you for your recent purchase from <strong>{{company_name}}</strong>. Your order has been confirmed and is being processed.</p><p>If you have any questions about your order, feel free to reach out to our support team.</p><p>We hope you enjoy your purchase!</p>',
      cta: '<a href="{{order_url}}" style="display:inline-block;background:#10b981;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px">View Order</a>',
    }, '#10b981'),
  },
  {
    name: 'Re-engagement Email',
    category: 'Business',
    subcategory: 'Re-engagement',
    subject: 'We miss you, {{first_name}}!',
    preview_text: 'It has been a while — come back and see what is new',
    tags: ['re-engagement', 'winback', 'retention'],
    industry_tags: ['general', 'technology', 'retail'],
    thumbnail_color: '#8b5cf6',
    is_featured: true,
    html_body: htmlTemplate({
      header: '<h1 style="margin:0;font-size:28px">We Miss You!</h1><p style="margin:12px 0 0;font-size:16px;opacity:0.9">Come back and see what is new at {{company_name}}</p>',
      content: '<p>Hi {{first_name}},</p><p>It has been a while since we last saw you at <strong>{{company_name}}</strong>. We have been busy making things even better for you!</p><p>Here is what you have missed:</p><ul><li>New features and improvements</li><li>Exclusive content just for you</li><li>Special offers waiting in your account</li></ul><p>We would love to have you back!</p>',
      cta: '<a href="{{comeback_url}}" style="display:inline-block;background:#8b5cf6;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px">Come Back</a>',
    }, '#8b5cf6'),
  },
  {
    name: 'Product Launch',
    category: 'Business',
    subcategory: 'Product Launch',
    subject: 'Introducing something new from {{company_name}}',
    preview_text: 'Be the first to try our latest product',
    tags: ['product-launch', 'announcement', 'new'],
    industry_tags: ['technology', 'retail', 'general'],
    thumbnail_color: '#f59e0b',
    is_featured: true,
    html_body: htmlTemplate({
      header: '<h1 style="margin:0;font-size:28px">Something New!</h1><p style="margin:12px 0 0;font-size:16px;opacity:0.9">From {{company_name}}</p>',
      content: '<p>Hi {{first_name}},</p><p>We are excited to announce our latest creation at <strong>{{company_name}}</strong>!</p><p>After months of hard work, we are thrilled to share this with you. This is designed to make your experience even better.</p><p>Be among the first to try it out — we think you will love it!</p>',
      cta: '<a href="{{product_url}}" style="display:inline-block;background:#f59e0b;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px">Explore Now</a>',
    }, '#f59e0b'),
  },

  // ─── Indian Festivals ───
  {
    name: 'Diwali Greetings',
    category: 'Indian Festivals',
    subcategory: 'Diwali',
    subject: 'Happy Diwali from {{company_name}} \u{1FA94}',
    preview_text: 'Wishing you a sparkling Diwali filled with joy and prosperity',
    tags: ['diwali', 'festival', 'indian', 'greetings'],
    industry_tags: ['general', 'retail', 'restaurant', 'real-estate'],
    thumbnail_color: '#f59e0b',
    is_featured: true,
    html_body: htmlTemplate({
      header: '<div style="font-size:48px;margin-bottom:12px">\u{1FA94}\u2728\u{1FA94}</div><h1 style="margin:0;font-size:28px">Happy Diwali!</h1><p style="margin:12px 0 0;font-size:16px;opacity:0.9">From the {{company_name}} family</p>',
      content: '<p>Dear {{first_name}},</p><p>May this Diwali bring you endless joy, prosperity, and new beginnings!</p><p>On this auspicious occasion, the entire <strong>{{company_name}}</strong> team wishes you and your family a very Happy Diwali. May the festival of lights illuminate your life with happiness and success.</p><p>\u{1FA94} Wishing you a sparkling Diwali!</p>',
      cta: '<a href="{{offer_url}}" style="display:inline-block;background:#f59e0b;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px">View Diwali Offers</a>',
    }, '#f59e0b'),
  },
  {
    name: 'Holi Greetings',
    category: 'Indian Festivals',
    subcategory: 'Holi',
    subject: 'Happy Holi from {{company_name}} \uD83C\uDF08',
    preview_text: 'Let the colors of Holi fill your life with happiness',
    tags: ['holi', 'festival', 'indian', 'greetings'],
    industry_tags: ['general', 'retail', 'restaurant'],
    thumbnail_color: '#ec4899',
    is_featured: false,
    html_body: htmlTemplate({
      header: '<div style="font-size:48px;margin-bottom:12px">\uD83C\uDF08\uD83C\uDFA8\u2728</div><h1 style="margin:0;font-size:28px">Happy Holi!</h1><p style="margin:12px 0 0;font-size:16px;opacity:0.9">Splash some color into your day</p>',
      content: '<p>Hi {{first_name}},</p><p>Wishing you a vibrant and joyful Holi from all of us at <strong>{{company_name}}</strong>!</p><p>May the festival of colors bring love, laughter, and happiness to your life. Play safe, eat sweets, and have a wonderful celebration with your loved ones.</p><p>Happy Holi! \uD83C\uDFA8</p>',
      cta: '',
    }, '#ec4899'),
  },
  {
    name: 'Onam Greetings',
    category: 'Indian Festivals',
    subcategory: 'Onam',
    subject: 'Happy Onam from {{company_name}} \uD83C\uDF3E',
    preview_text: 'Wishing you a harvest of happiness and prosperity this Onam',
    tags: ['onam', 'festival', 'indian', 'kerala', 'greetings'],
    industry_tags: ['general', 'retail', 'restaurant', 'real-estate'],
    thumbnail_color: '#16a34a',
    is_featured: false,
    html_body: htmlTemplate({
      header: '<div style="font-size:48px;margin-bottom:12px">\uD83C\uDF3E\uD83C\uDF3B\uD83D\uDEF6</div><h1 style="margin:0;font-size:28px">Happy Onam!</h1><p style="margin:12px 0 0;font-size:16px;opacity:0.9">From the {{company_name}} family</p>',
      content: '<p>Dear {{first_name}},</p><p>On the joyous occasion of Onam, the entire team at <strong>{{company_name}}</strong> wishes you and your family a prosperous and happy celebration!</p><p>May this harvest festival bring abundance, togetherness, and joy to your home. Enjoy the Onasadya and the beautiful Pookalam!</p><p>Happy Onam! \uD83C\uDF3E</p>',
      cta: '',
    }, '#16a34a'),
  },
  {
    name: 'Eid ul-Fitr Greetings',
    category: 'Indian Festivals',
    subcategory: 'Eid',
    subject: 'Eid Mubarak from {{company_name}} \u2728',
    preview_text: 'Wishing you joy and blessings this Eid',
    tags: ['eid', 'festival', 'indian', 'greetings'],
    industry_tags: ['general', 'retail', 'restaurant'],
    thumbnail_color: '#0ea5e9',
    is_featured: false,
    html_body: htmlTemplate({
      header: '<div style="font-size:48px;margin-bottom:12px">\u2728\u262A\uFE0F\u2728</div><h1 style="margin:0;font-size:28px">Eid Mubarak!</h1><p style="margin:12px 0 0;font-size:16px;opacity:0.9">From {{company_name}}</p>',
      content: '<p>Dear {{first_name}},</p><p>On this blessed occasion of Eid ul-Fitr, the <strong>{{company_name}}</strong> team wishes you and your loved ones Eid Mubarak!</p><p>May this Eid bring you peace, happiness, and prosperity. May all your prayers be answered and your celebrations be filled with joy.</p><p>Eid Mubarak! \u2728</p>',
      cta: '',
    }, '#0ea5e9'),
  },

  // ─── International ───
  {
    name: 'New Year Greetings',
    category: 'International',
    subcategory: 'New Year',
    subject: 'Happy New Year from {{company_name}} \uD83C\uDF89',
    preview_text: 'Cheers to a fantastic new year ahead',
    tags: ['new-year', 'holiday', 'greetings'],
    industry_tags: ['general', 'technology', 'retail'],
    thumbnail_color: '#6366f1',
    is_featured: true,
    html_body: htmlTemplate({
      header: '<div style="font-size:48px;margin-bottom:12px">\uD83C\uDF89\uD83C\uDF8A\u2728</div><h1 style="margin:0;font-size:28px">Happy New Year!</h1><p style="margin:12px 0 0;font-size:16px;opacity:0.9">From all of us at {{company_name}}</p>',
      content: '<p>Hi {{first_name}},</p><p>Wishing you a wonderful New Year from the entire <strong>{{company_name}}</strong> team!</p><p>As we step into a brand new year, we want to thank you for being a part of our journey. Here is to new opportunities, fresh starts, and an amazing year ahead!</p><p>Cheers to a fantastic year! \uD83E\uDD42</p>',
      cta: '',
    }, '#6366f1'),
  },
  {
    name: 'Christmas Greetings',
    category: 'International',
    subcategory: 'Christmas',
    subject: 'Merry Christmas from {{company_name}} \uD83C\uDF84',
    preview_text: 'Wishing you a joyful Christmas season',
    tags: ['christmas', 'holiday', 'greetings'],
    industry_tags: ['general', 'retail', 'restaurant'],
    thumbnail_color: '#dc2626',
    is_featured: false,
    html_body: htmlTemplate({
      header: '<div style="font-size:48px;margin-bottom:12px">\uD83C\uDF84\u2B50\uD83C\uDF81</div><h1 style="margin:0;font-size:28px">Merry Christmas!</h1><p style="margin:12px 0 0;font-size:16px;opacity:0.9">Warmest wishes from {{company_name}}</p>',
      content: '<p>Hi {{first_name}},</p><p>Merry Christmas from the <strong>{{company_name}}</strong> family!</p><p>May this Christmas season fill your heart with warmth, your home with love, and your life with laughter. Thank you for being a wonderful part of our community.</p><p>Wishing you joy and peace this holiday season! \uD83C\uDF84</p>',
      cta: '',
    }, '#dc2626'),
  },
  {
    name: 'Mothers Day',
    category: 'International',
    subcategory: 'Mothers Day',
    subject: 'Happy Mothers Day from {{company_name}} \u2764\uFE0F',
    preview_text: 'Celebrate the amazing moms in your life',
    tags: ['mothers-day', 'holiday', 'greetings'],
    industry_tags: ['general', 'retail', 'restaurant'],
    thumbnail_color: '#f472b6',
    is_featured: false,
    html_body: htmlTemplate({
      header: '<div style="font-size:48px;margin-bottom:12px">\u2764\uFE0F\uD83C\uDF38\uD83D\uDC90</div><h1 style="margin:0;font-size:28px">Happy Mothers Day!</h1><p style="margin:12px 0 0;font-size:16px;opacity:0.9">From {{company_name}}</p>',
      content: '<p>Hi {{first_name}},</p><p>Happy Mothers Day from all of us at <strong>{{company_name}}</strong>!</p><p>Today we celebrate the incredible moms who make our world brighter every day. Whether you are a mom, have an amazing mom, or know someone who deserves to be celebrated — this day is for all of them.</p><p>Happy Mothers Day! \uD83C\uDF38</p>',
      cta: '<a href="{{gift_url}}" style="display:inline-block;background:#f472b6;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px">Shop Gifts</a>',
    }, '#f472b6'),
  },
  {
    name: 'Black Friday Sale',
    category: 'International',
    subcategory: 'Black Friday',
    subject: 'Black Friday Deals are LIVE at {{company_name}} \uD83D\uDD25',
    preview_text: 'Biggest sale of the year — do not miss out',
    tags: ['black-friday', 'sale', 'promo', 'discount'],
    industry_tags: ['retail', 'technology', 'general'],
    thumbnail_color: '#1a1a2e',
    is_featured: true,
    html_body: htmlTemplate({
      header: '<div style="font-size:48px;margin-bottom:12px">\uD83D\uDD25\uD83D\uDED2\uD83D\uDD25</div><h1 style="margin:0;font-size:32px">BLACK FRIDAY</h1><p style="margin:12px 0 0;font-size:18px;opacity:0.9">The biggest sale of the year is here!</p>',
      content: '<p>Hi {{first_name}},</p><p>Our Black Friday sale at <strong>{{company_name}}</strong> is officially LIVE!</p><p style="font-size:24px;font-weight:700;text-align:center;color:#dc2626;margin:20px 0">Up to 60% OFF</p><p>This is your chance to grab the best deals of the year. Do not wait — these offers are available for a limited time only!</p><ul><li>Free shipping on all orders</li><li>Exclusive bundles and combos</li><li>Early access for subscribers like you</li></ul>',
      cta: '<a href="{{sale_url}}" style="display:inline-block;background:#dc2626;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px">Shop the Sale</a>',
    }, '#1a1a2e'),
  },
];

async function seed() {
  console.log('Seeding 12 system templates...');

  for (const t of templates) {
    const result = await pool.query(
      `INSERT INTO templates (
        name, category, subcategory, subject, preview_text, html_body,
        tags, industry_tags, thumbnail_color, is_featured, is_system
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true)
      ON CONFLICT DO NOTHING
      RETURNING id, name`,
      [
        t.name,
        t.category,
        t.subcategory,
        t.subject,
        t.preview_text,
        t.html_body,
        JSON.stringify(t.tags),
        JSON.stringify(t.industry_tags),
        t.thumbnail_color,
        t.is_featured,
      ]
    );
    if (result.rows.length) {
      console.log(`  + ${result.rows[0].name}`);
    } else {
      console.log(`  ~ ${t.name} (already exists)`);
    }
  }

  console.log('Done! 12 system templates seeded.');
  await pool.end();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
