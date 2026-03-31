#!/bin/bash

echo "🚀 Bestemail Platform Setup"
echo "=========================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ .env.local created. Please edit it with your credentials."
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create required directories
echo "📁 Creating directories..."
mkdir -p public/templates
mkdir -p public/logos
mkdir -p src/app/api/webhooks

# Generate template thumbnails placeholder
echo "🎨 Creating placeholder files..."
touch public/templates/welcome-simple.png
touch public/templates/blank.png
touch public/logo-192.png
touch public/logo-512.png

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your Supabase and email service credentials"
echo "2. Create a Supabase project and run the migrations"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "📚 Documentation:"
echo "- Features: FEATURES-ROADMAP.md"
echo "- Quick Start: QUICK-START-FEATURES.md"
echo "- Deployment: DEPLOYMENT-GUIDE.md"
echo ""
echo "Happy building! 🎉"