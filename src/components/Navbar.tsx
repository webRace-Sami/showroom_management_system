'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Phone, Compass, Calendar, Menu, X, ArrowRight } from 'lucide-react';
import { CompanyInfoData } from '@/lib/initialData';

interface NavbarProps {
  companyInfo?: CompanyInfoData;
}

export default function Navbar({ companyInfo }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authSession, setAuthSession] = useState<{ authenticated: boolean; user?: any } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) setAuthSession(data);
      })
      .catch(() => {});
  }, []);

  const name = companyInfo?.name || 'Apex Luxury Motors';
  const phone = companyInfo?.phone || '+92 (42) 3578-9900';

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(6, 8, 15, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        padding: scrolled ? '14px 0' : '22px 0',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.45)',
            }}
          >
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '0.04em',
                display: 'block',
                lineHeight: 1.1,
              }}
              className="emerald-gradient-text"
            >
              {name.toUpperCase()}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Elite Motors Showroom • PKR
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '32px' }} className="desktop-nav-links">
          <Link href="#inventory" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => (e.currentTarget.style.color = '#fff')} onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
            Showroom Fleet
          </Link>
          <Link href="#services" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => (e.currentTarget.style.color = '#fff')} onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
            VIP Services
          </Link>
          <Link href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => (e.currentTarget.style.color = '#fff')} onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
            About Us
          </Link>
          <Link href="#test-drive" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => (e.currentTarget.style.color = '#fff')} onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
            Book Test Drive
          </Link>
          <Link href="#contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => (e.currentTarget.style.color = '#fff')} onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
            Contact Concierge
          </Link>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <a
            href={`tel:${phone}`}
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
            className="desktop-nav-phone"
          >
            <Phone size={15} color="var(--emerald-light)" />
            {phone}
          </a>

          {authSession?.authenticated ? (
            <Link href="/admin" className="btn-emerald btn-sm">
              <Shield size={16} />
              Admin Portal
            </Link>
          ) : (
            <Link href="/login" className="btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={15} color="var(--emerald-light)" />
              Admin Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              cursor: 'pointer',
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'rgba(10, 15, 28, 0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
          className="animate-slide-up"
        >
          <Link href="#inventory" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600 }}>
            Showroom Fleet
          </Link>
          <Link href="#services" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600 }}>
            VIP Services
          </Link>
          <Link href="#about" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600 }}>
            About Showroom
          </Link>
          <Link href="#test-drive" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600 }}>
            Book Test Drive
          </Link>
          <Link href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600 }}>
            Contact Concierge
          </Link>
          <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn-emerald" style={{ width: '100%' }}>
              <Shield size={16} /> Admin Portal Access
            </Link>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (min-width: 860px) {
          .desktop-nav-links {
            display: flex !important;
          }
          .desktop-nav-phone {
            display: inline-flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
