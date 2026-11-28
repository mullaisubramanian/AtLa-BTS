import { useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useModals } from '../../context/ModalContext';

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

export default function ApplicationsInbox({ applications, onUpdated }) {
  const { showToast } = useModals();
  const [statusTab, setStatusTab] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

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
        const hay = `${a.full_name || ''} ${a.email || ''} ${a.role || ''} ${a.note || ''}`.toLowerCase();
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
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Role', 'Portfolio URL', 'Note', 'Status'];
    const rows = filtered.map((a) => [
      a.created_at ? new Date(a.created_at).toISOString() : '',
      a.full_name || '',
      a.email || '',
      a.phone || '',
      a.role || '',
      a.portfolio_url || '',
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
          placeholder="Search applicant name, email, note…"
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
              <th>Portfolio / Note</th>
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
                return (
                  <tr key={a.id}>
                    <td>{a.created_at ? new Date(a.created_at).toLocaleDateString('en-IN') : '—'}</td>
                    <td>
                      <b>{a.full_name}</b>
                      <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{a.email}</div>
                      {a.phone && (
                        <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{a.phone}</div>
                      )}
                    </td>
                    <td>
                      <span className="adm-pill" style={{ background: '#018087' }}>
                        {a.role}
                      </span>
                    </td>
                    <td style={{ maxWidth: '320px' }}>
                      {a.portfolio_url && (
                        <div style={{ marginBottom: a.note ? '4px' : 0 }}>
                          <a
                            href={a.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--deep)', fontWeight: 700, textDecoration: 'underline' }}
                          >
                            Portfolio link ↗
                          </a>
                        </div>
                      )}
                      {a.note ? (
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'normal' }}>
                          {a.note}
                        </div>
                      ) : !a.portfolio_url ? (
                        '—'
                      ) : null}
                    </td>
                    <td>
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
    </>
  );
}

