'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth';

type Phase = 1 | 2 | 'success';

const DESIGNER_SPECS = ['Residential', 'Commercial', 'Hospitality', 'Retail', 'Healthcare', 'Luxury Villas', 'Offices', 'Show Homes'];

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: 'var(--bg-input)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M2 3.5h12M2 8h7M2 12.5h9" stroke="var(--text-secondary)" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>tradeliv</span>
    </div>
  );
}

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

function StepBar({ phase }: { phase: Phase }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
      <div className={`step-dot ${phase === 1 ? 'active' : 'done'}`} />
      <div style={{
        flex: 1, height: 2, borderRadius: 2,
        background: phase === 2 ? '#111111' : 'var(--border)',
        transition: 'background 0.4s',
      }} />
      <div className={`step-dot ${phase === 2 ? 'active' : ''}`} />
    </div>
  );
}

function FormWrap({ phase, title, sub, onSubmit, children }: {
  phase: Phase;
  title: string;
  sub: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg anim-fade-up">
        <div className="card p-8 xl:p-10">
          <div style={{ marginBottom: 28 }}>
            <Logo />
            <div style={{ marginTop: 28, marginBottom: 22 }}>
              <StepBar phase={phase} />
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
                Step {phase === 1 ? '1' : '2'} of 2
              </div>
              <h2 style={{ fontSize: 23, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>{title}</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{sub}</p>
            </div>
          </div>
          <form onSubmit={onSubmit} noValidate>{children}</form>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [phase, setPhase] = useState<Phase>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (phase === 'success') {
      const t = setTimeout(() => router.push('/dashboard'), 2200);
      return () => clearTimeout(t);
    }
  }, [phase, router]);

  // Phase 1
  const [fullName, setFullName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  // Phase 2
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone]               = useState('');
  const [experience, setExperience]     = useState('');
  const [specs, setSpecs]               = useState<string[]>([]);
  const [portfolio, setPortfolio]       = useState('');

  function toggleSpec(val: string) {
    setSpecs((prev) => prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]);
  }

  function validateP1(): string | null {
    if (!fullName.trim())                                       return 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))            return 'Valid email required.';
    if (password.length < 8)                                    return 'Password must be at least 8 characters.';
    if (password !== confirmPw)                                 return 'Passwords do not match.';
    return null;
  }

  function handleP1(e: React.FormEvent) {
    e.preventDefault();
    const err = validateP1();
    if (err) { setError(err); return; }
    setError('');
    setPhase(2);
  }

  async function handleP2(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await api.signupDesigner({ fullName, email, password, businessName, phone });
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    setUser(result.data.user);
    setPhase('success');
  }

  const pwStrength = Math.min(4, Math.floor(password.length / 3));
  const strengthColor = ['#ef4444', '#f97316', '#eab308', '#22c55e'][pwStrength - 1] ?? 'transparent';

  /* ── Success ─────────────────────────────────────── */
  if (phase === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="card p-10 text-center max-w-md w-full anim-scale-in">
          <Logo />

          <div style={{ position: 'relative', width: 80, height: 80, margin: '28px auto 24px' }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(0,0,0,0.05)',
              animation: 'successRing 2s ease-out infinite',
            }} />
            <div style={{
              position: 'relative', width: 80, height: 80, borderRadius: '50%',
              background: 'var(--bg-input)', border: '1.5px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M8 16.5L13 21.5L24 10.5"
                  stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="50"
                  style={{ animation: 'checkStroke 0.7s ease-out 0.2s both' }}
                />
              </svg>
            </div>
          </div>

          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
            Account Created
          </div>

          <h2 style={{ fontSize: 23, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 10 }}>
            Welcome to Tradeliv!
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 28 }}>
            You're all set, <strong style={{ color: 'var(--text-primary)' }}>{fullName.split(' ')[0]}</strong>! Your designer account is active and ready to use.
          </p>

          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 14, padding: 18, marginBottom: 28, textAlign: 'left' }}>
            {[
              { done: true,  label: 'Account created' },
              { done: true,  label: 'Designer studio activated' },
              { done: false, label: 'Start your first project' },
            ].map((step, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step.done ? 'var(--bg-input)' : 'transparent',
                  border: `1.5px solid ${step.done ? 'var(--border-strong)' : 'var(--border)'}`,
                }}>
                  {step.done
                    ? <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5 5-5" stroke="var(--text-secondary)" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--border-strong)' }} />
                  }
                </div>
                <span style={{ fontSize: 13, color: step.done ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: step.done ? 600 : 400 }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <button onClick={() => router.push('/dashboard')} className="btn-primary" style={{ width: '100%' }}>
            Enter your studio
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  /* ── Phase 1 ──────────────────────────────────────── */
  if (phase === 1) {
    return (
      <FormWrap
        phase={phase}
        title="Create your account"
        sub="Join trade professionals on Tradeliv."
        onSubmit={handleP1}
      >
        <div style={{ marginBottom: 14 }}>
          <label className="form-label">Full Name</label>
          <input className="input-field" type="text" placeholder="Alexandra Chen" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="form-label">Email Address</label>
          <input className="input-field" type="email" placeholder="alex@yourstudio.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input className="input-field" type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" style={{ paddingRight: 44 }} />
            <button type="button" tabIndex={-1} onClick={() => setShowPw((v) => !v)}
              style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <EyeIcon open={showPw} />
            </button>
          </div>
          {password.length > 0 && (
            <div style={{ display: 'flex', gap: 4, marginTop: 7 }}>
              {[1, 2, 3, 4].map((n) => (
                <div key={n} style={{ flex: 1, height: 3, borderRadius: 2, transition: 'background 0.3s', background: n <= pwStrength ? strengthColor : 'var(--border)' }} />
              ))}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 22 }}>
          <label className="form-label">Confirm Password</label>
          <input className="input-field" type={showPw ? 'text' : 'password'} placeholder="Re-enter password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} autoComplete="new-password" />
        </div>

        {error && <div className="error-box" style={{ marginBottom: 16 }}>{error}</div>}

        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          Continue
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--text-primary)', fontWeight: 700, textDecoration: 'none', borderBottom: '1.5px solid var(--border-strong)', paddingBottom: 1 }}>Sign in</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          By continuing you agree to Tradeliv&apos;s{' '}
          <span style={{ color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Terms of Service</span>{' '}
          and <span style={{ color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policy</span>.
        </p>
      </FormWrap>
    );
  }

  /* ── Phase 2 ──────────────────────────────────────── */
  return (
    <FormWrap
      phase={phase}
      title="Tell us about your studio"
      sub="Help us personalise your trade experience."
      onSubmit={handleP2}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <label className="form-label">Individual / Business Name</label>
          <input className="input-field" type="text" placeholder="Chen Studio (optional)" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
        </div>
        <div>
          <label className="form-label">Phone Number</label>
          <input className="input-field" type="tel" placeholder="+1 555 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label className="form-label">Years of Experience</label>
        <div style={{ position: 'relative' }}>
          <select className="select-field" value={experience} onChange={(e) => setExperience(e.target.value)}>
            <option value="">Select range</option>
            <option value="<2">Less than 2 years</option>
            <option value="2-5">2 – 5 years</option>
            <option value="5-10">5 – 10 years</option>
            <option value="10+">10+ years</option>
          </select>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label className="form-label">Specializations</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {DESIGNER_SPECS.map((s) => (
            <div key={s} className={`tag-chip ${specs.includes(s) ? 'selected' : ''}`} onClick={() => toggleSpec(s)}>
              {specs.includes(s) && <span style={{ fontSize: 10 }}>✓</span>}{s}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <label className="form-label">
          Portfolio URL <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
        </label>
        <input className="input-field" type="url" placeholder="https://yourportfolio.com" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
      </div>

      {error && <div className="error-box" style={{ marginBottom: 16 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" className="btn-ghost" onClick={() => { setPhase(1); setError(''); }}>← Back</button>
        <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
          {loading
            ? <><svg className="anim-rotate" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg> Creating Account…</>
            : <>Create Account <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
          }
        </button>
      </div>
    </FormWrap>
  );
}
