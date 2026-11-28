import { useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useModals } from '../../context/ModalContext';
import { formatAnswerLabel } from '../../data/teamRoles';

const APP_STATUSES = [
  { value: 'new', label: 'New', color: '#0fb5ad' },
  { value: 'reviewing', label: 'Reviewing', color: '#0284c7' },
  { value: 'contacted', label: 'Contacted', color: '#7c3aed' },
  { value: 'closed', label: 'Closed', color: '#64748b' },
];

const STATUS_MAP = Object.fromEntries(APP_STATUSES.map((s) => [s.value, s]));

function escapeCsv(val) {
  const s = val == null ? '' : String(val);
  return `"${s.replace(/"/g, '""')}"`;
}

function formatAnswerValue(val) {
  if (Array.isArray(val)) return val.join(', ');
  if (val == null) return '—';
  return String(val);
}

export default function ApplicationsInbox({ applications, onUpdated }) {
  const { showToast } = useModals();
  const [statusTab, setStatusTab] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const selectedApp = useMemo(
    () => applications.find((a) => a.id === selectedId) || null,
    [applications, selectedId]
  );

  const statusCounts = useMemo(() => {
    const counts = { all: applications.length };
    APP_STATUSES.forEach((s) => {
      counts[s.value] = 0;
    });
    applications.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return counts;
  }, [applications]);

  const roleOptions = useMemo(
    () => [...new Set(applications.map((a) => a.role).filter(Boolean))].sort(),
    [applications]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((a) => {
      if (statusTab !== 'all' && a.status !== statusTab) return false;
      if (roleFilter !== 'all' && a.role !== roleFilter) return false;
      if (q) {
        const answersText = a.answers ? JSON.stringify(a.answers) : '';
        const hay = `${a.full_name || ''} ${a.email || ''} ${a.city || ''} ${a.role || ''} ${a.note || ''} ${answersText}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [applications, statusTab, roleFilter, query]);

  const handleStatusChange = async (appId, nextStatus) => {
    if (!supabase) return;
    setUpdatingId(appId);
    const { error } = await supabase
      .from('job_applications')
      .update({ status: nextStatus })
      .eq('id', appId);
    setUpdatingId(null);
    if (error) {
      showToast(error.message || 'Could not update status');
      return;
    }
    showToast(`Application marked ${nextStatus}`);
    onUpdated?.();
  };

  const exportCsv = () => {
    const headers = [
      'Date',
      'Name',
      'Email',
      'Phone',
      'City',
      'Role',
      'Portfolio URL',
      'Answers',
      'Note',
      'Status',
    ];
    const rows = filtered.map((a) => [
      a.created_at ? new Date(a.created_at).toISOString() : '',
      a.full_name || '',
      a.email || '',
      a.phone || '',
      a.city || '',
      a.role || '',
      a.portfolio_url || '',
      a.answers && Object.keys(a.answers).length > 0 ? JSON.stringify(a.answers) : '',
      a.note || '',
      a.status || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlabts-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const answerEntries =
    selectedApp?.answers && typeof selectedApp.answers === 'object'
      ? Object.entries(selectedApp.answers).filter(([, v]) =>
          Array.isArray(v) ? v.length > 0 : String(v ?? '').trim() !== ''
        )
      : [];

  return (
    <>
      <div className="adm-tabs">
        <button
          type="button"
          className={`adm-tab ${statusTab === 'all' ? 'on' : ''}`}
          onClick={() => setStatusTab('all')}
        >
          All <span>({statusCounts.all})</span>
        </button>
        {APP_STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            className={`adm-tab ${statusTab === s.value ? 'on' : ''}`}
            onClick={() => setStatusTab(s.value)}
          >
            {s.label} <span>({statusCounts[s.value] || 0})</span>
          </button>
        ))}
      </div>

      <div className="adm-filters glass">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search applicant name, email, city, role…"
          aria-label="Search applications"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          aria-label="Filter by role"
        >
          <option value="all">All roles</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-neu"
          onClick={exportCsv}
          style={{ padding: '10px 16px', fontSize: '0.8rem' }}
        >
          Export CSV
        </button>
      </div>

      <div className="adm-table-wrap glass">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Applicant</th>
              <th>Role</th>
              <th>Role Details / Note</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: '28px' }}>
                  No applications match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((a) => {
                const st = STATUS_MAP[a.status] || { label: a.status, color: '#64748b' };
                const ansCount =
                  a.answers && typeof a.answers === 'object' ? Object.keys(a.answers).length : 0;
                return (
                  <tr key={a.id} onClick={() => setSelectedId(a.id)} style={{ cursor: 'pointer' }}>
                    <td>{a.created_at ? new Date(a.created_at).toLocaleDateString('en-IN') : '—'}</td>
                    <td>
                      <b>{a.full_name}</b>
                      <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{a.email}</div>
                      {(a.phone || a.city) && (
                        <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
                          {[a.phone, a.city].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="adm-pill" style={{ background: '#018087' }}>
                        {a.role}
                      </span>
                    </td>
                    <td style={{ maxWidth: '320px' }}>
                      {ansCount > 0 && (
                        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--deep)', marginBottom: '4px' }}>
                          {ansCount} role answer{ansCount > 1 ? 's' : ''} (click to view)
                        </div>
                      )}
                      {a.portfolio_url && (
                        <div style={{ marginBottom: a.note ? '4px' : 0 }}>
                          <a
                            href={a.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{ color: 'var(--deep)', fontWeight: 700, textDecoration: 'underline' }}
                          >
                            Profile / Portfolio ↗
                          </a>
                        </div>
                      )}
                      {a.note ? (
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'normal' }}>
                          {a.note}
                        </div>
                      ) : !a.portfolio_url && ansCount === 0 ? (
                        '—'
                      ) : null}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        aria-label={`Status for ${a.full_name}`}
                        value={a.status}
                        disabled={updatingId === a.id}
                        onChange={(e) => handleStatusChange(a.id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '10px',
                          border: `1.5px solid ${st.color}`,
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          color: 'var(--deep)',
                          background: '#fff',
                        }}
                      >
                        {APP_STATUSES.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedApp && (
        <div
          className="adm-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Application from ${selectedApp.full_name}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedId(null);
          }}
        >
          <div className="adm-drawer">
            <div className="adm-drawer-head">
              <div>
                <h2 style={{ fontSize: '1.15rem', margin: 0 }}>{selectedApp.full_name}</h2>
                <small style={{ color: 'var(--muted)' }}>
                  {selectedApp.role} ·{' '}
                  {selectedApp.created_at
                    ? new Date(selectedApp.created_at).toLocaleString('en-IN')
                    : ''}
                </small>
              </div>
              <button
                type="button"
                className="close"
                aria-label="Close application details"
                onClick={() => setSelectedId(null)}
              >
                ×
              </button>
            </div>

            <div className="adm-drawer-body">
              <div className="adm-card glass">
                <h4>Applicant Details</h4>
                <div className="adm-kv">
                  <div>
                    <small>Email</small>
                    <b>{selectedApp.email}</b>
                  </div>
                  <div>
                    <small>Phone</small>
                    <b>{selectedApp.phone || '—'}</b>
                  </div>
                  <div>
                    <small>City</small>
                    <b>{selectedApp.city || '—'}</b>
                  </div>
                  <div>
                    <small>Status</small>
                    <select
                      aria-label="Update applicant status"
                      value={selectedApp.status}
                      disabled={updatingId === selectedApp.id}
                      onChange={(e) => handleStatusChange(selectedApp.id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '10px',
                        border: '1.5px solid #0fb5ad',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        color: 'var(--deep)',
                        background: '#fff',
                      }}
                    >
                      {APP_STATUSES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {selectedApp.portfolio_url && (
                  <div style={{ marginTop: '12px' }}>
                    <a
                      href={selectedApp.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                    >
                      Open Profile / Portfolio ↗
                    </a>
                  </div>
                )}
              </div>

              <div className="adm-card glass">
                <h4>Role-Specific Answers ({selectedApp.role})</h4>
                {answerEntries.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>
                    No role-specific answers recorded.
                  </p>
                ) : (
                  <div className="adm-kv">
                    {answerEntries.map(([key, val]) => (
                      <div key={key}>
                        <small>{formatAnswerLabel(key)}</small>
                        {typeof val === 'string' && /^https?:\/\//i.test(val) ? (
                          <a
                            href={val}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--deep)', fontWeight: 700, textDecoration: 'underline', wordBreak: 'break-all' }}
                          >
                            {val}
                          </a>
                        ) : (
                          <b>{formatAnswerValue(val)}</b>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedApp.note && (
                <div className="adm-card glass">
                  <h4>Applicant Note</h4>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.55, margin: 0, color: 'var(--deep)' }}>
                    {selectedApp.note}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
