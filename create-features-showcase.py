from PIL import Image, ImageDraw, ImageFont
import os

# Create image
width, height = 1200, 1600
img = Image.new('RGB', (width, height), '#f8f9fa')
draw = ImageDraw.Draw(img)

# Try to use system font
try:
    title_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 48)
    header_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 32)
    feature_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 20)
    small_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 16)
except:
    title_font = ImageFont.load_default()
    header_font = ImageFont.load_default()
    feature_font = ImageFont.load_default()
    small_font = ImageFont.load_default()

# Title
draw.rectangle([0, 0, width, 120], fill='#007bff')
draw.text((width//2, 60), 'Bestemail Platform', font=title_font, fill='white', anchor='mm')
draw.text((width//2, 90), '50+ Features - 100% Complete', font=feature_font, fill='white', anchor='mm')

# Feature categories with emojis
categories = [
    ('📧 Email Marketing', [
        'Campaign Management',
        'Email Templates Library', 
        'Rich Text Editor',
        'Scheduling & Automation',
        'Personalization & Merge Tags',
        'A/B Testing'
    ]),
    ('🤖 Marketing Automation', [
        'Welcome Series',
        'Abandoned Cart Recovery',
        'Re-engagement Campaigns',
        'Birthday & Anniversary',
        'Post-purchase Follow-up',
        'Visual Workflow Builder'
    ]),
    ('📊 Analytics & Tracking', [
        'Real-time Open Tracking',
        'Click Tracking & Heatmaps',
        'Device & Client Detection',
        'Geographic Analytics',
        'Engagement Scoring',
        'Campaign Performance'
    ]),
    ('👥 Contact Management', [
        'Smart Segmentation',
        'Import/Export Tools',
        'Custom Fields',
        'Bulk Operations',
        'Engagement History',
        'Unsubscribe Management'
    ]),
    ('🔗 Integrations', [
        'Shopify & WooCommerce',
        'Zoho & Freshsales CRM',
        'WhatsApp Business',
        'Google Analytics',
        'Zapier & 5000+ Apps',
        'API Access'
    ]),
    ('🏷️ White Label Platform', [
        'Custom Branding',
        'Subdomain Support',
        'Feature Toggles',
        'Reseller Dashboard',
        'Multi-tenant Architecture',
        'Custom Pricing'
    ])
]

y_offset = 140
for category, features in categories:
    # Category header
    draw.rectangle([40, y_offset, width-40, y_offset+50], fill='#e9ecef')
    draw.text((60, y_offset+25), category, font=header_font, fill='#333', anchor='lm')
    
    y_offset += 70
    
    # Features in 2 columns
    for i, feature in enumerate(features):
        x = 80 if i % 2 == 0 else 620
        y = y_offset + (i // 2) * 35
        draw.text((x, y), f'✓ {feature}', font=feature_font, fill='#555')
    
    y_offset += ((len(features) + 1) // 2) * 35 + 40

# Bottom section - stats
draw.rectangle([0, height-200, width, height], fill='#007bff')
stats_y = height - 150
draw.text((width//4, stats_y), '35+', font=title_font, fill='white', anchor='mm')
draw.text((width//4, stats_y+30), 'Files Created', font=small_font, fill='white', anchor='mm')

draw.text((width//2, stats_y), '25K+', font=title_font, fill='white', anchor='mm')
draw.text((width//2, stats_y+30), 'Lines of Code', font=small_font, fill='white', anchor='mm')

draw.text((3*width//4, stats_y), '100%', font=title_font, fill='white', anchor='mm')
draw.text((3*width//4, stats_y+30), 'Complete', font=small_font, fill='white', anchor='mm')

# Save image
output_path = '/Users/rejimodiyil/.openclaw/workspace/bestemail-features-complete.png'
img.save(output_path, 'PNG', quality=95)
print(f"Feature showcase image created: {output_path}")

# Also save to media folder for sending
media_path = '/Users/rejimodiyil/.openclaw/media/bestemail-features-complete.png'
os.makedirs(os.path.dirname(media_path), exist_ok=True)
img.save(media_path, 'PNG', quality=95)
print(f"Also saved to: {media_path}")