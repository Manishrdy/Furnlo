'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

type Role = 'designer' | 'client';

/* ── Logo mark ──────────────────────────────────────────────── */
function Logo({ size = 32 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.28,
          background: 'linear-gradient(145deg, #c98e1a 0%, #a8710a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(168,113,10,0.28), inset 0 1px 0 rgba(255,255,255,0.18)',
        }}
      >
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 16 16" fill="none">
          <path d="M2 3.5h12M2 8h7M2 12.5h9" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <span style={{ fontSize: size * 0.6, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
        tradeliv
      </span>
    </div>
  );
}

/* ── Eye icon ───────────────────────────────────────────────── */
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function LoginPage() {
  const [role, setRole] = useState<Role>('designer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    const result = role === 'designer'
      ? await api.loginDesigner({ email, password })
      : await api.loginClient({ email, password });
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    setSuccess(true);
  }

  /* ── Success ────────────────────────────────────────── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="card p-10 text-center max-w-sm w-full anim-scale-in">
          {/* Ring animation container */}
          <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 24px' }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(168,113,10,0.12)',
              animation: 'successRing 1.8s ease-out infinite',
            }} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(168,113,10,0.07)',
              animation: 'successRing 1.8s ease-out infinite 0.7s',
            }} />
            <div style={{
              position: 'relative', width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(145deg, #fef9f0, #fdf3e0)',
              border: '2px solid rgba(168,113,10,0.3)',
              boxShadow: '0 4px 20px rgba(168,113,10,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M7 15.5L12.5 21L23 10"
                  stroke="var(--gold)" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="60"
                  style={{ animation: 'checkStroke 0.6s ease-out 0.3s both' }}
                />
              </svg>
            </div>
          </div>

          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
            Authenticated
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Welcome back!
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 }}>
            {role === 'designer' ? 'Redirecting to your design studio…' : 'Redirecting to your client portal…'}
          </p>

          {/* Progress bar */}
          <div style={{ height: 4, borderRadius: 4, background: 'var(--bg-input)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
              animation: 'progressFill 1.8s ease-in-out forwards',
            }} />
          </div>
        </div>
      </div>
    );
  }

  /* ── Main layout ────────────────────────────────────── */
  return (
    <div className="min-h-screen flex">

      {/* ── Left — Brand panel ─────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[460px] xl:w-[500px] flex-shrink-0 p-10 xl:p-14"
        style={{
          background: 'var(--bg-panel)',
          borderRight: '1px solid var(--border)',
          backgroundImage: 'radial-gradient(circle, rgba(100,75,40,0.09) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      >
        <Logo size={34} />

        <div>
          {/* Eyebrow */}
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
            The Trade Platform
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(34px, 3.2vw, 46px)',
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}>
            Where Design<br />
            <span style={{
              backgroundImage: 'linear-gradient(135deg, #a8710a 0%, #d4951a 55%, #a8710a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Meets Trade.</span>
          </h1>

          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 340, marginBottom: 40 }}>
            A curated platform connecting interior designers with premium trade suppliers — from concept to delivery.
          </p>

          {/* 3D stacked card visual */}
          <div style={{ position: 'relative', height: 210, marginBottom: 40, perspective: '1000px' }}>
            {/* Back card */}
            <div
              className="anim-float-c"
              style={{
                position: 'absolute',
                width: 310, height: 170,
                borderRadius: 16,
                background: '#fff',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
                left: 32, top: 26,
                transform: 'rotate(4deg)',
              }}
            >
              <div style={{ padding: '18px 20px', opacity: 0.45 }}>
                <div style={{ height: 8, width: '55%', borderRadius: 4, background: 'rgba(168,113,10,0.2)', marginBottom: 10 }} />
                <div style={{ height: 6, width: '38%', borderRadius: 4, background: 'rgba(0,0,0,0.08)' }} />
              </div>
            </div>

            {/* Mid card */}
            <div
              className="anim-float-b"
              style={{
                position: 'absolute',
                width: 310, height: 170,
                borderRadius: 16,
                background: '#fff',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                left: 16, top: 13,
                transform: 'rotate(2deg)',
              }}
            >
              <div style={{ padding: '18px 20px', opacity: 0.6 }}>
                <div style={{ height: 8, width: '45%', borderRadius: 4, background: 'rgba(168,113,10,0.25)', marginBottom: 10 }} />
                <div style={{ height: 6, width: '65%', borderRadius: 4, background: 'rgba(0,0,0,0.08)' }} />
              </div>
            </div>

            {/* Front card — main */}
            <div
              className="anim-float-a"
              style={{
                position: 'absolute',
                width: 310,
                borderRadius: 16,
                background: '#fff',
                border: '1px solid var(--border)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
                left: 0, top: 0,
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 3 }}>
                    Project Board
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Living Room Revamp</div>
                </div>
                <div style={{
                  background: 'rgba(39,103,73,0.1)', border: '1px solid rgba(39,103,73,0.22)',
                  borderRadius: 999, padding: '3px 10px', fontSize: 11, color: '#276749', fontWeight: 600,
                }}>
                  Active
                </div>
              </div>

              {[
                { label: 'Sofa — Cassina',         price: '$ 8,400', dot: '#a8710a' },
                { label: 'Coffee Table — B&B Italia', price: '$ 3,200', dot: '#2c5282' },
                { label: 'Pendant — Flos',          price: '$ 1,850', dot: '#7c3aed' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '7px 10px', borderRadius: 8, marginBottom: i < 2 ? 4 : 0,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { value: '500+',      label: 'Designers' },
              { value: '10k+',      label: 'Products' },
              { value: '$ 200M+', label: 'Trade Orders' },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, background: '#fff', border: '1px solid var(--border)',
                borderRadius: 12, padding: '10px 12px',
                boxShadow: 'var(--shadow-xs)',
              }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>© 2025 Tradeliv. All rights reserved.</div>
      </div>

      {/* ── Right — Form panel ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-5 py-12 lg:px-12">
        <div className="w-full max-w-md anim-fade-up">

          {/* Mobile logo */}
          <div className="flex justify-center mb-10 lg:hidden"><Logo size={32} /></div>

          <div className="card p-8 xl:p-10">
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
                Sign In
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: 6 }}>
                Welcome back
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                Continue to your{' '}
                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>
                  {role === 'designer' ? 'design studio' : 'client portal'}
                </span>.
              </p>
            </div>

            {/* Role toggle */}
            <div style={{
              display: 'flex',
              background: 'var(--bg-input)',
              border: '1.5px solid var(--border)',
              borderRadius: 12,
              padding: 4,
              marginBottom: 24,
              gap: 4,
            }}>
              {(['designer', 'client'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRole(r); setError(''); }}
                  style={{
                    flex: 1,
                    padding: '9px 0',
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                    background: role === r ? '#fff' : 'transparent',
                    color: role === r ? 'var(--gold)' : 'var(--text-muted)',
                    boxShadow: role === r ? 'var(--shadow-sm), 0 0 0 1.5px var(--gold-border)' : 'none',
                  }}
                >
                  {r === 'designer' ? '✦ Designer' : '◆ Client'}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Email Address</label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="hello@yourstudio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div style={{ marginBottom: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                  <label className="form-label" style={{ margin: 0 }}>Password</label>
                  <button type="button" style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input-field"
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPw((v) => !v)}
                    style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                  >
                    <EyeIcon open={showPw} />
                  </button>
                </div>
              </div>

              {error && <div className="error-box" style={{ marginBottom: 16 }}>{error}</div>}

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? (
                  <>
                    <svg className="anim-rotate" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="divider" style={{ margin: '22px 0' }}>or</div>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ color: 'var(--gold)', fontWeight: 700, textDecoration: 'none', borderBottom: '1.5px solid var(--gold-border)', paddingBottom: 1 }}>
                Create account
              </Link>
            </p>
          </div>

          {/* Trust line */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 18, flexWrap: 'wrap' }}>
            {['256-bit SSL', 'SOC 2 Compliant', 'GDPR Ready'].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
