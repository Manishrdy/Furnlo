import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Project — Furnlo',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Top nav */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(248,247,244,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7,
            background: 'var(--bg-input)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M2 3.5h12M2 8h7M2 12.5h9" stroke="var(--text-secondary)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            tradeliv
          </span>
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Client Portal
        </div>
      </header>

      {/* Page content */}
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 80px' }}>
        {children}
      </main>
    </div>
  );
}
