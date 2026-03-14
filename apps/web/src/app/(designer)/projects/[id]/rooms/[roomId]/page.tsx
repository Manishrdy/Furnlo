'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, Room } from '@/lib/api';

function formatBudget(min: number | null, max: number | null) {
  if (!min && !max) return null;
  const fmt = (v: number) => {
    if (v >= 1000000) return `$${(v / 1000000).toFixed(1).replace('.0', '')}M`;
    if (v >= 1000)    return `$${(v / 1000).toFixed(0)}K`;
    return `$${v}`;
  };
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

export default function RoomDetailPage() {
  const { id: projectId, roomId } = useParams<{ id: string; roomId: string }>();
  const router = useRouter();

  const [room, setRoom]       = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.getProject(projectId).then((r) => {
      if (r.error || !r.data) { setNotFound(true); setLoading(false); return; }
      const found = r.data.rooms.find((rm) => rm.id === roomId);
      if (!found) { setNotFound(true); setLoading(false); return; }
      setRoom(found);
      setLoading(false);
    });
  }, [projectId, roomId]);

  if (loading) {
    return (
      <div style={{ padding: '60px 44px', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 13.5 }}>
        <svg className="anim-rotate" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
        Loading room…
      </div>
    );
  }

  if (notFound || !room) {
    return (
      <div style={{ padding: '60px 44px', textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Room not found</div>
        <button
          className="btn-ghost"
          onClick={() => router.push(`/projects/${projectId}/rooms`)}
          style={{ fontSize: 13 }}
        >
          ← Back to Rooms
        </button>
      </div>
    );
  }

  const budget  = formatBudget(room.budgetMin, room.budgetMax);
  const hasDims = room.lengthFt != null || room.widthFt != null || room.heightFt != null;
  const req     = room.clientRequirements;

  return (
    <div style={{ padding: '40px 44px 80px', maxWidth: 760 }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 20 }}>
        <Link href={`/projects/${projectId}/rooms`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>
          ← Rooms
        </Link>
        <span style={{ color: 'var(--border-strong)' }}>/</span>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{room.name}</span>
      </div>

      {/* Room header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', margin: '0 0 6px' }}>
          {room.name}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
          {room.areaSqft != null && (
            <span>{room.areaSqft} sq ft</span>
          )}
          {hasDims && (
            <span>
              {[room.lengthFt, room.widthFt, room.heightFt].filter(Boolean).join(' × ')} ft
            </span>
          )}
          {budget && (
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{budget}</span>
          )}
        </div>
      </div>

      {/* Furniture Needed */}
      {room.categoryNeeds.length > 0 && (
        <div className="card" style={{ padding: '20px 22px', marginBottom: 16 }}>
          <SectionTitle>Furniture Needed</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {room.categoryNeeds.map((cat) => (
              <span
                key={cat}
                style={{
                  border: '1px solid #111',
                  background: '#111',
                  color: '#fff',
                  borderRadius: 999,
                  padding: '4px 12px',
                  fontSize: 12, fontWeight: 600,
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Client Requirements */}
      {req && (
        <div className="card" style={{ padding: '20px 22px', marginBottom: 16 }}>
          <SectionTitle>Client Requirements</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {req.colorPalette && (
              <DetailRow label="Color palette" value={req.colorPalette} />
            )}
            {req.materialPreferences && (
              <DetailRow label="Material preferences" value={req.materialPreferences} />
            )}
            {req.seatingCapacity != null && (
              <DetailRow label="Seating capacity" value={`${req.seatingCapacity} persons`} />
            )}
            {req.functionalConstraints && (
              <DetailRow label="Functional constraints" value={req.functionalConstraints} />
            )}
            {req.inspirationLinks?.length ? (
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Inspiration links
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {req.inspirationLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 13, color: '#a8710a', textDecoration: 'none',
                        fontWeight: 500, wordBreak: 'break-all',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      {link.length > 60 ? link.slice(0, 60) + '…' : link}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Designer Notes */}
      {room.notes && (
        <div className="card" style={{ padding: '20px 22px', marginBottom: 16 }}>
          <SectionTitle>Designer Notes</SectionTitle>
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {room.notes}
          </p>
        </div>
      )}

      {/* Shortlist placeholder */}
      <div className="card" style={{ padding: '20px 22px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <SectionTitle style={{ margin: 0 }}>Shortlist</SectionTitle>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
            color: '#7a5c2d', background: '#fdf5e6',
            padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase',
          }}>
            Coming soon
          </span>
        </div>
        <div style={{
          border: '1.5px dashed var(--border-strong)',
          borderRadius: 10, padding: '32px 20px',
          textAlign: 'center', color: 'var(--text-muted)',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: 10, opacity: 0.4 }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
            Shortlist furniture for this room
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
            Browse the catalog and add items to this room&apos;s shortlist for client review.
          </div>
        </div>
      </div>

    </div>
  );
}

function SectionTitle({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)',
      textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12,
      ...style,
    }}>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--text-primary)', fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}
