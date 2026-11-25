import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Logo from '../../components/Logo';
import './Admin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data?.session?.user;
      if (!user) return;
      const { data: staff } = await supabase
        .from('staff_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      if (staff) {
        navigate('/admin', { replace: true });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setErrorMsg('Supabase is not configured in environment variables.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data?.user) {
      setLoading(false);
      setErrorMsg(error?.message || 'Invalid login credentials.');
      return;
    }

    const { data: staff, error: staffErr } = await supabase
      .from('staff_profiles')
      .select('id, role')
      .eq('id', data.user.id)
      .maybeSingle();

    if (staffErr || !staff) {
      await supabase.auth.signOut();
      setLoading(false);
      setErrorMsg('Not authorised');
      return;
    }

    setLoading(false);
    navigate('/admin', { replace: true });
  };

  return (
    <div className="adm-login-wrap">
      <Helmet>
        <title>Admin Login — ATLABTS</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="adm-login-card glass">
        <div className="adm-login-brand">
          <Logo />
          <div>
            <b>ATLABTS Admin</b>
            <span>Private Growth &amp; CRM Console</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="adm-login-form">
          <div className="field">
            <label htmlFor="adm-email">Work email</label>
            <input
              id="adm-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@atlabts.com"
            />
          </div>
          <div className="field">
            <label htmlFor="adm-pass">Password</label>
            <input
              id="adm-pass"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <div className="qe-error" role="alert">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in to Admin →'}
          </button>
        </form>

        <Link to="/" className="adm-back-link">
          ← Back to public website
        </Link>
      </div>
    </div>
  );
}

