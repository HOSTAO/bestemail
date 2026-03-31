// Part 1: Indian Festival Templates - generated programmatically

export interface TemplateData {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  subject: string;
  preview_text: string;
  html_body: string;
  tags: string[];
  industry_tags: string[];
  thumbnail_color: string;
  is_featured: boolean;
  created_at: string;
}

let counter = 1;
function uid(): string {
  return `t-${String(counter++).padStart(4, '0')}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeHTML(p: {
  emoji: string;
  color1: string;
  color2: string;
  heading: string;
  greeting: string;
  paragraphs: string[];
  ctaText?: string;
  ctaColor?: string;
}): string {
  const bodyParas = p.paragraphs.map(t => `<p style="margin:0 0 16px;font-size:16px;color:#555;line-height:1.6;">${t}</p>`).join('\n          ');
  const cta = p.ctaText ? `
          <table cellpadding="0" cellspacing="0" style="margin:24px 0 8px;"><tr><td style="background:${p.ctaColor || p.color1};border-radius:8px;padding:14px 28px;">
            <a href="{{cta_url}}" style="color:#fff;text-decoration:none;font-weight:600;font-size:16px;">${p.ctaText}</a>
          </td></tr></table>` : '';
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:20px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,${p.color1},${p.color2});padding:40px 30px;text-align:center;">
          <p style="margin:0;font-size:48px;">${p.emoji}</p>
          <h1 style="margin:16px 0 0;color:#ffffff;font-size:28px;font-weight:700;">${p.heading}</h1>
        </td></tr>
        <tr><td style="padding:32px 30px;">
          <p style="margin:0 0 16px;font-size:16px;color:#333;line-height:1.6;">${p.greeting}</p>
          ${bodyParas}${cta}
        </td></tr>
        <tr><td style="padding:20px 30px;border-top:1px solid #eee;text-align:center;">
          <p style="margin:0;font-size:13px;color:#999;">{{company_name}} | <a href="{{unsubscribe_url}}" style="color:#999;">Unsubscribe</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

interface FestivalDef {
  subcategory: string;
  emoji: string;
  color1: string;
  color2: string;
  baseTags: string[];
}

interface VariantDef {
  nameSuffix: string;
  subject: string;
  preview: string;
  heading: string;
  greeting: string;
  paragraphs: string[];
  ctaText?: string;
  tags?: string[];
  industryTags?: string[];
  featured?: boolean;
}

function generateFestivalTemplates(festival: FestivalDef, variants: VariantDef[]): TemplateData[] {
  return variants.map(v => ({
    id: uid(),
    name: `${festival.subcategory} - ${v.nameSuffix}`,
    category: 'Indian Festivals',
    subcategory: festival.subcategory,
    subject: v.subject,
    preview_text: v.preview,
    html_body: makeHTML({
      emoji: festival.emoji,
      color1: festival.color1,
      color2: festival.color2,
      heading: v.heading,
      greeting: v.greeting,
      paragraphs: v.paragraphs,
      ctaText: v.ctaText,
      ctaColor: festival.color1,
    }),
    tags: [...festival.baseTags, ...(v.tags || [])],
    industry_tags: v.industryTags || ['general'],
    thumbnail_color: festival.color1,
    is_featured: v.featured || false,
    created_at: new Date().toISOString(),
  }));
}

// ========== DIWALI (10 variants) ==========
const diwaliTemplates = generateFestivalTemplates(
  { subcategory: 'Diwali', emoji: '🪔', color1: '#FF6B00', color2: '#FFD700', baseTags: ['diwali', 'festival', 'deepavali', 'indian', 'festival-of-lights'] },
  [
    { nameSuffix: 'Business Greetings', subject: 'Wishing You a Prosperous Diwali from {{company_name}}', preview: 'May the Festival of Lights brighten your path to success', heading: 'Happy Diwali!', greeting: 'Dear {{first_name}},', paragraphs: ['On behalf of everyone at {{company_name}}, we wish you and your family a very Happy Diwali! May this Festival of Lights illuminate your life with joy, prosperity, and success.', 'As we celebrate the triumph of light over darkness, we are grateful for your continued trust and partnership. Wishing you a year filled with new opportunities and achievements.', 'May the glow of diyas and the sparkle of rangoli bring warmth and happiness to your home. Happy Diwali!'], tags: ['business', 'corporate', 'greetings'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Sale Offer', subject: '🪔 Diwali Mega Sale — Up to 50% Off Everything!', preview: 'Celebrate Diwali with our biggest sale of the year', heading: 'Diwali Mega Sale!', greeting: 'Dear {{first_name}},', paragraphs: ['The Festival of Lights calls for celebration, and what better way than our biggest sale of the year! Enjoy up to 50% off across all categories.', 'Use code DIWALI50 at checkout to unlock exclusive Diwali discounts. Hurry — this festive offer is valid for a limited time only!', 'Light up your Diwali celebrations with amazing deals on gifts, decor, fashion, and more.'], ctaText: 'Shop the Diwali Sale', tags: ['sale', 'discount', 'offer', 'promo'], industryTags: ['retail'], featured: true },
    { nameSuffix: 'Thank You', subject: 'Thank You for a Wonderful Year — Happy Diwali!', preview: 'Expressing our gratitude this Diwali season', heading: 'Thank You & Happy Diwali!', greeting: 'Dear {{first_name}},', paragraphs: ['As we light diyas this Diwali, we want to take a moment to thank you for being an integral part of our journey. Your support has been the light guiding our path.', 'This festive season, we celebrate not just the triumph of good over evil, but also the beautiful relationships we have built together. We are truly grateful for your trust.'], tags: ['thank-you', 'gratitude'], industryTags: ['general'] },
    { nameSuffix: 'Warm Wishes', subject: 'Warm Diwali Wishes from Our Family to Yours', preview: 'Sending love and light this Diwali', heading: 'Shubh Diwali!', greeting: 'Dear {{first_name}},', paragraphs: ['May the flickering flames of diyas fill your heart with joy and your home with warmth. Wishing you and your loved ones a Diwali filled with love, laughter, and togetherness.', 'As the night sky lights up with fireworks, may your life be illuminated with happiness and prosperity. From our family to yours — Shubh Diwali!'], tags: ['warm-wishes', 'personal', 'family'], industryTags: ['general'] },
    { nameSuffix: 'Corporate', subject: 'Season\'s Greetings — Happy Diwali from {{company_name}}', preview: 'A festive message from the team at your trusted partner', heading: 'Happy Diwali!', greeting: 'Dear {{first_name}},', paragraphs: ['As another year draws to a close, we at {{company_name}} reflect on the valued partnerships that have made this year a success. Diwali marks a time of renewal and optimism.', 'We look forward to continuing our collaboration in the coming year and wish you a festive season filled with prosperity and new opportunities. Happy Diwali!'], tags: ['corporate', 'b2b', 'formal'], industryTags: ['general'] },
    { nameSuffix: 'Retail Offer', subject: '🛍️ Diwali Shopping Festival — Flat 40% Off + Free Gifts!', preview: 'Your favourite products at unbeatable Diwali prices', heading: 'Diwali Shopping Festival!', greeting: 'Hi {{first_name}},', paragraphs: ['Make your Diwali shopping extra special with our exclusive Shopping Festival! Enjoy flat 40% off on all products plus free gift wrapping on orders above ₹2,000.', 'From ethnic wear to home decor, electronics to accessories — find the perfect Diwali gifts for everyone on your list. Use code DIWALI40 at checkout.'], ctaText: 'Start Shopping', tags: ['retail', 'shopping', 'gifts', 'offer'], industryTags: ['retail'], featured: true },
    { nameSuffix: 'Restaurant Special', subject: '🍽️ Celebrate Diwali with Our Special Festive Menu!', preview: 'Join us for a memorable Diwali dinner experience', heading: 'Diwali Feast Awaits!', greeting: 'Dear {{first_name}},', paragraphs: ['This Diwali, treat yourself and your loved ones to an unforgettable dining experience! Our chefs have crafted a special festive menu featuring traditional sweets, savory delights, and fusion cuisine.', 'Book your table now and enjoy 20% off on our Diwali Special Thali. Available for dine-in and takeaway. Reservations are filling fast — don\'t miss out!'], ctaText: 'Reserve Your Table', tags: ['restaurant', 'food', 'dining', 'menu'], industryTags: ['restaurant'] },
    { nameSuffix: 'Real Estate', subject: '🏠 This Diwali, Bring Home New Beginnings!', preview: 'Auspicious Diwali offers on premium properties', heading: 'New Home, New Beginnings!', greeting: 'Dear {{first_name}},', paragraphs: ['Diwali is the most auspicious time to invest in your dream home. We are offering exclusive festive deals on premium residential properties with easy EMI options and zero registration charges.', 'Step into a brighter future this Diwali. Schedule a site visit today and unlock special Diwali pricing that won\'t last long!'], ctaText: 'Explore Properties', tags: ['real-estate', 'property', 'home', 'investment'], industryTags: ['real-estate'] },
    { nameSuffix: 'Education', subject: '📚 Light Up Your Future — Diwali Learning Offers!', preview: 'Special Diwali discounts on courses and programs', heading: 'Learn & Grow This Diwali!', greeting: 'Dear {{first_name}},', paragraphs: ['This Diwali, invest in knowledge! Enroll in any of our professional courses and get 30% off on tuition fees. From digital marketing to data science, we have programs designed to accelerate your career.', 'Use code DIWALILEARN at enrollment. Offer valid from October 15 to November 5. Light up your career this festive season!'], ctaText: 'Browse Courses', tags: ['education', 'courses', 'learning', 'career'], industryTags: ['education'] },
    { nameSuffix: 'Healthcare', subject: '💊 Diwali Health Check-Up Packages — Special Festive Prices!', preview: 'Prioritize your health this festive season', heading: 'Healthy Diwali!', greeting: 'Dear {{first_name}},', paragraphs: ['This Diwali, give yourself the gift of good health! We are offering comprehensive health check-up packages at special festive prices starting at just ₹999.', 'Our packages include full body check-up, cardiac screening, diabetes panel, and more. Book your appointment today and celebrate a healthy, happy Diwali with your family!'], ctaText: 'Book Health Check-Up', tags: ['healthcare', 'health', 'checkup', 'wellness'], industryTags: ['healthcare'] },
  ]
);

// ========== HOLI (6 variants) ==========
const holiTemplates = generateFestivalTemplates(
  { subcategory: 'Holi', emoji: '🎨', color1: '#FF6B6B', color2: '#4ECDC4', baseTags: ['holi', 'festival', 'colors', 'indian', 'spring'] },
  [
    { nameSuffix: 'Business Greetings', subject: 'Happy Holi from {{company_name}}! 🎨', preview: 'Wishing you a colourful and joyous Holi celebration', heading: 'Happy Holi!', greeting: 'Dear {{first_name}},', paragraphs: ['May the vibrant colours of Holi paint your life with happiness, success, and fulfilment! On behalf of {{company_name}}, we wish you and your family a colourful and joyous celebration.', 'Just as Holi brings people together in a splash of colours, we hope our partnership continues to create beautiful moments. Have a wonderful Holi!'], tags: ['business', 'greetings'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Sale Offer', subject: '🌈 Holi Sale — Splash of Savings up to 40% Off!', preview: 'Add colour to your shopping with our Holi deals', heading: 'Holi Sale Bonanza!', greeting: 'Hi {{first_name}},', paragraphs: ['Celebrate the festival of colours with a splash of savings! Enjoy up to 40% off on fashion, home decor, and accessories. Use code HOLI40 at checkout.', 'From colourful ethnic wear to organic Holi colours and party essentials — we have everything to make your celebration special. Shop now before stocks run out!'], ctaText: 'Shop Holi Sale', tags: ['sale', 'discount', 'offer'], industryTags: ['retail'] },
    { nameSuffix: 'Warm Wishes', subject: 'Sending Colourful Wishes This Holi! 🌈', preview: 'May every colour of Holi spread happiness in your life', heading: 'Rang Barse!', greeting: 'Dear {{first_name}},', paragraphs: ['As the air fills with colours and the spirit of celebration, we send our warmest Holi wishes to you and your family. May this festival wash away all worries and fill your life with vibrant joy.', 'Play safe, eat sweets, and celebrate the beautiful tradition of togetherness. Wishing you a Happy and colourful Holi!'], tags: ['warm-wishes', 'personal'], industryTags: ['general'] },
    { nameSuffix: 'Restaurant Special', subject: '🍹 Celebrate Holi with Our Special Thandai Menu!', preview: 'Festive food and drinks to make your Holi memorable', heading: 'Holi Food Festival!', greeting: 'Dear {{first_name}},', paragraphs: ['This Holi, savour the taste of tradition! We have curated a special Holi menu featuring classic Thandai, Gujiya, Dahi Vada, and fusion delights.', 'Book your festive feast with us and enjoy 15% off on all Holi specials. Available for dine-in and delivery from March 10-15.'], ctaText: 'Order Holi Specials', tags: ['restaurant', 'food', 'thandai', 'gujiya'], industryTags: ['restaurant'] },
    { nameSuffix: 'Corporate', subject: 'Happy Holi — Celebrating Diversity & Togetherness', preview: 'A colourful message from the entire team', heading: 'Happy Holi!', greeting: 'Dear {{first_name}},', paragraphs: ['At {{company_name}}, we believe in the spirit of Holi — celebrating diversity, building connections, and spreading joy. We wish you and your team a wonderful, colourful celebration.', 'May this festival inspire creativity and fresh thinking in all our endeavours together. Here\'s to another year of vibrant collaboration!'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
    { nameSuffix: 'Skincare & Beauty', subject: '🧴 Pre & Post Holi Skincare — Protect Your Glow!', preview: 'Essential skincare tips and offers for a safe Holi', heading: 'Holi Skincare Essentials!', greeting: 'Hi {{first_name}},', paragraphs: ['Don\'t let harsh colours damage your skin! Stock up on our organic, chemical-free Holi colours and post-Holi skincare essentials. Get 25% off on our Holi Protection Kit.', 'The kit includes: pre-Holi moisturizer, organic colours, post-Holi cleanser, and hair care pack. Play safe and glow bright!'], ctaText: 'Get Your Holi Kit', tags: ['beauty', 'skincare', 'organic'], industryTags: ['retail'] },
  ]
);

// ========== EID UL-FITR (8 variants) ==========
const eidFitrTemplates = generateFestivalTemplates(
  { subcategory: 'Eid ul-Fitr', emoji: '🌙', color1: '#00695C', color2: '#FFD700', baseTags: ['eid', 'eid-ul-fitr', 'festival', 'ramadan', 'muslim'] },
  [
    { nameSuffix: 'Greetings', subject: 'Eid Mubarak from {{company_name}}! 🌙', preview: 'Wishing you and your family a blessed Eid ul-Fitr', heading: 'Eid Mubarak!', greeting: 'Dear {{first_name}},', paragraphs: ['As the holy month of Ramadan comes to a blessed end, we wish you and your family Eid Mubarak! May this joyous occasion bring peace, happiness, and prosperity to your home.', 'May the blessings of Allah fill your life with hope and your heart with gratitude. From all of us at {{company_name}}, we extend our warmest Eid greetings.'], tags: ['greetings', 'blessings'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Sale Offer', subject: '🛍️ Eid Mubarak Sale — Up to 35% Off on All Categories!', preview: 'Celebrate Eid with exclusive shopping deals', heading: 'Eid Shopping Special!', greeting: 'Dear {{first_name}},', paragraphs: ['Make your Eid celebrations extra special with our exclusive sale! Enjoy up to 35% off on fashion, home decor, perfumes, and gifts.', 'Use code EIDMUBARAK at checkout. Free delivery on orders above ₹1,500. Shop the perfect Eid gifts for your family and friends!'], ctaText: 'Shop Eid Collection', tags: ['sale', 'offer', 'shopping'], industryTags: ['retail'] },
    { nameSuffix: 'Corporate', subject: 'Eid Mubarak — Warm Wishes from {{company_name}}', preview: 'Season\'s greetings from your business partner', heading: 'Eid Mubarak!', greeting: 'Dear {{first_name}},', paragraphs: ['On the auspicious occasion of Eid ul-Fitr, we extend our warmest wishes to you and your organisation. May this blessed celebration bring renewed energy and success to all your endeavours.', 'We value our partnership and look forward to continued collaboration. Eid Mubarak from the entire team at {{company_name}}.'], tags: ['corporate', 'b2b', 'formal'], industryTags: ['general'] },
    { nameSuffix: 'Warm Wishes', subject: 'Eid Mubarak — May Allah Bless You Abundantly', preview: 'Heartfelt Eid greetings from our family to yours', heading: 'Eid Mubarak!', greeting: 'Dear {{first_name}},', paragraphs: ['As families gather and hearts rejoice, we send you our heartfelt Eid wishes. May the spirit of Ramadan continue to guide your path and the joy of Eid fill every moment.', 'May this Eid bring happiness to your heart, health to your family, and success to your life. Eid Mubarak!'], tags: ['warm-wishes', 'personal', 'family'], industryTags: ['general'] },
    { nameSuffix: 'Restaurant', subject: '🍖 Eid Feast Special — Book Your Celebration Dinner!', preview: 'Join us for a grand Eid feast with family and friends', heading: 'Eid Special Menu!', greeting: 'Dear {{first_name}},', paragraphs: ['Celebrate Eid with a grand feast! Our chefs have prepared a special Eid menu featuring Biryani, Kebabs, Sheer Khurma, and traditional delicacies.', 'Book your Eid dinner with us and enjoy 20% off on group bookings of 6 or more. Perfect for family celebrations!'], ctaText: 'Reserve Now', tags: ['restaurant', 'food', 'feast', 'biryani'], industryTags: ['restaurant'] },
    { nameSuffix: 'Fashion', subject: '👗 Eid Collection — Elegant Ethnic Wear Now Available!', preview: 'Look your best this Eid with our new collection', heading: 'Eid Fashion Collection!', greeting: 'Hi {{first_name}},', paragraphs: ['Step into Eid celebrations in style! Our exclusive Eid collection features elegant sherwanis, stunning abayas, and festive kidswear.', 'Shop now and get 30% off on your first purchase. Express delivery available for last-minute shoppers. Make this Eid unforgettable!'], ctaText: 'Browse Collection', tags: ['fashion', 'clothing', 'ethnic-wear'], industryTags: ['retail'] },
    { nameSuffix: 'Charity & Giving', subject: 'This Eid, Let\'s Make a Difference Together 🤲', preview: 'Join us in spreading joy and giving back to the community', heading: 'Give This Eid!', greeting: 'Dear {{first_name}},', paragraphs: ['Eid is a time of gratitude and generosity. This year, {{company_name}} is partnering with local charities to bring joy to underprivileged families.', 'For every purchase you make during our Eid campaign, we will donate 5% to community meal programs. Together, let\'s make this Eid meaningful for everyone.'], ctaText: 'Shop & Give', tags: ['charity', 'giving', 'community', 'csr'], industryTags: ['general'] },
    { nameSuffix: 'Ramadan Reflection', subject: 'As Ramadan Ends, Eid Begins — A Message of Hope', preview: 'Reflecting on the blessings of the holy month', heading: 'Eid Mubarak!', greeting: 'Dear {{first_name}},', paragraphs: ['As the crescent moon marks the end of Ramadan, we reflect on the spiritual growth, patience, and compassion this holy month has inspired. Eid ul-Fitr is a celebration of these blessings.', 'May the lessons of Ramadan continue to guide us all year long. Wishing you a peaceful and joyful Eid celebration.'], tags: ['spiritual', 'reflection', 'ramadan'], industryTags: ['general'] },
  ]
);

// ========== EID UL-ADHA (5 variants) ==========
const eidAdhaTemplates = generateFestivalTemplates(
  { subcategory: 'Eid ul-Adha', emoji: '🐑', color1: '#00695C', color2: '#C0CA33', baseTags: ['eid', 'eid-ul-adha', 'bakrid', 'festival', 'muslim'] },
  [
    { nameSuffix: 'Greetings', subject: 'Eid ul-Adha Mubarak from {{company_name}}! 🐑', preview: 'Wishing you blessings on this auspicious occasion', heading: 'Eid ul-Adha Mubarak!', greeting: 'Dear {{first_name}},', paragraphs: ['On the blessed occasion of Eid ul-Adha, we extend our warmest greetings to you and your family. May the spirit of sacrifice and devotion bring peace and prosperity to your life.', 'May Allah accept your good deeds and bless you abundantly. Eid Mubarak from all of us at {{company_name}}.'], tags: ['greetings', 'blessings'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Sale Offer', subject: '🛒 Eid ul-Adha Sale — Festive Deals Await!', preview: 'Celebrate with special discounts across all products', heading: 'Eid Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Celebrate Eid ul-Adha with amazing festive deals! Enjoy up to 30% off on home essentials, kitchenware, and festive outfits.', 'Use code BAKRID30 at checkout. Free shipping on orders over ₹2,000. Limited time offer — shop now!'], ctaText: 'Shop Festive Deals', tags: ['sale', 'offer', 'discount'], industryTags: ['retail'] },
    { nameSuffix: 'Corporate', subject: 'Eid ul-Adha Mubarak — Warm Regards from {{company_name}}', preview: 'Warm professional greetings on this blessed occasion', heading: 'Eid ul-Adha Mubarak!', greeting: 'Dear {{first_name}},', paragraphs: ['As we observe the festival of sacrifice and devotion, {{company_name}} extends its warmest wishes to you. May this Eid bring new opportunities and strengthen our professional bond.', 'Wishing you, your family, and your team a blessed Eid ul-Adha.'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
    { nameSuffix: 'Family Wishes', subject: 'Eid ul-Adha — Wishing You Joy and Togetherness', preview: 'May this Eid bring love and happiness to your home', heading: 'Eid Mubarak!', greeting: 'Dear {{first_name}},', paragraphs: ['As families come together to celebrate the spirit of sacrifice and devotion, we send you our warmest wishes. May Eid ul-Adha fill your home with love, laughter, and abundant blessings.', 'May this sacred day deepen your faith and bring prosperity to your life. Eid Mubarak!'], tags: ['family', 'warm-wishes'], industryTags: ['general'] },
    { nameSuffix: 'Community', subject: 'Eid ul-Adha — Sharing, Caring, Celebrating Together', preview: 'Let\'s celebrate the spirit of generosity this Eid', heading: 'Eid ul-Adha Mubarak!', greeting: 'Dear {{first_name}},', paragraphs: ['Eid ul-Adha teaches us the beauty of sacrifice and sharing. This year, join us in making a difference. For every order, we donate a meal to those in need.', 'Celebrate Eid with purpose. Shop our curated Eid collection and help spread joy in your community.'], ctaText: 'Shop & Share', tags: ['community', 'charity', 'sharing'], industryTags: ['general'] },
  ]
);

// ========== NAVRATRI (5 variants) ==========
const navratriTemplates = generateFestivalTemplates(
  { subcategory: 'Navratri', emoji: '🔱', color1: '#C62828', color2: '#FFB300', baseTags: ['navratri', 'festival', 'durga', 'garba', 'dandiya', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Shubh Navratri! 🔱 Nine Nights of Devotion & Joy', preview: 'May Goddess Durga bless you with strength and wisdom', heading: 'Shubh Navratri!', greeting: 'Dear {{first_name}},', paragraphs: ['As the nine auspicious nights of Navratri begin, we wish you divine blessings, good health, and prosperity. May Maa Durga fill your life with courage and wisdom.', 'May the energy of Garba and Dandiya fill your nights with joy and devotion. Happy Navratri from {{company_name}}!'], tags: ['greetings', 'devotion'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Sale Offer', subject: '🛍️ Navratri Special — Flat 30% Off on Ethnic Wear!', preview: 'Dance into Navratri with our stunning collection', heading: 'Navratri Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Get ready for nine nights of celebration with our Navratri Special Sale! Enjoy flat 30% off on lehengas, chaniya cholis, kurtas, and festive accessories.', 'Use code NAVRATRI30 at checkout. New arrivals in all nine Navratri colours! Shop now for guaranteed delivery before the festival.'], ctaText: 'Shop Navratri Collection', tags: ['sale', 'ethnic-wear', 'fashion'], industryTags: ['retail'] },
    { nameSuffix: 'Garba Night', subject: '💃 Garba Night Invitation — Join the Celebration!', preview: 'You are invited to the biggest Garba night in town', heading: 'Garba Night!', greeting: 'Dear {{first_name}},', paragraphs: ['You are cordially invited to our grand Garba & Dandiya Night! Join us for an evening of music, dance, and festive celebrations.', 'Live music, authentic Gujarati food, and prizes for best-dressed couples. Book your passes now at early bird prices!'], ctaText: 'Book Passes', tags: ['event', 'garba', 'dandiya', 'dance'], industryTags: ['general'] },
    { nameSuffix: 'Fasting Specials', subject: '🍽️ Navratri Fasting Menu — Sattvic Delights for You!', preview: 'Wholesome Navratri fasting meals delivered to you', heading: 'Navratri Fasting Specials!', greeting: 'Dear {{first_name}},', paragraphs: ['Observing Navratri fast? We have curated a special sattvic menu with delicious fasting-friendly dishes — Sabudana Khichdi, Kuttu Puri, Singhare ke Atte ka Halwa, and more.', 'Order our Navratri Meal Box for the entire 9 days and get 15% off. Fresh, hygienic, and prepared with pure ingredients.'], ctaText: 'Order Fasting Menu', tags: ['food', 'fasting', 'vrat', 'sattvic'], industryTags: ['restaurant'] },
    { nameSuffix: 'Corporate', subject: 'Happy Navratri — Celebrating Strength & New Beginnings', preview: 'Nine nights of festive energy from our team to yours', heading: 'Happy Navratri!', greeting: 'Dear {{first_name}},', paragraphs: ['As Navratri brings nine nights of energy, devotion, and celebration, we at {{company_name}} wish you strength and success in all your endeavours.', 'May this festive season inspire new beginnings and prosperous partnerships. Happy Navratri!'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
  ]
);

// ========== DUSSEHRA (5 variants) ==========
const dussehraTemplates = generateFestivalTemplates(
  { subcategory: 'Dussehra', emoji: '🏹', color1: '#FF6F00', color2: '#B71C1C', baseTags: ['dussehra', 'vijayadashami', 'festival', 'indian', 'victory'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Dussehra! 🏹 Victory of Good Over Evil', preview: 'Celebrating the triumph of righteousness', heading: 'Happy Dussehra!', greeting: 'Dear {{first_name}},', paragraphs: ['On this auspicious day of Vijayadashami, we celebrate the victory of good over evil. May Lord Ram\'s triumph over Ravana inspire us to overcome every challenge with courage and faith.', 'Wishing you and your family a blessed Dussehra filled with strength, wisdom, and prosperity. Happy Dussehra from {{company_name}}!'], tags: ['greetings', 'victory'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Sale Offer', subject: '🎉 Dussehra Victory Sale — Up to 45% Off!', preview: 'Win big with our Dussehra sale across all categories', heading: 'Victory Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Celebrate the triumph of good over evil with our Dussehra Victory Sale! Enjoy up to 45% off on electronics, fashion, and home essentials.', 'Use code VICTORY45 at checkout. Flash deals every 3 hours. This sale ends at midnight on Vijayadashami!'], ctaText: 'Grab Victory Deals', tags: ['sale', 'discount'], industryTags: ['retail'] },
    { nameSuffix: 'Corporate', subject: 'Happy Dussehra — May Success Be Yours', preview: 'Warm festive wishes from the entire team', heading: 'Happy Dussehra!', greeting: 'Dear {{first_name}},', paragraphs: ['As we celebrate Dussehra, the festival of victory, {{company_name}} wishes you success in conquering every challenge ahead. May this festive season bring new triumphs to your business.', 'Here\'s to shared victories and continued growth together. Happy Vijayadashami!'], tags: ['corporate', 'formal'], industryTags: ['general'] },
    { nameSuffix: 'Warm Wishes', subject: 'Dussehra Wishes — Let Good Prevail in All You Do', preview: 'May righteousness guide your path this Dussehra', heading: 'Shubh Vijayadashami!', greeting: 'Dear {{first_name}},', paragraphs: ['As the effigy of Ravana burns bright, may it take away all negativity from your life. Dussehra reminds us that truth and righteousness always prevail.', 'Wishing you a joyful celebration with family and friends. May the coming year bring you unstoppable success!'], tags: ['warm-wishes', 'personal'], industryTags: ['general'] },
    { nameSuffix: 'Education', subject: '📚 Dussehra Offer — Conquer New Skills at 35% Off!', preview: 'Win the battle for a better career this Dussehra', heading: 'Learn & Conquer!', greeting: 'Dear {{first_name}},', paragraphs: ['This Dussehra, conquer new skills! Enroll in our professional courses and get 35% off. From coding to design, marketing to management — arm yourself with knowledge.', 'Use code CONQUER35 at enrollment. Offer valid for 3 days only. Victory awaits those who learn!'], ctaText: 'Start Learning', tags: ['education', 'courses', 'skills'], industryTags: ['education'] },
  ]
);

// ========== GANESH CHATURTHI (5 variants) ==========
const ganeshTemplates = generateFestivalTemplates(
  { subcategory: 'Ganesh Chaturthi', emoji: '🐘', color1: '#E65100', color2: '#FDD835', baseTags: ['ganesh-chaturthi', 'ganapati', 'festival', 'indian', 'ganpati'] },
  [
    { nameSuffix: 'Greetings', subject: 'Ganpati Bappa Morya! 🐘 Happy Ganesh Chaturthi!', preview: 'May Lord Ganesha bless you with wisdom and prosperity', heading: 'Ganpati Bappa Morya!', greeting: 'Dear {{first_name}},', paragraphs: ['May Lord Ganesha, the remover of obstacles, bless you with wisdom, prosperity, and success. Wishing you and your family a joyous Ganesh Chaturthi!', 'As we welcome Bappa into our homes and hearts, may his divine presence bring peace and happiness to your life. Ganpati Bappa Morya!'], tags: ['greetings', 'blessings'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Sale Offer', subject: '🛍️ Ganesh Chaturthi Sale — Auspicious Deals Inside!', preview: 'Shop auspicious deals on puja items and more', heading: 'Festive Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Celebrate Ganesh Chaturthi with our special festive sale! Get up to 40% off on puja items, modaks, home decor, and eco-friendly Ganesh idols.', 'Free delivery on all festive orders. Use code BAPPA40 at checkout. Celebrate the festival responsibly with our eco-friendly collection!'], ctaText: 'Shop Festive Deals', tags: ['sale', 'puja', 'modak', 'eco-friendly'], industryTags: ['retail'] },
    { nameSuffix: 'Restaurant', subject: '🍬 Ganesh Chaturthi Special — Modak Festival at Our Store!', preview: 'Celebrate with our authentic Modak and sweet collection', heading: 'Modak Festival!', greeting: 'Dear {{first_name}},', paragraphs: ['Lord Ganesha\'s favourite sweet is here in 10 delicious flavours! From traditional Ukdiche Modak to chocolate and dry fruit variations — we have them all.', 'Order our Ganesh Chaturthi Sweet Box and get a complimentary box of Pedas. Perfect for your home celebrations and gifting!'], ctaText: 'Order Modak Box', tags: ['food', 'sweets', 'modak'], industryTags: ['restaurant'] },
    { nameSuffix: 'Eco-Friendly', subject: '🌱 Celebrate Ganesh Chaturthi the Eco-Friendly Way!', preview: 'Choose eco-friendly idols and celebrate responsibly', heading: 'Go Green This Ganesh Chaturthi!', greeting: 'Dear {{first_name}},', paragraphs: ['This Ganesh Chaturthi, make a choice that protects our environment. Our eco-friendly Ganesh idols are made from natural clay, plant-based colours, and seed-embedded materials.', 'After visarjan, these idols dissolve safely and even grow into plants! Order now and receive free organic puja accessories with every idol.'], ctaText: 'Shop Eco-Friendly Idols', tags: ['eco-friendly', 'green', 'sustainable'], industryTags: ['retail'] },
    { nameSuffix: 'Corporate', subject: 'Happy Ganesh Chaturthi from {{company_name}}!', preview: 'Wishing you new beginnings and success', heading: 'Happy Ganesh Chaturthi!', greeting: 'Dear {{first_name}},', paragraphs: ['As we welcome the Lord of new beginnings, {{company_name}} wishes you a year of obstacles overcome and goals achieved.', 'May Lord Ganesha\'s wisdom guide our partnership to greater success. Ganpati Bappa Morya!'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
  ]
);

// ========== ONAM (5 variants) ==========
const onamTemplates = generateFestivalTemplates(
  { subcategory: 'Onam', emoji: '🌺', color1: '#2E7D32', color2: '#F9A825', baseTags: ['onam', 'festival', 'kerala', 'harvest', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Onam! 🌺 Celebrate the Spirit of Kerala!', preview: 'May King Mahabali bring prosperity to your home', heading: 'Happy Onam!', greeting: 'Dear {{first_name}},', paragraphs: ['As the fragrance of flowers fills the air and the spirit of Onam fills our hearts, we wish you a harvest season filled with joy and abundance.', 'May the legendary King Mahabali bring prosperity and happiness to you and your family. Happy Onam from {{company_name}}!'], tags: ['greetings', 'kerala'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Sale Offer', subject: '🛒 Onam Mega Sale — Kerala\'s Biggest Shopping Festival!', preview: 'Unbeatable deals on fashion, electronics, and more', heading: 'Onam Mega Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Celebrate the harvest festival with Kerala\'s biggest sale! Enjoy up to 50% off on gold jewellery, silk sarees, electronics, and home appliances.', 'Use code ONAM50 at checkout. Free shipping across Kerala. Flash deals every day during the 10-day Onam celebration!'], ctaText: 'Shop Onam Deals', tags: ['sale', 'offer', 'shopping'], industryTags: ['retail'] },
    { nameSuffix: 'Sadya Special', subject: '🍌 Onam Sadya — Traditional Feast Delivered to You!', preview: 'Authentic Kerala Sadya with 26 items on banana leaf', heading: 'Onam Sadya!', greeting: 'Dear {{first_name}},', paragraphs: ['No Onam is complete without a grand Sadya! Order our authentic 26-item Onam Sadya served on banana leaf, prepared by master chefs from Kerala.', 'Includes Avial, Sambar, Rasam, Payasam, Banana Chips, and all traditional dishes. Pre-book now for Thiruvonam day!'], ctaText: 'Order Sadya', tags: ['food', 'sadya', 'feast'], industryTags: ['restaurant'] },
    { nameSuffix: 'Corporate', subject: 'Happy Onam — Celebrating Abundance & Partnership', preview: 'Festive greetings from your trusted business partner', heading: 'Happy Onam!', greeting: 'Dear {{first_name}},', paragraphs: ['As we celebrate the season of harvest and abundance, {{company_name}} extends its warmest Onam wishes. May this festival bring a bountiful harvest of opportunities for your business.', 'We are grateful for our partnership and look forward to growing together. Happy Onam!'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
    { nameSuffix: 'Travel', subject: '✈️ Onam Getaway Deals — Explore God\'s Own Country!', preview: 'Special travel packages to experience Onam in Kerala', heading: 'Onam Travel Special!', greeting: 'Dear {{first_name}},', paragraphs: ['Experience the magic of Onam in God\'s Own Country! Our special Onam travel packages include houseboat stays in Alleppey, snake boat race viewing, and authentic Sadya experiences.', 'Book before August 15 and get 20% off on all Kerala packages. Includes airport transfers and guided tours!'], ctaText: 'Book Kerala Package', tags: ['travel', 'tourism', 'kerala', 'houseboat'], industryTags: ['general'] },
  ]
);

// ========== PONGAL (5 variants) ==========
const pongalTemplates = generateFestivalTemplates(
  { subcategory: 'Pongal', emoji: '🌾', color1: '#2E7D32', color2: '#FF8F00', baseTags: ['pongal', 'festival', 'harvest', 'tamil-nadu', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Pongalo Pongal! 🌾 Happy Harvest Festival!', preview: 'May the harvest season bring abundance to your life', heading: 'Happy Pongal!', greeting: 'Dear {{first_name}},', paragraphs: ['As the rice overflows in the pongal pot, may your life overflow with joy, prosperity, and good fortune. Wishing you and your family a bountiful Pongal!', 'May this harvest festival bring warmth and togetherness to your celebrations. Pongalo Pongal!'], tags: ['greetings', 'harvest'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Sale Offer', subject: '🛍️ Pongal Sale — Harvest Season Discounts Up to 40% Off!', preview: 'Reap amazing deals this Pongal season', heading: 'Pongal Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Celebrate the harvest with our Pongal Sale! Enjoy up to 40% off on silk sarees, jewellery, home appliances, and traditional cookware.', 'Use code PONGAL40 at checkout. Special offers on Pongal gift hampers and sugarcane-themed decor!'], ctaText: 'Shop Pongal Sale', tags: ['sale', 'offer'], industryTags: ['retail'] },
    { nameSuffix: 'Restaurant', subject: '🍚 Pongal Special Menu — Traditional Tamil Feast!', preview: 'Authentic Pongal dishes prepared with love', heading: 'Pongal Feast!', greeting: 'Dear {{first_name}},', paragraphs: ['Celebrate Pongal with our authentic Tamil feast! Enjoy Ven Pongal, Sakkarai Pongal, traditional murukku, and more — all prepared with freshly harvested ingredients.', 'Order our Pongal Special Thali for your family celebration. 15% off on bulk orders for community events.'], ctaText: 'Order Pongal Thali', tags: ['food', 'feast', 'tamil'], industryTags: ['restaurant'] },
    { nameSuffix: 'Corporate', subject: 'Happy Pongal — Celebrating Growth & Gratitude', preview: 'Warm Pongal wishes from our team to yours', heading: 'Happy Pongal!', greeting: 'Dear {{first_name}},', paragraphs: ['As we celebrate the harvest season, we at {{company_name}} reflect on the growth and success we have achieved together. Pongal symbolises gratitude for nature\'s bounty and the fruits of hard work.', 'Wishing you a prosperous year ahead. Happy Pongal!'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
    { nameSuffix: 'Agriculture', subject: '🚜 Pongal Special — Farming Equipment at Best Prices!', preview: 'Honour the harvest with deals on farming essentials', heading: 'Pongal Farming Deals!', greeting: 'Dear {{first_name}},', paragraphs: ['This Pongal, we honour the farming community with special deals on agricultural equipment, seeds, and tools. Get up to 25% off on tractors, pumps, and farming essentials.', 'EMI options available. Free delivery across Tamil Nadu. Book a demo today!'], ctaText: 'Browse Equipment', tags: ['agriculture', 'farming', 'equipment'], industryTags: ['general'] },
  ]
);

// ========== MAKAR SANKRANTI (4 variants) ==========
const sankrantiTemplates = generateFestivalTemplates(
  { subcategory: 'Makar Sankranti', emoji: '🪁', color1: '#FF9800', color2: '#4CAF50', baseTags: ['makar-sankranti', 'sankranti', 'festival', 'kite', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Makar Sankranti! 🪁 Soar High Like a Kite!', preview: 'May your dreams soar high this Sankranti', heading: 'Happy Sankranti!', greeting: 'Dear {{first_name}},', paragraphs: ['As kites paint the sky with colour, may your aspirations soar to new heights. Wishing you a Makar Sankranti filled with warmth, sesame sweets, and boundless joy!', 'May the sun\'s transition bring positive energy and new beginnings to your life. Tilgul ghya, god god bola!'], tags: ['greetings', 'kite-flying'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Sale Offer', subject: '🪁 Sankranti Sale — Sky-High Savings Await!', preview: 'Fly into savings with our Sankranti special offers', heading: 'Sankranti Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Let your savings soar this Sankranti! Enjoy up to 35% off on winter wear, kite-flying kits, sesame treats, and more.', 'Use code KITE35 at checkout. Free tilgul box with every order above ₹1,000!'], ctaText: 'Shop Sankranti Deals', tags: ['sale', 'offer'], industryTags: ['retail'] },
    { nameSuffix: 'Corporate', subject: 'Happy Makar Sankranti from {{company_name}}', preview: 'Warm wishes for a sweet and successful year ahead', heading: 'Happy Sankranti!', greeting: 'Dear {{first_name}},', paragraphs: ['As we celebrate the harvest festival of Makar Sankranti, {{company_name}} wishes you sweetness in your relationships and success in your endeavours.', 'May this Sankranti mark the beginning of a fruitful partnership ahead. Tilgul ghya, god god bola!'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
    { nameSuffix: 'Warm Wishes', subject: 'Sankranti Ki Shubhkamnayein — Sweet Beginnings Ahead!', preview: 'Sharing warmth and sesame sweets this Sankranti', heading: 'Shubh Sankranti!', greeting: 'Dear {{first_name}},', paragraphs: ['As the sun journeys northward, may it bring warmth and light to every corner of your life. Makar Sankranti is a reminder that better days are always ahead.', 'Enjoy tilgul, fly kites, and celebrate the beauty of this harvest festival with loved ones!'], tags: ['warm-wishes', 'personal'], industryTags: ['general'] },
  ]
);

// ========== UGADI / GUDI PADWA (4 variants) ==========
const ugadiTemplates = generateFestivalTemplates(
  { subcategory: 'Ugadi / Gudi Padwa', emoji: '🌸', color1: '#FF9800', color2: '#7B1FA2', baseTags: ['ugadi', 'gudi-padwa', 'new-year', 'festival', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Ugadi & Gudi Padwa! 🌸 A Fresh Start!', preview: 'New year, new beginnings — wishing you the very best', heading: 'Happy Ugadi!', greeting: 'Dear {{first_name}},', paragraphs: ['As the new year dawns for many across India, we wish you a Ugadi and Gudi Padwa filled with sweetness, prosperity, and new beginnings!', 'May the Bevu-Bella (bitter and sweet) of life teach us to embrace every experience. Wishing you a beautiful year ahead!'], tags: ['greetings', 'new-year'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Sale Offer', subject: '🎉 Ugadi Sale — New Year, New Deals Up to 40% Off!', preview: 'Start the new year with amazing shopping offers', heading: 'Ugadi Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Ring in the new year with our Ugadi Sale! Enjoy up to 40% off on gold jewellery, silk sarees, home furnishings, and more.', 'Use code UGADI40 at checkout. Exclusive new year offer — shop now and step into the new year in style!'], ctaText: 'Shop New Year Sale', tags: ['sale', 'new-year'], industryTags: ['retail'] },
    { nameSuffix: 'Corporate', subject: 'Happy Ugadi — New Beginnings for Our Partnership', preview: 'Warm greetings on the Telugu and Kannada New Year', heading: 'Happy Ugadi!', greeting: 'Dear {{first_name}},', paragraphs: ['As we celebrate Ugadi, the start of a new chapter, {{company_name}} extends its warmest wishes. May this new year bring innovation, growth, and success to your organisation.', 'We look forward to writing another year of success together!'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
    { nameSuffix: 'Restaurant', subject: '🍽️ Ugadi Special Menu — Bevu-Bella & Traditional Feast!', preview: 'Celebrate the new year with our authentic Ugadi thali', heading: 'Ugadi Special!', greeting: 'Dear {{first_name}},', paragraphs: ['Welcome the new year with a traditional Ugadi feast! Our special menu includes Ugadi Pachadi (with all six tastes), Pulihora, Bobbatlu, and authentic Andhra-Karnataka delicacies.', 'Order our New Year Thali and get a complimentary box of Bevu-Bella. Perfect for family celebrations!'], ctaText: 'Order Ugadi Thali', tags: ['food', 'feast', 'new-year'], industryTags: ['restaurant'] },
  ]
);

// ========== BAISAKHI (4 variants) ==========
const baishakhiTemplates = generateFestivalTemplates(
  { subcategory: 'Baisakhi', emoji: '🌾', color1: '#FF9800', color2: '#388E3C', baseTags: ['baisakhi', 'vaisakhi', 'festival', 'punjab', 'harvest', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Baisakhi! 🌾 Celebrating the Harvest!', preview: 'Joy, bhangra, and abundant blessings this Baisakhi', heading: 'Happy Baisakhi!', greeting: 'Dear {{first_name}},', paragraphs: ['As the golden wheat sways in the fields, we wish you a Baisakhi filled with joy, prosperity, and the spirit of new beginnings!', 'May the harvest season bring abundance to your life. Let the drums of Bhangra echo with celebration. Happy Baisakhi!'], tags: ['greetings', 'harvest', 'punjab'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Sale Offer', subject: '🛍️ Baisakhi Sale — Harvest Season Discounts!', preview: 'Reap amazing deals this Baisakhi season', heading: 'Baisakhi Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Celebrate the harvest festival with our special Baisakhi sale! Get up to 35% off on Punjabi suits, jutti, and ethnic accessories.', 'Free shipping on all orders. Use code BAISAKHI35. Limited period offer — shop now!'], ctaText: 'Shop Baisakhi Sale', tags: ['sale', 'fashion', 'ethnic'], industryTags: ['retail'] },
    { nameSuffix: 'Corporate', subject: 'Happy Baisakhi from {{company_name}} — New Year, New Goals!', preview: 'Warm Baisakhi greetings from our professional team', heading: 'Happy Baisakhi!', greeting: 'Dear {{first_name}},', paragraphs: ['As Baisakhi marks a new year in the Sikh calendar, we at {{company_name}} wish you renewed energy and prosperity for the year ahead.', 'May this harvest season bring a bounty of opportunities. Happy Baisakhi!'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
    { nameSuffix: 'Restaurant', subject: '🍛 Baisakhi Special — Authentic Punjabi Feast!', preview: 'Celebrate Baisakhi with butter chicken and more', heading: 'Baisakhi Feast!', greeting: 'Dear {{first_name}},', paragraphs: ['Celebrate Baisakhi with a grand Punjabi feast! Our special menu features Butter Chicken, Sarson da Saag with Makki di Roti, Dal Makhani, and traditional Jalebi.', 'Book your Baisakhi feast and get 15% off on group dining. Live Dhol and Bhangra at select locations!'], ctaText: 'Book Your Feast', tags: ['food', 'punjabi', 'feast'], industryTags: ['restaurant'] },
  ]
);

// ========== DURGA PUJA (5 variants) ==========
const durgaPujaTemplates = generateFestivalTemplates(
  { subcategory: 'Durga Puja', emoji: '🔱', color1: '#C62828', color2: '#FF6F00', baseTags: ['durga-puja', 'durga', 'festival', 'bengal', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Shubho Bijoya! 🔱 Happy Durga Puja!', preview: 'May Maa Durga bless you with strength and victory', heading: 'Shubho Durga Puja!', greeting: 'Dear {{first_name}},', paragraphs: ['As the sounds of Dhak drums fill the air and the aroma of incense spreads, we wish you a Durga Puja filled with divine blessings.', 'May Maa Durga grant you strength, wisdom, and victory over all obstacles. Shubho Bijoya from {{company_name}}!'], tags: ['greetings', 'bijoya', 'bengal'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Sale Offer', subject: '🛍️ Durga Puja Sale — Pujo Shopping Made Special!', preview: 'Your favourite brands at festive prices this Pujo', heading: 'Pujo Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Pujo shopping just got better! Enjoy up to 45% off on sarees, jewellery, electronics, and festive home decor.', 'Free gift wrapping on all orders. Use code SHUBHO45 at checkout. Shop the best Pujo deals now!'], ctaText: 'Shop Pujo Collection', tags: ['sale', 'pujo', 'shopping'], industryTags: ['retail'] },
    { nameSuffix: 'Pandal Hopping', subject: '🎪 Durga Puja Pandal Guide — Must-Visit Celebrations!', preview: 'Discover the best Pujo pandals and events near you', heading: 'Pujo Pandal Guide!', greeting: 'Dear {{first_name}},', paragraphs: ['Your ultimate guide to the best Durga Puja pandals this year! We have curated the top 20 must-visit pandals with themes, locations, and timings.', 'Download our Pujo guide and plan your pandal hopping route. Includes recommendations for the best street food stops along the way!'], ctaText: 'Get Pujo Guide', tags: ['pandal', 'events', 'guide'], industryTags: ['general'] },
    { nameSuffix: 'Restaurant', subject: '🍽️ Pujo Special — Authentic Bengali Feast Awaits!', preview: 'Savour the taste of Bengal with our Pujo menu', heading: 'Pujo Special Menu!', greeting: 'Dear {{first_name}},', paragraphs: ['Celebrate Durga Puja with a grand Bengali feast! Our Pujo Special Menu features Luchi-Alur Dom, Kosha Mangsho, Chingri Malai Curry, Mishti Doi, and Sandesh.', 'Order our Bijoya Special Hamper for corporate gifting. 20% off on pre-orders!'], ctaText: 'Order Pujo Menu', tags: ['food', 'bengali', 'feast'], industryTags: ['restaurant'] },
    { nameSuffix: 'Corporate', subject: 'Shubho Durga Puja — Festive Greetings from {{company_name}}', preview: 'Warm Pujo wishes from our team to yours', heading: 'Shubho Durga Puja!', greeting: 'Dear {{first_name}},', paragraphs: ['As we celebrate the divine arrival of Maa Durga, {{company_name}} wishes you and your organisation a blessed Pujo season.', 'May the coming year bring courage, prosperity, and new beginnings. Shubho Bijoya!'], tags: ['corporate', 'b2b', 'formal'], industryTags: ['general'] },
  ]
);

// ========== RAKSHA BANDHAN (5 variants) ==========
const rakshaTemplates = generateFestivalTemplates(
  { subcategory: 'Raksha Bandhan', emoji: '🧵', color1: '#E91E63', color2: '#FDD835', baseTags: ['raksha-bandhan', 'rakhi', 'festival', 'siblings', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Raksha Bandhan! 🧵 Celebrating the Bond of Love', preview: 'Honouring the beautiful bond between siblings', heading: 'Happy Raksha Bandhan!', greeting: 'Dear {{first_name}},', paragraphs: ['The sacred thread of Rakhi symbolises the unbreakable bond of love, trust, and protection between siblings. Wishing you a Raksha Bandhan filled with warmth and togetherness.', 'May this special day strengthen the bonds that mean the most. Happy Raksha Bandhan from {{company_name}}!'], tags: ['greetings', 'siblings', 'love'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Gift Ideas', subject: '🎁 Rakhi Gift Guide — Perfect Gifts for Your Sibling!', preview: 'Find the perfect Rakhi gift with our curated collection', heading: 'Rakhi Gift Guide!', greeting: 'Hi {{first_name}},', paragraphs: ['Looking for the perfect Rakhi gift? We have curated gift sets for brothers and sisters — from grooming kits and gadgets to jewellery and chocolates.', 'Order now and get free Rakhi with every gift above ₹999. Express delivery available for last-minute shoppers!'], ctaText: 'Shop Rakhi Gifts', tags: ['gifts', 'shopping', 'rakhi'], industryTags: ['retail'] },
    { nameSuffix: 'Sale Offer', subject: '🛍️ Raksha Bandhan Sale — Flat 25% Off + Free Rakhi!', preview: 'Special deals to make Rakhi celebrations memorable', heading: 'Rakhi Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Celebrate the bond of love with our Raksha Bandhan Sale! Enjoy flat 25% off on fashion, accessories, chocolates, and gift hampers.', 'Every order includes a beautifully handcrafted Rakhi free! Use code RAKHI25 at checkout.'], ctaText: 'Shop Now', tags: ['sale', 'offer', 'discount'], industryTags: ['retail'] },
    { nameSuffix: 'Corporate', subject: 'Happy Raksha Bandhan — Celebrating Bonds That Protect', preview: 'Warm wishes on the festival of sibling love', heading: 'Happy Raksha Bandhan!', greeting: 'Dear {{first_name}},', paragraphs: ['Raksha Bandhan reminds us that the strongest partnerships are built on trust and mutual care — just like the bond between siblings.', 'From our work family at {{company_name}}, we wish you a beautiful Raksha Bandhan celebration.'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
    { nameSuffix: 'Long Distance', subject: '💌 Miles Apart but Hearts Together — Send Rakhi Online!', preview: 'Send love across distances with our Rakhi delivery', heading: 'Send Rakhi with Love!', greeting: 'Dear {{first_name}},', paragraphs: ['Living far from your sibling? Don\'t let distance come between your Rakhi celebrations! Send a beautiful Rakhi with sweets and gifts anywhere in India with guaranteed delivery.', 'Same-day and next-day delivery available in 500+ cities. Personalised message cards included free!'], ctaText: 'Send Rakhi Online', tags: ['online', 'delivery', 'distance'], industryTags: ['retail'] },
  ]
);

// ========== JANMASHTAMI (4 variants) ==========
const janmashtamiTemplates = generateFestivalTemplates(
  { subcategory: 'Janmashtami', emoji: '🦚', color1: '#1565C0', color2: '#FFD700', baseTags: ['janmashtami', 'krishna', 'festival', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Janmashtami! 🦚 Hare Krishna!', preview: 'Celebrating the birth of Lord Krishna with devotion', heading: 'Happy Janmashtami!', greeting: 'Dear {{first_name}},', paragraphs: ['On the auspicious occasion of Janmashtami, we celebrate the birth of Lord Krishna — the symbol of love, wisdom, and divine play.', 'May Lord Krishna\'s flute fill your life with melody and His teachings guide your path. Happy Janmashtami!'], tags: ['greetings', 'krishna', 'devotion'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Sale Offer', subject: '🛍️ Janmashtami Sale — Divine Deals on Puja Essentials!', preview: 'Shop festive essentials at blessed prices', heading: 'Janmashtami Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Celebrate Janmashtami with our special sale on puja items, Krishna idols, butter-themed hampers, and festive decor!', 'Get 20% off on all festive collections. Use code KRISHNA20. Free peacock feather bookmark with every order!'], ctaText: 'Shop Festive Deals', tags: ['sale', 'puja', 'shopping'], industryTags: ['retail'] },
    { nameSuffix: 'Restaurant', subject: '🧈 Janmashtami Special — Makhan & Sweets Festival!', preview: 'Celebrate with Lord Krishna\'s favourite treats', heading: 'Krishna\'s Feast!', greeting: 'Dear {{first_name}},', paragraphs: ['Celebrate Janmashtami with Lord Krishna\'s favourite foods! Our special menu features Maakhan Mishri, Panjiri, Dhaniya Panjiri, Malpua, and a variety of milk sweets.', 'Order our Janmashtami Sweet Box for midnight celebrations. 15% off on pre-orders!'], ctaText: 'Order Sweet Box', tags: ['food', 'sweets', 'makhan'], industryTags: ['restaurant'] },
    { nameSuffix: 'Corporate', subject: 'Happy Janmashtami — Wisdom for the Journey Ahead', preview: 'Drawing inspiration from the Bhagavad Gita', heading: 'Happy Janmashtami!', greeting: 'Dear {{first_name}},', paragraphs: ['As we celebrate Lord Krishna\'s birth, we are reminded of the timeless wisdom of the Bhagavad Gita: "Do your duty without attachment to results."', 'At {{company_name}}, we strive to embody this philosophy in our work. Wishing you a blessed Janmashtami!'], tags: ['corporate', 'b2b', 'wisdom'], industryTags: ['general'] },
  ]
);

// ========== RAM NAVAMI (3 variants) ==========
const ramNavamiTemplates = generateFestivalTemplates(
  { subcategory: 'Ram Navami', emoji: '🏹', color1: '#FF6F00', color2: '#FFD700', baseTags: ['ram-navami', 'rama', 'festival', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Ram Navami! 🏹 Jai Shri Ram!', preview: 'Celebrating the birth of Lord Rama with devotion', heading: 'Happy Ram Navami!', greeting: 'Dear {{first_name}},', paragraphs: ['On the sacred occasion of Ram Navami, we celebrate the birth of Lord Rama — the embodiment of dharma, courage, and compassion.', 'May Lord Rama\'s blessings illuminate your path and His ideals of truth and righteousness inspire your journey. Jai Shri Ram!'], tags: ['greetings', 'devotion'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Corporate', subject: 'Happy Ram Navami — Walking the Path of Dharma Together', preview: 'Warm wishes on the birth anniversary of Lord Rama', heading: 'Happy Ram Navami!', greeting: 'Dear {{first_name}},', paragraphs: ['As we honour the birth of Lord Rama, {{company_name}} reaffirms its commitment to integrity, excellence, and righteous business practices.', 'Wishing you and your organisation a blessed Ram Navami.'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
    { nameSuffix: 'Warm Wishes', subject: 'Ram Navami — May Truth and Virtue Guide Your Path', preview: 'Heartfelt wishes on this auspicious occasion', heading: 'Shri Ram Navami!', greeting: 'Dear {{first_name}},', paragraphs: ['Ram Navami reminds us that truth always triumphs. May Lord Rama\'s unwavering commitment to dharma inspire us to walk the path of virtue.', 'Wishing you and your family a peaceful and blessed celebration. Happy Ram Navami!'], tags: ['warm-wishes', 'personal'], industryTags: ['general'] },
  ]
);

// ========== HANUMAN JAYANTI (3 variants) ==========
const hanumanTemplates = generateFestivalTemplates(
  { subcategory: 'Hanuman Jayanti', emoji: '🙏', color1: '#FF6F00', color2: '#C62828', baseTags: ['hanuman-jayanti', 'hanuman', 'festival', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Hanuman Jayanti! 🙏 Jai Bajrang Bali!', preview: 'Celebrating the strength and devotion of Lord Hanuman', heading: 'Jai Hanuman!', greeting: 'Dear {{first_name}},', paragraphs: ['On the auspicious occasion of Hanuman Jayanti, we celebrate the power of devotion, courage, and selfless service embodied by Lord Hanuman.', 'May Bajrang Bali grant you the strength to overcome every obstacle. Jai Hanuman!'], tags: ['greetings', 'devotion'], industryTags: ['general'] },
    { nameSuffix: 'Corporate', subject: 'Hanuman Jayanti — Strength, Service, and Success', preview: 'Drawing inspiration from Lord Hanuman\'s dedication', heading: 'Happy Hanuman Jayanti!', greeting: 'Dear {{first_name}},', paragraphs: ['Lord Hanuman teaches us that true strength lies in devotion and service. At {{company_name}}, we strive to serve our partners with the same unwavering dedication.', 'Wishing you a blessed Hanuman Jayanti!'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
    { nameSuffix: 'Warm Wishes', subject: 'Hanuman Jayanti — May Strength and Courage Be Yours', preview: 'Invoking the blessings of Bajrang Bali for you', heading: 'Jai Bajrang Bali!', greeting: 'Dear {{first_name}},', paragraphs: ['May Lord Hanuman\'s boundless energy and unwavering devotion inspire you to achieve greatness. May His blessings protect you and your loved ones always.', 'Wishing you a powerful and blessed Hanuman Jayanti!'], tags: ['warm-wishes', 'strength'], industryTags: ['general'] },
  ]
);

// ========== GURU NANAK JAYANTI (4 variants) ==========
const guruNanakTemplates = generateFestivalTemplates(
  { subcategory: 'Guru Nanak Jayanti', emoji: '🙏', color1: '#1565C0', color2: '#FF6F00', baseTags: ['guru-nanak-jayanti', 'gurpurab', 'sikh', 'festival', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Guru Nanak Jayanti! 🙏 Waheguru Ji Ka Khalsa!', preview: 'Celebrating the birth of Guru Nanak Dev Ji', heading: 'Happy Gurpurab!', greeting: 'Dear {{first_name}},', paragraphs: ['On the blessed occasion of Guru Nanak Jayanti, we remember the teachings of equality, compassion, and honest living. May Guru Nanak Dev Ji\'s light guide your path.', 'Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh! Happy Gurpurab from {{company_name}}!'], tags: ['greetings', 'gurpurab', 'sikh'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Sale Offer', subject: '🛍️ Gurpurab Sale — Blessed Deals on Festive Collection!', preview: 'Celebrate Guru Nanak Jayanti with special offers', heading: 'Gurpurab Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Celebrate the spirit of Gurpurab with our festive sale! Enjoy up to 30% off on ethnic wear, religious items, and festive hampers.', 'Free shipping on all orders above ₹1,000. Use code GURU30 at checkout!'], ctaText: 'Shop Gurpurab Sale', tags: ['sale', 'offer'], industryTags: ['retail'] },
    { nameSuffix: 'Corporate', subject: 'Happy Guru Nanak Jayanti — Embracing Equality & Service', preview: 'Warm greetings on this sacred Sikh festival', heading: 'Happy Gurpurab!', greeting: 'Dear {{first_name}},', paragraphs: ['Guru Nanak Dev Ji taught us that true success comes from serving others with humility and treating everyone as equals. These values guide us at {{company_name}}.', 'Wishing you a blessed Guru Nanak Jayanti!'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
    { nameSuffix: 'Langar Seva', subject: '🍲 Guru Nanak Jayanti — Join Us for Community Langar!', preview: 'You are invited to our community kitchen and prayers', heading: 'Langar Seva Invitation!', greeting: 'Dear {{first_name}},', paragraphs: ['In the spirit of Guru Nanak Dev Ji\'s teachings on equality and seva, we invite you to our community Langar on Gurpurab.', 'Join us for prayers, kirtan, and a communal meal where everyone is welcome regardless of background. Waheguru!'], ctaText: 'RSVP for Langar', tags: ['langar', 'seva', 'community', 'event'], industryTags: ['general'] },
  ]
);

// ========== BUDDHA PURNIMA (3 variants) ==========
const buddhaPurnimaTemplates = generateFestivalTemplates(
  { subcategory: 'Buddha Purnima', emoji: '🪷', color1: '#FF6F00', color2: '#880E4F', baseTags: ['buddha-purnima', 'vesak', 'buddhist', 'festival', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Buddha Purnima! 🪷 Peace and Enlightenment', preview: 'Celebrating the birth of Gautama Buddha', heading: 'Happy Buddha Purnima!', greeting: 'Dear {{first_name}},', paragraphs: ['On the sacred occasion of Buddha Purnima, we celebrate the birth, enlightenment, and parinirvana of Lord Buddha. May His teachings of compassion, non-violence, and mindfulness guide your life.', 'In the words of the Buddha: "Peace comes from within. Do not seek it without." Wishing you inner peace and enlightenment.'], tags: ['greetings', 'peace', 'buddhist'], industryTags: ['general'] },
    { nameSuffix: 'Corporate', subject: 'Buddha Purnima — Mindfulness in Business and Life', preview: 'Drawing wisdom from the Enlightened One for our work', heading: 'Happy Buddha Purnima!', greeting: 'Dear {{first_name}},', paragraphs: ['Lord Buddha taught us that mindfulness and right action lead to lasting success. At {{company_name}}, we embrace these principles in our commitment to ethical business.', 'Wishing you a peaceful and reflective Buddha Purnima.'], tags: ['corporate', 'mindfulness'], industryTags: ['general'] },
    { nameSuffix: 'Warm Wishes', subject: 'Buddha Purnima — Walk the Path of Compassion', preview: 'May Lord Buddha\'s light illuminate your journey', heading: 'Blessed Buddha Purnima!', greeting: 'Dear {{first_name}},', paragraphs: ['As the full moon of Vaishakha lights the sky, may Lord Buddha\'s wisdom light your inner world. This day reminds us to live with kindness, awareness, and compassion.', 'May you find the middle path and walk with grace. Happy Buddha Purnima!'], tags: ['warm-wishes', 'compassion'], industryTags: ['general'] },
  ]
);

// ========== MAHAVIR JAYANTI (3 variants) ==========
const mahavirTemplates = generateFestivalTemplates(
  { subcategory: 'Mahavir Jayanti', emoji: '🙏', color1: '#880E4F', color2: '#FFD700', baseTags: ['mahavir-jayanti', 'jain', 'festival', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Mahavir Jayanti! 🙏 Ahimsa Paramo Dharma', preview: 'Celebrating the birth of Lord Mahavira', heading: 'Happy Mahavir Jayanti!', greeting: 'Dear {{first_name}},', paragraphs: ['On the sacred occasion of Mahavir Jayanti, we celebrate the life and teachings of Lord Mahavira — the champion of non-violence, truth, and self-discipline.', 'May His timeless message of "Ahimsa Paramo Dharma" (non-violence is the highest duty) inspire peace in our hearts and actions.'], tags: ['greetings', 'jain', 'ahimsa'], industryTags: ['general'] },
    { nameSuffix: 'Corporate', subject: 'Mahavir Jayanti — Ethical Business, Peaceful Progress', preview: 'Honoring Lord Mahavira\'s principles in our work', heading: 'Happy Mahavir Jayanti!', greeting: 'Dear {{first_name}},', paragraphs: ['Lord Mahavira\'s teachings on non-violence, truthfulness, and ethical conduct resonate deeply with responsible business practices.', 'At {{company_name}}, we are committed to these values. Wishing you a peaceful Mahavir Jayanti!'], tags: ['corporate', 'ethical'], industryTags: ['general'] },
    { nameSuffix: 'Warm Wishes', subject: 'Mahavir Jayanti — May Peace Prevail in Your Life', preview: 'Wishing you harmony and spiritual growth', heading: 'Jai Jinendra!', greeting: 'Dear {{first_name}},', paragraphs: ['As we honour the 24th Tirthankara, may His teachings of self-restraint, truthfulness, and compassion illuminate your path.', 'Wishing you spiritual growth and inner peace. Jai Jinendra! Happy Mahavir Jayanti!'], tags: ['warm-wishes', 'peace', 'spiritual'], industryTags: ['general'] },
  ]
);

// ========== MAHA SHIVRATRI (4 variants) ==========
const shivratriTemplates = generateFestivalTemplates(
  { subcategory: 'Maha Shivratri', emoji: '🔱', color1: '#311B92', color2: '#00BCD4', baseTags: ['maha-shivratri', 'shiva', 'festival', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Maha Shivratri! 🔱 Har Har Mahadev!', preview: 'Celebrating the great night of Lord Shiva', heading: 'Har Har Mahadev!', greeting: 'Dear {{first_name}},', paragraphs: ['On the auspicious night of Maha Shivratri, we bow to Lord Shiva — the destroyer of ignorance and the source of transformation.', 'May Mahadev bless you with inner peace, strength, and the wisdom to transform challenges into opportunities. Om Namah Shivaya!'], tags: ['greetings', 'devotion', 'shiva'], industryTags: ['general'], featured: true },
    { nameSuffix: 'Sale Offer', subject: '🛍️ Shivratri Sale — Blessed Savings on Puja Items!', preview: 'Special deals on Rudraksha, puja essentials, and more', heading: 'Shivratri Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Celebrate Maha Shivratri with our exclusive sale on Rudraksha malas, Shiva idols, puja items, and spiritual accessories.', 'Get 25% off on all puja collections. Use code SHIVA25 at checkout. Om Namah Shivaya!'], ctaText: 'Shop Shivratri Sale', tags: ['sale', 'puja', 'spiritual'], industryTags: ['retail'] },
    { nameSuffix: 'Corporate', subject: 'Happy Maha Shivratri — Transformation and Renewal', preview: 'Embracing the spirit of transformation this Shivratri', heading: 'Happy Shivratri!', greeting: 'Dear {{first_name}},', paragraphs: ['Maha Shivratri symbolises the power of transformation. At {{company_name}}, we embrace this spirit in our continuous pursuit of innovation and excellence.', 'Wishing you a night of divine blessings and a year of positive transformation!'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
    { nameSuffix: 'Warm Wishes', subject: 'Maha Shivratri — May Shiva\'s Blessings Transform Your Life', preview: 'Invoking the cosmic energy of Lord Shiva for you', heading: 'Om Namah Shivaya!', greeting: 'Dear {{first_name}},', paragraphs: ['As the cosmic dance of Lord Nataraja continues, may this Shivratri bring a transformative energy to your life — dissolving the old and welcoming the new.', 'May Lord Shiva\'s third eye of wisdom open new perspectives for you. Happy Maha Shivratri!'], tags: ['warm-wishes', 'spiritual'], industryTags: ['general'] },
  ]
);

// ========== VASANT PANCHAMI (3 variants) ==========
const vasantTemplates = generateFestivalTemplates(
  { subcategory: 'Vasant Panchami', emoji: '🌼', color1: '#FDD835', color2: '#FF9800', baseTags: ['vasant-panchami', 'saraswati', 'festival', 'spring', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Vasant Panchami! 🌼 Blessings of Saraswati', preview: 'Celebrating knowledge and the arrival of spring', heading: 'Happy Vasant Panchami!', greeting: 'Dear {{first_name}},', paragraphs: ['As spring blossoms and yellow flowers adorn our homes, we celebrate Vasant Panchami — the day of Goddess Saraswati, the deity of knowledge and wisdom.', 'May Maa Saraswati bless you with creativity, learning, and the wisdom to excel in all your pursuits. Happy Vasant Panchami!'], tags: ['greetings', 'saraswati', 'spring'], industryTags: ['general'] },
    { nameSuffix: 'Education', subject: '📚 Vasant Panchami — Auspicious Day to Begin Learning!', preview: 'Start your educational journey on this blessed day', heading: 'Learn & Grow!', greeting: 'Dear {{first_name}},', paragraphs: ['Vasant Panchami is considered the most auspicious day to begin new learning. Whether you are starting a new course, picking up a musical instrument, or learning a new skill — today is the day!', 'Enroll in any course today and get 30% off as our Saraswati blessing. Use code VIDYA30!'], ctaText: 'Start Learning Today', tags: ['education', 'learning', 'courses'], industryTags: ['education'] },
    { nameSuffix: 'Corporate', subject: 'Happy Vasant Panchami — Celebrating Knowledge & Innovation', preview: 'Warm wishes for a season of learning and growth', heading: 'Happy Vasant Panchami!', greeting: 'Dear {{first_name}},', paragraphs: ['On Vasant Panchami, {{company_name}} celebrates the power of knowledge and continuous learning that drives innovation in our industry.', 'May Goddess Saraswati bless our shared endeavours with wisdom and success. Happy Vasant Panchami!'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
  ]
);

// ========== KARWA CHAUTH (3 variants) ==========
const karwaChAuthTemplates = generateFestivalTemplates(
  { subcategory: 'Karwa Chauth', emoji: '🌙', color1: '#C62828', color2: '#FFD700', baseTags: ['karwa-chauth', 'festival', 'love', 'marriage', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Karwa Chauth! 🌙 Celebrating Love & Devotion', preview: 'Honouring the beautiful bond of married love', heading: 'Happy Karwa Chauth!', greeting: 'Dear {{first_name}},', paragraphs: ['As the moon rises and completes the sacred fast, we celebrate the beautiful bond of love and devotion between married couples.', 'Wishing you and your partner a Karwa Chauth filled with love, togetherness, and everlasting blessings.'], tags: ['greetings', 'love', 'marriage'], industryTags: ['general'] },
    { nameSuffix: 'Sale Offer', subject: '💍 Karwa Chauth Sale — Gifts for Your Better Half!', preview: 'Surprise your partner with our exclusive collection', heading: 'Karwa Chauth Special!', greeting: 'Hi {{first_name}},', paragraphs: ['Make this Karwa Chauth extra special! Shop our curated collection of jewellery, sarees, mehendi sets, and couple gift hampers at 30% off.', 'Free personalised gift wrapping. Use code LOVE30 at checkout. Same-day delivery available!'], ctaText: 'Shop Karwa Chauth Gifts', tags: ['sale', 'gifts', 'jewellery'], industryTags: ['retail'] },
    { nameSuffix: 'Restaurant', subject: '🍽️ Karwa Chauth Special Dinner — Break Your Fast in Style!', preview: 'Book a romantic dinner to celebrate your love', heading: 'Moonlit Dinner!', greeting: 'Dear {{first_name}},', paragraphs: ['After a day of fasting, celebrate your love with a romantic Karwa Chauth dinner! Our special menu includes a moonlit terrace setting, couple\'s thali, and complimentary dessert.', 'Book early — seats are limited! Special couple packages starting at ₹1,499.'], ctaText: 'Book Your Table', tags: ['restaurant', 'dinner', 'romantic'], industryTags: ['restaurant'] },
  ]
);

// ========== TEEJ (3 variants) ==========
const teejTemplates = generateFestivalTemplates(
  { subcategory: 'Teej', emoji: '💚', color1: '#E91E63', color2: '#4CAF50', baseTags: ['teej', 'hariyali-teej', 'festival', 'women', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Teej! 💚 Celebrating Womanhood & Love', preview: 'Wishing you joy and green bangles this Teej', heading: 'Happy Teej!', greeting: 'Dear {{first_name}},', paragraphs: ['As the monsoon rains bring freshness to the earth, Teej celebrates the spirit of womanhood, love, and marital bliss. May this festival bring joy and green bangles to your life!', 'Wishing you a beautiful Teej filled with mehndi, jhula, and the sweet taste of ghevar!'], tags: ['greetings', 'women', 'monsoon'], industryTags: ['general'] },
    { nameSuffix: 'Sale Offer', subject: '🛍️ Teej Sale — Ethnic Wear & Jewellery at 35% Off!', preview: 'Dress up for Teej with our stunning collection', heading: 'Teej Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Celebrate Teej in style! Shop our exclusive collection of green lehengas, bandhani dupattas, lac bangles, and henna cones at 35% off.', 'Free mehndi cone with every order. Use code TEEJ35 at checkout!'], ctaText: 'Shop Teej Collection', tags: ['sale', 'ethnic', 'fashion'], industryTags: ['retail'] },
    { nameSuffix: 'Restaurant', subject: '🍬 Teej Special — Ghevar & Rajasthani Feast!', preview: 'Authentic Rajasthani Teej celebration at our restaurant', heading: 'Teej Feast!', greeting: 'Dear {{first_name}},', paragraphs: ['Celebrate Teej with an authentic Rajasthani feast! Our special menu features Ghevar, Dal Baati Churma, Gatte ki Sabzi, and traditional sweets.', 'Ladies\' group dining gets 20% off! Mehndi artist available at select locations.'], ctaText: 'Book Your Teej Party', tags: ['food', 'ghevar', 'rajasthani'], industryTags: ['restaurant'] },
  ]
);

// ========== LOHRI (3 variants) ==========
const lohriTemplates = generateFestivalTemplates(
  { subcategory: 'Lohri', emoji: '🔥', color1: '#FF6F00', color2: '#795548', baseTags: ['lohri', 'festival', 'bonfire', 'punjab', 'winter', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Lohri! 🔥 Warmth, Joy, and Celebrations!', preview: 'May the bonfire of Lohri bring warmth to your life', heading: 'Happy Lohri!', greeting: 'Dear {{first_name}},', paragraphs: ['As the Lohri bonfire crackles with warmth and the sounds of Bhangra fill the air, we wish you a celebration filled with joy, rewri, and peanuts!', 'May the warmth of Lohri melt away all worries and bring new beginnings. Sunder Mundriye Ho!'], tags: ['greetings', 'bonfire', 'punjab'], industryTags: ['general'] },
    { nameSuffix: 'Sale Offer', subject: '🛍️ Lohri Sale — Winter Warmers at Hot Prices!', preview: 'Beat the winter with our warm deals this Lohri', heading: 'Lohri Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Celebrate Lohri with our winter sale! Get up to 40% off on sweaters, shawls, heaters, and winter accessories.', 'Free rewri and gajak hamper with orders above ₹2,000. Use code LOHRI40!'], ctaText: 'Shop Winter Sale', tags: ['sale', 'winter', 'warm'], industryTags: ['retail'] },
    { nameSuffix: 'Corporate', subject: 'Happy Lohri — Gathering Around the Fire of Growth', preview: 'Warm Lohri wishes from our team to yours', heading: 'Happy Lohri!', greeting: 'Dear {{first_name}},', paragraphs: ['As communities gather around the Lohri bonfire, {{company_name}} celebrates the warmth of partnership and the promise of a prosperous year ahead.', 'May this Lohri bring new energy to our collaboration. Happy Lohri!'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
  ]
);

// ========== BIHU (3 variants) ==========
const bihuTemplates = generateFestivalTemplates(
  { subcategory: 'Bihu', emoji: '🌾', color1: '#4CAF50', color2: '#FF9800', baseTags: ['bihu', 'bohag-bihu', 'festival', 'assam', 'harvest', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Bihu! 🌾 Assam\'s Harvest Festival Greetings!', preview: 'Celebrating the joy and culture of Assam', heading: 'Happy Bihu!', greeting: 'Dear {{first_name}},', paragraphs: ['As the fields of Assam celebrate another bountiful harvest, we wish you a Bihu filled with joy, Bihu dance, and the sweetness of pitha!', 'May this festive season bring prosperity and happiness to you and your family. Happy Bohag Bihu!'], tags: ['greetings', 'assam', 'harvest'], industryTags: ['general'] },
    { nameSuffix: 'Sale Offer', subject: '🛍️ Bihu Sale — Northeast Special Collection!', preview: 'Celebrate Bihu with our authentic northeast collection', heading: 'Bihu Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Celebrate Bihu with our special Northeast collection! Get 30% off on Mekhela Chadors, Gamochas, and traditional Assamese jewellery.', 'Free Pitha hamper with orders above ₹1,500. Use code BIHU30!'], ctaText: 'Shop Bihu Collection', tags: ['sale', 'northeast', 'fashion'], industryTags: ['retail'] },
    { nameSuffix: 'Corporate', subject: 'Happy Bihu from {{company_name}} — Celebrating Growth!', preview: 'Festive greetings from our team this Bihu season', heading: 'Happy Bihu!', greeting: 'Dear {{first_name}},', paragraphs: ['As Assam celebrates the harvest season, {{company_name}} celebrates the growth we have achieved together. May Bihu bring a season of abundance and new beginnings!', 'Wishing you and your team a joyful Bihu celebration!'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
  ]
);

// ========== VISHU (3 variants) ==========
const vishuTemplates = generateFestivalTemplates(
  { subcategory: 'Vishu', emoji: '🌼', color1: '#FFD700', color2: '#4CAF50', baseTags: ['vishu', 'festival', 'kerala', 'new-year', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Vishu! 🌼 Vishu Kani Greetings!', preview: 'May the Vishu Kani bring prosperity to your home', heading: 'Happy Vishu!', greeting: 'Dear {{first_name}},', paragraphs: ['As the golden Konna flowers bloom and the Vishu Kani is set with auspicious offerings, we wish you a new year filled with prosperity and divine blessings.', 'May your first sight of the year bring good fortune and happiness. Happy Vishu from {{company_name}}!'], tags: ['greetings', 'kani', 'kerala'], industryTags: ['general'] },
    { nameSuffix: 'Sale Offer', subject: '🛍️ Vishu Sale — New Year, New Deals!', preview: 'Welcome the Malayalam New Year with amazing offers', heading: 'Vishu Sale!', greeting: 'Hi {{first_name}},', paragraphs: ['Ring in the Malayalam New Year with our Vishu Sale! Enjoy up to 35% off on gold jewellery, Kasavu sarees, electronics, and home appliances.', 'Free Vishukkaineettam (lucky money) gift card with every order above ₹3,000!'], ctaText: 'Shop Vishu Deals', tags: ['sale', 'new-year', 'offer'], industryTags: ['retail'] },
    { nameSuffix: 'Corporate', subject: 'Happy Vishu — A Prosperous New Year Ahead', preview: 'Warm Vishu greetings from your business partner', heading: 'Happy Vishu!', greeting: 'Dear {{first_name}},', paragraphs: ['As Kerala welcomes the new year with Vishu, {{company_name}} extends its warmest wishes for a year of growth, success, and fruitful collaboration.', 'May the Vishu Kani of prosperity bless all our shared endeavours!'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
  ]
);

// ========== RATH YATRA (2 variants) ==========
const rathYatraTemplates = generateFestivalTemplates(
  { subcategory: 'Rath Yatra', emoji: '🛕', color1: '#FF6F00', color2: '#1565C0', baseTags: ['rath-yatra', 'jagannath', 'festival', 'odisha', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Rath Yatra! 🛕 Jai Jagannath!', preview: 'Celebrating the grand chariot festival of Lord Jagannath', heading: 'Jai Jagannath!', greeting: 'Dear {{first_name}},', paragraphs: ['As the magnificent chariots of Lord Jagannath roll through the streets, we celebrate the festival of faith, devotion, and divine grace.', 'May Lord Jagannath bless you with strength, protection, and eternal happiness. Happy Rath Yatra!'], tags: ['greetings', 'jagannath', 'devotion'], industryTags: ['general'] },
    { nameSuffix: 'Corporate', subject: 'Happy Rath Yatra — Moving Forward Together', preview: 'May Lord Jagannath\'s chariot carry us to success', heading: 'Happy Rath Yatra!', greeting: 'Dear {{first_name}},', paragraphs: ['As Lord Jagannath\'s chariot moves forward with unstoppable momentum, may our partnership continue to progress with the same divine energy.', 'Wishing you a blessed Rath Yatra from everyone at {{company_name}}.'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
  ]
);

// ========== CHHATH PUJA (2 variants) ==========
const chhathPujaTemplates = generateFestivalTemplates(
  { subcategory: 'Chhath Puja', emoji: '🌅', color1: '#FF6F00', color2: '#FDD835', baseTags: ['chhath-puja', 'surya', 'festival', 'bihar', 'indian'] },
  [
    { nameSuffix: 'Greetings', subject: 'Happy Chhath Puja! 🌅 Pranam to the Sun God!', preview: 'Celebrating devotion to Lord Surya with Chhath Puja', heading: 'Happy Chhath Puja!', greeting: 'Dear {{first_name}},', paragraphs: ['As devotees stand in holy waters offering arghya to the rising and setting sun, we celebrate the festival of gratitude to Chhathi Maiya and Lord Surya.', 'May the blessings of the Sun God illuminate your life with health, happiness, and prosperity. Happy Chhath Puja!'], tags: ['greetings', 'surya', 'bihar', 'devotion'], industryTags: ['general'] },
    { nameSuffix: 'Corporate', subject: 'Happy Chhath Puja — Gratitude and New Horizons', preview: 'Warm greetings on this auspicious occasion', heading: 'Happy Chhath Puja!', greeting: 'Dear {{first_name}},', paragraphs: ['Chhath Puja teaches us the power of discipline, gratitude, and reverence for nature. These values are at the heart of everything we do at {{company_name}}.', 'Wishing you and your team a blessed Chhath Puja!'], tags: ['corporate', 'b2b'], industryTags: ['general'] },
  ]
);

// ========== COMBINE ALL ==========
export const indianFestivalTemplates: TemplateData[] = [
  ...diwaliTemplates,
  ...holiTemplates,
  ...eidFitrTemplates,
  ...eidAdhaTemplates,
  ...navratriTemplates,
  ...dussehraTemplates,
  ...ganeshTemplates,
  ...onamTemplates,
  ...pongalTemplates,
  ...sankrantiTemplates,
  ...ugadiTemplates,
  ...baishakhiTemplates,
  ...durgaPujaTemplates,
  ...rakshaTemplates,
  ...janmashtamiTemplates,
  ...ramNavamiTemplates,
  ...hanumanTemplates,
  ...guruNanakTemplates,
  ...buddhaPurnimaTemplates,
  ...mahavirTemplates,
  ...shivratriTemplates,
  ...vasantTemplates,
  ...karwaChAuthTemplates,
  ...teejTemplates,
  ...lohriTemplates,
  ...bihuTemplates,
  ...vishuTemplates,
  ...rathYatraTemplates,
  ...chhathPujaTemplates,
];

console.log(`Indian Festival templates generated: ${indianFestivalTemplates.length}`);
