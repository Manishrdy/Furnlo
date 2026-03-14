'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, Client, ClientPayload } from '@/lib/api';

const BUDGET_CHIPS = [
  { label: 'Under $10K',    min: 0,      max: 10000 },
  { label: '$10K – $25K',   min: 10000,  max: 25000 },
  { label: '$25K – $50K',   min: 25000,  max: 50000 },
  { label: '$50K – $100K',  min: 50000,  max: 100000 },
  { label: '$100K – $250K', min: 100000, max: 250000 },
  { label: '$250K+',        min: 250000, max: 0 },
];

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function StepDot({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 700,
      background: done ? '#111111' : active ? 'var(--bg-input)' : 'var(--bg-input)',
      border: `1.5px solid ${done ? '#111111' : active ? 'var(--border-strong)' : 'var(--border)'}`,
      color: done ? '#fff' : active ? 'var(--text-primary)' : 'var(--text-muted)',
      transition: 'all 0.2s',
    }}>
      {done ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : n}
    </div>
  );
}

export default function NewProjectPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);

  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [showNewClient, setShowNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [creatingClient, setCreatingClient] = useState(false);
  const [clientError, setClientError] = useState('');

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [activeChip, setActiveChip] = useState(-1);
  const [stylePreference, setStylePreference] = useState('');
  const [projectError, setProjectError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMode, setSubmitMode] = useState<'draft' | 'active'>('draft');

  useEffect(() => {
    api.getClients().then((r) => {
      if (r.data) setClients(r.data);
      setClientsLoading(false);
    });
  }, []);

  const filteredClients = clientSearch.trim()
    ? clients.filter((c) =>
        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        (c.email ?? '').toLowerCase().includes(clientSearch.toLowerCase())
      )
    : clients;

  async function handleCreateClient() {
    if (!newClientName.trim()) { setClientError('Client name is required.'); return; }
    setCreatingClient(true); setClientError('');
    const payload: ClientPayload = {
      name: newClientName.trim(),
      email: newClientEmail.trim() || undefined,
      phone: newClientPhone.trim() || undefined,
    };
    const r = await api.createClient(payload);
    setCreatingClient(false);
    if (r.error) { setClientError(r.error); return; }
    setClients((prev) => [r.data!, ...prev]);
    setSelectedClient(r.data!);
    setShowNewClient(false);
    setNewClientName(''); setNewClientEmail(''); setNewClientPhone('');
  }

  function handleChipSelect(idx: number) {
    const chip = BUDGET_CHIPS[idx];
    setActiveChip(idx);
    setBudgetMin(chip.min > 0 ? String(chip.min) : '');
    setBudgetMax(chip.max > 0 ? String(chip.max) : '');
  }

  async function handleSubmit(status: 'draft' | 'active') {
    if (!projectName.trim()) { setProjectError('Project name is required.'); return; }
    if (!selectedClient) { setProjectError('Please select a client.'); return; }

    setSubmitMode(status);
    setSubmitting(true);
    setProjectError('');

    const r = await api.createProject({
      clientId: selectedClient.id,
      name: projectName.trim(),
      description: description.trim() || undefined,
      budgetMin: budgetMin ? Number(budgetMin) : undefined,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
      stylePreference: stylePreference.trim() || undefined,
      status,
    });

    setSubmitting(false);
    if (r.error) { setProjectError(r.error); return; }
    router.push(`/projects/${r.data!.id}`);
  }

  return (
    <div style={{ padding: '40px 44px', maxWidth: 720 }}>

      {/* ── Back ────────────────────────────────────────── */}
      <Link
        href="/projects"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, textDecoration: 'none', marginBottom: 28 }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to projects
      </Link>

      {/* ── Step indicator ──────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 36 }}>
        {[
          { n: 1, label: 'Select Client' },
          { n: 2, label: 'Project Details' },
        ].map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <StepDot n={s.n} active={step === s.n} done={step > s.n} />
              <span style={{
                fontSize: 13, fontWeight: 600,
                color: step === s.n ? 'var(--text-primary)' : step > s.n ? 'var(--text-secondary)' : 'var(--text-muted)',
              }}>
                {s.label}
              </span>
            </div>
            {i < 1 && (
              <div style={{ width: 44, height: 1, background: step > s.n ? 'var(--border-strong)' : 'var(--border)', margin: '0 14px' }} />
            )}
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════
          STEP 1 — CLIENT SELECTION
      ════════════════════════════════════════════════ */}
      {step === 1 && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 6 }}>
              Select a client
            </h1>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
              Choose an existing client or create a new one for this project.
            </p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="input-field"
              type="text"
              placeholder="Search clients…"
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              style={{ paddingLeft: 34, width: '100%' }}
            />
          </div>

          {/* Client list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14, maxHeight: 340, overflowY: 'auto' }}>
            {clientsLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13, padding: '12px 0' }}>
                <svg className="anim-rotate" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Loading clients…
              </div>
            ) : filteredClients.length === 0 && !showNewClient ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                {clientSearch ? 'No clients match your search.' : 'No clients yet.'}
              </div>
            ) : (
              filteredClients.map((c) => {
                const isSelected = selectedClient?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClient(isSelected ? null : c)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 13,
                      padding: '11px 15px', borderRadius: 9, cursor: 'pointer',
                      border: `1px solid ${isSelected ? '#111111' : 'var(--border)'}`,
                      background: isSelected ? '#111111' : 'var(--bg-input)',
                      transition: 'all 0.12s',
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: isSelected ? 'rgba(255,255,255,0.12)' : 'var(--bg-card)',
                      border: `1px solid ${isSelected ? 'rgba(255,255,255,0.12)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: isSelected ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)',
                    }}>
                      {initials(c.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: isSelected ? '#fff' : 'var(--text-primary)', marginBottom: 1 }}>{c.name}</div>
                      {c.email && <div style={{ fontSize: 12, color: isSelected ? 'rgba(255,255,255,0.50)' : 'var(--text-muted)' }}>{c.email}</div>}
                    </div>
                    {c._count?.projects !== undefined && (
                      <div style={{
                        background: isSelected ? 'rgba(255,255,255,0.09)' : 'var(--bg-card)',
                        border: `1px solid ${isSelected ? 'rgba(255,255,255,0.10)' : 'var(--border)'}`,
                        borderRadius: 999, padding: '2px 9px', fontSize: 11,
                        color: isSelected ? 'rgba(255,255,255,0.65)' : 'var(--text-muted)', fontWeight: 600,
                      }}>
                        {c._count.projects} project{c._count.projects !== 1 ? 's' : ''}
                      </div>
                    )}
                    {isSelected && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* New client inline */}
          {!showNewClient ? (
            <button
              onClick={() => setShowNewClient(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '11px 15px', borderRadius: 9, cursor: 'pointer',
                border: '1px dashed var(--border-strong)', background: 'transparent',
                color: 'var(--text-muted)', fontSize: 13, fontWeight: 600,
                transition: 'all 0.12s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-input)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create a new client
            </button>
          ) : (
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>New client</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input className="input-field" type="text" value={newClientName} onChange={(e) => setNewClientName(e.target.value)} placeholder="Priya Sharma" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label">Email</label>
                    <input className="input-field" type="email" value={newClientEmail} onChange={(e) => setNewClientEmail(e.target.value)} placeholder="priya@example.com" />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input className="input-field" type="tel" value={newClientPhone} onChange={(e) => setNewClientPhone(e.target.value)} placeholder="+91 98765 43210" />
                  </div>
                </div>
                {clientError && <div className="error-box">{clientError}</div>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-primary" onClick={handleCreateClient} disabled={creatingClient} style={{ fontSize: 13 }}>
                    {creatingClient ? 'Creating…' : 'Create & Select'}
                  </button>
                  <button className="btn-ghost" onClick={() => { setShowNewClient(false); setClientError(''); }} style={{ fontSize: 13 }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Continue */}
          <div style={{ marginTop: 28, paddingTop: 22, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-primary"
              disabled={!selectedClient}
              onClick={() => setStep(2)}
              style={{ display: 'flex', alignItems: 'center', gap: 7 }}
            >
              Continue
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {selectedClient && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--text-secondary)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <strong>{selectedClient.name}</strong> selected
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════
          STEP 2 — PROJECT DETAILS
      ════════════════════════════════════════════════ */}
      {step === 2 && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 6 }}>
              Project details
            </h1>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
              For <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{selectedClient?.name}</strong>
            </p>
          </div>

          <div className="card" style={{ padding: 28 }}>

            <div style={{ marginBottom: 18 }}>
              <label className="form-label">Project Name *</label>
              <input
                className="input-field"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., Bandra West — 3BHK Renovation"
                autoFocus
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label className="form-label">Description</label>
              <textarea
                className="input-field"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief overview of the project scope…"
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label className="form-label">Total Budget</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {BUDGET_CHIPS.map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleChipSelect(i)}
                    style={{
                      border: `1px solid ${activeChip === i ? '#111111' : 'var(--border)'}`,
                      background: activeChip === i ? '#111111' : 'var(--bg-input)',
                      color: activeChip === i ? '#fff' : 'var(--text-secondary)',
                      borderRadius: 999, padding: '5px 13px', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.12s',
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Min ($)</label>
                  <input
                    className="input-field"
                    type="number"
                    value={budgetMin}
                    onChange={(e) => { setBudgetMin(e.target.value); setActiveChip(-1); }}
                    placeholder="e.g., 500000"
                    min="0"
                  />
                </div>
                <div>
                  <label className="form-label">Max ($)</label>
                  <input
                    className="input-field"
                    type="number"
                    value={budgetMax}
                    onChange={(e) => { setBudgetMax(e.target.value); setActiveChip(-1); }}
                    placeholder="e.g., 1500000"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Style Preference</label>
              <input
                className="input-field"
                type="text"
                value={stylePreference}
                onChange={(e) => setStylePreference(e.target.value)}
                placeholder="e.g., Modern minimalist with warm wood tones"
              />
            </div>
          </div>

          {projectError && <div className="error-box" style={{ marginTop: 14 }}>{projectError}</div>}

          {/* Actions */}
          <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
            <button className="btn-ghost" onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-ghost" onClick={() => handleSubmit('draft')} disabled={submitting}>
                {submitting && submitMode === 'draft' ? 'Saving…' : 'Save as Draft'}
              </button>
              <button className="btn-primary" onClick={() => handleSubmit('active')} disabled={submitting}>
                {submitting && submitMode === 'active' ? 'Creating…' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
