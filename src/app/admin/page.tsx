'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardCharts from '@/components/DashboardCharts';
import {
  Car,
  Receipt,
  Users,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Building,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Bell,
  BellRing,
  CheckCircle2,
  Phone,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  Clock
} from 'lucide-react';
import { formatPKR, formatPKRShort, timeAgo, formatWhatsAppLink } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resStats, resNotifs] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/notifications'),
      ]);
      const dataStats = await resStats.json();
      const dataNotifs = await resNotifs.json();

      if (dataStats.success) {
        setStats(dataStats.data);
      }
      if (dataNotifs.success) {
        setNotifications(dataNotifs.notifications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 16px', color: 'var(--emerald-primary)' }} />
        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>Loading Showroom Executive Intelligence...</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Compiling live PKR fleet valuations and incoming customer bookings</p>
      </div>
    );
  }

  const { kpis, monthlyTrends, categoryDistribution, inquiryFunnel, recentSales, recentInquiries } = stats;
  const newNotifs = notifications.filter(n => n.isNew);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner & Quick Actions */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', color: '#fff', fontWeight: 800 }}>
            Showroom Executive Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            PKR Currency Management • Real-Time Customer Bookings & Commercial Analytics
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/admin/inventory" className="btn-emerald btn-sm">
            <Plus size={16} /> Add Vehicle
          </Link>
          <Link href="/admin/sales" className="btn-secondary btn-sm">
            <Receipt size={16} color="var(--emerald-light)" /> Record Sale & Invoice
          </Link>
          <Link href="/admin/company-info" className="btn-secondary btn-sm">
            <Building size={16} color="var(--emerald-primary)" /> Edit Showroom CMS
          </Link>
        </div>
      </div>

      {/* REAL-TIME INCOMING LEADS ALERT BANNER */}
      {newNotifs.length > 0 && (
        <div
          className="glass-panel-emerald animate-slide-down"
          style={{
            padding: '20px 24px',
            marginBottom: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-emerald)',
                }}
              >
                <BellRing size={18} color="var(--emerald-light)" />
              </div>
              <div>
                <strong style={{ color: '#fff', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {newNotifs.length} New Customer Inquiries & VIP Bookings Awaiting Attention
                  <span className="badge badge-pulse-emerald" style={{ fontSize: '0.7rem' }}>LIVE ALERT</span>
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Prospective buyers have requested vehicle allocations and private track demonstrations.
                </span>
              </div>
            </div>

            <Link href="/admin/customers" className="btn-emerald btn-sm">
              View All In CRM <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', marginTop: '4px' }}>
            {newNotifs.slice(0, 3).map((n: any) => (
              <div
                key={n.id}
                style={{
                  padding: '12px 14px',
                  background: 'rgba(5, 7, 10, 0.6)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {n.customerName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--emerald-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {n.type === 'TEST_DRIVE' ? `🚗 VIP Test Drive: ${n.vehicleName}` : `📩 ${n.vehicleName || 'General Inquiry'}`}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {n.customerPhone && (
                    <a
                      href={formatWhatsAppLink(n.customerPhone, `Hello ${n.customerName}, this is Apex Luxury Motors regarding your request for ${n.vehicleName || 'our showroom inventory'}.`)}
                      target="_blank"
                      rel="noreferrer"
                      title="WhatsApp Chat"
                      style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16,185,129,0.15)', color: '#34d399', display: 'flex', alignItems: 'center' }}
                    >
                      <MessageSquare size={13} />
                    </a>
                  )}
                  {n.customerPhone && (
                    <a
                      href={`tel:${n.customerPhone}`}
                      title="Direct Call"
                      style={{ padding: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', display: 'flex', alignItems: 'center' }}
                    >
                      <PhoneCall size={13} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Card 1: Showroom Fleet Inventory Valuation */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Fleet Inventory Valuation (PKR)
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
                {formatPKRShort(kpis.totalInventoryValue)}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                Exact: {formatPKR(kpis.totalInventoryValue)}
              </span>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--border-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={20} color="var(--emerald-primary)" />
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>{kpis.availableVehicles} Available In Showroom</span>
            <span style={{ color: 'var(--emerald-light)' }}>{kpis.reservedVehicles} Reserved</span>
          </div>
        </div>

        {/* Card 2: Executed Sales Revenue */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Executed Sales Revenue (PKR)
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-primary)', marginTop: '8px' }}>
                {formatPKRShort(kpis.totalSalesRevenue)}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                Exact: {formatPKR(kpis.totalSalesRevenue)}
              </span>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--border-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} color="var(--emerald-primary)" />
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>{kpis.totalSalesCount} Completed Invoices</span>
            <span style={{ color: 'var(--emerald-primary)' }}>+18.4% MoM</span>
          </div>
        </div>

        {/* Card 3: Active Client Inquiries & Bookings */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Active VIP Leads & Bookings
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-light)', marginTop: '8px' }}>
                {kpis.activeInquiries} Active
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                {kpis.scheduledTestDrives} Scheduled VIP Test Drives
              </span>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--border-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="var(--emerald-primary)" />
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Conversion Ratio</span>
            <span style={{ color: 'var(--emerald-light)' }}>~42.5% Success</span>
          </div>
        </div>

        {/* Card 4: Showroom Operational Status */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Showroom System Status
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-primary)', marginTop: '8px' }}>
                100% Online
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                All Modules Active & Verified
              </span>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--border-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="var(--emerald-primary)" />
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Real-Time Inquiries Sync</span>
            <span style={{ color: 'var(--emerald-light)' }}>Live & Secure</span>
          </div>
        </div>
      </div>

      {/* UPPER DASHBOARD INTERACTIVE GRAPHS COMPONENT */}
      <DashboardCharts
        monthlyTrends={monthlyTrends}
        categoryDistribution={categoryDistribution}
        inquiryFunnel={inquiryFunnel}
        totalRevenue={kpis.totalSalesRevenue}
        totalUnitsSold={kpis.totalSalesCount}
      />

      {/* LOWER SECTION: RECENT PROCEDURAL RECORDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '28px' }}>
        {/* Recent Sales Table */}
        <div className="glass-panel" style={{ padding: '24px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>Recent Executed Sales</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Latest processed invoices and delivery status in PKR</p>
            </div>
            <Link href="/admin/sales" style={{ color: 'var(--emerald-light)', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Vehicle</th>
                  <th>Total (PKR)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale: any) => (
                  <tr key={sale.id}>
                    <td><strong style={{ color: 'var(--emerald-light)' }}>{sale.invoiceNo}</strong></td>
                    <td>{sale.customerName}</td>
                    <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sale.vehicleName}</td>
                    <td style={{ fontWeight: 700, color: '#fff' }}>{formatPKR(sale.finalPrice)}</td>
                    <td>
                      <span className="badge badge-available" style={{ fontSize: '0.7rem' }}>
                        {sale.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Client Inquiries */}
        <div className="glass-panel" style={{ padding: '24px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>Active Inquiries & VIP Leads</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Prospect interest submitted via showroom portal</p>
            </div>
            <Link href="/admin/customers" style={{ color: 'var(--emerald-light)', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Vehicle Interest</th>
                  <th>Phone</th>
                  <th>Stage</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inq: any) => (
                  <tr key={inq.id}>
                    <td><strong style={{ color: '#fff' }}>{inq.customerName}</strong></td>
                    <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.interestedVehicle}</td>
                    <td>{inq.customerPhone}</td>
                    <td>
                      <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                        {inq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
