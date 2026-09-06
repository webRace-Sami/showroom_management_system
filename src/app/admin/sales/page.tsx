'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import {
  Receipt,
  Plus,
  Search,
  Printer,
  Edit2,
  Trash2,
  DollarSign,
  User,
  Car,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { SaleData, VehicleData } from '@/lib/initialData';
import { formatPKR } from '@/lib/utils';

export default function AdminSalesPage() {
  const [sales, setSales] = useState<SaleData[]>([]);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<SaleData | null>(null);
  const [editingSale, setEditingSale] = useState<SaleData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const initialForm = {
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleId: '',
    vehicleName: '',
    vehicleVin: '',
    basePrice: 0,
    taxAmount: 0,
    discountAmount: 0,
    finalPrice: 0,
    paymentMethod: 'Bank Wire',
    paymentStatus: 'PAID',
    deliveryStatus: 'DELIVERED',
    saleDate: new Date().toISOString().split('T')[0],
    soldBy: 'Admin',
    notes: '',
  };
  const [formData, setFormData] = useState<any>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sales');
      const data = await res.json();
      if (data.success) setSales(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (data.success) setVehicles(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchVehicles();
  }, []);

  const openCreateModal = () => {
    setEditingSale(null);
    setFormData(initialForm);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sale: SaleData) => {
    setEditingSale(sale);
    setFormData({
      customerName: sale.customerName,
      customerPhone: sale.customerPhone,
      customerEmail: sale.customerEmail,
      vehicleId: sale.vehicleId || '',
      vehicleName: sale.vehicleName,
      vehicleVin: sale.vehicleVin,
      basePrice: sale.basePrice,
      taxAmount: sale.taxAmount,
      discountAmount: sale.discountAmount,
      finalPrice: sale.finalPrice,
      paymentMethod: sale.paymentMethod,
      paymentStatus: sale.paymentStatus,
      deliveryStatus: sale.deliveryStatus,
      saleDate: sale.saleDate.split('T')[0],
      soldBy: sale.soldBy,
      notes: sale.notes || '',
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleVehicleSelect = (vehId: string) => {
    const veh = vehicles.find(v => v.id === vehId);
    if (veh) {
      const tax = Math.round(veh.sellingPrice * 0.08); // 8% default luxury tax
      const total = veh.sellingPrice + tax;
      setFormData((prev: any) => ({
        ...prev,
        vehicleId: veh.id,
        vehicleName: `${veh.year} ${veh.make} ${veh.model}`,
        vehicleVin: veh.vin,
        basePrice: veh.sellingPrice,
        taxAmount: tax,
        discountAmount: 0,
        finalPrice: total,
      }));
    }
  };

  const handlePriceRecalc = (base: number, tax: number, discount: number) => {
    const finalVal = Math.max(0, base + tax - discount);
    setFormData((prev: any) => ({
      ...prev,
      basePrice: base,
      taxAmount: tax,
      discountAmount: discount,
      finalPrice: finalVal,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url = editingSale ? `/api/sales/${editingSale.id}` : '/api/sales';
      const method = editingSale ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process sales invoice');

      setSuccess(editingSale ? 'Invoice updated.' : 'Sales invoice executed and vehicle marked as SOLD.');
      fetchSales();
      fetchVehicles();
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess(null);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/sales/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete sale');
      setDeleteId(null);
      fetchSales();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = sales.filter(s => {
    const matchesSearch =
      s.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
      s.vehicleVin.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            Sales & Invoicing Registry
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Official luxury vehicle sales ledger, automated tax calculation, and printable invoices
          </p>
        </div>

        <button onClick={openCreateModal} className="btn-primary">
          <Plus size={18} /> Execute New Sale
        </button>
      </div>

      {/* Filter & Search */}
      <div
        className="glass-panel"
        style={{
          padding: '18px 24px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(7, 9, 14, 0.8)', padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search invoice no, client name, vehicle, VIN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem', width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Payment Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ padding: '8px 12px', fontSize: '0.85rem', width: 'auto' }}
          >
            <option value="ALL">All Payments</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {/* Sales Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client Name & Phone</th>
                <th>Vehicle & VIN</th>
                <th>Sale Date</th>
                <th>Payment Mode</th>
                <th>Final Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sale => (
                <tr key={sale.id}>
                  <td>
                    <strong style={{ color: 'var(--emerald-light)', fontSize: '0.95rem' }}>
                      {sale.invoiceNo}
                    </strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{sale.customerName}</div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{sale.customerPhone}</span>
                  </td>
                  <td>
                    <div style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>{sale.vehicleName}</div>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      VIN: {sale.vehicleVin}
                    </span>
                  </td>
                  <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{sale.paymentMethod}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--emerald-primary)' }}>
                      {formatPrice(sale.finalPrice)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        sale.paymentStatus === 'PAID'
                          ? 'badge-available'
                          : sale.paymentStatus === 'PARTIAL'
                          ? 'badge-reserved'
                          : 'badge-sold'
                      }`}
                    >
                      {sale.paymentStatus}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => setViewingInvoice(sale)}
                        title="Print / View Invoice"
                        style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--border-emerald)', color: 'var(--emerald-light)', cursor: 'pointer' }}
                      >
                        <Printer size={15} />
                      </button>
                      <button
                        onClick={() => openEditModal(sale)}
                        title="Edit Sale"
                        style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--border-emerald)', color: 'var(--emerald-primary)', cursor: 'pointer' }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(sale.id)}
                        title="Delete Sale"
                        style={{ padding: '6px', borderRadius: '6px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fb7185', cursor: 'pointer' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No sales invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CREATE / EDIT SALES INVOICE */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSale ? `Edit Invoice: ${editingSale.invoiceNo}` : 'Execute New Sales Agreement & Invoice'}
        subtitle="Automatic stock assignment and financial provenance recording"
        maxWidth="800px"
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

          {/* Available Showroom Vehicle Picker */}
          {!editingSale && (
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ color: 'var(--emerald-light)' }}>
                Select Vehicle from Showroom Inventory (Auto-assigns specs & marks SOLD)
              </label>
              <select
                className="form-select"
                value={formData.vehicleId}
                onChange={e => handleVehicleSelect(e.target.value)}
              >
                <option value="">-- Choose Showroom Vehicle --</option>
                {vehicles
                  .filter(v => v.status === 'AVAILABLE' || v.status === 'RESERVED')
                  .map(v => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} ({v.variant}) - {formatPrice(v.sellingPrice)} [{v.status}]
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Vehicle Name *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.vehicleName}
                onChange={e => setFormData({ ...formData, vehicleName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Vehicle VIN *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.vehicleVin}
                onChange={e => setFormData({ ...formData, vehicleVin: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Customer Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sir Arthur Pendelton"
                className="form-input"
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Customer Phone *</label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 019-2834"
                className="form-input"
                value={formData.customerPhone}
                onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Customer Email</label>
              <input
                type="email"
                placeholder="client@prestige.com"
                className="form-input"
                value={formData.customerEmail}
                onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
              />
            </div>
          </div>

          {/* Financial Calculation */}
          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', margin: '8px 0 16px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--emerald-light)', marginBottom: '12px' }}>
              Financial Breakdown & Final Ledger
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Base Price (Rs. / PKR)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.basePrice}
                  onChange={e => handlePriceRecalc(Number(e.target.value), formData.taxAmount, formData.discountAmount)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tax Amount (Rs. / PKR)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.taxAmount}
                  onChange={e => handlePriceRecalc(formData.basePrice, Number(e.target.value), formData.discountAmount)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">VIP Discount (Rs. / PKR)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.discountAmount}
                  onChange={e => handlePriceRecalc(formData.basePrice, formData.taxAmount, Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#10b981' }}>Final Invoice Total (Rs. / PKR) *</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  style={{ borderColor: '#10b981', color: '#10b981', fontWeight: 800 }}
                  value={formData.finalPrice}
                  onChange={e => setFormData({ ...formData, finalPrice: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-select"
                value={formData.paymentMethod}
                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="Bank Wire">Bank Wire / Federal Wire</option>
                <option value="Certified Cheque">Certified Cashier Cheque</option>
                <option value="Cash">Cash / Escrow</option>
                <option value="Financing">Custom Structured Financing</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Status</label>
              <select
                className="form-select"
                value={formData.paymentStatus}
                onChange={e => setFormData({ ...formData, paymentStatus: e.target.value })}
              >
                <option value="PAID">Paid in Full</option>
                <option value="PARTIAL">Partial Deposit</option>
                <option value="PENDING">Pending Wire Verification</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Status</label>
              <select
                className="form-select"
                value={formData.deliveryStatus}
                onChange={e => setFormData({ ...formData, deliveryStatus: e.target.value })}
              >
                <option value="DELIVERED">Delivered to Client</option>
                <option value="READY">Ready for Handover</option>
                <option value="PENDING">Pending Detailing & Inspection</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Transaction Notes & Provenance</label>
            <textarea
              rows={2}
              placeholder="Delivery address, included maintenance plans, wire transfer reference codes..."
              className="form-textarea"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Processing...' : editingSale ? 'Update Invoice' : 'Execute & Save Invoice'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: PRINTABLE LUXURY INVOICE */}
      {viewingInvoice && (
        <Modal
          isOpen={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          title={`Showroom Official Invoice: ${viewingInvoice.invoiceNo}`}
          subtitle="Certified procedural sales deed & conveyance"
          maxWidth="700px"
        >
          <div style={{ padding: '24px', background: '#fff', color: '#0f172a', borderRadius: '12px' }}>
            {/* Invoice Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>APEX LUXURY MOTORS</h2>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>742 Prestige Boulevard, Suite 100 • Beverly Hills, CA</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>concierge@apexluxurymotors.com • +1 (800) 555-APEX</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#d97706' }}>{viewingInvoice.invoiceNo}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Date: {new Date(viewingInvoice.saleDate).toLocaleDateString()}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>Status: {viewingInvoice.paymentStatus}</div>
              </div>
            </div>

            {/* Bill To */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Client Bill-To</span>
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{viewingInvoice.customerName}</div>
                <div style={{ fontSize: '0.85rem' }}>Phone: {viewingInvoice.customerPhone}</div>
                <div style={{ fontSize: '0.85rem' }}>Email: {viewingInvoice.customerEmail}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Vehicle Identification</span>
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{viewingInvoice.vehicleName}</div>
                <div style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>VIN: {viewingInvoice.vehicleVin}</div>
                <div style={{ fontSize: '0.85rem' }}>Advisor: {viewingInvoice.soldBy}</div>
              </div>
            </div>

            {/* Financial Line Items */}
            <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '12px 0', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span>Vehicle Base Conveyance Price</span>
                <strong>{formatPrice(viewingInvoice.basePrice)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span>Certified Luxury Tax & Surcharge</span>
                <span>+{formatPrice(viewingInvoice.taxAmount)}</span>
              </div>
              {viewingInvoice.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#16a34a' }}>
                  <span>VIP Executive Discount</span>
                  <span>-{formatPrice(viewingInvoice.discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '2px solid #0f172a', fontSize: '1.25rem', fontWeight: 900 }}>
                <span>Grand Total Paid</span>
                <span style={{ color: '#059669' }}>{formatPrice(viewingInvoice.finalPrice)}</span>
              </div>
            </div>

            {viewingInvoice.notes && (
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', marginBottom: '16px' }}>
                Notes: {viewingInvoice.notes}
              </div>
            )}

            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px dashed #cbd5e1', paddingTop: '12px' }}>
              Official Showroom Invoice Record • Bank Verified Settlement
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button onClick={() => window.print()} className="btn-primary">
              <Printer size={16} /> Print Official Document
            </button>
          </div>
        </Modal>
      )}

      {/* CONFIRM DELETE */}
      {deleteId && (
        <Modal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          title="Confirm Invoice Deletion"
          maxWidth="450px"
        >
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <AlertCircle size={40} color="#fb7185" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Are you sure you want to delete this sales invoice record?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button onClick={() => setDeleteId(null)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} className="btn-danger">
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
