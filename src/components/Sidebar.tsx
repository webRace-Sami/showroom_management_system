'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  Receipt,
  Users,
  Building2,
  UserCheck,
  Settings,
  LogOut,
  ExternalLink,
  Sparkles,
  Truck,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  user?: {
    username: string;
    fullName: string;
    role: string;
    email?: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    {
      label: 'Dashboard Overview',
      href: '/admin',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'MANAGER', 'SALES_AGENT', 'INVENTORY_OFFICER'],
    },
    {
      label: 'Vehicle Inventory',
      href: '/admin/inventory',
      icon: Car,
      roles: ['ADMIN', 'MANAGER', 'SALES_AGENT', 'INVENTORY_OFFICER'],
    },
    {
      label: 'Sales & Invoices',
      href: '/admin/sales',
      icon: Receipt,
      roles: ['ADMIN', 'MANAGER', 'SALES_AGENT'],
    },
    {
      label: 'Customers & Leads',
      href: '/admin/customers',
      icon: Users,
      roles: ['ADMIN', 'MANAGER', 'SALES_AGENT'],
    },
    {
      label: 'Suppliers & Logistics',
      href: '/admin/suppliers',
      icon: Truck,
      roles: ['ADMIN', 'MANAGER', 'INVENTORY_OFFICER'],
    },
    {
      label: 'Dynamic Company Info',
      href: '/admin/company-info',
      icon: Building2,
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      label: 'Staff User Management',
      href: '/admin/users',
      icon: UserCheck,
      roles: ['ADMIN'], // Only Admin can manage users!
    },
    {
      label: 'Settings & Backups',
      href: '/admin/settings',
      icon: Settings,
      roles: ['ADMIN', 'MANAGER', 'SALES_AGENT', 'INVENTORY_OFFICER'],
    },
  ];

  const userRole = user?.role || 'ADMIN';

  return (
    <aside
      style={{
        width: '280px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #090e1a 0%, #06080f 100%)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
      className="admin-sidebar"
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
          }}
        >
          <Sparkles size={22} color="#ffffff" />
        </div>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.15rem',
              letterSpacing: '0.03em',
              display: 'block',
              lineHeight: 1.1,
            }}
            className="emerald-gradient-text"
          >
            APEX MOTORS
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Showroom Management (PKR)
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div style={{ padding: '20px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ padding: '0 10px 8px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Management Modules
        </div>

        {navItems
          .filter(item => item.roles.includes(userRole))
          .map((item, idx) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={idx}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))'
                    : 'transparent',
                  color: isActive ? 'var(--emerald-light)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--border-emerald)' : '1px solid transparent',
                  boxShadow: isActive ? '0 4px 18px rgba(16, 185, 129, 0.2)' : 'none',
                }}
                onMouseOver={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseOut={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon size={18} color={isActive ? 'var(--emerald-primary)' : 'currentColor'} />
                <span>{item.label}</span>
              </Link>
            );
          })}

        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'var(--emerald-primary)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ExternalLink size={15} color="var(--emerald-light)" />
              View Public Showroom
            </span>
          </Link>
        </div>
      </div>

      {/* User Footer Profile */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(7, 10, 18, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #064e3b, #059669)',
              border: '1px solid var(--border-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: '#ffffff',
              fontSize: '0.85rem',
              flexShrink: 0,
            }}
          >
            {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'A'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.fullName || user?.username || 'Executive Admin'}
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
              {user?.role || 'ADMIN'}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign Out"
          style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            color: '#fb7185',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = 'rgba(244, 63, 94, 0.25)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)';
            e.currentTarget.style.color = '#fb7185';
          }}
        >
          <LogOut size={16} />
        </button>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .admin-sidebar {
            width: 100% !important;
            min-height: auto !important;
            position: relative !important;
          }
        }
      `}</style>
    </aside>
  );
}
