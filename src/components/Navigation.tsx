'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/Logo';

const NAV_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/docs', label: 'Docs' },
  { href: '/integrations', label: 'Integrations' },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(15,15,26,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Logo size="sm" />
          </Link>

          {/* Desktop nav */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {NAV_LINKS.map((item) => (
                <Link key={item.href} href={item.href} style={{
                  color: 'rgba(255,255,255,0.75)',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#fff'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.75)'}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop CTAs */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link href="/login" style={{
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                Login
              </Link>
              <Link href="/signup" style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                padding: '8px 20px',
                borderRadius: 8,
                background: '#00B4D8',
              }}>
                Start Free →
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                zIndex: 1001,
              }}
            >
              <span style={{ display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2 }} />
              <span style={{ display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2 }} />
              <span style={{ display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2 }} />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#0f0f1a',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          padding: '0 24px',
        }}>
          {/* Header row */}
          <div style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Logo size="sm" />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: 22,
                  fontWeight: 600,
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'block',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Bottom CTAs */}
          <div style={{ paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 700,
                padding: '14px',
                borderRadius: 10,
                background: '#00B4D8',
                textAlign: 'center',
                display: 'block',
              }}
            >
              Start Free — No Credit Card
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 500,
                padding: '14px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.15)',
                textAlign: 'center',
                display: 'block',
              }}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
