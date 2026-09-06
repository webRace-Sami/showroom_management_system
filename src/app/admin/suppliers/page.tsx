'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import {
  Truck,
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { SupplierData } from '@/lib/initialData';
import { formatPKR, formatWhatsAppLink } from '@/lib/utils';

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const initialForm = {
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    totalProcured: 0,
    notes: '',
  };
  const [formData, setFormData] = useState<any>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/suppliers');
      const data = await res.json();
      if (data.success) setSuppliers(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const openModal = (sup?: SupplierData) => {
    if (sup) {
      setEditingSupplier(sup);
      setFormData({ ...sup });
    } else {
      setEditingSupplier(null);
      setFormData(initialForm);
    }
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url = editingSupplier ? `/api/suppliers/${editingSupplier.id}` : '/api/suppliers';
      const method = editingSupplier ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save supplier');

      setSuccess('Supplier logistics profile saved.');
      fetchSuppliers();
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
      const res = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete supplier');
      setDeleteId(null);
      fetchSuppliers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    s.phone.includes(search)
  );

  const formatPrice = (val: number) => {
    return formatPKR(val);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
            Procurement & OEM Suppliers
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            International exotic vehicle procurement partners and logistics accounts
          </p>
        </div>

        <button onClick={() => openModal()} className="btn-primary">
          <Plus size={18} /> Register Supplier
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(7, 9, 14, 0.8)', padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', maxWidth: '400px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search supplier, contact representative..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem', width: '100%' }}
          />
        </div>
      </div>

      {/* Supplier Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {filtered.map(sup => (
          <div key={sup.id} className="glass-panel glass-panel-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>{sup.name}</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--gold-primary)', fontWeight: 600 }}>Rep: {sup.contactPerson}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => openModal(sup)} style={{ padding: '6px', borderRadius: '6px', background: 'rgba(245,158,11,0.1)', border: '1px solid var(--border-gold)', color: 'var(--gold-primary)', cursor: 'pointer' }}>
                  <Edit2 size={14} />
                </button>
                <button onClick={() => setDeleteId(sup.id)} style={{ padding: '6px', borderRadius: '6px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fb7185', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="var(--gold-primary)" />
                <span>{sup.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="var(--gold-primary)" />
                <span>{sup.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={14} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{sup.address}</span>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Procurement Total</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                  {formatPrice(sup.totalProcured)}
                </div>
              </div>
              <span className="badge badge-available">CERTIFIED PARTNER</span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSupplier ? `Edit Supplier: ${editingSupplier.name}` : 'Register New Procurement Supplier'}
      >
        <form onSubmit={handleSave}>
          {error && <div style={{ color: '#fb7185', marginBottom: '12px' }}>{error}</div>}
          {success && <div style={{ color: '#34d399', marginBottom: '12px' }}>{success}</div>}

          <div className="form-group">
            <label className="form-label">Company / Partner Name *</label>
            <input type="text" required className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Contact Person *</label>
              <input type="text" required className="form-input" value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input type="tel" required className="form-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Total Procured (Rs. / PKR)</label>
              <input type="number" className="form-input" value={formData.totalProcured} onChange={e => setFormData({ ...formData, totalProcured: Number(e.target.value) })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Logistics Address</label>
            <input type="text" className="form-input" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Procurement Allocation Notes</label>
            <textarea rows={2} className="form-textarea" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Supplier'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE */}
      {deleteId && (
        <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Supplier" maxWidth="420px">
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <AlertCircle size={40} color="#fb7185" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Remove this supplier from directory?</p>
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
