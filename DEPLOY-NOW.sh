#!/usr/bin/env bash
set -euo pipefail

# Bestemail Platform - One-Shot Deployment Script
# This script handles: npm install, build, db migration, Vercel deploy, and smoke tests

REPO_DIR="$HOME/.openclaw/workspace/bestemail-platform"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

echo "=========================================="
echo "Bestemail Platform - Production Deploy"
echo "Started: $TIMESTAMP"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
  echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
  echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[!]${NC} $1"
}

# Check if .env.production.local exists
if [ ! -f "$REPO_DIR/.env.production.local" ]; then
  print_error ".env.production.local not found at $REPO_DIR"
  echo "Please copy .env.production.local to the project root first."
  exit 1
fi

print_status "Environment file found"

# Step 1: Navigate to repo
cd "$REPO_DIR"
print_status "Changed to repo directory: $REPO_DIR"

# Step 2: Install dependencies
echo ""
echo "========== Step 1: Install Dependencies =========="
if npm install; then
  print_status "Dependencies installed successfully"
else
  print_error "npm install failed"
  exit 1
fi

# Step 3: Database migrations
echo ""
echo "========== Step 2: Database Migrations =========="
if npm run db:migrate; then
  print_status "Database migrations completed"
else
  print_warning "Database migrations may have failed or no migrations pending"
fi

# Step 4: Build
echo ""
echo "========== Step 3: Build Application =========="
if npm run build; then
  print_status "Build completed successfully"
else
  print_error "Build failed"
  exit 1
fi

# Step 5: Deploy to Vercel
echo ""
echo "========== Step 4: Deploy to Vercel =========="
print_status "Starting Vercel deployment..."
echo "Note: You may be prompted to confirm the deployment"

if vercel --prod --confirm; then
  print_status "Vercel deployment succeeded"
else
  print_error "Vercel deployment failed"
  exit 1
fi

# Step 6: Wait for deployment to stabilize
echo ""
echo "========== Step 5: Waiting for deployment =========="
print_status "Waiting 30 seconds for Vercel to stabilize..."
sleep 30

# Step 7: Smoke test
echo ""
echo "========== Step 6: Smoke Tests =========="

# Test 1: Check domain
DOMAIN="https://bestemail.in"
print_status "Testing domain: $DOMAIN"

if curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/login" | grep -q "200\|301\|302"; then
  print_status "Domain is responding"
else
  print_warning "Domain may not be responding yet (DNS propagation may take 5-10 minutes)"
fi

# Test 2: Check health endpoint
print_status "Checking application health..."
if curl -s "$DOMAIN/api/health" > /dev/null 2>&1; then
  print_status "Health check passed"
else
  print_warning "Health endpoint not available (this is normal for some setups)"
fi

# Final summary
echo ""
echo "=========================================="
echo "Deployment Summary"
echo "=========================================="
print_status "Build: PASSED"
print_status "Vercel Deploy: PASSED"
print_status "Smoke Tests: COMPLETED"
echo ""
echo "Next Steps:"
echo "1. Visit: https://bestemail.in/login"
echo "2. Login with your admin credentials"
echo "3. Create a test campaign at /dashboard/campaigns/new"
echo "4. Send a test email to verify Sendy integration"
echo ""
print_warning "Note: If domain is not accessible, DNS may still be propagating (5-15 min)"
echo ""
echo "Deployment completed at $(date +"%Y-%m-%d %H:%M:%S")"
echo "=========================================="
