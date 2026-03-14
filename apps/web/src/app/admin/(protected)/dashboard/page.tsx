'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, AdminStats, AdminDesigner } from '@/lib/api';

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="card" style={{ padding: '20px 22px' }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
}

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  approved:       { color: '#2d7a4f', bg: '#e8f5ee', label: 'Approved' },
  pending_review: { color: '#7a5c2d', bg: '#fdf5e6', label: 'Pending' },
  rejected:       { color: '#8b2635', bg: '#fdecea', label: 'Rejected' },
  suspended:      { color: '#555',    bg: '#f0f0f0', label: 'Suspended' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { color: '#555', bg: '#f0f0f0', label: status };
  return (
    <span style={{
      fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em',
      color: s.color, background: s.bg,
      padding: '3px 9px', borderRadius: 20, textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats]     = useState<AdminStats | null>(null);
  const [pending, setPending] = useState<AdminDesigner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAdminStats(),
      api.getAdminDesigners({ status: 'pending_review' }),
    ]).then(([sRes, pRes]) => {
      if (sRes.data)  setStats(sRes.data);
      if (pRes.data)  setPending(pRes.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '60px 40px', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 13.5 }}>
        <svg className="anim-rotate" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
        Loading…
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 40px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 13.5, color: 'var(--text-muted)' }}>
          Platform overview
        </p>
      </div>

      {/* Stats grid */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 36 }}>
          <StatCard label="Total designers" value={stats.designers.total} />
          <StatCard label="Pending review" value={stats.designers.pending_review} sub="awaiting approval" />
          <StatCard label="Total projects" value={stats.totalProjects} />
          <StatCard label="Total orders" value={stats.totalOrders} />
        </div>
      )}

      {/* Pending applications */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Pending Applications
            {pending.length > 0 && (
              <span style={{
                marginLeft: 8, fontSize: 11, fontWeight: 700,
                color: '#7a5c2d', background: '#fdf5e6',
                padding: '2px 8px', borderRadius: 20,
              }}>
                {pending.length}
              </span>
            )}
          </h2>
          <Link
            href="/admin/designers"
            style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none' }}
          >
            View all designers →
          </Link>
        </div>

        {pending.length === 0 ? (
          <div className="card" style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13.5 }}>
            No pending applications
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'Email', 'Business', 'Applied', ''].map((h) => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left',
                      fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.map((d) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {d.fullName}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
                      {d.email}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
                      {d.businessName ?? '—'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--text-muted)' }}>
                      {new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <Link
                        href={`/admin/designers/${d.id}`}
                        style={{
                          fontSize: 12, fontWeight: 600, color: 'var(--text-primary)',
                          textDecoration: 'none', padding: '5px 12px',
                          border: '1px solid var(--border)', borderRadius: 7,
                        }}
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status breakdown */}
      {stats && (
        <div style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 14 }}>
            Designer Status Breakdown
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {(['approved', 'pending_review', 'rejected', 'suspended'] as const).map((s) => (
              <div key={s} className="card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <StatusBadge status={s} />
                <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
                  {stats.designers[s]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
