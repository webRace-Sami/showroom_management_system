'use client';

import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, Layers, DollarSign, Car, Users, Sparkles } from 'lucide-react';
import { formatPKR, formatPKRShort } from '@/lib/utils';

interface MonthlyTrend {
  month: string;
  revenue: number;
  unitsSold: number;
  target: number;
}

interface CategoryDist {
  category: string;
  count: number;
  percentage: number;
}

interface FunnelStage {
  stage: string;
  count: number;
  color: string;
}

interface DashboardChartsProps {
  monthlyTrends: MonthlyTrend[];
  categoryDistribution: CategoryDist[];
  inquiryFunnel: FunnelStage[];
  totalRevenue: number;
  totalUnitsSold: number;
}

export default function DashboardCharts({
  monthlyTrends,
  categoryDistribution,
  inquiryFunnel,
  totalRevenue,
  totalUnitsSold,
}: DashboardChartsProps) {
  const [activeTab, setActiveTab] = useState<'revenue' | 'distribution' | 'funnel'>('revenue');
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyTrend | null>(null);

  const maxRevenue = Math.max(
    ...monthlyTrends.map(m => Math.max(m.revenue, m.target)),
    450000000
  );

  const categoryColors: { [key: string]: string } = {
    Sedan: '#3b82f6',
    SUV: '#10b981',
    Coupe: '#f59e0b',
    Electric: '#06b6d4',
    Supercar: '#f43f5e',
    Convertible: '#8b5cf6',
  };

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(13, 20, 36, 0.85), rgba(9, 14, 26, 0.95))',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 25px rgba(16, 185, 129, 0.08)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '32px',
      }}
      className="animate-fade-in"
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-50px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Upper Header with Tab Switcher */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
            }}
          >
            <TrendingUp size={22} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Showroom Executive Intelligence
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                LIVE PKR METRICS
              </span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Real-time revenue velocity, vehicle inventory distribution, and customer acquisition pipeline
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(6, 10, 20, 0.8)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            gap: '4px',
          }}
        >
          <button
            onClick={() => setActiveTab('revenue')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              background: activeTab === 'revenue' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
              color: activeTab === 'revenue' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            <BarChart3 size={16} /> Revenue Trends (PKR)
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              background: activeTab === 'distribution' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
              color: activeTab === 'distribution' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            <PieChart size={16} /> Fleet Distribution
          </button>
          <button
            onClick={() => setActiveTab('funnel')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              background: activeTab === 'funnel' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
              color: activeTab === 'funnel' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            <Layers size={16} /> Lead Funnel
          </button>
        </div>
      </div>

      {/* TAB 1: REVENUE VELOCITY CHART */}
      {activeTab === 'revenue' && (
        <div className="animate-fade-in">
          {/* Chart Header Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                padding: '16px',
                background: 'rgba(16, 185, 129, 0.08)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-emerald)',
              }}
            >
              <span style={{ fontSize: '0.78rem', color: 'var(--emerald-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Executed Sales (PKR)
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                {formatPKR(totalRevenue)}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <TrendingUp size={12} /> {formatPKRShort(totalRevenue)} across showroom deals
              </span>
            </div>

            <div
              style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Average Transaction Value
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                {formatPKR(totalUnitsSold > 0 ? totalRevenue / totalUnitsSold : 100000000)}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                High-ticket luxury & bespoke exotics
              </span>
            </div>

            <div
              style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Units Transacted
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                {totalUnitsSold} Luxury Fleet Units
              </div>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px', display: 'block' }}>
                100% Verified Import & Local Clearance
              </span>
            </div>
          </div>

          {/* Interactive Bar & Benchmark Graph */}
          <div
            style={{
              position: 'relative',
              height: '280px',
              paddingTop: '20px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '12px',
              borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '8px',
            }}
          >
            {monthlyTrends.map((item, idx) => {
              const heightPercent = (item.revenue / maxRevenue) * 100;
              const targetPercent = (item.target / maxRevenue) * 100;
              const isHovered = hoveredMonth?.month === item.month;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredMonth(item)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: '100%',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: `calc(${heightPercent}% + 12px)`,
                        background: 'rgba(10, 16, 30, 0.98)',
                        border: '1px solid var(--emerald-primary)',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.8), 0 0 20px rgba(16, 185, 129, 0.3)',
                        zIndex: 20,
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                      }}
                      className="animate-fade-in"
                    >
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>{item.month}</div>
                      <div style={{ color: 'var(--emerald-light)', fontSize: '0.82rem', fontWeight: 700 }}>
                        Revenue: {formatPKR(item.revenue)} ({formatPKRShort(item.revenue)})
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
                        Units Sold: {item.unitsSold} | Target: {formatPKRShort(item.target)}
                      </div>
                    </div>
                  )}

                  {/* Target Benchmark Line Indicator */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: `${targetPercent}%`,
                      width: '100%',
                      height: '2px',
                      borderTop: '1px dashed rgba(255, 255, 255, 0.25)',
                      pointerEvents: 'none',
                    }}
                    title={`Target: ${formatPKR(item.target)}`}
                  />

                  {/* Animated Revenue Bar */}
                  <div
                    style={{
                      width: '65%',
                      maxWidth: '48px',
                      height: `${Math.max(heightPercent, 4)}%`,
                      background: isHovered
                        ? 'linear-gradient(180deg, #34d399 0%, #10b981 50%, #047857 100%)'
                        : 'linear-gradient(180deg, #10b981 0%, #059669 70%, rgba(5, 150, 105, 0.3) 100%)',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: isHovered ? '0 0 25px rgba(16, 185, 129, 0.8)' : '0 4px 15px rgba(16, 185, 129, 0.25)',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                    }}
                  >
                    {/* Pulsing Top Light */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: '#ffffff',
                        borderRadius: '6px 6px 0 0',
                        opacity: 0.9,
                      }}
                    />
                  </div>

                  {/* Month Label */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-28px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: isHovered ? '#fff' : 'var(--text-secondary)',
                    }}
                  >
                    {item.month}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: 'var(--emerald-primary)', borderRadius: '3px' }} />
              Monthly Executed Revenue (PKR)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '16px', height: '0px', borderTop: '2px dashed rgba(255,255,255,0.4)' }} />
              Target Benchmark
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: FLEET DISTRIBUTION */}
      {activeTab === 'distribution' && (
        <div className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Vehicle Inventory Mix by Body Style</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Balanced inventory allocation ensuring competitive availability across flagship sedans, exotics, and luxury utility vehicles in PKR.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                {categoryDistribution.map((cat, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: categoryColors[cat.category] || '#10b981' }} />
                        {cat.category}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {cat.count} Units ({cat.percentage}%)
                      </span>
                    </div>
                    <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${cat.percentage}%`,
                          background: categoryColors[cat.category] || '#10b981',
                          borderRadius: '4px',
                          transition: 'width 0.6s ease',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Highlights Card */}
            <div
              style={{
                background: 'rgba(6, 10, 20, 0.6)',
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Car size={20} color="var(--emerald-light)" />
                <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Fleet Allocation Insights</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Sparkles size={14} color="var(--emerald-light)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Exotic Supercars:</strong> High demand with average showroom dwell time under 18 days.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Sparkles size={14} color="var(--emerald-light)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Luxury Sedans & Limousines:</strong> Steady corporate executive and VIP chauffeur interest.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Sparkles size={14} color="var(--emerald-light)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Next-Gen Electrics:</strong> Fast-growing segment with premium 800V GT vehicles.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEAD CONVERSION FUNNEL */}
      {activeTab === 'funnel' && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Showroom Acquisition & Conversion Funnel</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              From initial website inquiry to private test-drive and final sales deed execution
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {inquiryFunnel.map((stage, idx) => {
              const maxCount = Math.max(...inquiryFunnel.map(f => f.count), 1);
              const widthPct = Math.max((stage.count / maxCount) * 100, 20);

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <div style={{ width: '130px', fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                    {stage.stage}
                  </div>
                  <div style={{ flex: 1, position: 'relative', height: '36px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${widthPct}%`,
                        background: `linear-gradient(90deg, ${stage.color}88, ${stage.color})`,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '12px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: '#05070a',
                        transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: `0 0 15px ${stage.color}44`,
                      }}
                    >
                      {stage.count} Leads
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '24px', padding: '14px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} /> Test-Drive to Sale Conversion Efficiency: ~42.5%
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Industry Leading VIP Advisory Benchmark
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
