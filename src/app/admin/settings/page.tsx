'use client';

import React, { useState } from 'react';
import {
  Settings,
  KeyRound,
  Shield,
  Download,
  Database,
  FileJson,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Server,
  Cloud,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';

export default function AdminSettingsPage() {
  // Admin Credentials Update State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [credSaving, setCredSaving] = useState(false);
  const [credSuccess, setCredSuccess] = useState<string | null>(null);
  const [credError, setCredError] = useState<string | null>(null);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredSaving(true);
    setCredSuccess(null);
    setCredError(null);

    if (newPassword && newPassword !== confirmPassword) {
      setCredError('New password and confirmation do not match.');
      setCredSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/update-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername.trim() || undefined,
          newPassword: newPassword.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update credentials');

      setCredSuccess('Admin username/password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setCredSuccess(null), 4000);
    } catch (err: any) {
      setCredError(err.message);
    } finally {
      setCredSaving(false);
    }
  };

  const handleExportJson = () => {
    window.open('/api/backup?format=json', '_blank');
  };

  const handleExportCsv = () => {
    window.open('/api/backup?format=csv', '_blank');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
          Security Credentials & Data Backups
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
          Manage your Admin login credentials, rotate passwords, and export offline database backups.
        </p>
      </div>

      {/* SECTION 1: ADMIN CREDENTIALS */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--emerald-primary), #047857)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)',
            }}
          >
            <KeyRound size={20} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#fff' }}>Admin Profile & Password Manager</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Update your administrative username or rotate master access password
            </p>
          </div>
        </div>

        {credSuccess && (
          <div
            style={{
              padding: '14px 18px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--emerald-primary)',
              borderRadius: 'var(--radius-md)',
              color: '#34d399',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.9rem',
            }}
          >
            <CheckCircle2 size={18} />
            <span>{credSuccess}</span>
          </div>
        )}

        {credError && (
          <div
            style={{
              padding: '14px 18px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid var(--rose-primary)',
              borderRadius: 'var(--radius-md)',
              color: '#fb7185',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.9rem',
            }}
          >
            <AlertCircle size={18} />
            <span>{credError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateCredentials}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label">Current Master Password * (Required for verification)</label>
              <input
                type="password"
                required
                placeholder="Enter current password"
                className="form-input"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Admin Username (Leave blank to keep current)</label>
              <input
                type="text"
                placeholder="e.g. executive_admin"
                className="form-input"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label">New Password (min 6 characters)</label>
              <input
                type="password"
                placeholder="••••••••"
                className="form-input"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="form-input"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="submit" disabled={credSaving} className="btn-primary">
              {credSaving ? 'Updating...' : 'Update Admin Credentials'}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: ONE-CLICK SHOWROOM DATA BACKUPS */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--border-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Database size={20} color="var(--emerald-primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#fff' }}>Showroom Database & Inventory Backups</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Download offline snapshots of your fleet inventory, sales invoices, and customer registry
            </p>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', background: 'rgba(5, 7, 10, 0.6)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Download Complete System Snapshot</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Export full records in JSON format or spreadsheet-ready CSV for offline archival.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleExportJson} className="btn-primary btn-sm">
              <FileJson size={16} /> Export JSON Snapshot
            </button>
            <button onClick={handleExportCsv} className="btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <FileSpreadsheet size={16} color="var(--emerald-primary)" /> Export Inventory CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
