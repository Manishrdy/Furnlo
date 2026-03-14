'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const INPUT: React.CSSProperties = {
  display: 'block',
  width: '100%',
  background: '#fff',
  border: '1.5px solid #E4E1DC',
  borderRadius: 10,
  padding: '12px 14px',
  fontSize: 14,
  color: '#0F0F0F',
  fontFamily: 'inherit',
  outline: 'none',
  letterSpacing: '-0.01em',
  transition: 'border-color 0.14s',
};

const LABEL: React.CSSProperties = {
  display: 'block',
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
  color: '#B0ADA8',
  marginBottom: 7,
};

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

export default function AdminLoginPage() {
  const router = useRouter();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    const result = await api.adminLogin({ email: email.trim(), password });
    setLoading(false);
    if (result.error || !result.data) { setError(result.error ?? 'Login failed'); return; }
    router.push('/admin/dashboard');
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAFAF8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
    }}>
      <div className="anim-fade-up" style={{ width: '100%', maxWidth: 380 }}>

        {/* Wordmark + badge */}
        <div style={{ marginBottom: 56, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.04em', color: '#0F0F0F' }}>
            Tradeliv
          </span>
          <span style={{
            fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
            color: '#7a5c2d', background: '#fdf5e6',
            padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase',
          }}>
            Admin
          </span>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{
            fontSize: 40, fontWeight: 300, letterSpacing: '-0.05em',
            color: '#0F0F0F', lineHeight: 1.06, marginBottom: 14,
          }}>
            Admin access.
          </h1>
          <p style={{ fontSize: 14, color: '#8C8984', letterSpacing: '-0.01em', lineHeight: 1.5 }}>
            Sign in with your admin credentials.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 16 }}>
            <label style={LABEL}>Email address</label>
            <input
              type="email"
              placeholder="admin@tradeliv.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              style={INPUT}
              onFocus={(e) => (e.target.style.borderColor = '#0F0F0F')}
              onBlur={(e) => (e.target.style.borderColor = '#E4E1DC')}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={LABEL}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ ...INPUT, paddingRight: 44 }}
                onFocus={(e) => (e.target.style.borderColor = '#0F0F0F')}
                onBlur={(e) => (e.target.style.borderColor = '#E4E1DC')}
              />
              <button
                type="button" tabIndex={-1}
                onClick={() => setShowPw((v) => !v)}
                style={{
                  position: 'absolute', right: 13, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#C8C5BF', display: 'flex', alignItems: 'center', padding: 0,
                }}
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(185,28,28,0.04)', border: '1px solid rgba(185,28,28,0.12)',
              borderRadius: 8, padding: '10px 13px', fontSize: 13, color: '#b91c1c',
              marginBottom: 16, letterSpacing: '-0.01em',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', padding: '13px 0',
              background: '#0F0F0F', color: '#fff',
              border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: loading ? 0.55 : 1,
              transition: 'opacity 0.14s',
            }}
          >
            {loading
              ? <><svg className="anim-rotate" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg> Signing in…</>
              : 'Sign in'
            }
          </button>
        </form>

      </div>
    </div>
  );
}
