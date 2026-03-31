'use client';

import { CSSProperties, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Logo from '@/components/Logo';

const styles: Record<string, CSSProperties> = {
  wrap: { width: '100%', maxWidth: 460, margin: '0 auto' },
  logoBox: { display: 'flex', justifyContent: 'center', marginBottom: 28 },
  card: {
    background: '#ffffff',
    borderRadius: 28,
    padding: '28px 22px',
    boxShadow: '0 20px 60px rgba(15,23,42,0.12)',
    border: '1px solid #e2e8f0'
  },
  title: { margin: 0, fontSize: 38, fontWeight: 800, color: '#0f172a', textAlign: 'center', lineHeight: 1.05 },
  subtitle: { margin: '10px 0 0', fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 1.6 },
  form: { display: 'flex', flexDirection: 'column', gap: 18, marginTop: 24 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 14, fontWeight: 700, color: '#334155' },
  input: {
    width: '100%',
    borderRadius: 16,
    border: '1px solid #cbd5e1',
    padding: '15px 16px',
    fontSize: 16,
    color: '#0f172a',
    background: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box'
  },
  passwordWrap: { position: 'relative' },
  passwordInput: { paddingRight: 72 },
  toggle: {
    position: 'absolute',
    right: 12,
    top: 11,
    border: 'none',
    background: '#eff6ff',
    color: '#2563eb',
    borderRadius: 12,
    padding: '8px 10px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer'
  },
  helper: { margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.5 },
  submit: {
    width: '100%',
    border: 'none',
    borderRadius: 16,
    background: '#2563eb',
    color: '#ffffff',
    padding: '15px 18px',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 54
  },
  footer: { marginTop: 18, textAlign: 'center' },
  footerText: { margin: 0, fontSize: 15, color: '#475569', lineHeight: 1.6 },
  link: { color: '#2563eb', textDecoration: 'none', fontWeight: 700 },
  secureBox: {
    marginTop: 20,
    borderRadius: 18,
    padding: '14px 16px',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    color: '#1e3a8a',
    fontSize: 14,
    lineHeight: 1.6,
    textAlign: 'center'
  },
  spinner: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.35)',
    borderTopColor: '#ffffff',
    animation: 'spin 1s linear infinite'
  }
};

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Login successful!');
        setTimeout(() => {
          window.location.href = redirect;
        }, 500);
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <Toaster position="top-right" />
      <div style={styles.wrap}>
        <div style={styles.logoBox}>
          <Logo size="lg" />
        </div>

        <div style={styles.card}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to manage campaigns, contacts, settings, and delivery.</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="admin@bestemail.in"
                required
                autoComplete="username"
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <div style={styles.passwordWrap}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...styles.input, ...styles.passwordInput }}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.toggle}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <p style={styles.helper}>Use the email and password you signed up with, or your admin login.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submit, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner} />
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={styles.link}>
                Start free trial
              </Link>
            </p>
          </div>

          <div style={styles.secureBox}>
            🔒 Secure login with simplified authentication
          </div>
        </div>
      </div>
    </>
  );
}
