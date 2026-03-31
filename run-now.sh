#!/bin/bash

# BESTEMAIL + SENDY QUICK SETUP
# =============================

echo "🚀 BESTEMAIL + YOUR SENDY AT my.bestemail.in"
echo "============================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    echo "Creating from template..."
    cp .env.local.example .env.local 2>/dev/null || echo "⚠️  Please create .env.local manually"
fi

echo "📝 IMPORTANT: Edit .env.local with your Sendy credentials"
echo ""
echo "1. Login to https://my.bestemail.in"
echo "2. Get API Key: Settings → API Keys"
echo "3. Get List ID: View lists → Click your list → Copy ID from URL"
echo ""
echo "Then update these in .env.local:"
echo "  SENDY_API_KEY=your_actual_api_key"
echo "  SENDY_LIST_ID=your_actual_list_id"
echo ""

read -p "Press ENTER after updating .env.local..."

echo ""
echo "🧪 Testing Sendy connection..."
node test-sendy-connection.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Sendy connection successful!"
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    
    echo ""
    echo "🔨 Building production bundle..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ BUILD SUCCESSFUL!"
        echo ""
        echo "🚀 Ready to deploy!"
        echo ""
        echo "Run: vercel --prod"
        echo ""
        echo "Your platform will be live at bestemail.in"
        echo "Using Sendy at my.bestemail.in for email delivery"
        echo ""
    else
        echo "❌ Build failed. Check errors above."
    fi
else
    echo ""
    echo "❌ Sendy connection failed."
    echo "Please check your API credentials in .env.local"
fi