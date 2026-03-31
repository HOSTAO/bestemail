/**
 * Bestemail Integration Helper
 * Version: 1.0.0
 * 
 * Simple email integration for any website
 * Just include this file and configure your API key
 */

(function(window) {
    'use strict';
    
    // Configuration
    const BESTEMAIL_CONFIG = {
        apiUrl: 'https://my.bestemail.in/api/',
        apiKey: '', // Set your API key here
        listId: '', // Set your default list ID
        trackOpens: true,
        trackClicks: true
    };
    
    // Main Bestemail object
    window.Bestemail = {
        
        // Initialize with config
        init: function(config) {
            Object.assign(BESTEMAIL_CONFIG, config);
            return this;
        },
        
        // Send transactional email
        sendEmail: async function(to, subject, html, options = {}) {
            const data = {
                api_key: BESTEMAIL_CONFIG.apiKey,
                to: to,
                subject: subject,
                html: html,
                from_name: options.fromName || document.title,
                from_email: options.fromEmail || 'noreply@' + window.location.hostname,
                list_id: options.listId || BESTEMAIL_CONFIG.listId,
                track_opens: options.trackOpens !== false ? 1 : 0,
                track_clicks: options.trackClicks !== false ? 1 : 0
            };
            
            try {
                const response = await fetch(BESTEMAIL_CONFIG.apiUrl + 'send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(data)
                });
                
                const result = await response.text();
                return result === 'Email sent';
            } catch (error) {
                console.error('Bestemail error:', error);
                return false;
            }
        },
        
        // Subscribe to list
        subscribe: async function(email, name = '', customFields = {}) {
            const data = {
                api_key: BESTEMAIL_CONFIG.apiKey,
                list: BESTEMAIL_CONFIG.listId,
                email: email,
                name: name,
                ...customFields
            };
            
            try {
                const response = await fetch(BESTEMAIL_CONFIG.apiUrl + 'subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(data)
                });
                
                const result = await response.text();
                return result === '1' || result.includes('subscribed');
            } catch (error) {
                console.error('Bestemail subscribe error:', error);
                return false;
            }
        },
        
        // Unsubscribe from list
        unsubscribe: async function(email) {
            const data = {
                api_key: BESTEMAIL_CONFIG.apiKey,
                list_id: BESTEMAIL_CONFIG.listId,
                email: email
            };
            
            try {
                const response = await fetch(BESTEMAIL_CONFIG.apiUrl + 'unsubscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(data)
                });
                
                const result = await response.text();
                return result === '1';
            } catch (error) {
                console.error('Bestemail unsubscribe error:', error);
                return false;
            }
        },
        
        // Auto-capture forms with class "bestemail-form"
        autoCapture: function() {
            document.addEventListener('DOMContentLoaded', function() {
                const forms = document.querySelectorAll('.bestemail-form');
                
                forms.forEach(form => {
                    form.addEventListener('submit', async function(e) {
                        e.preventDefault();
                        
                        const emailInput = form.querySelector('input[type="email"]');
                        const nameInput = form.querySelector('input[name="name"]');
                        const submitButton = form.querySelector('button[type="submit"]');
                        
                        if (!emailInput) return;
                        
                        // Disable submit button
                        const originalText = submitButton.textContent;
                        submitButton.disabled = true;
                        submitButton.textContent = 'Subscribing...';
                        
                        // Subscribe
                        const success = await Bestemail.subscribe(
                            emailInput.value,
                            nameInput ? nameInput.value : ''
                        );
                        
                        // Show result
                        if (success) {
                            form.innerHTML = '<div class="bestemail-success">✅ Successfully subscribed!</div>';
                        } else {
                            submitButton.disabled = false;
                            submitButton.textContent = originalText;
                            alert('Subscription failed. Please try again.');
                        }
                    });
                });
            });
        }
    };
    
})(window);

/* 
Quick Start:

1. Include this script in your HTML:
   <script src="bestemail-integration.js"></script>

2. Initialize with your credentials:
   <script>
   Bestemail.init({
       apiKey: 'YOUR_API_KEY',
       listId: 'YOUR_LIST_ID'
   });
   </script>

3. Send emails:
   Bestemail.sendEmail('user@example.com', 'Subject', '<h1>Hello!</h1>');

4. Add subscription forms:
   <form class="bestemail-form">
       <input type="email" placeholder="Email" required>
       <input type="text" name="name" placeholder="Name">
       <button type="submit">Subscribe</button>
   </form>

5. Enable auto-capture:
   Bestemail.autoCapture();
*/