'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import {
  UserCheck,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Lock,
  UserX,
} from 'lucide-react';
import { UserData } from '@/lib/initialData';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form
  const initialForm = {
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: 'SALES_AGENT' as UserData['role'],
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData(initialForm);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (u: UserData) => {
    setEditingUser(u);
    setFormData({
      username: u.username,
      password: '', // Blank unless updating password
      fullName: u.fullName,
      email: u.email || '',
      role: u.role,
      isActive: u.isActive,
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save staff user');

      setSuccess(editingUser ? 'User credentials and permissions updated.' : 'Staff user created successfully.');
      fetchUsers();
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess(null);
      }, 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      setDeleteId(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = users.filter(
    u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            Staff & User Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Exclusive Admin Authority • No public registration permitted • Create, configure & manage staff permissions
          </p>
        </div>

        <button onClick={openCreateModal} className="btn-primary">
          <UserPlus size={18} /> Add New Staff Member
        </button>
      </div>

      {/* Authority Notice */}
      <div
        style={{
          padding: '16px 20px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid var(--border-emerald)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Shield size={20} color="var(--emerald-primary)" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--emerald-light)' }}>Zero Public Registration Enforced:</strong> Only the logged-in Administrator can create new accounts. Staff roles determine dashboard module visibility.
        </span>
      </div>

      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(7, 9, 14, 0.8)', padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', maxWidth: '400px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search staff by username, name, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem', width: '100%' }}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>User / Full Name</th>
                <th>Username</th>
                <th>Assigned Role</th>
                <th>Email Contact</th>
                <th>Account Status</th>
                <th>Last Active</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: u.role === 'ADMIN' ? 'linear-gradient(135deg, var(--emerald-primary), #047857)' : 'rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          color: '#fff',
                          fontSize: '0.85rem',
                        }}
                      >
                        {u.fullName.charAt(0)}
                      </div>
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.92rem', display: 'block' }}>
                          {u.fullName}
                        </strong>
                        {u.username === 'admin' && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--emerald-primary)', fontWeight: 700 }}>
                            SUPER ADMIN
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', color: 'var(--emerald-light)' }}>{u.username}</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === 'ADMIN'
                          ? 'badge-available'
                          : u.role === 'MANAGER'
                          ? 'badge-cyan'
                          : 'badge-reserved'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>{u.email || '—'}</td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-available' : 'badge-sold'}`}>
                      {u.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Never'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditModal(u)}
                        title="Edit User"
                        style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--border-emerald)', color: 'var(--emerald-primary)', cursor: 'pointer' }}
                      >
                        <Edit2 size={14} />
                      </button>
                      {u.username !== 'admin' && (
                        <button
                          onClick={() => setDeleteId(u.id)}
                          title="Delete User"
                          style={{ padding: '6px', borderRadius: '6px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fb7185', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CREATE / EDIT USER */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? `Edit Staff Account: ${editingUser.fullName}` : 'Create New Authorized Staff Account'}
        subtitle="Only Admin can create or modify showroom accounts"
      >
        <form onSubmit={handleSave}>
          {error && (
            <div style={{ padding: '12px', background: 'rgba(244,63,94,0.15)', border: '1px solid var(--rose-primary)', borderRadius: '8px', color: '#fb7185', marginBottom: '16px', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '12px', background: 'rgba(16,185,129,0.15)', border: '1px solid var(--emerald-primary)', borderRadius: '8px', color: '#34d399', marginBottom: '16px', fontSize: '0.85rem' }}>
              {success}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Belfort"
                className="form-input"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Username *</label>
              <input
                type="text"
                required
                placeholder="e.g. jordan_belfort"
                className="form-input"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Email Contact</label>
              <input
                type="email"
                placeholder="jordan@apexluxury.com"
                className="form-input"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {editingUser ? 'Reset Password (Leave blank to keep current)' : 'Password * (min 6 chars)'}
              </label>
              <input
                type="password"
                required={!editingUser}
                placeholder="••••••••"
                className="form-input"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Assigned Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as any })}
              >
                <option value="SALES_AGENT">Sales Agent (Inventory & Sales)</option>
                <option value="MANAGER">Showroom Manager (Full Ops)</option>
                <option value="INVENTORY_OFFICER">Inventory Officer (Fleet & Suppliers)</option>
                <option value="ADMIN">Administrator (Full Authority)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Account Status</label>
              <select
                className="form-select"
                value={formData.isActive ? 'ACTIVE' : 'INACTIVE'}
                onChange={e => setFormData({ ...formData, isActive: e.target.value === 'ACTIVE' })}
              >
                <option value="ACTIVE">Active Account</option>
                <option value="INACTIVE">Deactivated</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editingUser ? 'Update Staff Account' : 'Create Staff User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE */}
      {deleteId && (
        <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Staff User" maxWidth="420px">
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <AlertCircle size={40} color="#fb7185" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Are you sure you want to permanently delete this staff member?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="btn-danger">Confirm Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
