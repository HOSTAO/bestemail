export interface LibraryTemplate {
  id: string;
  name: string;
  category: 'Welcome' | 'Festival' | 'Business' | 'Newsletter';
  subject: string;
  previewText: string;
  thumbnailColor: string;
  thumbnailEmoji: string;
  htmlBody: string;
}

export const templateLibrary: LibraryTemplate[] = [
  // ── WELCOME (3) ────────────────────────────────────────────────
  {
    id: 'welcome-new-signup',
    name: 'New Signup Welcome',
    category: 'Welcome',
    subject: 'Welcome to {{company_name}}! 🎉 Here\'s how to get started',
    previewText: 'We\'re excited to have you with us.',
    thumbnailColor: '#4F46E5',
    thumbnailEmoji: '🎉',
    htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <tr><td style="background:linear-gradient(135deg,#4F46E5,#7C3AED);padding:50px 40px;text-align:center;">
    <div style="font-size:56px;margin-bottom:16px;">🎉</div>
    <h1 style="color:#ffffff;font-size:32px;margin:0 0 12px;font-weight:700;">Welcome to {{company_name}}!</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:18px;margin:0;">We're thrilled to have you on board.</p>
  </td></tr>
  <tr><td style="padding:40px;">
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 20px;">Hi <strong>{{first_name}}</strong>,</p>
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 28px;">Thank you for signing up with <strong>{{company_name}}</strong>. Your account is now active and ready to use. Here's what you can do next:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td style="padding:16px;background:#F3F4F6;border-radius:12px;margin-bottom:12px;vertical-align:top;">
          <p style="margin:0;font-size:24px;">✅</p>
          <p style="margin:8px 0 4px;font-weight:600;color:#111827;font-size:15px;">Complete Your Profile</p>
          <p style="margin:0;color:#6B7280;font-size:14px;">Add your business details to personalise your experience.</p>
        </td>
      </tr>
      <tr><td style="height:10px;"></td></tr>
      <tr>
        <td style="padding:16px;background:#F3F4F6;border-radius:12px;vertical-align:top;">
          <p style="margin:0;font-size:24px;">📧</p>
          <p style="margin:8px 0 4px;font-weight:600;color:#111827;font-size:15px;">Send Your First Email</p>
          <p style="margin:0;color:#6B7280;font-size:14px;">Use our ready-made templates to launch your first campaign.</p>
        </td>
      </tr>
    </table>
    <div style="text-align:center;">
      <a href="{{cta_link}}" style="display:inline-block;background:#4F46E5;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 40px;border-radius:50px;">Get Started Now →</a>
    </div>
  </td></tr>
  <tr><td style="background:#F9FAFB;padding:28px 40px;text-align:center;border-top:1px solid #E5E7EB;">
    <p style="color:#9CA3AF;font-size:13px;margin:0;">© {{year}} {{company_name}} · <a href="{{unsubscribe_link}}" style="color:#9CA3AF;">Unsubscribe</a></p>
  </td></tr>
</table>
</td></tr></table>
</body>
</html>`,
  },

  {
    id: 'welcome-free-trial',
    name: 'Free Trial Start',
    category: 'Welcome',
    subject: 'Your 14-day free trial has started – unlock everything 🚀',
    previewText: 'Make the most of your trial with these quick tips.',
    thumbnailColor: '#059669',
    thumbnailEmoji: '🚀',
    htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <tr><td style="background:linear-gradient(135deg,#059669,#10B981);padding:50px 40px;text-align:center;">
    <div style="font-size:56px;margin-bottom:16px;">🚀</div>
    <h1 style="color:#ffffff;font-size:30px;margin:0 0 12px;font-weight:700;">Your Free Trial is Live!</h1>
    <p style="color:rgba(255,255,255,0.9);font-size:16px;margin:0;">14 days · Full access · No credit card needed</p>
  </td></tr>
  <tr><td style="padding:40px;">
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 20px;">Hi <strong>{{first_name}}</strong>,</p>
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 28px;">Your free trial of <strong>{{product_name}}</strong> starts today. You have <strong>14 days</strong> of unrestricted access. Here's how to get the most out of it:</p>
    <table width="100%" cellpadding="12" cellspacing="0" style="border:1.5px solid #D1FAE5;border-radius:12px;margin-bottom:32px;">
      <tr style="background:#ECFDF5;"><td style="border-radius:10px 10px 0 0;padding:14px 20px;">
        <p style="margin:0;font-size:15px;font-weight:600;color:#065F46;">📌 Day 1–3: Setup &amp; onboarding</p>
        <p style="margin:4px 0 0;font-size:13px;color:#374151;">Import contacts and configure your sender profile.</p>
      </td></tr>
      <tr><td style="padding:14px 20px;border-top:1px solid #D1FAE5;">
        <p style="margin:0;font-size:15px;font-weight:600;color:#065F46;">📌 Day 4–7: First campaign</p>
        <p style="margin:4px 0 0;font-size:13px;color:#374151;">Send your first email campaign and review analytics.</p>
      </td></tr>
      <tr><td style="padding:14px 20px;border-top:1px solid #D1FAE5;border-radius:0 0 10px 10px;">
        <p style="margin:0;font-size:15px;font-weight:600;color:#065F46;">📌 Day 8–14: Automate &amp; grow</p>
        <p style="margin:4px 0 0;font-size:13px;color:#374151;">Set up automation workflows and segment your audience.</p>
      </td></tr>
    </table>
    <div style="text-align:center;">
      <a href="{{dashboard_link}}" style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 40px;border-radius:50px;">Open Your Dashboard →</a>
    </div>
  </td></tr>
  <tr><td style="background:#F9FAFB;padding:28px 40px;text-align:center;border-top:1px solid #E5E7EB;">
    <p style="color:#9CA3AF;font-size:13px;margin:0;">Questions? Reply to this email and we'll help you out.</p>
    <p style="color:#9CA3AF;font-size:13px;margin:8px 0 0;">© {{year}} {{company_name}} · <a href="{{unsubscribe_link}}" style="color:#9CA3AF;">Unsubscribe</a></p>
  </td></tr>
</table>
</td></tr></table>
</body>
</html>`,
  },

  {
    id: 'welcome-onboarding',
    name: 'Onboarding Checklist',
    category: 'Welcome',
    subject: 'Complete your setup in 5 minutes – {{first_name}} 🛠️',
    previewText: 'A quick checklist to get you up and running fast.',
    thumbnailColor: '#0EA5E9',
    thumbnailEmoji: '🛠️',
    htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <tr><td style="background:linear-gradient(135deg,#0EA5E9,#0284C7);padding:40px;text-align:center;">
    <div style="font-size:48px;margin-bottom:12px;">🛠️</div>
    <h1 style="color:#ffffff;font-size:28px;margin:0;font-weight:700;">Let's Get You Set Up!</h1>
  </td></tr>
  <tr><td style="padding:40px;">
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 28px;">Hi <strong>{{first_name}}</strong> 👋 — here's a quick checklist to get your account fully ready in under 5 minutes.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td width="36" valign="top" style="padding-top:2px;"><div style="width:28px;height:28px;background:#DBEAFE;border-radius:50%;text-align:center;line-height:28px;font-size:14px;font-weight:700;color:#1D4ED8;">1</div></td>
        <td style="padding:0 0 20px 14px;">
          <p style="margin:0 0 4px;font-weight:600;color:#111827;font-size:15px;">Verify Your Email Address</p>
          <p style="margin:0;color:#6B7280;font-size:14px;">Check your inbox and click the verification link we sent.</p>
        </td>
      </tr>
      <tr>
        <td width="36" valign="top" style="padding-top:2px;"><div style="width:28px;height:28px;background:#DBEAFE;border-radius:50%;text-align:center;line-height:28px;font-size:14px;font-weight:700;color:#1D4ED8;">2</div></td>
        <td style="padding:0 0 20px 14px;">
          <p style="margin:0 0 4px;font-weight:600;color:#111827;font-size:15px;">Add Your Business Details</p>
          <p style="margin:0;color:#6B7280;font-size:14px;">Set your business name, logo, and address for professional emails.</p>
        </td>
      </tr>
      <tr>
        <td width="36" valign="top" style="padding-top:2px;"><div style="width:28px;height:28px;background:#DBEAFE;border-radius:50%;text-align:center;line-height:28px;font-size:14px;font-weight:700;color:#1D4ED8;">3</div></td>
        <td style="padding:0 0 20px 14px;">
          <p style="margin:0 0 4px;font-weight:600;color:#111827;font-size:15px;">Import Your Contacts</p>
          <p style="margin:0;color:#6B7280;font-size:14px;">Upload a CSV or connect your existing CRM to import subscribers.</p>
        </td>
      </tr>
      <tr>
        <td width="36" valign="top" style="padding-top:2px;"><div style="width:28px;height:28px;background:#DBEAFE;border-radius:50%;text-align:center;line-height:28px;font-size:14px;font-weight:700;color:#1D4ED8;">4</div></td>
        <td style="padding:0 0 0 14px;">
          <p style="margin:0 0 4px;font-weight:600;color:#111827;font-size:15px;">Send Your First Campaign</p>
          <p style="margin:0;color:#6B7280;font-size:14px;">Pick a template and send your first email to your audience.</p>
        </td>
      </tr>
    </table>
    <div style="text-align:center;">
      <a href="{{setup_link}}" style="display:inline-block;background:#0EA5E9;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 40px;border-radius:50px;">Start Setup →</a>
    </div>
  </td></tr>
  <tr><td style="background:#F9FAFB;padding:24px 40px;text-align:center;border-top:1px solid #E5E7EB;">
    <p style="color:#9CA3AF;font-size:13px;margin:0;">© {{year}} {{company_name}} · <a href="{{unsubscribe_link}}" style="color:#9CA3AF;">Unsubscribe</a></p>
  </td></tr>
</table>
</td></tr></table>
</body>
</html>`,
  },

  // ── FESTIVAL (3) ────────────────────────────────────────────────
  {
    id: 'festival-diwali',
    name: 'Diwali Special Offer',
    category: 'Festival',
    subject: '🪔 Diwali Dhamaka! {{discount}}% off – Limited Time',
    previewText: 'Celebrate the festival of lights with exclusive savings.',
    thumbnailColor: '#D97706',
    thumbnailEmoji: '🪔',
    htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#1C0A00;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#1C0A00;border-radius:16px;overflow:hidden;border:2px solid #D97706;">
  <tr><td style="padding:50px 40px;text-align:center;background:linear-gradient(180deg,#451A03,#1C0A00);">
    <div style="font-size:64px;margin-bottom:8px;">🪔</div>
    <div style="font-size:32px;margin-bottom:4px;">🎆 🎇 🎆</div>
    <h1 style="color:#FCD34D;font-size:36px;margin:16px 0 8px;font-weight:800;text-shadow:0 0 20px rgba(251,191,36,0.5);">शुभ दीपावली</h1>
    <p style="color:#FDE68A;font-size:20px;margin:0;">Happy Diwali from {{company_name}}!</p>
  </td></tr>
  <tr><td style="padding:40px;background:#ffffff;">
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 20px;">Dear <strong>{{first_name}}</strong>,</p>
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 28px;">May this Diwali bring light, joy, and prosperity to you and your family! To celebrate this auspicious occasion, we're offering our biggest sale of the year exclusively for you.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr><td style="background:linear-gradient(135deg,#FEF3C7,#FFFBEB);border:2px solid #D97706;border-radius:16px;padding:32px;text-align:center;">
        <p style="color:#92400E;font-size:16px;font-weight:600;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Diwali Exclusive</p>
        <p style="color:#D97706;font-size:60px;font-weight:900;margin:0 0 8px;line-height:1;">{{discount}}% OFF</p>
        <p style="color:#78350F;font-size:15px;margin:0 0 20px;">on all orders above ₹{{min_order}}</p>
        <p style="color:#6B7280;font-size:14px;margin:0 0 8px;">Use code at checkout:</p>
        <div style="display:inline-block;background:#D97706;color:#ffffff;font-size:22px;font-weight:800;padding:12px 28px;border-radius:8px;letter-spacing:3px;">{{coupon_code}}</div>
      </td></tr>
    </table>
    <p style="color:#9CA3AF;font-size:13px;text-align:center;margin:0 0 28px;">⏰ Offer valid till {{expiry_date}} · While stocks last</p>
    <div style="text-align:center;">
      <a href="{{shop_link}}" style="display:inline-block;background:linear-gradient(135deg,#D97706,#B45309);color:#ffffff;text-decoration:none;font-size:17px;font-weight:700;padding:18px 48px;border-radius:50px;box-shadow:0 4px 15px rgba(217,119,6,0.4);">Shop the Diwali Sale 🛍️</a>
    </div>
  </td></tr>
  <tr><td style="background:#1C0A00;padding:24px 40px;text-align:center;">
    <p style="color:#FDE68A;font-size:14px;margin:0 0 8px;">🪔 🎆 From all of us at {{company_name}} 🎆 🪔</p>
    <p style="color:#78350F;font-size:12px;margin:0;"><a href="{{unsubscribe_link}}" style="color:#78350F;">Unsubscribe</a></p>
  </td></tr>
</table>
</td></tr></table>
</body>
</html>`,
  },

  {
    id: 'festival-new-year',
    name: 'New Year Greetings',
    category: 'Festival',
    subject: '🎊 Happy New Year {{year}}! A special gift for you inside',
    previewText: 'Wishing you a prosperous new year ahead.',
    thumbnailColor: '#7C3AED',
    thumbnailEmoji: '🎊',
    htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0F172A;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#0F172A;border-radius:16px;overflow:hidden;">
  <tr><td style="padding:60px 40px;text-align:center;background:linear-gradient(180deg,#1E1B4B,#0F172A);">
    <div style="font-size:56px;margin-bottom:12px;">🎊🎉🥂</div>
    <h1 style="color:#ffffff;font-size:48px;font-weight:900;margin:0;background:linear-gradient(135deg,#818CF8,#C084FC,#F472B6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">{{year}}</h1>
    <p style="color:#C4B5FD;font-size:22px;margin:12px 0 0;font-weight:600;">Happy New Year!</p>
  </td></tr>
  <tr><td style="padding:40px;background:#ffffff;">
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 20px;">Dear <strong>{{first_name}}</strong>,</p>
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 28px;">As we step into <strong>{{year}}</strong>, we want to thank you for being part of the <strong>{{company_name}}</strong> family. Your trust and support mean everything to us.</p>
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 28px;">To kick off the new year on a great note, here's a special gift from us to you:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr><td style="background:linear-gradient(135deg,#EDE9FE,#FAE8FF);border:2px solid #7C3AED;border-radius:16px;padding:32px;text-align:center;">
        <p style="color:#5B21B6;font-size:14px;font-weight:700;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">New Year Special</p>
        <p style="color:#7C3AED;font-size:52px;font-weight:900;margin:0 0 8px;line-height:1;">{{discount}}% OFF</p>
        <p style="color:#6B7280;font-size:14px;margin:0 0 16px;">Valid till {{expiry_date}}</p>
        <div style="background:#7C3AED;color:#ffffff;font-size:20px;font-weight:800;padding:10px 24px;border-radius:8px;letter-spacing:3px;display:inline-block;">{{coupon_code}}</div>
      </td></tr>
    </table>
    <div style="text-align:center;">
      <a href="{{shop_link}}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#EC4899);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 40px;border-radius:50px;">Claim Your Gift 🎁</a>
    </div>
  </td></tr>
  <tr><td style="background:#1E1B4B;padding:28px 40px;text-align:center;">
    <p style="color:#C4B5FD;font-size:14px;margin:0 0 8px;">Wishing you health, happiness &amp; success in {{year}} ✨</p>
    <p style="color:#4B5563;font-size:12px;margin:0;">— Team {{company_name}} · <a href="{{unsubscribe_link}}" style="color:#4B5563;">Unsubscribe</a></p>
  </td></tr>
</table>
</td></tr></table>
</body>
</html>`,
  },

  {
    id: 'festival-holi',
    name: 'Holi Sale Announcement',
    category: 'Festival',
    subject: '🌈 Holi Hai! Colours, Joy & {{discount}}% OFF for you',
    previewText: 'Add some colour to your shopping this Holi.',
    thumbnailColor: '#EC4899',
    thumbnailEmoji: '🌈',
    htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FDF2F8;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <tr><td style="padding:0;background:linear-gradient(135deg,#F472B6,#FB923C,#FBBF24,#34D399,#60A5FA,#A78BFA);height:8px;"></td></tr>
  <tr><td style="padding:50px 40px;text-align:center;">
    <div style="font-size:64px;margin-bottom:16px;">🌈</div>
    <h1 style="font-size:40px;font-weight:900;margin:0 0 8px;background:linear-gradient(135deg,#EC4899,#F97316,#8B5CF6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Holi Hai! 🎨</h1>
    <p style="color:#6B7280;font-size:18px;margin:0;">Happy Holi from {{company_name}}</p>
  </td></tr>
  <tr><td style="padding:0 40px 40px;">
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 20px;">Dear <strong>{{first_name}}</strong>,</p>
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 28px;">The festival of colours is here! May your life be as colourful and joyful as this beautiful celebration. To make your Holi even more special, we're offering you an exclusive deal:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td width="48%" style="padding:24px;background:#FDF2F8;border:2px solid #F9A8D4;border-radius:12px;text-align:center;">
          <p style="color:#BE185D;font-size:40px;font-weight:900;margin:0 0 4px;">{{discount}}%</p>
          <p style="color:#9D174D;font-size:14px;margin:0;font-weight:600;">OFF Everything</p>
        </td>
        <td width="4%"></td>
        <td width="48%" style="padding:24px;background:#FFF7ED;border:2px solid #FED7AA;border-radius:12px;text-align:center;">
          <p style="color:#C2410C;font-size:18px;font-weight:800;margin:0 0 4px;letter-spacing:2px;">{{coupon_code}}</p>
          <p style="color:#9A3412;font-size:14px;margin:0;font-weight:600;">Use this code</p>
        </td>
      </tr>
    </table>
    <p style="color:#9CA3AF;font-size:13px;text-align:center;margin:0 0 28px;">⏰ Valid till {{expiry_date}} · Minimum order ₹{{min_order}}</p>
    <div style="text-align:center;">
      <a href="{{shop_link}}" style="display:inline-block;background:linear-gradient(135deg,#EC4899,#F97316);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 40px;border-radius:50px;">Shop Now 🛍️</a>
    </div>
  </td></tr>
  <tr><td style="padding:0;background:linear-gradient(135deg,#F472B6,#FB923C,#FBBF24,#34D399,#60A5FA,#A78BFA);height:8px;"></td></tr>
  <tr><td style="background:#F9FAFB;padding:20px 40px;text-align:center;">
    <p style="color:#9CA3AF;font-size:12px;margin:0;">© {{year}} {{company_name}} · <a href="{{unsubscribe_link}}" style="color:#9CA3AF;">Unsubscribe</a></p>
  </td></tr>
</table>
</td></tr></table>
</body>
</html>`,
  },

  // ── BUSINESS (3) ────────────────────────────────────────────────
  {
    id: 'business-invoice-followup',
    name: 'Invoice Follow-Up',
    category: 'Business',
    subject: 'Friendly Reminder: Invoice #{{invoice_number}} is due',
    previewText: 'A gentle reminder about your pending payment.',
    thumbnailColor: '#1D4ED8',
    thumbnailEmoji: '📄',
    htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <tr><td style="background:#1D4ED8;padding:32px 40px;">
    <table width="100%"><tr>
      <td><p style="color:#ffffff;font-size:22px;font-weight:700;margin:0;">{{company_name}}</p></td>
      <td align="right"><p style="color:#BFDBFE;font-size:14px;margin:0;">Payment Reminder</p></td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:40px;">
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 20px;">Dear <strong>{{client_name}}</strong>,</p>
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 28px;">This is a friendly reminder that payment for the following invoice is due. Please find the details below:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #E5E7EB;border-radius:12px;overflow:hidden;margin-bottom:28px;">
      <tr style="background:#F3F4F6;"><td colspan="2" style="padding:14px 20px;"><p style="margin:0;font-weight:700;color:#111827;font-size:15px;">Invoice Details</p></td></tr>
      <tr style="border-top:1px solid #E5E7EB;"><td style="padding:14px 20px;color:#6B7280;font-size:14px;">Invoice Number</td><td style="padding:14px 20px;color:#111827;font-weight:600;font-size:14px;text-align:right;">#{{invoice_number}}</td></tr>
      <tr style="border-top:1px solid #E5E7EB;background:#FAFAFA;"><td style="padding:14px 20px;color:#6B7280;font-size:14px;">Invoice Date</td><td style="padding:14px 20px;color:#111827;font-size:14px;text-align:right;">{{invoice_date}}</td></tr>
      <tr style="border-top:1px solid #E5E7EB;"><td style="padding:14px 20px;color:#6B7280;font-size:14px;">Due Date</td><td style="padding:14px 20px;color:#DC2626;font-weight:700;font-size:14px;text-align:right;">{{due_date}}</td></tr>
      <tr style="border-top:1px solid #E5E7EB;background:#FEF2F2;"><td style="padding:14px 20px;color:#111827;font-weight:700;font-size:15px;">Amount Due</td><td style="padding:14px 20px;color:#DC2626;font-weight:800;font-size:20px;text-align:right;">₹{{amount}}</td></tr>
    </table>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 28px;">If you've already made the payment, please disregard this message. For any queries regarding this invoice, don't hesitate to reach out.</p>
    <div style="text-align:center;">
      <a href="{{payment_link}}" style="display:inline-block;background:#1D4ED8;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 40px;border-radius:50px;">Pay Now →</a>
    </div>
  </td></tr>
  <tr><td style="background:#F9FAFB;padding:24px 40px;border-top:1px solid #E5E7EB;">
    <p style="color:#374151;font-size:14px;margin:0 0 4px;"><strong>{{company_name}}</strong></p>
    <p style="color:#9CA3AF;font-size:13px;margin:0;">{{company_address}} · {{company_email}} · <a href="{{unsubscribe_link}}" style="color:#9CA3AF;">Unsubscribe</a></p>
  </td></tr>
</table>
</td></tr></table>
</body>
</html>`,
  },

  {
    id: 'business-meeting-request',
    name: 'Meeting Request',
    category: 'Business',
    subject: 'Meeting Request: {{meeting_topic}} – {{proposed_date}}',
    previewText: 'I would love to connect with you to discuss further.',
    thumbnailColor: '#374151',
    thumbnailEmoji: '🤝',
    htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <tr><td style="background:#111827;padding:32px 40px;">
    <p style="color:#F9FAFB;font-size:22px;font-weight:700;margin:0;">{{sender_name}}</p>
    <p style="color:#9CA3AF;font-size:13px;margin:6px 0 0;">{{sender_title}} · {{company_name}}</p>
  </td></tr>
  <tr><td style="padding:40px;">
    <div style="font-size:48px;text-align:center;margin-bottom:20px;">🤝</div>
    <h2 style="color:#111827;font-size:24px;font-weight:700;margin:0 0 20px;text-align:center;">Meeting Request</h2>
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 16px;">Dear <strong>{{recipient_name}}</strong>,</p>
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 28px;">I hope this email finds you well. I am reaching out from <strong>{{company_name}}</strong> to request a brief meeting to discuss <strong>{{meeting_topic}}</strong>. I believe this could be mutually beneficial for both our organisations.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #E5E7EB;border-radius:12px;overflow:hidden;margin-bottom:28px;">
      <tr style="background:#F9FAFB;"><td colspan="2" style="padding:14px 20px;"><p style="margin:0;font-weight:700;color:#111827;font-size:15px;">📅 Proposed Schedule</p></td></tr>
      <tr style="border-top:1px solid #E5E7EB;"><td style="padding:14px 20px;color:#6B7280;font-size:14px;width:40%;">Date</td><td style="padding:14px 20px;color:#111827;font-weight:600;font-size:14px;">{{proposed_date}}</td></tr>
      <tr style="border-top:1px solid #E5E7EB;background:#FAFAFA;"><td style="padding:14px 20px;color:#6B7280;font-size:14px;">Time</td><td style="padding:14px 20px;color:#111827;font-size:14px;">{{proposed_time}} IST</td></tr>
      <tr style="border-top:1px solid #E5E7EB;"><td style="padding:14px 20px;color:#6B7280;font-size:14px;">Duration</td><td style="padding:14px 20px;color:#111827;font-size:14px;">{{duration}} minutes</td></tr>
      <tr style="border-top:1px solid #E5E7EB;background:#FAFAFA;"><td style="padding:14px 20px;color:#6B7280;font-size:14px;">Format</td><td style="padding:14px 20px;color:#111827;font-size:14px;">{{meeting_format}}</td></tr>
    </table>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 28px;">Please let me know if the suggested time works for you, or feel free to propose an alternative. I look forward to connecting with you.</p>
    <div style="text-align:center;display:flex;gap:12px;justify-content:center;">
      <a href="{{accept_link}}" style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 32px;border-radius:50px;">✓ Accept</a>
      &nbsp;&nbsp;
      <a href="{{reschedule_link}}" style="display:inline-block;background:#F3F4F6;color:#374151;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:50px;">Suggest New Time</a>
    </div>
  </td></tr>
  <tr><td style="background:#F9FAFB;padding:24px 40px;border-top:1px solid #E5E7EB;text-align:center;">
    <p style="color:#9CA3AF;font-size:13px;margin:0;">{{sender_name}} · {{company_name}} · {{sender_email}}</p>
    <p style="color:#9CA3AF;font-size:12px;margin:6px 0 0;"><a href="{{unsubscribe_link}}" style="color:#9CA3AF;">Unsubscribe</a></p>
  </td></tr>
</table>
</td></tr></table>
</body>
</html>`,
  },

  {
    id: 'business-monthly-newsletter',
    name: 'Monthly Business Update',
    category: 'Business',
    subject: '{{company_name}} – {{month}} Business Update & Highlights',
    previewText: 'Your monthly roundup of news, tips, and product updates.',
    thumbnailColor: '#0F766E',
    thumbnailEmoji: '📊',
    htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <tr><td style="background:linear-gradient(135deg,#0F766E,#0D9488);padding:40px;">
    <table width="100%"><tr>
      <td><p style="color:#ffffff;font-size:20px;font-weight:700;margin:0;">{{company_name}}</p></td>
      <td align="right"><p style="color:rgba(255,255,255,0.8);font-size:13px;margin:0;">{{month}} {{year}}</p></td>
    </tr></table>
    <h1 style="color:#ffffff;font-size:28px;margin:20px 0 8px;font-weight:700;">Monthly Business Update 📊</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:15px;margin:0;">Your {{month}} roundup of highlights, updates & insights</p>
  </td></tr>
  <tr><td style="padding:40px;">
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 28px;">Dear <strong>{{first_name}}</strong>,</p>
    <h3 style="color:#0F766E;font-size:18px;margin:0 0 16px;border-bottom:2px solid #CCFBF1;padding-bottom:10px;">🌟 This Month's Highlights</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="padding:16px;background:#F0FDF4;border-radius:10px;border-left:4px solid #059669;margin-bottom:10px;">
          <p style="margin:0 0 4px;font-weight:600;color:#065F46;font-size:15px;">{{highlight_1_title}}</p>
          <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">{{highlight_1_text}}</p>
        </td>
      </tr>
      <tr><td style="height:10px;"></td></tr>
      <tr>
        <td style="padding:16px;background:#EFF6FF;border-radius:10px;border-left:4px solid #2563EB;">
          <p style="margin:0 0 4px;font-weight:600;color:#1E40AF;font-size:15px;">{{highlight_2_title}}</p>
          <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">{{highlight_2_text}}</p>
        </td>
      </tr>
      <tr><td style="height:10px;"></td></tr>
      <tr>
        <td style="padding:16px;background:#FFF7ED;border-radius:10px;border-left:4px solid #EA580C;">
          <p style="margin:0 0 4px;font-weight:600;color:#9A3412;font-size:15px;">{{highlight_3_title}}</p>
          <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">{{highlight_3_text}}</p>
        </td>
      </tr>
    </table>
    <h3 style="color:#0F766E;font-size:18px;margin:0 0 16px;border-bottom:2px solid #CCFBF1;padding-bottom:10px;">📈 Key Numbers</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td width="30%" style="padding:20px;background:#F9FAFB;border-radius:12px;text-align:center;">
          <p style="color:#0F766E;font-size:28px;font-weight:800;margin:0;">{{stat_1}}</p>
          <p style="color:#6B7280;font-size:12px;margin:4px 0 0;">{{stat_1_label}}</p>
        </td>
        <td width="5%"></td>
        <td width="30%" style="padding:20px;background:#F9FAFB;border-radius:12px;text-align:center;">
          <p style="color:#7C3AED;font-size:28px;font-weight:800;margin:0;">{{stat_2}}</p>
          <p style="color:#6B7280;font-size:12px;margin:4px 0 0;">{{stat_2_label}}</p>
        </td>
        <td width="5%"></td>
        <td width="30%" style="padding:20px;background:#F9FAFB;border-radius:12px;text-align:center;">
          <p style="color:#DC2626;font-size:28px;font-weight:800;margin:0;">{{stat_3}}</p>
          <p style="color:#6B7280;font-size:12px;margin:4px 0 0;">{{stat_3_label}}</p>
        </td>
      </tr>
    </table>
    <div style="text-align:center;">
      <a href="{{report_link}}" style="display:inline-block;background:#0F766E;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:50px;">View Full Report →</a>
    </div>
  </td></tr>
  <tr><td style="background:#F9FAFB;padding:24px 40px;text-align:center;border-top:1px solid #E5E7EB;">
    <p style="color:#9CA3AF;font-size:13px;margin:0;">© {{year}} {{company_name}} · <a href="{{unsubscribe_link}}" style="color:#9CA3AF;">Unsubscribe</a></p>
  </td></tr>
</table>
</td></tr></table>
</body>
</html>`,
  },

  // ── NEWSLETTER (3) ────────────────────────────────────────────────
  {
    id: 'promo-flash-sale',
    name: 'Flash Sale Alert',
    category: 'Newsletter',
    subject: '⚡ FLASH SALE – {{hours}} hours only! Up to {{discount}}% OFF',
    previewText: 'Don\'t miss out – this deal expires soon!',
    thumbnailColor: '#DC2626',
    thumbnailEmoji: '⚡',
    htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <tr><td style="background:#DC2626;padding:12px 40px;text-align:center;">
    <p style="color:#ffffff;font-size:13px;font-weight:700;margin:0;letter-spacing:2px;text-transform:uppercase;">⚡ LIMITED TIME OFFER ⚡</p>
  </td></tr>
  <tr><td style="background:linear-gradient(135deg,#1F2937,#111827);padding:50px 40px;text-align:center;">
    <p style="color:#FCA5A5;font-size:14px;font-weight:700;margin:0 0 12px;letter-spacing:3px;text-transform:uppercase;">Flash Sale</p>
    <h1 style="color:#ffffff;font-size:60px;font-weight:900;margin:0 0 8px;line-height:1;">UP TO</h1>
    <div style="background:#DC2626;color:#ffffff;font-size:72px;font-weight:900;padding:8px 20px;border-radius:12px;display:inline-block;line-height:1;margin-bottom:8px;">{{discount}}%</div>
    <p style="color:#F3F4F6;font-size:24px;font-weight:700;margin:8px 0 0;">OFF SITEWIDE</p>
  </td></tr>
  <tr><td style="padding:40px;">
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 20px;text-align:center;">Hi <strong>{{first_name}}</strong>! This deal won't last long ⏰</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #DC2626;border-radius:12px;padding:0;overflow:hidden;margin-bottom:28px;">
      <tr><td style="padding:24px;text-align:center;">
        <p style="color:#DC2626;font-size:14px;font-weight:700;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Sale Ends In</p>
        <p style="color:#111827;font-size:40px;font-weight:900;margin:0 0 16px;">{{hours}}:00:00</p>
        <p style="color:#6B7280;font-size:14px;margin:0 0 16px;">Use code at checkout:</p>
        <div style="background:#DC2626;color:#ffffff;font-size:24px;font-weight:800;padding:12px 28px;border-radius:8px;letter-spacing:3px;display:inline-block;">{{coupon_code}}</div>
      </td></tr>
    </table>
    <p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 28px;text-align:center;">Valid on all products · Min. order ₹{{min_order}} · {{uses_left}} uses left</p>
    <div style="text-align:center;">
      <a href="{{shop_link}}" style="display:inline-block;background:#DC2626;color:#ffffff;text-decoration:none;font-size:18px;font-weight:700;padding:18px 50px;border-radius:50px;box-shadow:0 4px 15px rgba(220,38,38,0.4);">Shop Now Before It's Gone ⚡</a>
    </div>
  </td></tr>
  <tr><td style="background:#F9FAFB;padding:24px 40px;text-align:center;border-top:1px solid #E5E7EB;">
    <p style="color:#9CA3AF;font-size:13px;margin:0;">© {{year}} {{company_name}} · <a href="{{unsubscribe_link}}" style="color:#9CA3AF;">Unsubscribe</a></p>
  </td></tr>
</table>
</td></tr></table>
</body>
</html>`,
  },

  {
    id: 'promo-referral',
    name: 'Referral Program',
    category: 'Newsletter',
    subject: '🎁 Earn ₹{{reward}} for every friend you refer!',
    previewText: 'Share with friends and earn together.',
    thumbnailColor: '#7C3AED',
    thumbnailEmoji: '🎁',
    htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <tr><td style="background:linear-gradient(135deg,#7C3AED,#5B21B6);padding:50px 40px;text-align:center;">
    <div style="font-size:56px;margin-bottom:16px;">🎁</div>
    <h1 style="color:#ffffff;font-size:30px;font-weight:800;margin:0 0 12px;">Refer a Friend &amp; Earn!</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:16px;margin:0;">Share the love and get rewarded together.</p>
  </td></tr>
  <tr><td style="padding:40px;">
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 20px;">Hi <strong>{{first_name}}</strong>! 👋</p>
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 28px;">Your referrals mean the world to us. That's why we're making it worth your while! Here's how the programme works:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td width="31%" style="padding:20px;background:#F5F3FF;border-radius:12px;text-align:center;">
          <div style="font-size:32px;margin-bottom:8px;">📤</div>
          <p style="color:#5B21B6;font-size:14px;font-weight:700;margin:0 0 4px;">Step 1</p>
          <p style="color:#374151;font-size:13px;margin:0;">Share your referral link with friends &amp; family</p>
        </td>
        <td width="3%" style="text-align:center;color:#C4B5FD;font-size:20px;">→</td>
        <td width="31%" style="padding:20px;background:#F5F3FF;border-radius:12px;text-align:center;">
          <div style="font-size:32px;margin-bottom:8px;">✅</div>
          <p style="color:#5B21B6;font-size:14px;font-weight:700;margin:0 0 4px;">Step 2</p>
          <p style="color:#374151;font-size:13px;margin:0;">They sign up &amp; place their first order</p>
        </td>
        <td width="3%" style="text-align:center;color:#C4B5FD;font-size:20px;">→</td>
        <td width="31%" style="padding:20px;background:#F5F3FF;border-radius:12px;text-align:center;">
          <div style="font-size:32px;margin-bottom:8px;">💰</div>
          <p style="color:#5B21B6;font-size:14px;font-weight:700;margin:0 0 4px;">Step 3</p>
          <p style="color:#374151;font-size:13px;margin:0;">You both earn ₹{{reward}} credit each!</p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F3FF;border:2px solid #DDD6FE;border-radius:12px;padding:0;overflow:hidden;margin-bottom:28px;">
      <tr><td style="padding:24px;text-align:center;">
        <p style="color:#5B21B6;font-size:14px;font-weight:700;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Your Referral Link</p>
        <p style="color:#374151;font-size:15px;margin:0 0 12px;word-break:break-all;">{{referral_link}}</p>
        <a href="{{referral_link}}" style="display:inline-block;background:#7C3AED;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 24px;border-radius:8px;">Copy Link</a>
      </td></tr>
    </table>
    <div style="text-align:center;">
      <a href="{{referral_dashboard}}" style="display:inline-block;background:#7C3AED;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 40px;border-radius:50px;">View My Referrals →</a>
    </div>
  </td></tr>
  <tr><td style="background:#F9FAFB;padding:24px 40px;text-align:center;border-top:1px solid #E5E7EB;">
    <p style="color:#9CA3AF;font-size:13px;margin:0;">© {{year}} {{company_name}} · <a href="{{unsubscribe_link}}" style="color:#9CA3AF;">Unsubscribe</a></p>
  </td></tr>
</table>
</td></tr></table>
</body>
</html>`,
  },

  {
    id: 'promo-loyalty-reward',
    name: 'Loyalty Reward',
    category: 'Newsletter',
    subject: '🏆 You\'ve earned {{points}} points – redeem your reward!',
    previewText: 'Your loyalty has unlocked an exclusive benefit.',
    thumbnailColor: '#D97706',
    thumbnailEmoji: '🏆',
    htmlBody: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <tr><td style="background:linear-gradient(135deg,#92400E,#B45309,#D97706);padding:50px 40px;text-align:center;">
    <div style="font-size:56px;margin-bottom:16px;">🏆</div>
    <p style="color:#FDE68A;font-size:14px;font-weight:700;margin:0 0 8px;letter-spacing:2px;text-transform:uppercase;">Loyalty Reward</p>
    <h1 style="color:#ffffff;font-size:32px;font-weight:800;margin:0 0 8px;">You're a VIP Member!</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:16px;margin:0;">Your loyalty deserves to be celebrated.</p>
  </td></tr>
  <tr><td style="padding:40px;">
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 20px;">Dear <strong>{{first_name}}</strong>,</p>
    <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 28px;">As a valued member of our loyalty programme, you've been with us for <strong>{{months}} months</strong> and placed <strong>{{total_orders}} orders</strong>. You've earned some fantastic rewards!</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td width="48%" style="padding:24px;background:linear-gradient(135deg,#FEF3C7,#FFFBEB);border:2px solid #D97706;border-radius:12px;text-align:center;">
          <p style="color:#92400E;font-size:13px;font-weight:700;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Loyalty Points</p>
          <p style="color:#D97706;font-size:44px;font-weight:900;margin:0 0 4px;line-height:1;">{{points}}</p>
          <p style="color:#78350F;font-size:13px;margin:0;">= ₹{{points_value}} discount</p>
        </td>
        <td width="4%"></td>
        <td width="48%" style="padding:24px;background:linear-gradient(135deg,#FEF3C7,#FFFBEB);border:2px solid #D97706;border-radius:12px;text-align:center;">
          <p style="color:#92400E;font-size:13px;font-weight:700;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Member Since</p>
          <p style="color:#D97706;font-size:20px;font-weight:800;margin:0 0 4px;">{{member_since}}</p>
          <p style="color:#78350F;font-size:13px;margin:0;">{{tier}} Member 🌟</p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:12px;margin-bottom:28px;">
      <tr><td style="padding:24px;">
        <p style="color:#92400E;font-size:15px;font-weight:700;margin:0 0 12px;">🎁 Your Exclusive Rewards</p>
        <p style="color:#374151;font-size:14px;margin:0 0 8px;">✅ Free shipping on your next order</p>
        <p style="color:#374151;font-size:14px;margin:0 0 8px;">✅ Early access to new arrivals</p>
        <p style="color:#374151;font-size:14px;margin:0;">✅ Birthday double-points bonus</p>
      </td></tr>
    </table>
    <div style="text-align:center;">
      <a href="{{redeem_link}}" style="display:inline-block;background:linear-gradient(135deg,#D97706,#B45309);color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:16px 40px;border-radius:50px;box-shadow:0 4px 15px rgba(217,119,6,0.3);">Redeem My Points 🏆</a>
    </div>
  </td></tr>
  <tr><td style="background:#F9FAFB;padding:24px 40px;text-align:center;border-top:1px solid #E5E7EB;">
    <p style="color:#9CA3AF;font-size:13px;margin:0;">© {{year}} {{company_name}} · <a href="{{unsubscribe_link}}" style="color:#9CA3AF;">Unsubscribe</a></p>
  </td></tr>
</table>
</td></tr></table>
</body>
</html>`,
  },
];

export const TEMPLATE_CATEGORIES = ['All', 'Welcome', 'Festival', 'Business', 'Newsletter'] as const;
export type TemplateCategory = typeof TEMPLATE_CATEGORIES[number];

export function getTemplateById(id: string): LibraryTemplate | undefined {
  return templateLibrary.find(t => t.id === id);
}

export function getTemplatesByCategory(category: string): LibraryTemplate[] {
  if (category === 'All') return templateLibrary;
  return templateLibrary.filter(t => t.category === category);
}
