'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import {
  Shield,
  Sparkles,
  Building,
  ExternalLink,
  Bell,
  RefreshCw,
  Calendar,
  Phone,
  MessageSquare,
  CheckCircle2,
  Check,
  X,
  Car,
  UserCheck,
  Clock,
  ArrowRight,
  Sliders,
  DollarSign
} from 'lucide-react';
import { formatPKR, timeAgo, formatWhatsAppLink } from '@/lib/utils';

interface NotificationItem {
  id: string;
  type: 'INQUIRY' | 'TEST_DRIVE';
  title: string;
  subtitle: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleName?: string;
  scheduledDate?: string;
  budget?: number;
  notes: string;
  status: string;
  timestamp: string;
  isNew: boolean;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ id: string; username: string; fullName: string; role: string } | null>(null);
  const [companyName, setCompanyName] = useState('Apex Luxury Motors');
  const [loading, setLoading] = useState(true);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activeNotifTab, setActiveNotifTab] = useState<'ALL' | 'INQUIRY' | 'TEST_DRIVE'>('ALL');
  const [toasts, setToasts] = useState<{ id: string; title: string; message: string; type: string }[]>([]);
  const prevCountRef = useRef<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Play subtle luxury audio chime on new notification
  const playChime = () => {
    try {
      if (typeof window !== 'undefined') {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        }
      }
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!data.authenticated) {
        router.push('/login');
      } else {
        setUser(data.user);
      }
    } catch (e) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const res = await fetch('/api/company');
      const data = await res.json();
      if (data.success && data.data?.name) {
        setCompanyName(data.data.name);
      }
    } catch {}
  };

  const fetchNotifications = async (isPolling = false) => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        const newCount = data.unreadCount || 0;
        
        // If unread count increased during polling, show toast alert and chime
        if (isPolling && newCount > prevCountRef.current && data.notifications.length > 0) {
          const latest = data.notifications[0];
          playChime();
          const toastId = `toast_${Date.now()}`;
          setToasts(prev => [
            ...prev,
            {
              id: toastId,
              title: latest.type === 'TEST_DRIVE' ? '🚗 VIP Test Drive Booking!' : '📩 New Customer Inquiry!',
              message: `${latest.customerName} (${latest.customerPhone}) - ${latest.vehicleName || 'Luxury Inquiry'}`,
              type: latest.type,
            }
          ]);
          // Auto dismiss toast after 6s
          setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== toastId));
          }, 6000);
        }
        
        prevCountRef.current = newCount;
        setUnreadCount(newCount);
      }
    } catch (e) {
      console.error('Failed to fetch notifications:', e);
    }
  };

  useEffect(() => {
    fetchSession();
    fetchCompanyInfo();
    fetchNotifications(false);

    // Auto-polling for real-time inquiries and bookings every 10 seconds
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [pathname]);

  // Click outside listener for notification dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirmTestDrive = async (id: string) => {
    try {
      const res = await fetch(`/api/test-drives/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' }),
      });
      if (res.ok) {
        fetchNotifications(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkInquiryContacted = async (id: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONTACTED' }),
      });
      if (res.ok) {
        fetchNotifications(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeNotifTab === 'INQUIRY') return n.type === 'INQUIRY';
    if (activeNotifTab === 'TEST_DRIVE') return n.type === 'TEST_DRIVE';
    return true;
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              animation: 'spinSlow 3s linear infinite',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
            }}
          >
            <Sparkles size={28} color="#ffffff" />
          </div>
          <div style={{ color: 'var(--emerald-light)', fontWeight: 800, fontSize: '1.15rem' }}>
            Authenticating Showroom Console...
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
            Loading procedural security tokens & live CRM feed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>{t.type === 'TEST_DRIVE' ? '🏎️' : '📩'}</span>
                <strong style={{ color: 'var(--emerald-light)', fontSize: '0.9rem' }}>{t.title}</strong>
              </div>
              <button
                onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
              >
                <X size={14} />
              </button>
            </div>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.84rem', lineHeight: '1.4' }}>
              {t.message}
            </p>
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  router.push('/admin/customers');
                  setToasts(prev => prev.filter(x => x.id !== t.id));
                }}
                className="btn-emerald btn-sm"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                Open in CRM <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Navigation */}
      <Sidebar user={user as any} />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar Header */}
        <header
          style={{
            height: '70px',
            padding: '0 32px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(9, 14, 26, 0.85)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          {/* Left Showroom Brand & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '7px' }}>
              <Building size={15} color="var(--emerald-light)" />
              <strong style={{ color: 'var(--text-primary)' }}>{companyName}</strong> • Showroom ERP
            </span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
            <span className="badge badge-emerald" style={{ fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerald-light)', animation: 'pulseBadge 1.5s infinite' }} />
              LIVE CONSOLE (PKR)
            </span>
          </div>

          {/* Right Action Tools: Notifications, Preview Web, User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }} ref={dropdownRef}>
            {/* Live Notifications Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                style={{
                  position: 'relative',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: isNotifOpen ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: isNotifOpen ? '1px solid var(--emerald-primary)' : '1px solid var(--border-subtle)',
                  color: isNotifOpen ? 'var(--emerald-light)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                title="Customer Inquiries & VIP Test Drive Bookings"
              >
                <Bell size={18} className={unreadCount > 0 ? 'animate-ring' : ''} />
                {unreadCount > 0 && (
                  <span
                    className="animate-badge-pulse"
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '9999px',
                      border: '2px solid #06080f',
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Tray */}
              {isNotifOpen && (
                <div className="notification-dropdown">
                  {/* Header */}
                  <div
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(15, 23, 42, 0.6)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Bell size={16} color="var(--emerald-light)" />
                      <strong style={{ fontSize: '0.95rem', color: '#fff' }}>Customer Notifications</strong>
                      {unreadCount > 0 && (
                        <span className="badge badge-available" style={{ fontSize: '0.65rem' }}>
                          {unreadCount} NEW
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => fetchNotifications(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                      }}
                      title="Refresh"
                    >
                      <RefreshCw size={13} />
                    </button>
                  </div>

                  {/* Filter Tabs */}
                  <div
                    style={{
                      display: 'flex',
                      padding: '8px 16px',
                      borderBottom: '1px solid var(--border-subtle)',
                      gap: '8px',
                      background: 'rgba(6, 10, 20, 0.4)',
                    }}
                  >
                    <button
                      onClick={() => setActiveNotifTab('ALL')}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        background: activeNotifTab === 'ALL' ? 'var(--emerald-dark)' : 'transparent',
                        color: activeNotifTab === 'ALL' ? '#fff' : 'var(--text-secondary)',
                      }}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      onClick={() => setActiveNotifTab('INQUIRY')}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        background: activeNotifTab === 'INQUIRY' ? 'var(--emerald-dark)' : 'transparent',
                        color: activeNotifTab === 'INQUIRY' ? '#fff' : 'var(--text-secondary)',
                      }}
                    >
                      Inquiries ({notifications.filter(n => n.type === 'INQUIRY').length})
                    </button>
                    <button
                      onClick={() => setActiveNotifTab('TEST_DRIVE')}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        background: activeNotifTab === 'TEST_DRIVE' ? 'var(--emerald-dark)' : 'transparent',
                        color: activeNotifTab === 'TEST_DRIVE' ? '#fff' : 'var(--text-secondary)',
                      }}
                    >
                      VIP Bookings ({notifications.filter(n => n.type === 'TEST_DRIVE').length})
                    </button>
                  </div>

                  {/* Notification List */}
                  <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                    {filteredNotifications.length === 0 ? (
                      <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <CheckCircle2 size={32} color="var(--emerald-primary)" style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                        <p style={{ fontSize: '0.88rem' }}>No customer notifications</p>
                        <span style={{ fontSize: '0.75rem' }}>All inquiries & bookings are up to date.</span>
                      </div>
                    ) : (
                      filteredNotifications.map(item => (
                        <div key={item.id} className={`notification-item ${item.isNew ? 'unread' : ''}`}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              background: item.type === 'TEST_DRIVE' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              color: item.type === 'TEST_DRIVE' ? 'var(--gold-light)' : 'var(--emerald-light)',
                            }}
                          >
                            {item.type === 'TEST_DRIVE' ? <Car size={18} /> : <MessageSquare size={18} />}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                              <strong style={{ fontSize: '0.85rem', color: '#fff' }}>
                                {item.customerName}
                              </strong>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {timeAgo(item.timestamp)}
                              </span>
                            </div>

                            <p style={{ fontSize: '0.78rem', color: 'var(--emerald-light)', fontWeight: 600, marginBottom: '4px' }}>
                              {item.type === 'TEST_DRIVE' ? `🏎️ Test Drive: ${item.vehicleName}` : `📩 ${item.subtitle}`}
                            </p>

                            {item.notes && (
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '4px' }}>
                                "{item.notes}"
                              </p>
                            )}

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                              <a
                                href={formatWhatsAppLink(item.customerPhone, `Hello ${item.customerName}, regarding your request at ${companyName}...`)}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  background: 'rgba(34, 197, 94, 0.15)',
                                  color: '#4ade80',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  border: '1px solid rgba(34, 197, 94, 0.3)',
                                }}
                              >
                                WhatsApp
                              </a>

                              <a
                                href={`tel:${item.customerPhone}`}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  color: 'var(--text-secondary)',
                                  fontSize: '0.72rem',
                                  textDecoration: 'none',
                                  border: '1px solid var(--border-subtle)',
                                }}
                              >
                                <Phone size={10} /> Call
                              </a>

                              {item.type === 'TEST_DRIVE' && item.status === 'SCHEDULED' && (
                                <button
                                  onClick={() => handleConfirmTestDrive(item.id)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    color: '#34d399',
                                    fontSize: '0.72rem',
                                    fontWeight: 600,
                                    border: '1px solid rgba(16, 185, 129, 0.4)',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <Check size={10} /> Confirm
                                </button>
                              )}

                              {item.type === 'INQUIRY' && item.status === 'NEW' && (
                                <button
                                  onClick={() => handleMarkInquiryContacted(item.id)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    background: 'rgba(6, 182, 212, 0.2)',
                                    color: '#38bdf8',
                                    fontSize: '0.72rem',
                                    fontWeight: 600,
                                    border: '1px solid rgba(6, 182, 212, 0.4)',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <Check size={10} /> Mark Contacted
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      padding: '12px 20px',
                      borderTop: '1px solid var(--border-subtle)',
                      background: 'rgba(15, 23, 42, 0.7)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Auto-syncs with live web bookings
                    </span>
                    <button
                      onClick={() => {
                        setIsNotifOpen(false);
                        router.push('/admin/customers');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--emerald-light)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Open Full CRM Portal <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Live Website */}
            <a
              href="/"
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = 'var(--emerald-primary)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <ExternalLink size={13} color="var(--emerald-light)" />
              Preview Website
            </a>

            {/* User Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '12px', borderLeft: '1px solid var(--border-subtle)' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #047857)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)',
                }}
              >
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                  {user?.fullName || user?.username}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--emerald-light)', fontWeight: 600 }}>
                  {user?.role || 'ADMINISTRATOR'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main style={{ padding: '32px', flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
