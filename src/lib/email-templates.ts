// Email Templates Library

export interface EmailTemplate {
  id: string;
  name: string;
  category: 'welcome' | 'festival' | 'business' | 'transactional' | 'newsletter';
  thumbnail: string;
  subject: string;
  preheader?: string;
  htmlContent: string;
  textContent?: string;
  variables: string[]; // List of merge tags used
}

export const emailTemplates: EmailTemplate[] = [
  // Welcome Templates
  {
    id: 'welcome-simple',
    name: 'Simple Welcome',
    category: 'welcome',
    thumbnail: '/templates/welcome-simple.png',
    subject: 'Welcome to {{company_name}}! 🎉',
    preheader: 'We\'re excited to have you here',
    variables: ['company_name', 'first_name', 'subscriber_count', 'cta_link'],
    htmlContent: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="{{logo_url}}" alt="{{company_name}}" style="max-width: 200px; height: auto;">
        </div>
        <h1 style="color: #333; text-align: center;">Welcome to {{company_name}}! 🎉</h1>
        <p style="color: #666; font-size: 16px;">Hi {{first_name}},</p>
        <p style="color: #666; font-size: 16px;">We're thrilled to have you join our community of {{subscriber_count}} happy customers.</p>
        <p style="color: #666; font-size: 16px;">Here's what you can expect from us:</p>
        <ul style="color: #666; font-size: 16px;">
          <li>Exclusive offers and early access to sales</li>
          <li>Tips and updates about our products</li>
          <li>Special birthday surprises</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{cta_link}}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Get Started</a>
        </div>
        <p style="color: #999; font-size: 14px; text-align: center;">If you have any questions, just reply to this email - we're always happy to help!</p>
      </div>
    `,
  },
  
  // Festival Templates
  {
    id: 'diwali-wishes',
    name: 'Diwali Greetings',
    category: 'festival',
    thumbnail: '/templates/diwali-wishes.png',
    subject: 'Happy Diwali {{first_name}}! ✨ Special Offer Inside',
    preheader: 'Celebrate with exclusive Diwali discounts',
    variables: ['first_name', 'discount_code', 'discount_percent', 'shop_link'],
    htmlContent: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(to bottom, #ff9933, #ffffff, #138808); padding: 2px;">
        <div style="background: white; padding: 20px;">
          <h1 style="color: #ff6b35; text-align: center; font-size: 32px;">🪔 Happy Diwali! 🪔</h1>
          <p style="color: #333; font-size: 18px; text-align: center;">Dear {{first_name}},</p>
          <p style="color: #666; font-size: 16px; text-align: center;">May this festival of lights illuminate your life with joy, prosperity, and happiness!</p>
          <div style="background: #fff3cd; border: 2px solid #ff9933; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="color: #ff6b35; font-size: 20px; margin: 0;"><strong>Exclusive Diwali Offer</strong></p>
            <p style="color: #333; font-size: 36px; margin: 10px 0;"><strong>{{discount_percent}}% OFF</strong></p>
            <p style="color: #666; font-size: 16px;">Use code: <span style="background: #ff9933; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;">{{discount_code}}</span></p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{shop_link}}" style="background: #ff6b35; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 18px;">Shop Now</a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">Offer valid till Diwali week only!</p>
        </div>
      </div>
    `,
  },
  
  // Business Templates
  {
    id: 'product-launch',
    name: 'Product Launch Announcement',
    category: 'business',
    thumbnail: '/templates/product-launch.png',
    subject: 'Introducing {{product_name}} - Now Available!',
    preheader: 'Be the first to experience our latest innovation',
    variables: ['product_name', 'product_image', 'product_description', 'product_price', 'cta_link'],
    htmlContent: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #f8f9fa; padding: 40px 20px; text-align: center;">
          <h1 style="color: #333; font-size: 32px; margin: 0;">Introducing</h1>
          <h2 style="color: #007bff; font-size: 36px; margin: 10px 0;">{{product_name}}</h2>
        </div>
        <div style="padding: 20px;">
          <img src="{{product_image}}" alt="{{product_name}}" style="width: 100%; max-width: 500px; height: auto; display: block; margin: 0 auto 30px;">
          <p style="color: #666; font-size: 18px; line-height: 1.6;">{{product_description}}</p>
          <div style="background: #f8f9fa; border-radius: 10px; padding: 30px; margin: 30px 0; text-align: center;">
            <p style="color: #999; font-size: 16px; margin: 0;">Starting at</p>
            <p style="color: #333; font-size: 36px; font-weight: bold; margin: 10px 0;">₹{{product_price}}</p>
            <a href="{{cta_link}}" style="background: #28a745; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin-top: 10px;">Shop Now</a>
          </div>
        </div>
      </div>
    `,
  },
  
  // Transactional Templates
  {
    id: 'order-confirmation',
    name: 'Order Confirmation',
    category: 'transactional',
    thumbnail: '/templates/order-confirmation.png',
    subject: 'Order Confirmed! Your order #{{order_number}} is being processed',
    preheader: 'Thank you for your purchase',
    variables: ['first_name', 'order_number', 'order_date', 'order_total', 'delivery_date', 'tracking_link', 'order_items'],
    htmlContent: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background: #28a745; color: white; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 40px;">✓</div>
          <h1 style="color: #333; margin-top: 20px;">Order Confirmed!</h1>
        </div>
        <p style="color: #666; font-size: 16px;">Hi {{first_name}},</p>
        <p style="color: #666; font-size: 16px;">Thank you for your order! We're getting it ready for delivery.</p>
        <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Order Details</h3>
          <p style="color: #666; margin: 5px 0;"><strong>Order Number:</strong> #{{order_number}}</p>
          <p style="color: #666; margin: 5px 0;"><strong>Order Date:</strong> {{order_date}}</p>
          <p style="color: #666; margin: 5px 0;"><strong>Total Amount:</strong> ₹{{order_total}}</p>
          <p style="color: #666; margin: 5px 0;"><strong>Expected Delivery:</strong> {{delivery_date}}</p>
        </div>
        <div style="margin: 30px 0;">
          {{order_items}}
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{tracking_link}}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Track Your Order</a>
        </div>
      </div>
    `,
  },
  
  // Newsletter Templates
  {
    id: 'monthly-newsletter',
    name: 'Monthly Newsletter',
    category: 'newsletter',
    thumbnail: '/templates/monthly-newsletter.png',
    subject: '{{company_name}} Newsletter - {{month}} Edition',
    preheader: 'Your monthly dose of updates and insights',
    variables: ['company_name', 'month', 'hero_image', 'hero_title', 'hero_description', 'articles', 'footer_links'],
    htmlContent: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">{{company_name}} Newsletter</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.8;">{{month}} Edition</p>
        </div>
        <img src="{{hero_image}}" alt="{{hero_title}}" style="width: 100%; height: auto; display: block;">
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; font-size: 28px; margin-bottom: 10px;">{{hero_title}}</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">{{hero_description}}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          {{articles}}
        </div>
        <div style="background: #f8f9fa; padding: 30px 20px; text-align: center;">
          <h3 style="color: #333;">Stay Connected</h3>
          {{footer_links}}
        </div>
      </div>
    `,
  }
];

// Helper function to get template by ID
export function getTemplateById(id: string): EmailTemplate | undefined {
  return emailTemplates.find(template => template.id === id);
}

// Helper function to get templates by category
export function getTemplatesByCategory(category: EmailTemplate['category']): EmailTemplate[] {
  return emailTemplates.filter(template => template.category === category);
}

// Helper function to replace variables in template
export function replaceMergeTags(content: string, data: Record<string, string>): string {
  let result = content;
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value || '');
  });
  return result;
}