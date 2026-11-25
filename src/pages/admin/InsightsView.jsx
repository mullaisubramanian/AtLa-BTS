import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { supabase } from '../../lib/supabase';
import { LEAD_SOURCES, LEAD_STATUSES } from '../../data/options';

function startOfWeekLabel(iso) {
  const d = new Date(iso);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

export default function InsightsView({ leads }) {
  const [topics, setTopics] = useState([]);
  const [latestQuestions, setLatestQuestions] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    Promise.all([
      supabase.from('v_top_ask_atla_topics').select('*'),
      supabase
        .from('ask_atla_messages')
        .select('id, content, matched_practice_id, clicked_item, created_at')
        .eq('role', 'user')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase.from('v_popular_cocktail_items').select('*').limit(18),
      supabase
        .from('site_events')
        .select('event_name, created_at')
        .order('created_at', { ascending: false })
        .limit(1000),
    ]).then(([topicsRes, qRes, popRes, evRes]) => {
      if (cancelled) return;
      setTopics(topicsRes.data || []);
      setLatestQuestions(qRes.data || []);
      setPopularItems(popRes.data || []);
      setEvents(evRes.data || []);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const leadsPerWeekBySource = useMemo(() => {
    const map = {};
    leads.forEach((l) => {
      if (!l.created_at) return;
      const wk = startOfWeekLabel(l.created_at);
      if (!map[wk]) map[wk] = { week: wk };
      map[wk][l.source] = (map[wk][l.source] || 0) + 1;
    });
    return Object.values(map).sort((a, b) => a.week.localeCompare(b.week));
  }, [leads]);

  const funnelData = useMemo(() => {
    const counts = {};
    leads.forEach((l) => {
      counts[l.status] = (counts[l.status] || 0) + 1;
    });
    return LEAD_STATUSES.filter((s) => s.value !== 'spam').map((s) => ({
      status: s.label,
      count: counts[s.value] || 0,
    }));
  }, [leads]);

  const eventsPerDay = useMemo(() => {
    const map = {};
    events.forEach((ev) => {
      const day = ev.created_at?.slice(0, 10);
      if (!day) return;
      map[day] = (map[day] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([day, count]) => ({ day, count }));
  }, [events]);

  if (loading) {
    return <p style={{ color: 'var(--muted)' }}>Loading insights…</p>;
  }

  return (
    <div style={{ display: 'grid', gap: '18px' }}>
      <div className="adm-charts-grid">
        <div className="adm-chart-box glass">
          <h3>Leads per week by source</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={leadsPerWeekBySource}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(8,81,77,0.1)" />
              <XAxis dataKey="week" fontSize={11} />
              <YAxis allowDecimals={false} fontSize={11} />
              <Tooltip />
              <Legend />
              {LEAD_SOURCES.map((s) => (
                <Bar
                  key={s.value}
                  dataKey={s.value}
                  name={s.label}
                  stackId="src"
                  fill={s.color}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="adm-chart-box glass">
          <h3>Conversion funnel by status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={funnelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(8,81,77,0.1)" />
              <XAxis dataKey="status" fontSize={11} />
              <YAxis allowDecimals={false} fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" name="Leads" fill="#0fb5ad" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="adm-chart-box glass">
          <h3>Most-selected cocktail items</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={popularItems} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(8,81,77,0.1)" />
              <XAxis type="number" allowDecimals={false} fontSize={11} />
              <YAxis
                type="category"
                dataKey="name_snapshot"
                width={150}
                fontSize={11}
              />
              <Tooltip />
              <Bar dataKey="times_selected" name="Selected" fill="#6366f1" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="adm-chart-box glass">
          <h3>Site events per day (last 14 days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={eventsPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(8,81,77,0.1)" />
              <XAxis dataKey="day" fontSize={11} />
              <YAxis allowDecimals={false} fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" name="Events" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="adm-charts-grid">
        <div className="adm-chart-box glass">
          <h3>Top Ask ATLA topics</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {topics.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '0.84rem' }}>No questions logged yet.</p>
            ) : (
              topics.map((t, i) => (
                <div
                  key={`${t.matched_practice_id || 'general'}-${i}`}
                  className="adm-act-item"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <b>{t.matched_practice_id || 'General / Unmatched'}</b>
                  <span>{t.questions} questions</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="adm-chart-box glass">
          <h3>Latest 50 Ask ATLA questions</h3>
          <div style={{ maxHeight: '300px', overflow: 'auto', display: 'grid', gap: '8px' }}>
            {latestQuestions.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '0.84rem' }}>No questions logged yet.</p>
            ) : (
              latestQuestions.map((q) => (
                <div key={q.id} className="adm-act-item">
                  <small>
                    {q.matched_practice_id || 'general'} ·{' '}
                    {new Date(q.created_at).toLocaleString('en-IN')}
                  </small>
                  <div>{q.content}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

