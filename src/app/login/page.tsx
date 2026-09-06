'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, User, ArrowRight, Sparkles, AlertCircle, KeyRound, Check } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Successful login
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const autofillAdmin = () => {
    setUsername('admin');
    setPassword('admin123');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(16, 185, 129, 0.12) 0%, rgba(5, 7, 10, 1) 75%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div className="ambient-glow glow-emerald animate-pulse-glow" style={{ top: '20%', left: '20%' }} />
      <div className="ambient-glow glow-gold animate-pulse-glow" style={{ bottom: '20%', right: '20%' }} />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          position: 'relative',
          zIndex: 1,
        }}
        className="animate-slide-up"
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--emerald-primary), #047857)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
              }}
            >
              <Sparkles size={26} color="#fff" />
            </div>
          </Link>
          <h1 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
            Executive Admin Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Authorized Personnel & Showroom Management
          </p>
        </div>

        {/* Login Form Card */}
        <div
          className="glass-panel"
          style={{
            padding: '36px',
            border: '1px solid var(--border-medium)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 25px rgba(245, 158, 11, 0.1)',
          }}
        >
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#fb7185',
                fontSize: '0.85rem',
                marginBottom: '20px',
              }}
              className="animate-fade-in"
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} color="var(--gold-primary)" />
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="form-input"
                autoComplete="username"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={14} color="var(--gold-primary)" />
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              {loading ? (
                'Authenticating...'
              ) : (
                <>
                  <Shield size={18} /> Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Hint */}
          <div
            style={{
              marginTop: '24px',
              padding: '14px',
              background: 'rgba(245, 158, 11, 0.08)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-gold)',
              fontSize: '0.82rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <KeyRound size={14} /> Initial Admin Credentials
              </span>
              <button
                type="button"
                onClick={autofillAdmin}
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Autofill
              </button>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Username: <strong style={{ color: '#fff' }}>admin</strong> • Password: <strong style={{ color: '#fff' }}>admin123</strong>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              * Admin can change username and password anytime in Settings.
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}>
            ← Return to Public Showroom
          </Link>
        </div>
      </div>
    </div>
  );
}
