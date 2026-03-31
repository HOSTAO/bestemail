from PIL import Image, ImageDraw, ImageFont
import os

# Create image
width, height = 1200, 800
img = Image.new('RGB', (width, height), '#f8f9fa')
draw = ImageDraw.Draw(img)

# Try to use system font
try:
    title_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 48)
    header_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 36)
    text_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 24)
    small_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 18)
except:
    title_font = ImageFont.load_default()
    header_font = ImageFont.load_default()
    text_font = ImageFont.load_default()
    small_font = ImageFont.load_default()

# Title
draw.rectangle([0, 0, width, 100], fill='#dc3545')
draw.text((width//2, 50), '⚠️ BESTEMAIL USES ONLY SENDY', font=title_font, fill='white', anchor='mm')

# Main flow diagram
y_start = 150

# Bestemail UI
draw.rectangle([300, y_start, 900, y_start+80], fill='#007bff', outline='#0056b3', width=3)
draw.text((600, y_start+40), '🖥️ Bestemail Platform (UI)', font=header_font, fill='white', anchor='mm')

# Arrow down
draw.line([(600, y_start+80), (600, y_start+130)], fill='#333', width=5)
draw.polygon([(600, y_start+140), (580, y_start+120), (620, y_start+120)], fill='#333')

# Sendy API
y_start += 180
draw.rectangle([300, y_start, 900, y_start+80], fill='#28a745', outline='#1e7e34', width=3)
draw.text((600, y_start+40), '📧 SENDY API (Required)', font=header_font, fill='white', anchor='mm')

# Arrow down
draw.line([(600, y_start+80), (600, y_start+130)], fill='#333', width=5)
draw.polygon([(600, y_start+140), (580, y_start+120), (620, y_start+120)], fill='#333')

# Amazon SES
y_start += 180
draw.rectangle([300, y_start, 900, y_start+80], fill='#ff9900', outline='#cc7a00', width=3)
draw.text((600, y_start+40), '☁️ Amazon SES', font=header_font, fill='white', anchor='mm')

# NO OTHER SERVICES box
draw.rectangle([50, 250, 250, 450], fill='#ffebee', outline='#dc3545', width=3)
draw.text((150, 270), '❌ NO OTHER', font=text_font, fill='#dc3545', anchor='mm')
draw.text((150, 300), 'EMAIL SERVICES', font=text_font, fill='#dc3545', anchor='mm')
draw.text((150, 340), '• No SendGrid', font=small_font, fill='#dc3545', anchor='mm')
draw.text((150, 365), '• No Mailgun', font=small_font, fill='#dc3545', anchor='mm')
draw.text((150, 390), '• No Direct SMTP', font=small_font, fill='#dc3545', anchor='mm')
draw.text((150, 415), '• No Fallbacks', font=small_font, fill='#dc3545', anchor='mm')

# Features that use Sendy
draw.rectangle([950, 250, 1150, 450], fill='#d4edda', outline='#28a745', width=3)
draw.text((1050, 270), '✅ ALL EMAILS', font=text_font, fill='#28a745', anchor='mm')
draw.text((1050, 300), 'USE SENDY', font=text_font, fill='#28a745', anchor='mm')
draw.text((1050, 340), '• Campaigns', font=small_font, fill='#28a745', anchor='mm')
draw.text((1050, 365), '• Transactional', font=small_font, fill='#28a745', anchor='mm')
draw.text((1050, 390), '• Test Emails', font=small_font, fill='#28a745', anchor='mm')
draw.text((1050, 415), '• Everything', font=small_font, fill='#28a745', anchor='mm')

# Cost comparison
y_bottom = 550
draw.rectangle([100, y_bottom, 1100, y_bottom+150], fill='#fff', outline='#333', width=2)
draw.text((600, y_bottom+20), 'Cost Comparison (10,000 emails/month)', font=header_font, fill='#333', anchor='mm')

# Traditional
draw.rectangle([150, y_bottom+50, 400, y_bottom+120], fill='#dc3545')
draw.text((275, y_bottom+85), 'Others: ₹2,500+', font=text_font, fill='white', anchor='mm')

# Bestemail + Sendy
draw.rectangle([500, y_bottom+50, 750, y_bottom+120], fill='#28a745')
draw.text((625, y_bottom+85), 'Sendy: ₹75 only', font=text_font, fill='white', anchor='mm')

# Savings
draw.rectangle([850, y_bottom+50, 1050, y_bottom+120], fill='#ffc107')
draw.text((950, y_bottom+85), 'Save 97%', font=text_font, fill='#333', anchor='mm')

# Footer
draw.text((600, height-30), '⚠️ Sendy is REQUIRED - No other email service is supported', font=text_font, fill='#dc3545', anchor='mm')

# Save image
output_path = '/Users/rejimodiyil/.openclaw/workspace/bestemail-sendy-only.png'
img.save(output_path, 'PNG', quality=95)
print(f"Sendy-only diagram created: {output_path}")

# Also save to media folder for sending
media_path = '/Users/rejimodiyil/.openclaw/media/bestemail-sendy-only.png'
os.makedirs(os.path.dirname(media_path), exist_ok=True)
img.save(media_path, 'PNG', quality=95)
print(f"Also saved to: {media_path}")