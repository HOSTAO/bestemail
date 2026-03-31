'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

export default function ContactPage() {
  const [windowWidth, setWindowWidth] = useState(1200);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactMethods = [
    { icon: '\u{1F4E7}', title: 'Email', detail: 'support@bestemail.in', description: 'For general inquiries and support', link: 'mailto:support@bestemail.in' },
    { icon: '\u{1F4AC}', title: 'WhatsApp', detail: 'Chat with us', description: 'Quick questions and instant help', link: '#' },
    { icon: '\u{1F4DE}', title: 'Phone', detail: '+91 (placeholder)', description: 'Mon-Sat, 9 AM - 6 PM IST', link: '#' },
    { icon: '\u{1F4CD}', title: 'Office', detail: 'Kochi, Kerala, India', description: 'Bestemail Technologies', link: '#' },
  ];

  const departmentEmails = [
    { label: 'General', email: 'hello@bestemail.in' },
    { label: 'Support', email: 'support@bestemail.in' },
    { label: 'Billing', email: 'billing@bestemail.in' },
    { label: 'Privacy', email: 'privacy@bestemail.in' },
    { label: 'Partnerships', email: 'partners@bestemail.in' },
  ];

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.08)',
    fontSize: '15px',
    outline: 'none',
    backgroundColor: '#0f0f1a',
    color: '#ffffff',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: '8px',
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#0f0f1a',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column' as const,
    }}>
      <Navigation />

      {/* Hero */}
      <section style={{
        padding: isMobile ? '80px 0 40px' : '120px 0 60px',
        textAlign: 'center' as const,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '16px',
          }}>Get in Touch</h1>
          <p style={{
            fontSize: '18px',
            color: '#8b8ba7',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}>
            We&apos;d love to hear from you. Reach out and we&apos;ll respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section style={{ padding: isMobile ? '20px 0 40px' : '20px 0 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '16px',
          }}>
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.link}
                style={{
                  backgroundColor: '#1a1a2e',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  textDecoration: 'none',
                  textAlign: 'center' as const,
                  transition: 'all 0.3s',
                  display: 'block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'rgba(0,180,216,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{method.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '6px' }}>{method.title}</h3>
                <p style={{ fontSize: '14px', color: '#00B4D8', fontWeight: '500', marginBottom: '4px' }}>{method.detail}</p>
                <p style={{ fontSize: '12px', color: '#8b8ba7' }}>{method.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Support Hours */}
      <section style={{ padding: isMobile ? '40px 0' : '80px 0' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          flexDirection: isMobile ? 'column' as const : 'row' as const,
          gap: '32px',
        }}>
          {/* Form */}
          <div style={{ flex: 2 }}>
            <div style={{
              backgroundColor: '#1a1a2e',
              borderRadius: '16px',
              padding: isMobile ? '24px' : '40px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '24px' }}>Send us a message</h2>

              {submitted ? (
                <div style={{
                  padding: '32px',
                  textAlign: 'center' as const,
                  backgroundColor: 'rgba(16,185,129,0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(16,185,129,0.3)',
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>{'\u2705'}</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#10b981', marginBottom: '8px' }}>Message Sent!</h3>
                  <p style={{ fontSize: '14px', color: '#8b8ba7' }}>Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: 'general', message: '' }); }}
                    style={{
                      marginTop: '16px',
                      padding: '10px 24px',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#ffffff',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#00B4D8'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#00B4D8'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Subject *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#00B4D8'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle}>Message *</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you?"
                      style={{ ...inputStyle, resize: 'vertical' as const, minHeight: '120px' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#00B4D8'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      backgroundColor: '#00B4D8',
                      color: '#ffffff',
                      padding: '14px 32px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0077B6'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#00B4D8'; }}
                  >
                    Send Message
                  </button>

                  <p style={{ fontSize: '13px', color: '#8b8ba7', marginTop: '12px', textAlign: 'center' as const }}>
                    We typically respond within 24 hours during business days
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Support Hours Sidebar */}
          <div style={{ flex: 1 }}>
            <div style={{
              backgroundColor: '#1a1a2e',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '24px',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '20px' }}>Support Hours</h3>
              <div style={{ fontSize: '14px', color: '#8b8ba7', lineHeight: '2' }}>
                <p><span style={{ color: '#ffffff' }}>Monday - Saturday:</span> 9:00 AM - 6:00 PM IST</p>
                <p><span style={{ color: '#ffffff' }}>Sunday:</span> Closed</p>
                <p><span style={{ color: '#ffffff' }}>Response time:</span> Within 24 hours</p>
              </div>
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontSize: '13px', color: '#8b8ba7' }}>
                  For urgent issues, email{' '}
                  <a href="mailto:urgent@bestemail.in" style={{ color: '#00B4D8', textDecoration: 'none' }}>urgent@bestemail.in</a>
                </p>
              </div>
            </div>

            {/* Registered Office */}
            <div style={{
              backgroundColor: '#1a1a2e',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '24px',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>Registered Office</h3>
              <p style={{ fontSize: '14px', color: '#ffffff', fontWeight: '500', marginBottom: '4px' }}>Bestemail Technologies</p>
              <p style={{ fontSize: '14px', color: '#8b8ba7', lineHeight: '1.6' }}>
                Kochi, Kerala 682001<br />India
              </p>
              <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '12px' }}>
                Email:{' '}
                <a href="mailto:support@bestemail.in" style={{ color: '#00B4D8', textDecoration: 'none' }}>support@bestemail.in</a>
              </p>
            </div>

            {/* Department Emails */}
            <div style={{
              backgroundColor: '#1a1a2e',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>Department Emails</h3>
              {departmentEmails.map((dept, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < departmentEmails.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}>
                  <span style={{ fontSize: '14px', color: '#8b8ba7' }}>{dept.label}</span>
                  <a href={`mailto:${dept.email}`} style={{ fontSize: '14px', color: '#00B4D8', textDecoration: 'none' }}>{dept.email}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StandardFooter />
    </div>
  );
}
