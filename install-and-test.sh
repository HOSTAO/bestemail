#!/bin/bash

# QUICK INSTALL AND TEST SENDY CONNECTION
# =======================================

echo "📦 Installing dotenv for testing..."
npm install dotenv

echo ""
echo "🔧 Now testing your Sendy connection..."
echo ""

# First check if credentials are set
if grep -q "YOUR_SENDY_API_KEY_HERE" .env.local 2>/dev/null; then
    echo "❌ ERROR: You need to update .env.local with your Sendy credentials!"
    echo ""
    echo "1. Open https://my.bestemail.in"
    echo "2. Login as admin"
    echo "3. Get API Key: Settings → API Keys"
    echo "4. Get List ID: View lists → Click your list → ID is in URL"
    echo "5. Update these in .env.local:"
    echo "   SENDY_API_KEY=your_actual_key"
    echo "   SENDY_LIST_ID=your_actual_list_id"
    echo ""
    exit 1
fi

# Run the test
node test-sendy-connection.js