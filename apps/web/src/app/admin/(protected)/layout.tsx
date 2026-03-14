'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
}

const NAV = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: '/admin/designers',
    label: 'Designers',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin]       = useState<AdminUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    api.getAdminMe().then((r) => {
      if (r.data && r.data.isAdmin) {
        setAdmin(r.data);
      } else {
        router.replace('/admin/login');
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSignOut() {
    await api.logout();
    router.replace('/admin/login');
  }

  if (!hydrated || !admin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAF8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#B0ADA8', fontSize: 13.5 }}>
          <svg className="anim-rotate" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
          Loading…
        </div>
      </div>
    );
  }

  const initials = admin.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 40,
      }}>

        {/* Logo + badge */}
        <div style={{ padding: '22px 20px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.04em', color: '#0F0F0F' }}>
            Tradeliv
          </span>
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: '0.07em',
            color: '#7a5c2d', background: '#fdf5e6',
            padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase',
          }}>
            Admin
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--sidebar-border)', margin: '0 12px 8px' }} />

        {/* Nav */}
        <nav style={{ flex: 1, padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '8px 10px', borderRadius: 8,
                  fontSize: 13, fontWeight: active ? 600 : 500,
                  color: active ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
                  background: active ? 'var(--sidebar-active-bg)' : 'transparent',
                  borderLeft: active ? '2px solid var(--sidebar-active-border)' : '2px solid transparent',
                  textDecoration: 'none', transition: 'all 0.12s ease',
                  letterSpacing: '-0.01em',
                  paddingLeft: active ? 8 : 10,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'var(--sidebar-hover-bg)';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#4A4A4A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--sidebar-text)';
                  }
                }}
              >
                <span style={{ flexShrink: 0, opacity: active ? 1 : 0.65 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User + sign out */}
        <div style={{ padding: '8px 10px 14px' }}>
          <div style={{ height: 1, background: 'var(--sidebar-border)', marginBottom: 10 }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '8px 10px', borderRadius: 8,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: '#fdf5e6', border: '1px solid #e8d5b0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: '#7a5c2d',
              letterSpacing: '0.02em',
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#0F0F0F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>
                {admin.fullName.split(' ')[0]}
              </div>
              <div style={{ fontSize: 10.5, color: '#B0ADA8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>
                {admin.email}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#C8C5BF', padding: 4, borderRadius: 5,
                display: 'flex', alignItems: 'center', flexShrink: 0,
                transition: 'color 0.12s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#0F0F0F')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#C8C5BF')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────── */}
      <main style={{ marginLeft: 220, flex: 1, minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
