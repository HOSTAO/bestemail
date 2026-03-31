#!/usr/bin/env node

// TEST YOUR SENDY CONNECTION AT my.bestemail.in
// =============================================

const https = require('https');
const querystring = require('querystring');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SENDY_API_URL = process.env.SENDY_API_URL || 'https://my.bestemail.in';
const SENDY_API_KEY = process.env.SENDY_API_KEY;
const SENDY_LIST_ID = process.env.SENDY_LIST_ID;

console.log('🔧 Testing Sendy Connection...');
console.log('================================');
console.log(`API URL: ${SENDY_API_URL}`);
console.log(`API Key: ${SENDY_API_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`List ID: ${SENDY_LIST_ID ? '✅ Set' : '❌ Missing'}`);
console.log('');

if (!SENDY_API_KEY || !SENDY_LIST_ID) {
  console.error('❌ ERROR: Missing SENDY_API_KEY or SENDY_LIST_ID in .env.local');
  console.log('');
  console.log('📝 How to get these values:');
  console.log('1. Login to your Sendy at https://my.bestemail.in');
  console.log('2. API Key: Go to Settings → API → Copy your API key');
  console.log('3. List ID: View all lists → Click your list → ID is in the URL');
  process.exit(1);
}

// Test 1: Get subscriber count
function testSubscriberCount() {
  console.log('📊 Test 1: Getting subscriber count...');
  
  const postData = querystring.stringify({
    'api_key': SENDY_API_KEY,
    'list_id': SENDY_LIST_ID
  });

  const url = new URL(`${SENDY_API_URL}/api/subscribers/active-subscriber-count.php`);
  
  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const count = parseInt(data);
      if (!isNaN(count)) {
        console.log(`✅ Success! You have ${count} active subscribers`);
        console.log('');
        testAddSubscriber();
      } else {
        console.error(`❌ Error: ${data}`);
        console.log('');
        console.log('🔍 Possible issues:');
        console.log('- Wrong API key');
        console.log('- Wrong List ID');
        console.log('- Sendy API not enabled');
      }
    });
  });

  req.on('error', (error) => {
    console.error(`❌ Connection error: ${error.message}`);
    console.log('');
    console.log('🔍 Check that my.bestemail.in is accessible');
  });

  req.write(postData);
  req.end();
}

// Test 2: Add a test subscriber
function testAddSubscriber() {
  console.log('👤 Test 2: Adding test subscriber...');
  
  const testEmail = `test-${Date.now()}@bestemail.in`;
  
  const postData = querystring.stringify({
    'api_key': SENDY_API_KEY,
    'list': SENDY_LIST_ID,
    'email': testEmail,
    'name': 'Test User',
    'boolean': 'true'
  });

  const url = new URL(`${SENDY_API_URL}/subscribe`);
  
  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (data === '1') {
        console.log(`✅ Success! Added test subscriber: ${testEmail}`);
        console.log('');
        console.log('🎉 ALL TESTS PASSED!');
        console.log('====================');
        console.log('Your Sendy connection is working perfectly!');
        console.log('');
        console.log('📋 Next Steps:');
        console.log('1. Run: npm run build');
        console.log('2. Deploy to Vercel: vercel --prod');
        console.log('3. Your platform will use Sendy for all emails');
        console.log('');
        console.log('💰 Cost: ~$0.10 per 1,000 emails via Amazon SES');
      } else {
        console.error(`❌ Error: ${data}`);
      }
    });
  });

  req.on('error', (error) => {
    console.error(`❌ Connection error: ${error.message}`);
  });

  req.write(postData);
  req.end();
}

// Run tests
testSubscriberCount();