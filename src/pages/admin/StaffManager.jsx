import { supabase } from '../../lib/supabase';
import { useModals } from '../../context/ModalContext';

export default function StaffManager({ staffList, onRefresh }) {
  const { showToast } = useModals();

  const handleRoleChange = async (id, role) => {
    const { error } = await supabase
      .from('staff_profiles')
      .update({ role })
      .eq('id', id);

    if (error) {
      showToast(error.message);
      return;
    }
    showToast('Staff role updated.');
    onRefresh();
  };

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div className="glass" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Adding a new staff member</h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--muted)' }}>
          1. In the Supabase Dashboard, open <b>Authentication → Users → Add user</b> and create the
          user with their email and password.
          <br />
          2. Run this SQL in the Supabase SQL Editor to grant access:
        </p>
        <pre
          style={{
            marginTop: '10px',
            padding: '12px',
            borderRadius: '12px',
            background: 'var(--bg)',
            boxShadow: 'var(--neu-in)',
            fontSize: '0.78rem',
            overflowX: 'auto',
          }}
        >
          {`insert into staff_profiles(id, full_name, role)\nselect id, 'Staff Name', 'sales' from auth.users where email = 'staff@atlabts.com';`}
        </pre>
      </div>

      <div className="adm-table-wrap glass">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Added</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((st) => (
              <tr key={st.id} style={{ cursor: 'default' }}>
                <td>
                  <b>{st.full_name}</b>
                </td>
                <td>
                  <select
                    value={st.role}
                    onChange={(e) => handleRoleChange(st.id, e.target.value)}
                    style={{
                      padding: '7px 10px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'var(--bg)',
                      boxShadow: 'var(--neu-in)',
                    }}
                    aria-label={`Role for ${st.full_name}`}
                  >
                    <option value="admin">admin</option>
                    <option value="sales">sales</option>
                    <option value="viewer">viewer</option>
                  </select>
                </td>
                <td>{st.created_at ? new Date(st.created_at).toLocaleDateString('en-IN') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

