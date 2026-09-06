'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Shield,
  Globe,
} from 'lucide-react';
import { CompanyInfoData } from '@/lib/initialData';

export default function AdminCompanyInfoPage() {
  const [formData, setFormData] = useState<Partial<CompanyInfoData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/company');
      const data = await res.json();
      if (data.success) {
        setFormData(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch('/api/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update company information');

      setSuccess('Company information saved! The public Home Page has been updated live.');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading Company Information...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
            Dynamic Company Info & Home Page CMS
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Modify your showroom branding, story, coordinates, and warranty terms. Updates reflect instantly on the public website.
          </p>
        </div>

        <a href="/" target="_blank" className="btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ExternalLink size={14} color="var(--emerald-primary)" /> View Live Home Page
        </a>
      </div>

      <form onSubmit={handleSubmit}>
        {success && (
          <div
            style={{
              padding: '16px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--emerald-primary)',
              borderRadius: 'var(--radius-md)',
              color: '#34d399',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.92rem',
            }}
            className="animate-fade-in"
          >
            <CheckCircle2 size={20} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '16px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid var(--rose-primary)',
              borderRadius: 'var(--radius-md)',
              color: '#fb7185',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.92rem',
            }}
            className="animate-fade-in"
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* SECTION 1: BRAND IDENTITY */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--emerald-primary)" />
            Showroom Brand Identity
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Showroom / Company Name *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Brand Logo Text</label>
              <input
                type="text"
                className="form-input"
                value={formData.logoText || ''}
                onChange={e => setFormData({ ...formData, logoText: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Showroom Tagline & Slogan *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.tagline || ''}
              onChange={e => setFormData({ ...formData, tagline: e.target.value })}
            />
          </div>
        </div>

        {/* SECTION 2: SHOWROOM STORY & POLICIES */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="var(--emerald-primary)" />
            Home Page Story, Vision & Certified Warranty
          </h2>

          <div className="form-group">
            <label className="form-label">About the Showroom (Appears on Home Page)</label>
            <textarea
              rows={4}
              className="form-textarea"
              value={formData.aboutUs || ''}
              onChange={e => setFormData({ ...formData, aboutUs: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Showroom Mission & Vision Statement</label>
            <textarea
              rows={2}
              className="form-textarea"
              value={formData.visionText || ''}
              onChange={e => setFormData({ ...formData, visionText: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Certified Warranty & Provenance Policy</label>
            <textarea
              rows={2}
              className="form-textarea"
              value={formData.warrantyPolicy || ''}
              onChange={e => setFormData({ ...formData, warrantyPolicy: e.target.value })}
            />
          </div>

          {/* Dynamic Warranty & Inspection Badges on Home Page */}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--emerald-light)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} /> Home Page Showcase Stat Badges (Managed by Admin)
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Warranty Stat Title (e.g. 24 Months / 3 Years)</label>
                <input
                  type="text"
                  placeholder="24 Months"
                  className="form-input"
                  value={formData.warrantyHighlightTitle || ''}
                  onChange={e => setFormData({ ...formData, warrantyHighlightTitle: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Warranty Stat Subtitle</label>
                <input
                  type="text"
                  placeholder="Concierge Warranty Included"
                  className="form-input"
                  value={formData.warrantyHighlightSubtitle || ''}
                  onChange={e => setFormData({ ...formData, warrantyHighlightSubtitle: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Multi-Point Audit Stat Title (e.g. 180-Point)</label>
                <input
                  type="text"
                  placeholder="180-Point"
                  className="form-input"
                  value={formData.warrantyInspectionPoints || ''}
                  onChange={e => setFormData({ ...formData, warrantyInspectionPoints: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Multi-Point Audit Subtitle</label>
                <input
                  type="text"
                  placeholder="Certified Multi-Point Audit"
                  className="form-input"
                  value={formData.warrantyInspectionSubtitle || ''}
                  onChange={e => setFormData({ ...formData, warrantyInspectionSubtitle: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: CONTACT & HOURS */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={18} color="var(--emerald-primary)" />
            Showroom Contact & Business Hours
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Primary Concierge Phone *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.phone || ''}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Secondary VIP Hotline</label>
              <input
                type="text"
                className="form-input"
                value={formData.secondaryPhone || ''}
                onChange={e => setFormData({ ...formData, secondaryPhone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Email Address *</label>
              <input
                type="email"
                required
                className="form-input"
                value={formData.email || ''}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Showroom Operating Hours *</label>
            <input
              type="text"
              required
              placeholder="Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 5:00 PM"
              className="form-input"
              value={formData.openingHours || ''}
              onChange={e => setFormData({ ...formData, openingHours: e.target.value })}
            />
          </div>
        </div>

        {/* SECTION 4: LOCATION COORDINATES */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="var(--emerald-primary)" />
            Physical Showroom Address
          </h2>

          <div className="form-group">
            <label className="form-label">Street Address *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.address || ''}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.city || ''}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">State / Province *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.state || ''}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Postal / Zip Code</label>
              <input
                type="text"
                className="form-input"
                value={formData.postalCode || ''}
                onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Country *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.country || ''}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: SOCIAL LINKS */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="var(--emerald-primary)" />
            Social Media & WhatsApp Channels
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Instagram URL</label>
              <input
                type="url"
                className="form-input"
                value={formData.socialInstagram || ''}
                onChange={e => setFormData({ ...formData, socialInstagram: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Facebook URL</label>
              <input
                type="url"
                className="form-input"
                value={formData.socialFacebook || ''}
                onChange={e => setFormData({ ...formData, socialFacebook: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input
                type="url"
                className="form-input"
                value={formData.socialLinkedIn || ''}
                onChange={e => setFormData({ ...formData, socialLinkedIn: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp Number / Link</label>
              <input
                type="text"
                className="form-input"
                value={formData.socialWhatsApp || ''}
                onChange={e => setFormData({ ...formData, socialWhatsApp: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
            {saving ? (
              'Saving Changes...'
            ) : (
              <>
                <Save size={18} />
                Save & Update Live Home Page
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
