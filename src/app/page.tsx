'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Modal from '@/components/Modal';
import {
  Sparkles,
  Shield,
  Award,
  Zap,
  Phone,
  Calendar,
  Compass,
  ArrowRight,
  CheckCircle2,
  Car,
  Fuel,
  Gauge,
  Sliders,
  Search,
  ChevronRight,
  Send,
  MapPin,
  Clock,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { CompanyInfoData, VehicleData } from '@/lib/initialData';
import { formatPKR, formatPKRShort, formatWhatsAppLink } from '@/lib/utils';

export default function HomePage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoData | null>(null);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);
  const [testDriveVehicle, setTestDriveVehicle] = useState('');

  // Inquiry/Test Drive Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleName: '',
    scheduledDate: '',
    notes: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch dynamic company info
    fetch('/api/company')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCompanyInfo(data.data);
      })
      .catch(console.error);

    // Fetch showroom inventory
    fetch('/api/inventory')
      .then(res => res.json())
      .then(data => {
        if (data.success) setVehicles(data.data);
      })
      .catch(console.error);
  }, []);

  const handleTestDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormSuccess(null);
    setFormError(null);

    try {
      const res = await fetch('/api/test-drives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail,
          vehicleName: formData.vehicleName || testDriveVehicle || 'Flagship VIP Viewing',
          scheduledDate: formData.scheduledDate || new Date().toISOString(),
          notes: formData.notes,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to submit booking');

      setFormSuccess('VIP Reservation received! Our Private Client Concierge has been alerted and will contact you promptly.');
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        vehicleName: '',
        scheduledDate: '',
        notes: '',
      });
      setTimeout(() => {
        setIsTestDriveModalOpen(false);
        setFormSuccess(null);
      }, 3500);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const openTestDriveFor = (vehName: string) => {
    setTestDriveVehicle(vehName);
    setFormData(prev => ({ ...prev, vehicleName: vehName }));
    setIsTestDriveModalOpen(true);
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesFilter = selectedFilter === 'ALL' || v.bodyType.toUpperCase() === selectedFilter.toUpperCase();
    const matchesSearch =
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.variant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.exteriorColor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const info = companyInfo || {
    name: 'Apex Luxury Motors',
    tagline: 'Excellence in Automotive Luxury & High-Performance Engineering',
    logoText: 'APEX MOTORS',
    email: 'concierge@apexluxurymotors.com',
    phone: '+92 (42) 3578-9900',
    secondaryPhone: '+92 (300) 845-1122',
    address: 'Plot 48-A, Main Boulevard, Gulberg III',
    city: 'Lahore',
    state: 'Punjab',
    postalCode: '54660',
    country: 'Pakistan',
    openingHours: 'Mon - Sat: 10:00 AM - 9:00 PM | Sun: 2:00 PM - 8:00 PM (By Appointment)',
    aboutUs: 'For over two decades, Apex Luxury Motors has set the benchmark for prestige automotive retail across Pakistan and internationally. We curate an ultra-exclusive inventory of the world’s most sought-after luxury sedans, grand tourers, hypercars, and bespoke SUVs with full import clearance and white-glove delivery.',
    visionText: 'Delivering unmatched automotive craftsmanship, transparent advisory, and white-glove client experience to connoisseurs and collectors worldwide.',
    warrantyPolicy: 'Every certified vehicle undergoes an uncompromising 180-point inspection and includes our 24-month comprehensive concierge warranty with 24/7 VIP roadside assistance and factory maintenance packages.',
    warrantyHighlightTitle: '24 Months',
    warrantyHighlightSubtitle: 'Concierge Warranty Included',
    warrantyInspectionPoints: '180-Point',
    warrantyInspectionSubtitle: 'Certified Multi-Point Audit',
    socialInstagram: 'https://instagram.com/apexluxurymotors',
    socialFacebook: 'https://facebook.com/apexluxurymotors',
    socialLinkedIn: 'https://linkedin.com/company/apexluxurymotors',
    socialTwitter: 'https://twitter.com/apexluxurymotors',
    socialWhatsApp: '+923008451122',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', position: 'relative' }}>
      <Navbar companyInfo={info as any} />

      {/* HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '160px 24px 100px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '92vh',
          background: 'radial-gradient(ellipse at 50% 20%, rgba(16, 185, 129, 0.15) 0%, rgba(6, 8, 15, 0.98) 75%)',
        }}
      >
        {/* Animated Glow Blobs */}
        <div className="ambient-glow glow-emerald animate-pulse-glow" style={{ top: '10%', left: '15%' }} />
        <div className="ambient-glow glow-gold animate-pulse-glow" style={{ bottom: '15%', right: '15%' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }} className="animate-slide-up">
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 20px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid var(--border-emerald)',
              marginBottom: '24px',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
            }}
          >
            <Sparkles size={16} color="var(--emerald-light)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--emerald-light)', textTransform: 'uppercase' }}>
              Certified Bespoke Fleet & Luxury Heritage • PKR Pricing
            </span>
          </div>

          {/* Hero Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.6rem)',
              lineHeight: 1.08,
              marginBottom: '24px',
              fontWeight: 800,
            }}
          >
            <span className="silver-gradient-text">Bespoke Automotive</span> <br />
            <span className="emerald-gradient-text">{info.name.toUpperCase()}</span>
          </h1>

          {/* Subtitle (Dynamic from Company Info) */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '820px',
              margin: '0 auto 40px',
              lineHeight: 1.65,
            }}
          >
            {info.tagline}
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <a href="#inventory" className="btn-emerald" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              Explore Available Fleet
              <ArrowRight size={18} />
            </a>
            <button onClick={() => openTestDriveFor('Flagship Experience')} className="btn-secondary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
              <Calendar size={18} color="var(--emerald-light)" />
              Book VIP Viewing
            </button>
          </div>

          {/* Quick Metrics Bar (PKR) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              marginTop: '70px',
              padding: '24px',
              background: 'rgba(13, 20, 36, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--emerald-light)' }}>
                {vehicles.length > 0 ? vehicles.length : '15'}+
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Curated Exotics In Stock
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>PKR (Rs.)</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Transparent Pricing & Invoices
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--emerald-light)' }}>
                {info.warrantyHighlightTitle || '24 Months'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {info.warrantyHighlightSubtitle || 'Concierge Warranty Included'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--emerald-primary)' }}>
                {info.warrantyInspectionPoints || '180-Point'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {info.warrantyInspectionSubtitle || 'Certified Multi-Point Audit'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOWROOM INVENTORY SECTION */}
      <section id="inventory" style={{ padding: '100px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Exclusive Fleet Showcase
          </span>
          <h2 style={{ fontSize: '2.5rem', marginTop: '8px', color: '#fff' }}>
            Explore Available Showroom Inventory
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '12px auto 0' }}>
            All vehicles are available for immediate delivery across Pakistan with verified customs, documentation, and provenance.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '36px',
            padding: '16px 20px',
            background: 'rgba(13, 20, 36, 0.75)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['ALL', 'SEDAN', 'SUV', 'COUPE', 'ELECTRIC', 'SUPERCAR'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: selectedFilter === cat ? 'var(--emerald-primary)' : 'var(--border-subtle)',
                  background: selectedFilter === cat ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedFilter === cat ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: selectedFilter === cat ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(6, 10, 20, 0.8)', padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', minWidth: '260px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search make, model, variant..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem', width: '100%' }}
            />
          </div>
        </div>

        {/* Vehicles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
          {filteredVehicles.map(veh => {
            const isAvailable = veh.status === 'AVAILABLE';
            const isReserved = veh.status === 'RESERVED';
            const isSold = veh.status === 'SOLD';

            return (
              <div
                key={veh.id}
                className="glass-panel glass-panel-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Status Badge */}
                <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 2 }}>
                  <span
                    className={`badge ${
                      isAvailable ? 'badge-available' : isReserved ? 'badge-reserved' : 'badge-sold'
                    }`}
                  >
                    {veh.status}
                  </span>
                </div>

                {/* Card Top / Title */}
                <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--emerald-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {veh.year} • {veh.bodyType}
                  </div>
                  <h3 style={{ fontSize: '1.35rem', color: '#fff', marginTop: '4px', lineHeight: 1.2 }}>
                    {veh.make} {veh.model}
                  </h3>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {veh.variant}
                  </div>
                </div>

                {/* Specs Pill List */}
                <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                      <Fuel size={16} color="var(--emerald-light)" />
                      <span>{veh.fuelType}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                      <Gauge size={16} color="var(--emerald-light)" />
                      <span>{veh.mileage.toLocaleString()} km</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                      <Sliders size={16} color="var(--emerald-light)" />
                      <span>{veh.transmission}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                      <Shield size={16} color="var(--emerald-light)" />
                      <span>{veh.condition.replace(/_/g, ' ')}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <strong style={{ color: 'var(--text-secondary)' }}>Finish:</strong> {veh.exteriorColor}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {veh.description}
                  </p>
                </div>

                {/* Price & Action in PKR */}
                <div
                  style={{
                    padding: '20px 24px',
                    background: 'rgba(6, 10, 20, 0.7)',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                      Showroom Price (PKR)
                    </span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--emerald-light)' }}>
                      {formatPKR(veh.sellingPrice)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedVehicle(veh)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid var(--border-medium)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Specs
                    </button>
                    {isAvailable && (
                      <button
                        onClick={() => openTestDriveFor(`${veh.make} ${veh.model} (${veh.year})`)}
                        className="btn-emerald btn-sm"
                      >
                        Inquire
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SHOWROOM SERVICES SECTION */}
      <section id="services" style={{ padding: '80px 24px', background: 'rgba(10, 16, 30, 0.65)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              White Glove Standards
            </span>
            <h2 style={{ fontSize: '2.4rem', marginTop: '8px', color: '#fff' }}>
              VIP Showroom Services
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '32px 24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid var(--border-emerald)' }}>
                <Sparkles size={24} color="var(--emerald-primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '10px' }}>Custom Bespoke Financing</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Tailored confidential financing, high-value asset leasing, and structured payment solutions in PKR designed for discerning collectors.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '32px 24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid var(--cyan-glow)' }}>
                <Award size={24} color="var(--cyan-primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '10px' }}>180-Point Certified Inspection</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every vehicle in our showroom is inspected down to the chassis, electronics, drivetrain, and paint depth to guarantee authentic provenance.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '32px 24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid var(--border-emerald)' }}>
                <Zap size={24} color="var(--emerald-primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '10px' }}>Private Test-Drive Logistics</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Enjoy an uninterrupted private road demonstration or private closed-circuit session accompanied by certified performance specialists.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '32px 24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid var(--border-emerald)' }}>
                <Compass size={24} color="var(--emerald-primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '10px' }}>Enclosed Nationwide Transport</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                White-glove covered logistics to your private residence, estate, or private hangar anywhere across Pakistan and internationally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC COMPANY ABOUT SECTION */}
      <section id="about" style={{ padding: '100px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Showroom Heritage
            </span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '8px', color: '#fff', lineHeight: 1.2 }}>
              About {info.name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.7, marginTop: '20px' }}>
              {info.aboutUs}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginTop: '16px' }}>
              {info.visionText}
            </p>

            {/* Warranty Guarantee Box */}
            <div style={{ marginTop: '28px', padding: '20px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-emerald)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--emerald-light)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
                <Shield size={18} />
                Certified Showroom Warranty Policy
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                {info.warrantyPolicy}
              </p>
            </div>
          </div>

          {/* Showroom Specs / Executive Standards Box */}
          <div className="glass-panel-emerald" style={{ padding: '36px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '20px' }}>
              Executive Showroom Standards
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <CheckCircle2 size={20} color="var(--emerald-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block' }}>180-Point Certified Multi-Point Audit</strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Every vehicle passes rigorous mechanical, chassis, electronics, and paint depth diagnostic certification.</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <CheckCircle2 size={20} color="var(--emerald-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block' }}>100% Genuine Customs & Title Provenance</strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Complete verified paperwork, genuine factory mileage certification, and clear ownership transfer documents.</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <CheckCircle2 size={20} color="var(--emerald-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block' }}>Dedicated VIP Concierge & Warranty</strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Full concierge assistance, covered nationwide transport, and dedicated after-sales master technicians.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOK TEST DRIVE / INQUIRY SECTION */}
      <section id="test-drive" style={{ padding: '100px 24px', background: 'radial-gradient(ellipse at 50% 50%, rgba(13, 20, 36, 0.95) 0%, rgba(6, 8, 15, 1) 100%)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Private VIP Reservation
            </span>
            <h2 style={{ fontSize: '2.4rem', marginTop: '8px', color: '#fff' }}>
              Book a Showroom Test-Drive or Consultation
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '8px' }}>
              Schedule a private slot with our master brand specialist.
            </p>
          </div>

          <form onSubmit={handleTestDriveSubmit} className="glass-panel" style={{ padding: '36px' }}>
            {formSuccess && (
              <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-primary)', borderRadius: 'var(--radius-md)', color: '#34d399', marginBottom: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} />
                {formSuccess}
              </div>
            )}
            {formError && (
              <div style={{ padding: '16px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--rose-primary)', borderRadius: 'var(--radius-md)', color: '#fb7185', marginBottom: '20px', fontSize: '0.9rem' }}>
                {formError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daniyal Qureshi"
                  className="form-input"
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +92 (300) 123-4567"
                  className="form-input"
                  value={formData.customerPhone}
                  onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. client@domain.pk"
                  className="form-input"
                  value={formData.customerEmail}
                  onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle of Interest</label>
                <input
                  type="text"
                  placeholder="e.g. Rolls-Royce Ghost or Porsche GT3 RS"
                  className="form-input"
                  value={formData.vehicleName}
                  onChange={e => setFormData({ ...formData, vehicleName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Date & Time</label>
              <input
                type="datetime-local"
                className="form-input"
                value={formData.scheduledDate}
                onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Special Requests or Bespoke Requirements</label>
              <textarea
                rows={3}
                placeholder="Trade-in preferences, financing discussions, or track demonstration requirements..."
                className="form-textarea"
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={formSubmitting}
              className="btn-emerald"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '8px' }}
            >
              {formSubmitting ? (
                'Transmitting VIP Request...'
              ) : (
                <>
                  <Send size={18} />
                  Confirm VIP Reservation
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* CONTACT & LOCATION SECTION */}
      <section id="contact" style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '36px' }}>
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <MapPin size={22} color="var(--emerald-light)" />
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Showroom Coordinates</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {info.address} <br />
              {info.city}, {info.state} {info.postalCode}, {info.country}
            </p>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--emerald-light)', fontWeight: 600 }}>VIP Valet Parking Available</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Private viewing suites available on 24hr notice</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Clock size={22} color="var(--emerald-light)" />
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Operating Hours</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {info.openingHours}
            </p>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--emerald-light)', fontWeight: 600 }}>Private After-Hours Appointments</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Available exclusively for accredited VIP collectors</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Phone size={22} color="var(--emerald-light)" />
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Direct Concierge</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Primary: <a href={`tel:${info.phone}`} style={{ color: '#fff', fontWeight: 600 }}>{info.phone}</a> <br />
              Secondary: <a href={`tel:${info.secondaryPhone}`} style={{ color: '#fff' }}>{info.secondaryPhone}</a> <br />
              Email: <a href={`mailto:${info.email}`} style={{ color: 'var(--emerald-light)' }}>{info.email}</a>
            </p>
          </div>
        </div>
      </section>

      {/* MODAL: VEHICLE FULL SPECS SHEET */}
      {selectedVehicle && (
        <Modal
          isOpen={!!selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          title={`${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`}
          subtitle={`VIN: ${selectedVehicle.vin} • Status: ${selectedVehicle.status}`}
          maxWidth="720px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-emerald)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Selling Price (PKR)</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-light)' }}>
                  {formatPKR(selectedVehicle.sellingPrice)}
                </div>
              </div>
              <span className={`badge ${selectedVehicle.status === 'AVAILABLE' ? 'badge-available' : 'badge-reserved'}`} style={{ fontSize: '0.85rem' }}>
                {selectedVehicle.status}
              </span>
            </div>

            {/* Spec Table */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.9rem' }}>
              <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Variant / Trim</span>
                <strong style={{ color: '#fff' }}>{selectedVehicle.variant}</strong>
              </div>
              <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Body Style</span>
                <strong style={{ color: '#fff' }}>{selectedVehicle.bodyType}</strong>
              </div>
              <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Fuel Type</span>
                <strong style={{ color: '#fff' }}>{selectedVehicle.fuelType}</strong>
              </div>
              <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Transmission</span>
                <strong style={{ color: '#fff' }}>{selectedVehicle.transmission}</strong>
              </div>
              <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Exterior Color</span>
                <strong style={{ color: '#fff' }}>{selectedVehicle.exteriorColor}</strong>
              </div>
              <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Interior Trim</span>
                <strong style={{ color: '#fff' }}>{selectedVehicle.interiorColor}</strong>
              </div>
              <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Mileage</span>
                <strong style={{ color: '#fff' }}>{selectedVehicle.mileage.toLocaleString()} km</strong>
              </div>
              <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'block' }}>Engine Number</span>
                <strong style={{ color: '#fff' }}>{selectedVehicle.engineNo}</strong>
              </div>
            </div>

            {/* Features List */}
            {selectedVehicle.features && (
              <div>
                <h4 style={{ color: 'var(--emerald-light)', fontSize: '0.95rem', marginBottom: '8px' }}>Equipment & Bespoke Options</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedVehicle.features.split(',').map((f, i) => (
                    <span key={i} style={{ padding: '6px 12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', fontSize: '0.8rem', color: '#e2e8f0', border: '1px solid var(--border-subtle)' }}>
                      • {f.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '6px' }}>Curator Description</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {selectedVehicle.description}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button
                onClick={() => {
                  const name = `${selectedVehicle.make} ${selectedVehicle.model}`;
                  setSelectedVehicle(null);
                  openTestDriveFor(name);
                }}
                className="btn-emerald"
                style={{ flex: 1 }}
              >
                Inquire & Book Test Drive
              </button>

              <a
                href={formatWhatsAppLink(info.phone, `Hello ${info.name}, I am interested in the ${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model} priced at ${formatPKR(selectedVehicle.sellingPrice)}.`)}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(34, 197, 94, 0.2)',
                  color: '#4ade80',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                }}
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: TEST DRIVE POPUP */}
      <Modal
        isOpen={isTestDriveModalOpen}
        onClose={() => setIsTestDriveModalOpen(false)}
        title="Schedule VIP Test-Drive or Consultation"
        subtitle={testDriveVehicle ? `Selected Vehicle: ${testDriveVehicle}` : 'Showroom Viewing'}
      >
        <form onSubmit={handleTestDriveSubmit}>
          {formSuccess && (
            <div style={{ padding: '14px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-primary)', borderRadius: 'var(--radius-md)', color: '#34d399', marginBottom: '16px', fontSize: '0.88rem' }}>
              {formSuccess}
            </div>
          )}
          {formError && (
            <div style={{ padding: '14px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--rose-primary)', borderRadius: 'var(--radius-md)', color: '#fb7185', marginBottom: '16px', fontSize: '0.88rem' }}>
              {formError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Daniyal Qureshi"
              className="form-input"
              value={formData.customerName}
              onChange={e => setFormData({ ...formData, customerName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="e.g. +92 (300) 123-4567"
              className="form-input"
              value={formData.customerPhone}
              onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="e.g. client@domain.pk"
              className="form-input"
              value={formData.customerEmail}
              onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Scheduled Date & Time Slot</label>
            <input
              type="datetime-local"
              className="form-input"
              value={formData.scheduledDate}
              onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bespoke Notes / Requirements</label>
            <textarea
              rows={2}
              placeholder="Special requirements..."
              className="form-textarea"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={formSubmitting}
            className="btn-emerald"
            style={{ width: '100%', padding: '12px', marginTop: '12px' }}
          >
            {formSubmitting ? 'Transmitting...' : 'Submit VIP Booking'}
          </button>
        </form>
      </Modal>

      <Footer companyInfo={info as any} />
    </div>
  );
}
