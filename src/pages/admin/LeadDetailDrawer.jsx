import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { fmt } from '../../lib/format';
import { BUDGET_RANGES, LEAD_STATUSES } from '../../data/options';

const BUDGET_MAP = Object.fromEntries(BUDGET_RANGES.map((b) => [b.value, b.label]));

export default function LeadDetailDrawer({
  leadId,
  staffList,
  currentUserId,
  onClose,
  onUpdated,
}) {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [status, setStatus] = useState('new');
  const [assignedTo, setAssignedTo] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [actType, setActType] = useState('note');
  const [actContent, setActContent] = useState('');
  const [saving, setSaving] = useState(false);

  const loadDetail = useCallback(async () => {
    if (!leadId || !supabase) return;
    setLoading(true);
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (!lead) {
      setLoading(false);
      return;
    }

    const [
      contactRes,
      companyRes,
      profileRes,
      quoteRes,
      quoteItemsRes,
      convRes,
      activitiesRes,
    ] = await Promise.all([
      lead.contact_id
        ? supabase.from('contacts').select('*').eq('id', lead.contact_id).maybeSingle()
        : Promise.resolve({ data: null }),
      lead.company_id
        ? supabase.from('companies').select('*').eq('id', lead.company_id).maybeSingle()
        : Promise.resolve({ data: null }),
      lead.company_id
        ? supabase
            .from('business_profiles')
            .select('*')
            .eq('company_id', lead.company_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      lead.cocktail_quote_id
        ? supabase
            .from('cocktail_quotes')
            .select('*')
            .eq('id', lead.cocktail_quote_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      lead.cocktail_quote_id
        ? supabase
            .from('cocktail_quote_items')
            .select('*')
            .eq('quote_id', lead.cocktail_quote_id)
        : Promise.resolve({ data: [] }),
      supabase
        .from('ask_atla_conversations')
        .select('*')
        .eq('lead_id', lead.id)
        .maybeSingle(),
      supabase
        .from('lead_activities')
        .select('*, staff_profiles(full_name)')
        .eq('lead_id', lead.id)
        .order('created_at', { ascending: false }),
    ]);

    let askMessages = [];
    if (convRes.data?.id) {
      const msgRes = await supabase
        .from('ask_atla_messages')
        .select('*')
        .eq('conversation_id', convRes.data.id)
        .order('created_at', { ascending: true });
      askMessages = msgRes.data || [];
    }

    setDetail({
      lead,
      contact: contactRes.data,
      company: companyRes.data,
      profile: profileRes.data,
      quote: quoteRes.data,
      quoteItems: quoteItemsRes.data || [],
      askConversation: convRes.data,
      askMessages,
      activities: activitiesRes.data || [],
    });
    setStatus(lead.status);
    setAssignedTo(lead.assigned_to || '');
    setNextFollowUp(lead.next_follow_up ? lead.next_follow_up.slice(0, 16) : '');
    setEstimatedValue(lead.estimated_value != null ? String(lead.estimated_value) : '');
    setLoading(false);
  }, [leadId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    setSaving(true);
    await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
    setSaving(false);
    await loadDetail();
    onUpdated?.();
  };

  const handleSaveMeta = async (e) => {
    e.preventDefault();
    setSaving(true);
    await supabase
      .from('leads')
      .update({
        assigned_to: assignedTo || null,
        next_follow_up: nextFollowUp ? new Date(nextFollowUp).toISOString() : null,
        estimated_value: estimatedValue ? Number(estimatedValue) : null,
      })
      .eq('id', leadId);
    setSaving(false);
    await loadDetail();
    onUpdated?.();
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!actContent.trim()) return;
    setSaving(true);
    await supabase.from('lead_activities').insert([
      {
        lead_id: leadId,
        staff_id: currentUserId,
        type: actType,
        content: actContent.trim(),
      },
    ]);
    setActContent('');
    setSaving(false);
    await loadDetail();
  };

  if (!leadId) return null;

  const { lead, contact, company, profile, quote, quoteItems, askMessages, activities } =
    detail || {};

  const waDigits = (contact?.whatsapp || contact?.phone || '').replace(/\D/g, '');

  return (
    <div
      className="adm-drawer-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Lead details"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="adm-drawer">
        <div className="adm-drawer-head">
          <div>
            <small style={{ color: 'var(--tq)', fontWeight: 800, fontSize: '0.7rem' }}>
              REF {String(leadId).slice(0, 8).toUpperCase()}
            </small>
            <h2 style={{ fontSize: '1.25rem' }}>{contact?.full_name || 'Lead Detail'}</h2>
          </div>
          <button type="button" className="close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="adm-drawer-body">
          {loading || !detail ? (
            <p style={{ color: 'var(--muted)' }}>Loading lead details…</p>
          ) : (
            <>
              {/* Status & assignment */}
              <div className="adm-card glass">
                <h4>Pipeline &amp; Assignment</h4>
                <div className="field" style={{ marginBottom: '10px' }}>
                  <label htmlFor="ld-status">Status</label>
                  <select
                    id="ld-status"
                    value={status}
                    disabled={saving}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <form onSubmit={handleSaveMeta} style={{ display: 'grid', gap: '10px' }}>
                  <div className="adm-kv">
                    <div className="field">
                      <label htmlFor="ld-assign">Assign to</label>
                      <select
                        id="ld-assign"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {staffList.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="ld-val">Estimated value (₹/mo)</label>
                      <input
                        id="ld-val"
                        type="number"
                        value={estimatedValue}
                        onChange={(e) => setEstimatedValue(e.target.value)}
                        placeholder="e.g. 65000"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="ld-fu">Next follow-up</label>
                    <input
                      id="ld-fu"
                      type="datetime-local"
                      value={nextFollowUp}
                      onChange={(e) => setNextFollowUp(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-neu" disabled={saving} style={{ padding: '9px 16px', fontSize: '0.82rem', justifySelf: 'start' }}>
                    Save pipeline details
                  </button>
                </form>
              </div>

              {/* Contact Card */}
              {contact && (
                <div className="adm-card glass">
                  <h4>Contact</h4>
                  <div className="adm-kv">
                    <div>
                      <small>Name</small>
                      <b>{contact.full_name}</b>
                    </div>
                    <div>
                      <small>Designation</small>
                      <b>{contact.designation || '—'}</b>
                    </div>
                    <div>
                      <small>Phone</small>
                      <b>{contact.phone}</b>
                    </div>
                    <div>
                      <small>Email</small>
                      <b>{contact.email || '—'}</b>
                    </div>
                  </div>
                  <div className="adm-actions-row">
                    <a className="btn btn-neu" href={`tel:${contact.phone}`}>
                      Call
                    </a>
                    {waDigits && (
                      <a
                        className="btn btn-primary"
                        href={`https://wa.me/${waDigits}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        WhatsApp
                      </a>
                    )}
                    {contact.email && (
                      <a className="btn btn-neu" href={`mailto:${contact.email}`}>
                        Email
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Company Card */}
              {company && (
                <div className="adm-card glass">
                  <h4>Company</h4>
                  <div className="adm-kv">
                    <div>
                      <small>Name</small>
                      <b>{company.name}</b>
                    </div>
                    <div>
                      <small>Industry</small>
                      <b>{company.industry || '—'}</b>
                    </div>
                    <div>
                      <small>Stage</small>
                      <b>{company.business_stage || '—'}</b>
                    </div>
                    <div>
                      <small>Team / Revenue</small>
                      <b>
                        {company.team_size || '—'} · {company.annual_revenue_range || '—'}
                      </b>
                    </div>
                    <div>
                      <small>Location</small>
                      <b>
                        {[company.city, company.state].filter(Boolean).join(', ') || '—'}
                      </b>
                    </div>
                  </div>
                  <div className="adm-actions-row">
                    {[
                      ['Website', company.website_url],
                      ['Instagram', company.instagram],
                      ['LinkedIn', company.linkedin],
                      ['Facebook', company.facebook],
                      ['YouTube', company.youtube],
                      ['Google Business', company.google_business_url],
                      ...(company.marketplace_links || []).map((u, idx) => [
                        `Marketplace ${idx + 1}`,
                        u,
                      ]),
                    ]
                      .filter(([, url]) => Boolean(url))
                      .map(([label, url]) => {
                        const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
                        return (
                          <a
                            key={`${label}-${url}`}
                            className="btn btn-neu"
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {label} ↗
                          </a>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Business Profile */}
              {profile && (
                <div className="adm-card glass">
                  <h4>Business Profile</h4>
                  <div className="adm-kv">
                    <div>
                      <small>Primary goals</small>
                      <b>{(profile.primary_goals || []).join(', ') || '—'}</b>
                    </div>
                    <div>
                      <small>Challenges</small>
                      <b>{(profile.biggest_challenges || []).join(', ') || '—'}</b>
                    </div>
                    <div>
                      <small>Target customers</small>
                      <b>{profile.target_customers || '—'}</b>
                    </div>
                    <div>
                      <small>Target locations</small>
                      <b>{(profile.target_locations || []).join(', ') || '—'}</b>
                    </div>
                    <div>
                      <small>Tools</small>
                      <b>{(profile.current_tools || []).join(', ') || '—'}</b>
                    </div>
                    <div>
                      <small>CRM / ERP</small>
                      <b>
                        CRM: {profile.has_crm ? 'Yes' : 'No'} · ERP:{' '}
                        {profile.has_erp ? 'Yes' : 'No'}
                      </b>
                    </div>
                    <div>
                      <small>Marketing spend</small>
                      <b>{profile.monthly_marketing_spend || '—'}</b>
                    </div>
                    <div>
                      <small>Decision timeline</small>
                      <b>{profile.decision_timeline || '—'}</b>
                    </div>
                  </div>
                </div>
              )}

              {/* Cocktail Quote */}
              {quote && (
                <div className="adm-card glass">
                  <h4>Service Cocktail Quote · {fmt(quote.total_monthly)}/mo</h4>
                  <ul style={{ listStyle: 'none', display: 'grid', gap: '6px' }}>
                    {quoteItems.map((qi) => (
                      <li
                        key={qi.cocktail_item_id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.84rem',
                        }}
                      >
                        <span>{qi.name_snapshot}</span>
                        <b>{fmt(qi.price_snapshot)}</b>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ask ATLA Conversation */}
              {askMessages?.length > 0 && (
                <div className="adm-card glass">
                  <h4>Ask ATLA Conversation</h4>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {askMessages.map((m) => (
                      <div key={m.id} className="adm-act-item">
                        <small>
                          {m.role.toUpperCase()}
                          {m.intent ? ` · ${m.intent}` : ''}
                          {m.clicked_item ? ` · Clicked: ${m.clicked_item}` : ''}
                        </small>
                        <div>{m.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message & UTM */}
              <div className="adm-card glass">
                <h4>Enquiry &amp; Attribution</h4>
                <div className="adm-kv">
                  <div>
                    <small>Source</small>
                    <b>{lead.source}</b>
                  </div>
                  <div>
                    <small>Budget</small>
                    <b>{BUDGET_MAP[lead.budget] || lead.budget || '—'}</b>
                  </div>
                  <div>
                    <small>Interests</small>
                    <b>{(lead.interests || []).join(', ') || '—'}</b>
                  </div>
                  <div>
                    <small>Page / Referrer</small>
                    <b>
                      {lead.page_path || '—'} · {lead.referrer || 'Direct'}
                    </b>
                  </div>
                  <div>
                    <small>UTM</small>
                    <b>
                      {[lead.utm_source, lead.utm_medium, lead.utm_campaign]
                        .filter(Boolean)
                        .join(' / ') || '—'}
                    </b>
                  </div>
                  <div>
                    <small>Free Audit</small>
                    <b>{lead.wants_free_audit ? 'Requested' : 'No'}</b>
                  </div>
                </div>
                {lead.message && (
                  <p style={{ marginTop: '10px', fontSize: '0.86rem', whiteSpace: 'pre-wrap' }}>
                    {lead.message}
                  </p>
                )}
              </div>

              {/* Activity Timeline */}
              <div className="adm-card glass">
                <h4>Activity Timeline</h4>
                <form onSubmit={handleAddActivity} style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      value={actType}
                      onChange={(e) => setActType(e.target.value)}
                      style={{
                        padding: '10px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'var(--bg)',
                        boxShadow: 'var(--neu-in)',
                      }}
                    >
                      <option value="note">Note</option>
                      <option value="call">Call</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="meeting">Meeting</option>
                    </select>
                    <input
                      value={actContent}
                      onChange={(e) => setActContent(e.target.value)}
                      placeholder="Log a note, call outcome or meeting summary…"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'var(--bg)',
                        boxShadow: 'var(--neu-in)',
                      }}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                      style={{ padding: '10px 16px', fontSize: '0.82rem' }}
                    >
                      Add
                    </button>
                  </div>
                </form>

                <div className="adm-timeline">
                  {activities.map((a) => (
                    <div key={a.id} className="adm-act-item">
                      <small>
                        {a.type} · {a.staff_profiles?.full_name || 'System'} ·{' '}
                        {new Date(a.created_at).toLocaleString('en-IN')}
                      </small>
                      <div>{a.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
