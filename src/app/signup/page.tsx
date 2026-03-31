'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Logo from '@/components/Logo';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          password: formData.password
        })
      });

      if (response.ok) {
        // Auto-login after signup
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        if (loginResponse.ok) {
          window.location.href = '/dashboard';
        }
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || 'Signup failed. Please try again.' });
      }
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const formContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: isMobile ? '32px 24px' : '48px',
    width: '100%',
    maxWidth: '480px'
  };

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: hasError ? '1px solid #ef4444' : '1px solid #e2e8f0',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box' as const
  });

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <Logo size="lg" />
          </Link>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: isMobile ? '28px' : '32px',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>Create your account</h1>
          <p style={{
            fontSize: '16px',
            color: '#64748b'
          }}>
            Create your workspace and start with the core campaign workflow.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '14px',
              color: '#dc2626'
            }}>
              {errors.submit}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#0f172a',
              marginBottom: '8px'
            }}>
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={inputStyle(!!errors.name)}
              placeholder="John Doe"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.name ? '#ef4444' : '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {errors.name && (
              <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                {errors.name}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#0f172a',
              marginBottom: '8px'
            }}>
              Work Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={inputStyle(!!errors.email)}
              placeholder="john@company.com"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.email ? '#ef4444' : '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {errors.email && (
              <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                {errors.email}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#0f172a',
              marginBottom: '8px'
            }}>
              Company (Optional)
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              style={inputStyle(false)}
              placeholder="Acme Inc."
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#0f172a',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={inputStyle(!!errors.password)}
              placeholder="At least 8 characters"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.password ? '#ef4444' : '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {errors.password && (
              <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                {errors.password}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#0f172a',
              marginBottom: '8px'
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              style={inputStyle(!!errors.confirmPassword)}
              placeholder="Repeat your password"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.confirmPassword ? '#ef4444' : '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {errors.confirmPassword && (
              <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
              color: '#ffffff',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              marginBottom: '16px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(37, 99, 235, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {loading ? 'Creating account...' : 'Create free account'}
          </button>

          <p style={{
            fontSize: '14px',
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            By signing up, you agree to our{' '}
            <Link href="/terms" style={{ color: '#2563eb', textDecoration: 'none' }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" style={{ color: '#2563eb', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
          </p>

          <div style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: '24px',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#64748b'
            }}>
              Already have an account?{' '}
              <Link 
                href="/login" 
                style={{ 
                  color: '#2563eb', 
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Log in
              </Link>
            </p>
          </div>
        </form>

        {/* Benefits */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          backgroundColor: '#f0f9ff',
          borderRadius: '12px',
          border: '1px solid #bfdbfe'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: '12px'
          }}>What you can do after signup:</h3>
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            fontSize: '14px',
            color: '#2563eb',
            lineHeight: '1.8'
          }}>
            <li>Set up your sending configuration</li>
            <li>Import contacts and organize segments</li>
            <li>Create and test your first campaign</li>
            <li>Add forms once the sending flow is ready</li>
          </ul>
        </div>
      </div>
    </div>
  );
}