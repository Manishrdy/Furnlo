'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

type Role   = 'designer' | 'client';
type Phase  = 1 | 2 | 'success';

const DESIGNER_SPECS = ['Residential', 'Commercial', 'Hospitality', 'Retail', 'Healthcare', 'Luxury Villas', 'Offices', 'Show Homes'];
const CLIENT_TYPES   = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Home Office', 'Full Home', 'Commercial Space', 'Villa'];
const BUDGET_RANGES  = ['Under $ 50k', '$ 50k – 200k', '$ 200k – 1M', '$ 1M+'];

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: 'linear-gradient(145deg, #c98e1a 0%, #a8710a 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(168,113,10,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
        flexShrink: 0,
      }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M2 3.5h12M2 8h7M2 12.5h9" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
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
        background: phase === 2 ? 'linear-gradient(90deg, var(--gold), rgba(168,113,10,0.2))' : 'var(--border)',
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
  const [phase, setPhase] = useState<Phase>(1);
  const [role,  setRole]  = useState<Role>('designer');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [showPw, setShowPw]   = useState(false);

  // Phase 1
  const [fullName, setFullName]         = useState('');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPw, setConfirmPw]       = useState('');

  // Designer phase 2
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone]               = useState('');
  const [experience, setExperience]     = useState('');
  const [specs, setSpecs]               = useState<string[]>([]);
  const [portfolio, setPortfolio]       = useState('');

  // Client phase 2
  const [city, setCity]                 = useState('');
  const [projTypes, setProjTypes]       = useState<string[]>([]);
  const [budget, setBudget]             = useState('');
  const [referral, setReferral]         = useState('');

  function toggle<T>(val: T, list: T[], set: (v: T[]) => void) {
    set(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);
  }

  function validateP1(): string | null {
    if (!fullName.trim())               return 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Valid email required.';
    if (password.length < 8)            return 'Password must be at least 8 characters.';
    if (password !== confirmPw)         return 'Passwords do not match.';
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
    const result = role === 'designer'
      ? await api.signupDesigner({ fullName, email, password, businessName, phone })
      : await api.signupClient({ fullName, email, password, phone, city, projectTypes: projTypes });
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    setPhase('success');
  }

  const pwStrength = Math.min(4, Math.floor(password.length / 3));
  const strengthColor = ['#ef4444','#f97316','#eab308','#22c55e'][pwStrength - 1] ?? 'transparent';

  /* ── Success ─────────────────────────────────────── */
  if (phase === 'success') {
    const isD = role === 'designer';
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="card p-10 text-center max-w-md w-full anim-scale-in">
          <Logo />

          {/* Icon */}
          <div style={{ position: 'relative', width: 88, height: 88, margin: '28px auto 24px' }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 88, height: 88, borderRadius: '50%',
              background: isD ? 'rgba(168,113,10,0.1)' : 'rgba(39,103,73,0.1)',
              animation: 'successRing 2s ease-out infinite',
            }} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 88, height: 88, borderRadius: '50%',
              background: isD ? 'rgba(168,113,10,0.06)' : 'rgba(39,103,73,0.06)',
              animation: 'successRing 2s ease-out infinite 0.8s',
            }} />
            <div style={{
              position: 'relative', width: 88, height: 88, borderRadius: '50%',
              background: isD ? 'linear-gradient(145deg, #fef9f0, #fef3dc)' : 'linear-gradient(145deg, #f0fdf6, #dcfce9)',
              border: `2px solid ${isD ? 'rgba(168,113,10,0.28)' : 'rgba(39,103,73,0.28)'}`,
              boxShadow: `0 4px 24px ${isD ? 'rgba(168,113,10,0.15)' : 'rgba(39,103,73,0.15)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M9 18.5L15 24.5L27 12.5"
                  stroke={isD ? 'var(--gold)' : 'var(--green)'}
                  strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="60"
                  style={{ animation: 'checkStroke 0.7s ease-out 0.2s both' }}
                />
              </svg>
            </div>
          </div>

          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: isD ? 'var(--gold)' : 'var(--green)',
            marginBottom: 10,
          }}>
            Account Created
          </div>

          <h2 style={{ fontSize: 23, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 10 }}>
            Welcome to Tradeliv!
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 28 }}>
            You're all set, <strong style={{ color: 'var(--text-primary)' }}>{fullName.split(' ')[0]}</strong>! Your account is active and ready to use.
          </p>

          {/* Status steps */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 14, padding: 18, marginBottom: 28, textAlign: 'left' }}>
            {[
              { done: true,  label: 'Account created' },
              { done: true,  label: isD ? 'Designer studio activated' : 'Profile set up' },
              { done: false, label: isD ? 'Start your first project' : 'Designer assignment & project kickoff' },
            ].map((step, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step.done ? (isD ? 'rgba(168,113,10,0.12)' : 'rgba(39,103,73,0.12)') : 'transparent',
                  border: `1.5px solid ${step.done ? (isD ? 'rgba(168,113,10,0.32)' : 'rgba(39,103,73,0.32)') : 'var(--border-strong)'}`,
                }}>
                  {step.done
                    ? <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5 5-5" stroke={isD ? 'var(--gold)' : 'var(--green)'} strokeWidth="1.8" strokeLinecap="round" /></svg>
                    : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--border-strong)' }} />
                  }
                </div>
                <span style={{ fontSize: 13, color: step.done ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: step.done ? 600 : 400 }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <Link href="/login" className="btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
            Go to Sign In
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
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
        sub="Join thousands of trade professionals on Tradeliv."
        onSubmit={handleP1}
      >
        {/* Role selection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {(['designer', 'client'] as Role[]).map((r) => (
            <div key={r} className={`role-card ${role === r ? 'active' : ''}`} onClick={() => { setRole(r); setError(''); }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11, marginBottom: 10,
                background: role === r ? 'var(--gold-dim)' : 'var(--bg-base)',
                border: `1.5px solid ${role === r ? 'var(--gold-border)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.25s ease',
              }}>
                {r === 'designer'
                  ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={role === r ? 'var(--gold)' : 'var(--text-muted)'} strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                  : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={role === r ? 'var(--gold)' : 'var(--text-muted)'} strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" /></svg>
                }
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: role === r ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom: 2 }}>
                {r === 'designer' ? "I'm a Designer" : "I'm a Client"}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {r === 'designer' ? 'Trade access & project tools' : 'Work with top designers'}
              </div>
            </div>
          ))}
        </div>

        {/* Fields */}
        <div style={{ marginBottom: 14 }}>
          <label className="form-label">Full Name</label>
          <input className="input-field" type="text" placeholder="Alexandra Chen" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="form-label">Email Address</label>
          <input className="input-field" type="email" placeholder="alex@yourstudio.ae" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
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
              {[1,2,3,4].map((n) => (
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
          <Link href="/login" style={{ color: 'var(--gold)', fontWeight: 700, textDecoration: 'none', borderBottom: '1.5px solid var(--gold-border)', paddingBottom: 1 }}>Sign in</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          By continuing you agree to Tradeliv's{' '}
          <span style={{ color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Terms of Service</span>{' '}
          and <span style={{ color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policy</span>.
        </p>
      </FormWrap>
    );
  }

  /* ── Phase 2 — Designer ───────────────────────────── */
  if (role === 'designer') {
    return (
      <FormWrap
        phase={phase}
        title="Tell us about your studio"
        sub="Help us verify and personalise your experience."
        onSubmit={handleP2}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label className="form-label">Individual / Business Name</label>
            <input className="input-field" type="text" placeholder="Chen Studio (optional)" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Phone Number</label>
            <input className="input-field" type="tel" placeholder="+971 50 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
              <div key={s} className={`tag-chip ${specs.includes(s) ? 'selected' : ''}`} onClick={() => toggle(s, specs, setSpecs)}>
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

  /* ── Phase 2 — Client ─────────────────────────────── */
  return (
    <FormWrap
      phase={phase}
      title="Tell us about your project"
      sub="We'll match you with the right design expert."
      onSubmit={handleP2}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <label className="form-label">Phone Number</label>
          <input className="input-field" type="tel" placeholder="+971 50 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="form-label">City</label>
          <input className="input-field" type="text" placeholder="Dubai" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label className="form-label">Project Types</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {CLIENT_TYPES.map((t) => (
            <div key={t} className={`tag-chip ${projTypes.includes(t) ? 'selected' : ''}`} onClick={() => toggle(t, projTypes, setProjTypes)}>
              {projTypes.includes(t) && <span style={{ fontSize: 10 }}>✓</span>}{t}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label className="form-label">Approximate Budget</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {BUDGET_RANGES.map((b) => (
            <div key={b} className={`tag-chip ${budget === b ? 'selected' : ''}`} onClick={() => setBudget(budget === b ? '' : b)}>
              {budget === b && <span style={{ fontSize: 10 }}>✓</span>}{b}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label className="form-label">How did you find Tradeliv?</label>
        <div style={{ position: 'relative' }}>
          <select className="select-field" value={referral} onChange={(e) => setReferral(e.target.value)}>
            <option value="">Select source</option>
            <option value="designer">Referred by my designer</option>
            <option value="instagram">Instagram / Social Media</option>
            <option value="google">Google Search</option>
            <option value="word-of-mouth">Word of Mouth</option>
            <option value="event">Industry Event</option>
            <option value="other">Other</option>
          </select>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {error && <div className="error-box" style={{ marginBottom: 16 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" className="btn-ghost" onClick={() => { setPhase(1); setError(''); }}>← Back</button>
        <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
          {loading
            ? <><svg className="anim-rotate" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg> Creating…</>
            : <>Get Started <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
          }
        </button>
      </div>
    </FormWrap>
  );
}
