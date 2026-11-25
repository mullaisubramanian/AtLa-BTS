import { useMemo, useState } from 'react';
import { fmt } from '../../lib/format';
import { BUDGET_RANGES, LEAD_SOURCES, LEAD_STATUSES } from '../../data/options';

const SOURCE_MAP = Object.fromEntries(LEAD_SOURCES.map((s) => [s.value, s]));
const STATUS_MAP = Object.fromEntries(LEAD_STATUSES.map((s) => [s.value, s]));
const BUDGET_MAP = Object.fromEntries(BUDGET_RANGES.map((b) => [b.value, b.label]));

function escapeCsv(val) {
  const s = val == null ? '' : String(val);
  return `"${s.replace(/"/g, '""')}"`;
}

export default function LeadsInbox({ leads, staffList, onSelectLead }) {
  const [statusTab, setStatusTab] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [assignedFilter, setAssignedFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [query, setQuery] = useState('');

  const statusCounts = useMemo(() => {
    const counts = { all: leads.length };
    LEAD_STATUSES.forEach((s) => {
      counts[s.value] = 0;
    });
    leads.forEach((l) => {
      counts[l.status] = (counts[l.status] || 0) + 1;
    });
    return counts;
  }, [leads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusTab !== 'all' && l.status !== statusTab) return false;
      if (sourceFilter !== 'all' && l.source !== sourceFilter) return false;
      if (assignedFilter !== 'all' && (l.assigned_to_name || 'unassigned') !== assignedFilter) {
        return false;
      }
      if (dateFrom && l.created_at && l.created_at.slice(0, 10) < dateFrom) return false;
      if (dateTo && l.created_at && l.created_at.slice(0, 10) > dateTo) return false;
      if (q) {
        const hay = `${l.full_name || ''} ${l.phone || ''} ${l.company || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, statusTab, sourceFilter, assignedFilter, dateFrom, dateTo, query]);

  const exportCsv = () => {
    const headers = [
      'Date',
      'Name',
      'Phone',
      'Email',
      'Company',
      'Source',
      'Package',
      'Cocktail Total',
      'Budget',
      'Status',
      'Assigned To',
      'Next Follow-up',
    ];
    const rows = filtered.map((l) => [
      l.created_at ? new Date(l.created_at).toISOString() : '',
      l.full_name || '',
      l.phone || '',
      l.email || '',
      l.company || '',
      l.source || '',
      l.package_id || (l.is_custom_cocktail ? 'Custom Cocktail' : ''),
      l.cocktail_total || '',
      BUDGET_MAP[l.budget] || l.budget || '',
      l.status || '',
      l.assigned_to_name || '',
      l.next_follow_up || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlabts-leads-${new Date().toISOString().slice(0, 10)}.csv`;
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
        {LEAD_STATUSES.filter((s) => s.value !== 'spam').map((s) => (
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
          placeholder="Search name, phone, company…"
          aria-label="Search leads"
        />
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          aria-label="Filter by source"
        >
          <option value="all">All sources</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={assignedFilter}
          onChange={(e) => setAssignedFilter(e.target.value)}
          aria-label="Filter by staff"
        >
          <option value="all">All assignees</option>
          <option value="unassigned">Unassigned</option>
          {staffList.map((st) => (
            <option key={st.id} value={st.full_name}>
              {st.full_name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          aria-label="From date"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          aria-label="To date"
        />
        <button type="button" className="btn btn-neu" onClick={exportCsv} style={{ padding: '10px 16px', fontSize: '0.8rem' }}>
          Export CSV
        </button>
      </div>

      <div className="adm-table-wrap glass">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Company</th>
              <th>Source</th>
              <th>Package / Cocktail</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Assigned</th>
              <th>Next follow-up</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: 'var(--muted)', padding: '28px' }}>
                  No leads match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((l) => {
                const src = SOURCE_MAP[l.source] || { label: l.source, color: '#0fb5ad' };
                const st = STATUS_MAP[l.status] || { label: l.status, color: '#64748b' };
                return (
                  <tr key={l.id} onClick={() => onSelectLead(l.id)}>
                    <td>{l.created_at ? new Date(l.created_at).toLocaleDateString('en-IN') : '—'}</td>
                    <td>
                      <b>{l.full_name}</b>
                      <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{l.phone}</div>
                    </td>
                    <td>{l.company || '—'}</td>
                    <td>
                      <span className="adm-pill" style={{ background: src.color }}>
                        {src.label}
                      </span>
                    </td>
                    <td>
                      {l.package_id ? (
                        <b style={{ textTransform: 'capitalize' }}>{l.package_id}</b>
                      ) : l.cocktail_total ? (
                        <b>Cocktail · {fmt(l.cocktail_total)}</b>
                      ) : l.is_custom_cocktail ? (
                        'Custom Cocktail'
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>{BUDGET_MAP[l.budget] || l.budget || '—'}</td>
                    <td>
                      <span className="adm-pill" style={{ background: st.color }}>
                        {st.label}
                      </span>
                    </td>
                    <td>{l.assigned_to_name || 'Unassigned'}</td>
                    <td>
                      {l.next_follow_up
                        ? new Date(l.next_follow_up).toLocaleDateString('en-IN')
                        : '—'}
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

