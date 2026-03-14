'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, AdminDesignerDetail } from '@/lib/api';

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  approved:       { color: '#2d7a4f', bg: '#e8f5ee', label: 'Approved' },
  pending_review: { color: '#7a5c2d', bg: '#fdf5e6', label: 'Pending Review' },
  rejected:       { color: '#8b2635', bg: '#fdecea', label: 'Rejected' },
  suspended:      { color: '#555',    bg: '#f0f0f0', label: 'Suspended' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { color: '#555', bg: '#f0f0f0', label: status };
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
      color: s.color, background: s.bg,
      padding: '4px 11px', borderRadius: 20, textTransform: 'uppercase',
    }}>
      {s.label}
    </span>
  );
}

const PROJECT_STATUS_COLOR: Record<string, string> = {
  draft: '#B0ADA8', active: '#2d7a4f', ordered: '#2563eb', closed: '#555',
};

export default function AdminDesignerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [designer, setDesigner] = useState<AdminDesignerDetail | null>(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null);

  useEffect(() => {
    api.getAdminDesigner(id).then((r) => {
      if (r.error || !r.data) { setNotFound(true); setLoading(false); return; }
      setDesigner(r.data);
      setLoading(false);
    });
  }, [id]);

  async function handleStatusChange(newStatus: string) {
    if (!designer) return;
    setUpdating(true);
    setUpdateError('');
    const r = await api.updateDesignerStatus(id, newStatus);
    setUpdating(false);
    setConfirmStatus(null);
    if (r.error) { setUpdateError(r.error); return; }
    setDesigner((prev) => prev ? { ...prev, status: newStatus } : prev);
  }

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

  if (notFound || !designer) {
    return (
      <div style={{ padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Designer not found</div>
        <button className="btn-ghost" onClick={() => router.push('/admin/designers')} style={{ fontSize: 13 }}>
          ← Back to Designers
        </button>
      </div>
    );
  }

  const actions: { label: string; status: string; style: React.CSSProperties }[] = [
    designer.status !== 'approved'  && { label: 'Approve',  status: 'approved',  style: { background: '#2d7a4f', color: '#fff', border: 'none' } },
    designer.status !== 'rejected'  && { label: 'Reject',   status: 'rejected',  style: { background: 'transparent', color: '#8b2635', border: '1px solid rgba(139,38,53,0.3)' } },
    designer.status !== 'suspended' && { label: 'Suspend',  status: 'suspended', style: { background: 'transparent', color: '#555', border: '1px solid #ccc' } },
  ].filter(Boolean) as { label: string; status: string; style: React.CSSProperties }[];

  return (
    <div style={{ padding: '40px 40px 80px', maxWidth: 800 }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 20 }}>
        <Link href="/admin/designers" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>
          ← Designers
        </Link>
        <span style={{ margin: '0 6px', color: 'var(--border-strong)' }}>/</span>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{designer.fullName}</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', margin: 0 }}>
              {designer.fullName}
            </h1>
            <StatusBadge status={designer.status} />
            {designer.isAdmin && (
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: '0.07em',
                color: '#7a5c2d', background: '#fdf5e6',
                padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase',
              }}>
                Admin
              </span>
            )}
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
            {designer.email}
            {designer.businessName && <span style={{ color: 'var(--border-strong)', margin: '0 6px' }}>·</span>}
            {designer.businessName}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {actions.map((a) => (
            <button
              key={a.status}
              onClick={() => setConfirmStatus(a.status)}
              disabled={updating}
              style={{
                ...a.style,
                borderRadius: 8, padding: '7px 14px',
                fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit', opacity: updating ? 0.6 : 1,
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm dialog */}
      {confirmStatus && (
        <div style={{
          marginBottom: 20, padding: '14px 18px',
          background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border)',
          borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>
            Change status to <strong>{STATUS_STYLE[confirmStatus]?.label ?? confirmStatus}</strong>?
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setConfirmStatus(null)}
              style={{
                border: '1px solid var(--border)', borderRadius: 7,
                background: 'transparent', color: 'var(--text-muted)',
                padding: '5px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => handleStatusChange(confirmStatus)}
              disabled={updating}
              style={{
                border: 'none', borderRadius: 7,
                background: '#0F0F0F', color: '#fff',
                padding: '5px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                opacity: updating ? 0.6 : 1,
              }}
            >
              {updating ? 'Saving…' : 'Confirm'}
            </button>
          </div>
        </div>
      )}

      {updateError && (
        <div style={{
          marginBottom: 16, padding: '10px 14px',
          background: 'rgba(185,28,28,0.04)', border: '1px solid rgba(185,28,28,0.12)',
          borderRadius: 8, fontSize: 13, color: '#b91c1c',
        }}>
          {updateError}
        </div>
      )}

      {/* Info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        <div className="card" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
            Account Details
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <InfoRow label="Phone" value={designer.phone ?? '—'} />
            <InfoRow label="Member since" value={new Date(designer.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
            <InfoRow label="Last updated" value={new Date(designer.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
          </div>
        </div>

        <div className="card" style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
            Activity
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <InfoRow label="Projects" value={String(designer._count.projects)} />
            <InfoRow label="Clients" value={String(designer._count.clients)} />
            <InfoRow label="Orders" value={String(designer._count.orders)} />
          </div>
        </div>
      </div>

      {/* Recent projects */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Recent Projects
          </div>
        </div>
        {designer.projects.length === 0 ? (
          <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            No projects yet
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Project name', 'Client', 'Rooms', 'Status', 'Created'].map((h) => (
                  <th key={h} style={{
                    padding: '9px 16px', textAlign: 'left',
                    fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {designer.projects.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '11px 16px', fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {p.name}
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
                    {p.client.name}
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
                    {p._count.rooms}
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                      color: PROJECT_STATUS_COLOR[p.status] ?? '#555',
                      textTransform: 'uppercase',
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px', fontSize: 12.5, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
      <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right' }}>{value}</span>
    </div>
  );
}
