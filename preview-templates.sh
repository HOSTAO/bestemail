#!/bin/bash
# Quick template preview script for Bestemail email templates

echo "🎨 Bestemail Email Template Preview"
echo "===================================="
echo ""

# Create index file with links to all templates
cat > email-templates/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Bestemail Email Templates</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
        h1 { color: #2563eb; }
        .template-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-top: 30px; }
        .template-card { border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; text-decoration: none; color: #333; transition: all 0.2s; }
        .template-card:hover { border-color: #2563eb; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .template-icon { font-size: 40px; margin-bottom: 10px; }
        .template-name { font-weight: bold; margin-bottom: 5px; }
        .template-desc { font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <h1>📧 Bestemail Email Templates</h1>
    <p>Click any template to preview. Use these as starting points for your email campaigns!</p>
    
    <div class="template-grid">
        <a href="welcome-email.html" class="template-card">
            <div class="template-icon">👋</div>
            <div class="template-name">Welcome Email</div>
            <div class="template-desc">Greet new subscribers warmly</div>
        </a>
        
        <a href="diwali-offer.html" class="template-card">
            <div class="template-icon">🪔</div>
            <div class="template-name">Diwali Offer</div>
            <div class="template-desc">Festival promotion template</div>
        </a>
    </div>
    
    <p style="margin-top: 40px; padding: 20px; background: #f3f4f6; border-radius: 8px;">
        <strong>💡 Quick tip:</strong> Right-click any template and select "View Page Source" to copy the HTML code!
    </p>
</body>
</html>
EOF

# Open the index in default browser
echo "✅ Templates ready for preview!"
echo ""
echo "Opening template gallery in your browser..."
open email-templates/index.html

echo ""
echo "📋 Quick actions you can do:"
echo "1. Preview each template in browser"
echo "2. Right-click → View Page Source to copy HTML"
echo "3. Edit templates directly in email-templates/*.html"
echo ""
echo "Run this anytime: ./preview-templates.sh"