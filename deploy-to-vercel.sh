#!/bin/bash

echo "🚀 DEPLOYING BESTEMAIL TO VERCEL"
echo "================================"
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local found"
else
    echo "⚠️  .env.local not found. Creating from example..."
    cp .env.local.example .env.local 2>/dev/null || echo "Please create .env.local"
fi

echo ""
echo "📋 Pre-deployment checklist:"
echo "- Sendy installed at: my.bestemail.in ✅"
echo "- Platform connects to Sendy API ✅"
echo "- Settings page for configuration ✅"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building production bundle..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Deploying to Vercel..."
    echo ""
    
    # Deploy to Vercel
    vercel --prod
    
    echo ""
    echo "🎉 DEPLOYMENT COMPLETE!"
    echo ""
    echo "📝 Next Steps:"
    echo "1. Visit your deployed site"
    echo "2. Go to Dashboard → Settings"
    echo "3. Configure your Sendy connection:"
    echo "   - API URL: https://my.bestemail.in"
    echo "   - API Key: Get from Sendy Settings → API"
    echo "   - List ID: Get from your list URL"
    echo "4. Test connection and save"
    echo ""
    echo "💡 Your platform uses ONLY Sendy for all emails!"
    echo "💰 Cost: $0.10 per 1,000 emails"
else
    echo "❌ Build failed. Please check errors above."
fi