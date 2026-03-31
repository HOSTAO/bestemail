#!/bin/bash

echo "🔒 DEPLOYING SECURITY UPDATES"
echo "============================"
echo ""

# Generate encryption key if not exists
if ! grep -q "ENCRYPTION_KEY=" .env.local 2>/dev/null; then
    echo "⚠️  Generating encryption key..."
    ENCRYPTION_KEY=$(openssl rand -hex 32)
    echo "" >> .env.local
    echo "# Security" >> .env.local
    echo "ENCRYPTION_KEY=$ENCRYPTION_KEY" >> .env.local
    echo "✅ Encryption key generated and saved"
fi

echo ""
echo "🔨 Building with security features..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Deploying to Vercel..."
    echo ""
    
    vercel --prod
    
    echo ""
    echo "🎉 SECURITY UPDATE DEPLOYED!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Login with: reji@hostao.com"
    echo "2. Password: Sherlymodiyil@007"
    echo "3. IMPORTANT: Change password after login"
    echo "4. Go to Settings and configure Sendy"
    echo ""
    echo "🔒 Security Features Active:"
    echo "• Encrypted API storage"
    echo "• Rate limiting (5 attempts)"
    echo "• Account lockout (15 min)"
    echo "• CSRF protection"
    echo "• XSS prevention"
    echo ""
    echo "⚠️  Don't forget to add ENCRYPTION_KEY to Vercel environment variables!"
else
    echo "❌ Build failed. Check errors above."
fi