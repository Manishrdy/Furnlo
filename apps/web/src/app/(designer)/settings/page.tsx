'use client';

import { useEffect, useState } from 'react';
import { api, DesignerProfile } from '@/lib/api';

export default function SettingsPage() {
  const [profile, setProfile]   = useState<DesignerProfile | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState('');

  const [fullName, setFullName]         = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone]               = useState('');

  useEffect(() => {
    api.getMe().then((r) => {
      if (r.data) {
        setProfile(r.data);
        setFullName(r.data.fullName ?? '');
        setBusinessName(r.data.businessName ?? '');
        setPhone(r.data.phone ?? '');
      }
      setLoading(false);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaved(false);
    if (!fullName.trim()) { setError('Full name is required.'); return; }
    setSaving(true);
    const r = await api.updateProfile({
      fullName: fullName.trim(),
      businessName: businessName.trim() || null,
      phone: phone.trim() || null,
    });
    setSaving(false);
    if (r.error) { setError(r.error); return; }
    if (r.data) setProfile(r.data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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

  return (
    <div style={{ padding: '40px 40px 60px', maxWidth: 640 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: 0 }}>
          Settings
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 13.5, color: 'var(--text-muted)' }}>
          Manage your account and profile information.
        </p>
      </div>

      {/* Profile section */}
      <div className="card" style={{ padding: '28px 28px 24px' }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 20px' }}>
          Profile
        </h2>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Full name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}>
              Full name <span style={{ color: 'var(--destructive, #c0392b)' }}>*</span>
            </label>
            <input
              className="input-field"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Smith"
              required
            />
          </div>

          {/* Email (read-only) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}>
              Email
            </label>
            <input
              className="input-field"
              type="email"
              value={profile?.email ?? ''}
              readOnly
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
              Email cannot be changed. Contact support if you need to update it.
            </p>
          </div>

          {/* Business name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}>
              Business name
            </label>
            <input
              className="input-field"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Smith Interiors"
            />
          </div>

          {/* Phone */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}>
              Phone
            </label>
            <input
              className="input-field"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {error && (
            <p style={{ margin: 0, fontSize: 13, color: 'var(--destructive, #c0392b)', fontWeight: 500 }}>
              {error}
            </p>
          )}

          {saved && (
            <p style={{ margin: 0, fontSize: 13, color: '#2d7a4f', fontWeight: 500 }}>
              Profile saved successfully.
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
              style={{ minWidth: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
            >
              {saving && (
                <svg className="anim-rotate" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
              )}
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Account section */}
      <div className="card" style={{ padding: '28px 28px 24px', marginTop: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 16px' }}>
          Account
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Status</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>Your account approval status</div>
            </div>
            <StatusBadge status={profile?.status ?? ''} />
          </div>
          <div style={{ height: 1, background: 'var(--border)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Member since</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    approved:       { label: 'Approved',       color: '#2d7a4f', bg: '#e8f5ee' },
    pending_review: { label: 'Pending Review', color: '#7a5c2d', bg: '#fdf5e6' },
    rejected:       { label: 'Rejected',       color: '#8b2635', bg: '#fdecea' },
    suspended:      { label: 'Suspended',      color: '#555',    bg: '#f0f0f0' },
  };
  const s = map[status] ?? { label: status, color: '#555', bg: '#f0f0f0' };
  return (
    <span style={{
      fontSize: 11.5, fontWeight: 700, letterSpacing: '0.04em',
      color: s.color, background: s.bg,
      padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase',
    }}>
      {s.label}
    </span>
  );
}
