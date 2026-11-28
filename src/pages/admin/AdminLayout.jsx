import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useModals } from '../../context/ModalContext';
import Logo from '../../components/Logo';
import LeadsInbox from './LeadsInbox';
import ApplicationsInbox from './ApplicationsInbox';
import LeadDetailDrawer from './LeadDetailDrawer';
import InsightsView from './InsightsView';
import CatalogueManager from './CatalogueManager';
import StaffManager from './StaffManager';
import './Admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { showToast } = useModals();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [staffProfile, setStaffProfile] = useState(null);
  const [section, setSection] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [applications, setApplications] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const loadInbox = useCallback(async () => {
    if (!supabase) return;
    const [leadsRes, appsRes, staffRes] = await Promise.all([
      supabase
        .from('v_lead_inbox')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase.from('staff_profiles').select('*').order('full_name'),
    ]);
    if (leadsRes.data) setLeads(leadsRes.data);
    if (appsRes.data) setApplications(appsRes.data);
    if (staffRes.data) setStaffList(staffRes.data);
  }, []);

  useEffect(() => {
    if (!supabase) {
      navigate('/admin/login', { replace: true });
      return;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      const user = data?.session?.user;
      if (!user) {
        navigate('/admin/login', { replace: true });
        return;
      }
      const { data: staff } = await supabase
        .from('staff_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!staff) {
        await supabase.auth.signOut();
        navigate('/admin/login', { replace: true });
        return;
      }
      setStaffProfile(staff);
      setCheckingAuth(false);
      loadInbox();
    });
  }, [navigate, loadInbox]);

  useEffect(() => {
    if (!supabase || !staffProfile) return;

    const channel = supabase
      .channel('admin-leads-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        async (payload) => {
          const newId = payload.new?.id;
          let label = 'a visitor';
          if (newId) {
            const { data: row } = await supabase
              .from('v_lead_inbox')
              .select('full_name')
              .eq('id', newId)
              .maybeSingle();
            if (row?.full_name) label = row.full_name;
          }
          showToast(`New lead from ${label}`);
          loadInbox();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [staffProfile, loadInbox, showToast]);

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  if (checkingAuth) {
    return (
      <div className="adm-login-wrap">
        <Helmet>
          <title>Admin — AtLa/BTS</title>
          <meta name="robots" content="noindex,nofollow" />
        </Helmet>
        <p style={{ color: 'var(--muted)' }}>Verifying staff session…</p>
      </div>
    );
  }

  const newCount = leads.filter((l) => l.status === 'new').length;
  const newAppsCount = applications.filter((a) => a.status === 'new').length;
  const isAdmin = staffProfile?.role === 'admin';

  return (
    <div className="adm-shell">
      <Helmet>
        <title>Admin Dashboard — AtLa/BTS</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <aside className="adm-side glass">
        <div className="brand">
          <Logo />
          <div className="brand-txt">
            <b>AtLa/BTS</b>
            <span>Admin Console</span>
          </div>
        </div>

        <div className="adm-side-user">
          <b>{staffProfile.full_name}</b>
          <span>{staffProfile.role}</span>
        </div>

        <button
          type="button"
          className={`adm-nav-btn ${section === 'leads' ? 'on' : ''}`}
          onClick={() => setSection('leads')}
        >
          <span>Leads inbox</span>
          {newCount > 0 && <span className="adm-badge">{newCount}</span>}
        </button>

        <button
          type="button"
          className={`adm-nav-btn ${section === 'applications' ? 'on' : ''}`}
          onClick={() => setSection('applications')}
        >
          <span>Applications</span>
          {newAppsCount > 0 && <span className="adm-badge">{newAppsCount}</span>}
        </button>

        <button
          type="button"
          className={`adm-nav-btn ${section === 'insights' ? 'on' : ''}`}
          onClick={() => setSection('insights')}
        >
          <span>Insights</span>
        </button>

        {isAdmin && (
          <>
            <button
              type="button"
              className={`adm-nav-btn ${section === 'catalogue' ? 'on' : ''}`}
              onClick={() => setSection('catalogue')}
            >
              <span>Catalogue</span>
            </button>
            <button
              type="button"
              className={`adm-nav-btn ${section === 'staff' ? 'on' : ''}`}
              onClick={() => setSection('staff')}
            >
              <span>Staff</span>
            </button>
          </>
        )}

        <div className="adm-side-foot">
          <Link to="/" className="btn btn-neu" style={{ justifyContent: 'center', padding: '10px 14px', fontSize: '0.82rem' }}>
            View website
          </Link>
          <button
            type="button"
            className="btn btn-neu"
            style={{ justifyContent: 'center', padding: '10px 14px', fontSize: '0.82rem' }}
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="adm-main">
        <div className="adm-topbar glass">
          <h1>
            {section === 'leads' && 'Leads Inbox'}
            {section === 'applications' && 'Applications'}
            {section === 'insights' && 'Growth Insights'}
            {section === 'catalogue' && 'Catalogue Manager'}
            {section === 'staff' && 'Staff Access'}
          </h1>
          <button
            type="button"
            className="btn btn-neu"
            style={{ padding: '9px 16px', fontSize: '0.82rem' }}
            onClick={loadInbox}
          >
            Refresh
          </button>
        </div>

        {section === 'leads' && (
          <LeadsInbox
            leads={leads}
            staffList={staffList}
            onSelectLead={(id) => setSelectedLeadId(id)}
          />
        )}

        {section === 'applications' && (
          <ApplicationsInbox applications={applications} onUpdated={loadInbox} />
        )}

        {section === 'insights' && <InsightsView leads={leads} />}
        {section === 'catalogue' && isAdmin && <CatalogueManager />}
        {section === 'staff' && isAdmin && (
          <StaffManager staffList={staffList} onRefresh={loadInbox} />
        )}
      </main>

      {selectedLeadId && (
        <LeadDetailDrawer
          leadId={selectedLeadId}
          staffList={staffList}
          currentUserId={staffProfile.id}
          onClose={() => setSelectedLeadId(null)}
          onUpdated={loadInbox}
        />
      )}
    </div>
  );
}

