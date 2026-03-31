'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPageOld() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    // Generate CSRF token on mount
    const token = Array(64).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setCsrfToken(token);

    // Check if blocked
    const blockedUntil = localStorage.getItem('login_blocked_until');
    if (blockedUntil && new Date().getTime() < parseInt(blockedUntil)) {
      setIsBlocked(true);
      const timeLeft = Math.ceil((parseInt(blockedUntil) - new Date().getTime()) / 1000 / 60);
      toast.error(`Too many login attempts. Try again in ${timeLeft} minutes.`);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      const blockedUntil = localStorage.getItem('login_blocked_until');
      if (blockedUntil && new Date().getTime() < parseInt(blockedUntil)) {
        const timeLeft = Math.ceil((parseInt(blockedUntil) - new Date().getTime()) / 1000 / 60);
        toast.error(`Account temporarily locked. Try again in ${timeLeft} minutes.`);
        return;
      } else {
        setIsBlocked(false);
        localStorage.removeItem('login_blocked_until');
      }
    }

    // Basic validation
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          password,
          csrfToken 
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Clear login attempts on success
        localStorage.removeItem('login_attempts');
        localStorage.removeItem('login_blocked_until');
        
        // Don't set cookie manually - server already sets it
        toast.success('Login successful! Redirecting...');
        
        // Immediate redirect without delay
        window.location.replace('/dashboard');
      } else {
        // Track failed attempts
        const attempts = (parseInt(localStorage.getItem('login_attempts') || '0') || 0) + 1;
        localStorage.setItem('login_attempts', attempts.toString());
        setLoginAttempts(attempts);

        // Block after 5 failed attempts
        if (attempts >= 5) {
          const blockUntil = new Date().getTime() + (15 * 60 * 1000); // 15 minutes
          localStorage.setItem('login_blocked_until', blockUntil.toString());
          setIsBlocked(true);
          toast.error('Too many failed attempts. Account locked for 15 minutes.');
        } else {
          toast.error(data.error || 'Invalid credentials');
        }
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <div className="w-full max-w-md">
          {/* Security Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure Login
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-2xl font-bold text-center mb-8">
              Admin Login
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="reji@hostao.com"
                  required
                  autoComplete="username"
                  disabled={isBlocked}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  disabled={isBlocked}
                />
              </div>

              {loginAttempts > 0 && loginAttempts < 5 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    {5 - loginAttempts} attempts remaining before account lock.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || isBlocked}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login Securely'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-blue-600 hover:text-blue-700">
                Back to Home
              </Link>
            </div>

            {/* Security Notice */}
            <div className="mt-6 text-center text-xs text-gray-500">
              <p>🔒 This login is protected by:</p>
              <ul className="mt-1 space-y-1">
                <li>• Rate limiting & brute force protection</li>
                <li>• Encrypted credentials</li>
                <li>• CSRF protection</li>
                <li>• Secure session management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}