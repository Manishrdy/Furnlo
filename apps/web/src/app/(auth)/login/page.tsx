'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth';

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Client management',
    desc: 'Manage profiles and share private design portals',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Product curation',
    desc: 'Build mood boards and shortlist from any source',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    title: 'Trade ordering',
    desc: 'Place and track orders across every supplier',
  },
];

/* ─── Left brand panel ──────────────────────────────────── */
function BrandPanel() {
  return (
    <div style={{
      width: '50%',
      flexShrink: 0,
      minHeight: '100vh',
      background: '#0D0B09',
      display: 'flex',
      flexDirection: 'column',
      padding: '44px 52px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
      }} />

      {/* Top-right accent block */}
      <div style={{
        position: 'absolute',
        top: -120, right: -120,
        width: 360, height: 360,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(158,124,63,0.10) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      {/* Bottom-left accent */}
      <div style={{
        position: 'absolute',
        bottom: -80, left: -80,
        width: 300, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(158,124,63,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Logo ── */}
      <div style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'rgba(158,124,63,0.12)',
            border: '1px solid rgba(158,124,63,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M2 3.5h12M2 8h7M2 12.5h9" stroke="#C4A265" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.025em', color: '#fff' }}>
            tradeliv
          </span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
        paddingTop: 20,
      }}>
        {/* Label */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          background: 'rgba(158,124,63,0.10)',
          border: '1px solid rgba(158,124,63,0.18)',
          borderRadius: 999,
          padding: '5px 14px',
          marginBottom: 32,
          alignSelf: 'flex-start',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#B08D50', flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#B08D50', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            For Interior Designers
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 46,
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '-0.04em',
          lineHeight: 1.08,
          marginBottom: 20,
        }}>
          The studio<br />
          <span style={{ color: '#C4A265' }}>you&apos;ve been</span><br />
          waiting for.
        </h1>

        <p style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.42)',
          lineHeight: 1.65,
          marginBottom: 44,
          maxWidth: 340,
        }}>
          Manage every client project, curate products from any source,
          and share beautiful portals — all from one place.
        </p>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#B08D50',
              }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,0.82)', marginBottom: 2 }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom palette strip ── */}
      <div style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['#E4D9C8', '#8A9E8C', '#C4855A', '#6B4C31', '#B08D50', '#D4C4A8'].map((c) => (
            <div key={c} style={{
              height: 6, flex: 1, borderRadius: 999, background: c, opacity: 0.55,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Login page ────────────────────────────────────────── */
export default function LoginPage() {
  const router  = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!success) return;
    let p = 0;
    const iv = setInterval(() => {
      p += 2.2;
      setProgress(Math.min(p, 100));
      if (p >= 100) { clearInterval(iv); router.push('/dashboard'); }
    }, 40);
    return () => clearInterval(iv);
  }, [success, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    const result = await api.login({ email: email.trim(), password });
    setLoading(false);
    if (result.error || !result.data) { setError(result.error ?? 'Login failed'); return; }
    setUser(result.data.user);
    setSuccess(true);
  }

  /* ── Success ──────────────────────────────────────────── */
  if (success) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0D0B09',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div className="anim-scale-in" style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 24px' }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(158,124,63,0.10)',
              animation: 'successRing 2s ease-out infinite',
            }} />
            <div style={{
              position: 'relative', width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(158,124,63,0.08)',
              border: '1px solid rgba(158,124,63,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M8 16.5L13 21.5L24 10.5" stroke="#C4A265"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="50"
                  style={{ animation: 'checkStroke 0.6s ease-out 0.1s both' }}
                />
              </svg>
            </div>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Welcome back
          </h3>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.32)', marginBottom: 32 }}>
            Redirecting to your studio…
          </p>
          <div style={{ width: 240, height: 2, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', margin: '0 auto' }}>
            <div style={{
              height: '100%', borderRadius: 999,
              background: 'linear-gradient(90deg, #9E7C3F, #C4A265)',
              width: `${progress}%`, transition: 'width 0.04s linear',
            }} />
          </div>
        </div>
      </div>
    );
  }

  /* ── Login form ───────────────────────────────────────── */
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Left brand panel */}
      <div className="login-panel-visual">
        <BrandPanel />
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        minHeight: '100vh',
        padding: '40px 32px',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }} className="anim-fade-up">

          {/* Mobile logo */}
          <div className="login-logo-mobile" style={{ marginBottom: 44 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'rgba(158,124,63,0.10)', border: '1px solid rgba(158,124,63,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M2 3.5h12M2 8h7M2 12.5h9" stroke="#C4A265" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>tradeliv</span>
            </div>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{
              fontSize: 28, fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.035em',
              lineHeight: 1.15, marginBottom: 8,
            }}>
              Sign in
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Welcome back to your studio.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 14 }}>
              <label className="form-label">Email address</label>
              <input
                className="input-field"
                type="email"
                placeholder="you@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-field"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button" tabIndex={-1}
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: 'absolute', right: 13, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 0,
                  }}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
              <button
                type="button"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, fontFamily: 'inherit',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)')}
              >
                Forgot password?
              </button>
            </div>

            {error && <div className="error-box" style={{ marginBottom: 16 }}>{error}</div>}

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '12px 0',
                fontFamily: 'inherit', fontSize: 14, fontWeight: 600, letterSpacing: '0.005em',
                color: '#fff', border: 'none', borderRadius: 10,
                cursor: loading ? 'not-allowed' : 'pointer',
                background: loading
                  ? 'rgba(140,104,40,0.45)'
                  : 'linear-gradient(135deg, #7A5C26 0%, #9E7C3F 50%, #C4A265 100%)',
                boxShadow: loading ? 'none' : '0 1px 3px rgba(0,0,0,0.10), 0 4px 14px rgba(122,92,38,0.28)',
                transition: 'box-shadow 0.18s, transform 0.18s',
              }}
              onMouseEnter={(e) => {
                if (loading) return;
                const b = e.currentTarget as HTMLButtonElement;
                b.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12), 0 8px 24px rgba(122,92,38,0.40)';
                b.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                if (loading) return;
                const b = e.currentTarget as HTMLButtonElement;
                b.style.boxShadow = '0 1px 3px rgba(0,0,0,0.10), 0 4px 14px rgba(122,92,38,0.28)';
                b.style.transform = 'translateY(0)';
              }}
              onMouseDown={(e) => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              {loading
                ? <><svg className="anim-rotate" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg> Signing in…</>
                : <>Sign in <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
              }
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Sign up */}
          <Link href="/signup" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '11px 0',
            fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600,
            color: 'var(--text-secondary)', textDecoration: 'none',
            background: 'var(--bg-input)', border: '1px solid var(--border)',
            borderRadius: 10, transition: 'all 0.15s ease',
          }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = '#fff';
              el.style.borderColor = 'var(--border-strong)';
              el.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'var(--bg-input)';
              el.style.borderColor = 'var(--border)';
              el.style.color = 'var(--text-secondary)';
            }}
          >
            Create an account
          </Link>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
            By signing in, you agree to our{' '}
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer' }}>Terms</span>
            {' '}and{' '}
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer' }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
