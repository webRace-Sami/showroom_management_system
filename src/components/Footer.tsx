import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, Mail, Clock, Shield, Globe, MessageSquare, Send } from 'lucide-react';
import { CompanyInfoData } from '@/lib/initialData';

interface FooterProps {
  companyInfo?: CompanyInfoData;
}

export default function Footer({ companyInfo }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const info = companyInfo || {
    name: 'Apex Luxury Motors',
    tagline: 'Excellence in Automotive Luxury & High-Performance Engineering',
    email: 'concierge@apexluxurymotors.com',
    phone: '+1 (800) 555-APEX',
    address: '742 Prestige Boulevard, Suite 100',
    city: 'Beverly Hills',
    state: 'CA',
    postalCode: '90210',
    country: 'United States',
    openingHours: 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 5:00 PM',
    aboutUs: 'Curating the worlds most extraordinary exotics, luxury sedans, and grand tourers.',
    socialInstagram: 'https://instagram.com',
    socialFacebook: 'https://facebook.com',
    socialLinkedIn: 'https://linkedin.com',
    socialTwitter: 'https://twitter.com',
  };

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #07090e 0%, #030407 100%)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '80px 24px 36px',
        color: 'var(--text-secondary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '48px', marginBottom: '60px' }}>
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--emerald-primary), #047857)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
              }}
            >
              <Sparkles size={20} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem' }} className="emerald-gradient-text">
              {info.name.toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: '20px' }}>
            {info.tagline}
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {info.socialInstagram && (
              <a href={info.socialInstagram} target="_blank" rel="noreferrer" title="Instagram" style={{ color: 'var(--text-secondary)', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={18} />
              </a>
            )}
            {info.socialFacebook && (
              <a href={info.socialFacebook} target="_blank" rel="noreferrer" title="Facebook" style={{ color: 'var(--text-secondary)', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={18} />
              </a>
            )}
            {info.socialLinkedIn && (
              <a href={info.socialLinkedIn} target="_blank" rel="noreferrer" title="LinkedIn" style={{ color: 'var(--text-secondary)', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={18} />
              </a>
            )}
            {info.socialTwitter && (
              <a href={info.socialTwitter} target="_blank" rel="noreferrer" title="Twitter / X" style={{ color: 'var(--text-secondary)', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Showroom Direct
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <li><Link href="#inventory" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Available Inventory</Link></li>
            <li><Link href="#services" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>VIP Concierge & Financing</Link></li>
            <li><Link href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About Showroom History</Link></li>
            <li><Link href="#test-drive" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Schedule Track / Road Test</Link></li>
            <li><Link href="/login" style={{ color: 'var(--emerald-light)', textDecoration: 'none', fontWeight: 600 }}>Admin Portal Login</Link></li>
          </ul>
        </div>

        {/* Showroom Location */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Showroom Location
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <MapPin size={18} color="var(--emerald-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{info.address}, {info.city}, {info.state} {info.postalCode}, {info.country}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={18} color="var(--emerald-primary)" style={{ flexShrink: 0 }} />
              <span>{info.openingHours}</span>
            </div>
          </div>
        </div>

        {/* VIP Contact */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Concierge Desk
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={18} color="var(--emerald-primary)" />
              <a href={`tel:${info.phone}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600 }}>{info.phone}</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={18} color="var(--emerald-primary)" />
              <a href={`mailto:${info.email}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{info.email}</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', fontSize: '0.82rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          <span>&copy; {currentYear} {info.name}. All Rights Reserved.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Privacy & Provenance</span>
          <span>Terms of Conveyance</span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <Link href="/login" style={{ color: 'var(--emerald-light)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '4px' }}>
            <Shield size={13} /> Admin Console
          </Link>
        </div>
      </div>
    </footer>
  );
}
