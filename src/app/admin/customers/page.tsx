'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import {
  Users,
  MessageSquare,
  Calendar,
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { CustomerData, InquiryData, TestDriveData } from '@/lib/initialData';
import { formatPKR, formatWhatsAppLink, formatDateTime } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [activeTab, setActiveTab] = useState<'customers' | 'inquiries' | 'testDrives'>('customers');

  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [testDrives, setTestDrives] = useState<TestDriveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(null);

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState<InquiryData | null>(null);

  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);
  const [editingTestDrive, setEditingTestDrive] = useState<TestDriveData | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);

  // Forms
  const [customerForm, setCustomerForm] = useState<any>({
    name: '',
    phone: '',
    email: '',
    nationalId: '',
    address: '',
    preferredCategory: '',
    budgetMin: 0,
    budgetMax: 0,
    notes: '',
  });

  const [inquiryForm, setInquiryForm] = useState<any>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    interestedVehicle: '',
    budget: 0,
    status: 'NEW',
    notes: '',
  });

  const [testDriveForm, setTestDriveForm] = useState<any>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleName: '',
    scheduledDate: '',
    licenseNumber: '',
    status: 'SCHEDULED',
    feedback: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, iRes, tRes] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/inquiries'),
        fetch('/api/test-drives'),
      ]);
      const [cData, iData, tData] = await Promise.all([cRes.json(), iRes.json(), tRes.json()]);

      if (cData.success) setCustomers(cData.data);
      if (iData.success) setInquiries(iData.data);
      if (tData.success) setTestDrives(tData.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- CUSTOMER CRUD ---
  const openCustomerModal = (cust?: CustomerData) => {
    if (cust) {
      setEditingCustomer(cust);
      setCustomerForm({ ...cust });
    } else {
      setEditingCustomer(null);
      setCustomerForm({
        name: '',
        phone: '',
        email: '',
        nationalId: '',
        address: '',
        preferredCategory: '',
        budgetMin: 0,
        budgetMax: 0,
        notes: '',
      });
    }
    setError(null);
    setSuccess(null);
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const url = editingCustomer ? `/api/customers/${editingCustomer.id}` : '/api/customers';
      const method = editingCustomer ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save customer');
      setSuccess('Customer record saved.');
      fetchData();
      setTimeout(() => setIsCustomerModalOpen(false), 1200);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // --- INQUIRY CRUD ---
  const openInquiryModal = (inq?: InquiryData) => {
    if (inq) {
      setEditingInquiry(inq);
      setInquiryForm({ ...inq });
    } else {
      setEditingInquiry(null);
      setInquiryForm({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        interestedVehicle: '',
        budget: 0,
        status: 'NEW',
        notes: '',
      });
    }
    setError(null);
    setSuccess(null);
    setIsInquiryModalOpen(true);
  };

  const handleSaveInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const url = editingInquiry ? `/api/inquiries/${editingInquiry.id}` : '/api/inquiries';
      const method = editingInquiry ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save inquiry');
      setSuccess('Inquiry record saved.');
      fetchData();
      setTimeout(() => setIsInquiryModalOpen(false), 1200);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // --- TEST DRIVE CRUD ---
  const openTestDriveModal = (td?: TestDriveData) => {
    if (td) {
      setEditingTestDrive(td);
      setTestDriveForm({ ...td, scheduledDate: td.scheduledDate.replace(':00.000Z', '') });
    } else {
      setEditingTestDrive(null);
      setTestDriveForm({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        vehicleName: '',
        scheduledDate: new Date().toISOString().slice(0, 16),
        licenseNumber: '',
        status: 'SCHEDULED',
        feedback: '',
      });
    }
    setError(null);
    setSuccess(null);
    setIsTestDriveModalOpen(true);
  };

  const handleSaveTestDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const url = editingTestDrive ? `/api/test-drives/${editingTestDrive.id}` : '/api/test-drives';
      const method = editingTestDrive ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testDriveForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save test drive');
      setSuccess('Test drive booking updated.');
      fetchData();
      setTimeout(() => setIsTestDriveModalOpen(false), 1200);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // --- DELETE HANDLER ---
  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      const { type, id } = deleteTarget;
      const endpoint = type === 'customer' ? `/api/customers/${id}` : type === 'inquiry' ? `/api/inquiries/${id}` : `/api/test-drives/${id}`;
      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete record');
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatPrice = (val: number) => {
    return formatPKR(val);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
            Customers, Leads & VIP Test Drives
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Procedural client relationships, acquisition pipeline, and private appointments
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {activeTab === 'customers' && (
            <button onClick={() => openCustomerModal()} className="btn-primary">
              <Plus size={18} /> Add Client Profile
            </button>
          )}
          {activeTab === 'inquiries' && (
            <button onClick={() => openInquiryModal()} className="btn-primary">
              <Plus size={18} /> Create Lead Inquiry
            </button>
          )}
          {activeTab === 'testDrives' && (
            <button onClick={() => openTestDriveModal()} className="btn-primary">
              <Plus size={18} /> Schedule VIP Test Drive
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('customers')}
          className={`btn-sm ${activeTab === 'customers' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Users size={16} /> VIP Clients ({customers.length})
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`btn-sm ${activeTab === 'inquiries' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <MessageSquare size={16} /> Inquiries ({inquiries.length})
        </button>

        <button
          onClick={() => setActiveTab('testDrives')}
          className={`btn-sm ${activeTab === 'testDrives' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Calendar size={16} /> Test Drives ({testDrives.length})
        </button>
      </div>

      {/* Search & Filter */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(7, 9, 14, 0.8)', padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', maxWidth: '400px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search records by name, phone, email, vehicle..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem', width: '100%' }}
          />
        </div>
      </div>

      {/* TAB 1: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Client Full Name</th>
                  <th>Contact Info</th>
                  <th>National ID / Passport</th>
                  <th>Address</th>
                  <th>Preference</th>
                  <th>Internal Notes</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}>
                    <td><strong style={{ color: '#fff', fontSize: '0.95rem' }}>{c.name}</strong></td>
                    <td>
                      <div style={{ color: 'var(--text-primary)' }}>{c.phone}</div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.email}</span>
                    </td>
                    <td><span style={{ fontFamily: 'monospace', color: 'var(--emerald-light)' }}>{c.nationalId || 'N/A'}</span></td>
                    <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.address || 'N/A'}</td>
                    <td><span className="badge badge-cyan">{c.preferredCategory || 'Any'}</span></td>
                    <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {c.notes || '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button onClick={() => openCustomerModal(c)} style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--border-emerald)', color: 'var(--emerald-primary)', cursor: 'pointer' }}>
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget({ type: 'customer', id: c.id })} style={{ padding: '6px', borderRadius: '6px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fb7185', cursor: 'pointer' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Lead Prospect</th>
                  <th>Vehicle Interest</th>
                  <th>Contact Info</th>
                  <th>Budget</th>
                  <th>Pipeline Status</th>
                  <th>Notes</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map(inq => (
                  <tr key={inq.id}>
                    <td><strong style={{ color: '#fff', fontSize: '0.95rem' }}>{inq.customerName}</strong></td>
                    <td><strong style={{ color: 'var(--emerald-light)' }}>{inq.interestedVehicle}</strong></td>
                    <td>
                      <div>{inq.customerPhone}</div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{inq.customerEmail}</span>
                    </td>
                    <td>{inq.budget ? formatPrice(inq.budget) : 'Open Budget'}</td>
                    <td>
                      <span className="badge badge-cyan">{inq.status}</span>
                    </td>
                    <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {inq.notes || '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button onClick={() => openInquiryModal(inq)} style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--border-emerald)', color: 'var(--emerald-primary)', cursor: 'pointer' }}>
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget({ type: 'inquiry', id: inq.id })} style={{ padding: '6px', borderRadius: '6px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fb7185', cursor: 'pointer' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TEST DRIVES */}
      {activeTab === 'testDrives' && (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Vehicle Requested</th>
                  <th>Scheduled Slot</th>
                  <th>License / ID</th>
                  <th>Appointment Status</th>
                  <th>Feedback / Notes</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testDrives.map(td => (
                  <tr key={td.id}>
                    <td>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{td.customerName}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{td.customerPhone}</div>
                    </td>
                    <td><strong style={{ color: 'var(--emerald-light)' }}>{td.vehicleName}</strong></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="var(--emerald-primary)" />
                        {new Date(td.scheduledDate).toLocaleString()}
                      </div>
                    </td>
                    <td><span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{td.licenseNumber}</span></td>
                    <td>
                      <span className={`badge ${td.status === 'SCHEDULED' ? 'badge-available' : td.status === 'COMPLETED' ? 'badge-cyan' : 'badge-sold'}`}>
                        {td.status}
                      </span>
                    </td>
                    <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {td.feedback || '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button onClick={() => openTestDriveModal(td)} style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--border-emerald)', color: 'var(--emerald-primary)', cursor: 'pointer' }}>
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget({ type: 'testDrive', id: td.id })} style={{ padding: '6px', borderRadius: '6px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fb7185', cursor: 'pointer' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CUSTOMER FORM */}
      <Modal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title={editingCustomer ? `Edit Client: ${editingCustomer.name}` : 'Register New VIP Client Profile'}
      >
        <form onSubmit={handleSaveCustomer}>
          {error && <div style={{ color: '#fb7185', marginBottom: '12px' }}>{error}</div>}
          {success && <div style={{ color: '#34d399', marginBottom: '12px' }}>{success}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Client Name *</label>
              <input type="text" required className="form-input" value={customerForm.name} onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input type="tel" required className="form-input" value={customerForm.phone} onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={customerForm.email} onChange={e => setCustomerForm({ ...customerForm, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">National ID / Passport</label>
              <input type="text" className="form-input" value={customerForm.nationalId} onChange={e => setCustomerForm({ ...customerForm, nationalId: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input type="text" className="form-input" value={customerForm.address} onChange={e => setCustomerForm({ ...customerForm, address: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Vehicle Category</label>
            <input type="text" placeholder="e.g. Supercar, Luxury Sedan, SUV" className="form-input" value={customerForm.preferredCategory} onChange={e => setCustomerForm({ ...customerForm, preferredCategory: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Client Profile Notes</label>
            <textarea rows={2} className="form-textarea" value={customerForm.notes} onChange={e => setCustomerForm({ ...customerForm, notes: e.target.value })} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsCustomerModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Client Profile</button>
          </div>
        </form>
      </Modal>

      {/* MODAL: INQUIRY FORM */}
      <Modal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        title={editingInquiry ? 'Edit Lead Inquiry' : 'Create Lead Inquiry'}
      >
        <form onSubmit={handleSaveInquiry}>
          {error && <div style={{ color: '#fb7185', marginBottom: '12px' }}>{error}</div>}
          {success && <div style={{ color: '#34d399', marginBottom: '12px' }}>{success}</div>}

          <div className="form-group">
            <label className="form-label">Client Full Name *</label>
            <input type="text" required className="form-input" value={inquiryForm.customerName} onChange={e => setInquiryForm({ ...inquiryForm, customerName: e.target.value })} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input type="tel" required className="form-input" value={inquiryForm.customerPhone} onChange={e => setInquiryForm({ ...inquiryForm, customerPhone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={inquiryForm.customerEmail} onChange={e => setInquiryForm({ ...inquiryForm, customerEmail: e.target.value })} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Vehicle Interest *</label>
              <input type="text" required className="form-input" value={inquiryForm.interestedVehicle} onChange={e => setInquiryForm({ ...inquiryForm, interestedVehicle: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Budget (Rs. / PKR)</label>
              <input type="number" className="form-input" value={inquiryForm.budget} onChange={e => setInquiryForm({ ...inquiryForm, budget: Number(e.target.value) })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pipeline Stage</label>
            <select className="form-select" value={inquiryForm.status} onChange={e => setInquiryForm({ ...inquiryForm, status: e.target.value })}>
              <option value="NEW">New Lead</option>
              <option value="CONTACTED">Contacted</option>
              <option value="TEST_DRIVE_SCHEDULED">Test Drive Scheduled</option>
              <option value="NEGOTIATING">Negotiating</option>
              <option value="CONVERTED">Converted Sale</option>
              <option value="LOST">Lost</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Inquiry Notes</label>
            <textarea rows={2} className="form-textarea" value={inquiryForm.notes} onChange={e => setInquiryForm({ ...inquiryForm, notes: e.target.value })} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsInquiryModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Inquiry</button>
          </div>
        </form>
      </Modal>

      {/* MODAL: TEST DRIVE FORM */}
      <Modal
        isOpen={isTestDriveModalOpen}
        onClose={() => setIsTestDriveModalOpen(false)}
        title={editingTestDrive ? 'Update VIP Test Drive' : 'Schedule VIP Test Drive'}
      >
        <form onSubmit={handleSaveTestDrive}>
          {error && <div style={{ color: '#fb7185', marginBottom: '12px' }}>{error}</div>}
          {success && <div style={{ color: '#34d399', marginBottom: '12px' }}>{success}</div>}

          <div className="form-group">
            <label className="form-label">Client Name *</label>
            <input type="text" required className="form-input" value={testDriveForm.customerName} onChange={e => setTestDriveForm({ ...testDriveForm, customerName: e.target.value })} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input type="tel" required className="form-input" value={testDriveForm.customerPhone} onChange={e => setTestDriveForm({ ...testDriveForm, customerPhone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Vehicle *</label>
              <input type="text" required className="form-input" value={testDriveForm.vehicleName} onChange={e => setTestDriveForm({ ...testDriveForm, vehicleName: e.target.value })} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Date & Time *</label>
              <input type="datetime-local" required className="form-input" value={testDriveForm.scheduledDate} onChange={e => setTestDriveForm({ ...testDriveForm, scheduledDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={testDriveForm.status} onChange={e => setTestDriveForm({ ...testDriveForm, status: e.target.value })}>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Driver License Number</label>
            <input type="text" className="form-input" value={testDriveForm.licenseNumber} onChange={e => setTestDriveForm({ ...testDriveForm, licenseNumber: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Feedback / Inspection Notes</label>
            <textarea rows={2} className="form-textarea" value={testDriveForm.feedback} onChange={e => setTestDriveForm({ ...testDriveForm, feedback: e.target.value })} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsTestDriveModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Test Drive</button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Confirm Record Deletion"
          maxWidth="420px"
        >
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <AlertCircle size={40} color="#fb7185" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Are you sure you want to remove this record?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button>
              <button onClick={executeDelete} className="btn-danger">Confirm Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
