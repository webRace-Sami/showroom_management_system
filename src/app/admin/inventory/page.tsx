'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import {
  Car,
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  Fuel,
  Sliders,
  Gauge,
  DollarSign,
  Download,
} from 'lucide-react';
import { VehicleData } from '@/lib/initialData';
import { formatPKR, formatPKRShort } from '@/lib/utils';

export default function AdminInventoryPage() {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [bodyTypeFilter, setBodyTypeFilter] = useState('ALL');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleData | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<VehicleData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const initialForm = {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    variant: '',
    vin: '',
    engineNo: '',
    bodyType: 'Sedan',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    exteriorColor: '',
    interiorColor: '',
    mileage: 0,
    costPrice: 0,
    sellingPrice: 0,
    status: 'AVAILABLE',
    condition: 'BRAND_NEW',
    features: '',
    description: '',
  };
  const [formData, setFormData] = useState<any>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (data.success) {
        setVehicles(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openCreateModal = () => {
    setEditingVehicle(null);
    setFormData(initialForm);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (veh: VehicleData) => {
    setEditingVehicle(veh);
    setFormData({
      make: veh.make,
      model: veh.model,
      year: veh.year,
      variant: veh.variant,
      vin: veh.vin,
      engineNo: veh.engineNo,
      bodyType: veh.bodyType,
      transmission: veh.transmission,
      fuelType: veh.fuelType,
      exteriorColor: veh.exteriorColor,
      interiorColor: veh.interiorColor,
      mileage: veh.mileage,
      costPrice: veh.costPrice,
      sellingPrice: veh.sellingPrice,
      status: veh.status,
      condition: veh.condition,
      features: veh.features,
      description: veh.description,
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
      const url = editingVehicle ? `/api/inventory/${editingVehicle.id}` : '/api/inventory';
      const method = editingVehicle ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save vehicle');

      setSuccess(editingVehicle ? 'Vehicle specifications updated.' : 'New vehicle added to showroom.');
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
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete vehicle');
      setDeleteId(null);
      fetchVehicles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = vehicles.filter(v => {
    const matchesSearch =
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.vin.toLowerCase().includes(search.toLowerCase()) ||
      v.variant.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    const matchesBody = bodyTypeFilter === 'ALL' || v.bodyType === bodyTypeFilter;
    return matchesSearch && matchesStatus && matchesBody;
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
            Showroom Fleet Inventory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Full CRUD vehicle registry with procedural specifications and status management
          </p>
        </div>

        <button onClick={openCreateModal} className="btn-primary">
          <Plus size={18} /> Add New Vehicle
        </button>
      </div>

      {/* Filter & Search Bar */}
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
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(7, 9, 14, 0.8)', padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search make, model, VIN, variant..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem', width: '100%' }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ padding: '8px 12px', fontSize: '0.85rem', width: 'auto' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
            <option value="IN_SERVICE">In Service</option>
          </select>
        </div>

        {/* Body Type Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Body Style:</span>
          <select
            value={bodyTypeFilter}
            onChange={e => setBodyTypeFilter(e.target.value)}
            className="form-select"
            style={{ padding: '8px 12px', fontSize: '0.85rem', width: 'auto' }}
          >
            <option value="ALL">All Body Styles</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Coupe">Coupe</option>
            <option value="Electric">Electric</option>
            <option value="Supercar">Supercar</option>
            <option value="Convertible">Convertible</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Vehicle / Model</th>
                <th>VIN / Engine</th>
                <th>Style & Fuel</th>
                <th>Mileage</th>
                <th>Cost Price</th>
                <th>Selling Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(veh => (
                <tr key={veh.id}>
                  <td>
                    <div>
                      <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block' }}>
                        {veh.year} {veh.make} {veh.model}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {veh.variant} • {veh.exteriorColor}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--emerald-light)' }}>
                      {veh.vin}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Eng: {veh.engineNo}</span>
                  </td>
                  <td>
                    <span style={{ color: '#e2e8f0', fontSize: '0.85rem', display: 'block' }}>{veh.bodyType}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{veh.fuelType} • {veh.transmission}</span>
                  </td>
                  <td>{veh.mileage.toLocaleString()} mi</td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatPrice(veh.costPrice)}</td>
                  <td style={{ fontWeight: 800, color: 'var(--emerald-light)', fontSize: '0.95rem' }}>
                    {formatPrice(veh.sellingPrice)}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        veh.status === 'AVAILABLE'
                          ? 'badge-available'
                          : veh.status === 'RESERVED'
                          ? 'badge-reserved'
                          : veh.status === 'SOLD'
                          ? 'badge-sold'
                          : 'badge-service'
                      }`}
                    >
                      {veh.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => setViewingVehicle(veh)}
                        title="View Spec Sheet"
                        style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--border-emerald)', color: 'var(--emerald-light)', cursor: 'pointer' }}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => openEditModal(veh)}
                        title="Edit Vehicle"
                        style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--border-emerald)', color: 'var(--emerald-primary)', cursor: 'pointer' }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(veh.id)}
                        title="Delete Vehicle"
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
                    No showroom vehicles found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CREATE / EDIT VEHICLE */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVehicle ? `Edit ${editingVehicle.make} ${editingVehicle.model}` : 'Add New Vehicle to Showroom Fleet'}
        subtitle="All specifications stored as procedural structured text"
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Make *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rolls-Royce"
                className="form-input"
                value={formData.make}
                onChange={e => setFormData({ ...formData, make: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Model *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ghost Black Badge"
                className="form-input"
                value={formData.model}
                onChange={e => setFormData({ ...formData, model: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Model Year *</label>
              <input
                type="number"
                required
                className="form-input"
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Variant / Trim</label>
              <input
                type="text"
                placeholder="e.g. V12 Twin-Turbo Bespoke"
                className="form-input"
                value={formData.variant}
                onChange={e => setFormData({ ...formData, variant: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">VIN / Chassis No *</label>
              <input
                type="text"
                required
                placeholder="17-character VIN"
                className="form-input"
                value={formData.vin}
                onChange={e => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Engine Number</label>
              <input
                type="text"
                placeholder="e.g. RR-6.75L-TT"
                className="form-input"
                value={formData.engineNo}
                onChange={e => setFormData({ ...formData, engineNo: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Body Style</label>
              <select
                className="form-select"
                value={formData.bodyType}
                onChange={e => setFormData({ ...formData, bodyType: e.target.value })}
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Coupe">Coupe</option>
                <option value="Electric">Electric</option>
                <option value="Supercar">Supercar</option>
                <option value="Convertible">Convertible</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Fuel Type</label>
              <select
                className="form-select"
                value={formData.fuelType}
                onChange={e => setFormData({ ...formData, fuelType: e.target.value })}
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transmission</label>
              <select
                className="form-select"
                value={formData.transmission}
                onChange={e => setFormData({ ...formData, transmission: e.target.value })}
              >
                <option value="Automatic">Automatic</option>
                <option value="Dual-Clutch">Dual-Clutch</option>
                <option value="Manual">Manual</option>
                <option value="Single-Speed">Single-Speed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Condition</label>
              <select
                className="form-select"
                value={formData.condition}
                onChange={e => setFormData({ ...formData, condition: e.target.value })}
              >
                <option value="BRAND_NEW">Brand New</option>
                <option value="CERTIFIED_PRE_OWNED">Certified Pre-Owned</option>
                <option value="USED">Used</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Exterior Color</label>
              <input
                type="text"
                placeholder="e.g. Diamond Black Crystal"
                className="form-input"
                value={formData.exteriorColor}
                onChange={e => setFormData({ ...formData, exteriorColor: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Interior Trim Color</label>
              <input
                type="text"
                placeholder="e.g. Scivaro Grey Leather"
                className="form-input"
                value={formData.interiorColor}
                onChange={e => setFormData({ ...formData, interiorColor: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mileage (mi / km)</label>
              <input
                type="number"
                className="form-input"
                value={formData.mileage}
                onChange={e => setFormData({ ...formData, mileage: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Cost / Procurement Price (Rs. / PKR)</label>
              <input
                type="number"
                className="form-input"
                value={formData.costPrice}
                onChange={e => setFormData({ ...formData, costPrice: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Selling Price (Rs. / PKR) *</label>
              <input
                type="number"
                required
                className="form-input"
                value={formData.sellingPrice}
                onChange={e => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Showroom Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="SOLD">Sold</option>
                <option value="IN_SERVICE">In Service</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Key Features (Comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Starlight Headliner, Bespoke Audio, Massage Seating, Ceramic Brakes"
              className="form-input"
              value={formData.features}
              onChange={e => setFormData({ ...formData, features: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Vehicle Description & Provenance</label>
            <textarea
              rows={3}
              placeholder="Full procedural historical notes and showroom highlights..."
              className="form-textarea"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editingVehicle ? 'Update Vehicle' : 'Add Vehicle to Fleet'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: VIEW SPEC SHEET */}
      {viewingVehicle && (
        <Modal
          isOpen={!!viewingVehicle}
          onClose={() => setViewingVehicle(null)}
          title={`${viewingVehicle.year} ${viewingVehicle.make} ${viewingVehicle.model}`}
          subtitle={`VIN: ${viewingVehicle.vin} • Status: ${viewingVehicle.status}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-emerald)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Selling Price</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald-light)' }}>
                  {formatPrice(viewingVehicle.sellingPrice)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cost Margin</span>
                <div style={{ fontSize: '1.1rem', color: '#10b981', fontWeight: 700 }}>
                  +{formatPrice(viewingVehicle.sellingPrice - viewingVehicle.costPrice)}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.88rem' }}>
              <div><strong>Body Style:</strong> {viewingVehicle.bodyType}</div>
              <div><strong>Transmission:</strong> {viewingVehicle.transmission}</div>
              <div><strong>Fuel Type:</strong> {viewingVehicle.fuelType}</div>
              <div><strong>Mileage:</strong> {viewingVehicle.mileage.toLocaleString()} mi</div>
              <div><strong>Exterior:</strong> {viewingVehicle.exteriorColor}</div>
              <div><strong>Interior:</strong> {viewingVehicle.interiorColor}</div>
              <div><strong>Engine No:</strong> {viewingVehicle.engineNo}</div>
              <div><strong>Condition:</strong> {viewingVehicle.condition}</div>
            </div>

            {viewingVehicle.features && (
              <div>
                <strong style={{ color: 'var(--emerald-light)', display: 'block', marginBottom: '6px' }}>Equipment:</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{viewingVehicle.features}</p>
              </div>
            )}

            <div>
              <strong style={{ color: '#fff', display: 'block', marginBottom: '6px' }}>Provenance & Notes:</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{viewingVehicle.description}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteId && (
        <Modal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          title="Confirm Vehicle Deletion"
          subtitle="This action removes the vehicle from the active showroom inventory."
          maxWidth="450px"
        >
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <AlertCircle size={40} color="#fb7185" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Are you sure you want to delete this vehicle record from the system?
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
