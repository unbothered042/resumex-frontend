import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const displayFont = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };

const PLAN_LABELS = { starter: 'Starter', plus: 'Plus', max: 'Max' };

function formatNGN(amount) {
  return `₦${Number(amount).toLocaleString('en-NG')}`;
}

function RevenueSummary() {
  const [revenue, setRevenue] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await API.get('/accounts/admin/revenue/');
        setRevenue(res.data);
      } catch (err) {
        setError('Failed to load revenue data.');
      }
    };
    fetchRevenue();
  }, []);

  if (error) {
    return (
      <div className="bg-[#3A1418] border border-[#7A2C33] text-[#E88A93] px-4 py-3 rounded-lg mb-8 text-sm">
        {error}
      </div>
    );
  }

  if (!revenue) {
    return <p className="text-[#9AA1B2] mb-8">Loading revenue...</p>;
  }

  const cards = [
    { label: 'Today', value: revenue.daily },
    { label: 'This Week', value: revenue.weekly },
    { label: 'This Month', value: revenue.monthly },
    { label: 'This Year', value: revenue.yearly },
  ];

  const chartData = revenue.trend.map((point) => ({
    date: new Date(point.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    revenue: point.revenue,
  }));

  return (
    <div className="mb-12">
      <h2 className="text-2xl mb-4" style={displayFont}>Revenue</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-[#0D121B] border border-[#2A303C] rounded-xl p-5">
            <p className="text-[#6C7386] text-xs uppercase tracking-wide mb-2">{card.label}</p>
            <p className="text-2xl font-semibold text-[#D4A657]">{formatNGN(card.value)}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0D121B] border border-[#2A303C] rounded-xl p-5">
        <p className="text-[#9AA1B2] text-sm mb-4">Last 30 days</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#161B24" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#6C7386" fontSize={12} tickMargin={8} />
            <YAxis stroke="#6C7386" fontSize={12} tickFormatter={(v) => `₦${v}`} />
            <Tooltip
              contentStyle={{ background: '#0A0E14', border: '1px solid #2A303C', borderRadius: 8 }}
              labelStyle={{ color: '#E7E5DF' }}
              formatter={(value) => [formatNGN(value), 'Revenue']}
            />
            <Line type="monotone" dataKey="revenue" stroke="#D4A657" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [grantingId, setGrantingId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({});

  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const isStaff = storedUser?.is_staff;

  useEffect(() => {
    if (isStaff) fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/accounts/admin/users/');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleGrant = async (userId) => {
    const plan = selectedPlan[userId] || 'starter';
    setGrantingId(userId);
    try {
      const res = await API.post('/accounts/admin/grant-plan/', { user_id: userId, plan });
      setUsers(users.map((u) => (u.id === userId ? res.data.user : u)));
    } catch (err) {
      alert('Failed to grant plan.');
    } finally {
      setGrantingId(null);
    }
  };

  // Not a staff user — don't even attempt the request, just redirect.
  if (!isStaff) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl mb-2" style={displayFont}>Admin — Users</h1>
        <p className="text-[#9AA1B2] mb-10">All registered CVX users.</p>

        <RevenueSummary />

        {error && (
          <div className="bg-[#3A1418] border border-[#7A2C33] text-[#E88A93] px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-[#9AA1B2]">Loading users...</p>
        ) : (
          <div className="overflow-x-auto border border-[#2A303C] rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0D121B] text-[#6C7386] uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Credits</th>
                  <th className="px-4 py-3">Free Used</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Grant Plan</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-[#161B24]">
                    <td className="px-4 py-3">{u.first_name} {u.last_name}</td>
                    <td className="px-4 py-3 text-[#9AA1B2]">{u.email}</td>
                    <td className="px-4 py-3 text-[#9AA1B2]">{u.phone}</td>
                    <td className="px-4 py-3 text-[#6C7386]">
                      {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">{u.analysis_credits}</td>
                    <td className="px-4 py-3">{u.free_analyses_used}/2</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs border border-[#D4A657]/40 text-[#D4A657] bg-[#D4A657]/10">
                        {u.plan_tier_label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 items-center">
                        <select
                          value={selectedPlan[u.id] || 'starter'}
                          onChange={(e) => setSelectedPlan({ ...selectedPlan, [u.id]: e.target.value })}
                          className="bg-[#0A0E14] border border-[#2A303C] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#D4A657]"
                        >
                          {Object.entries(PLAN_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleGrant(u.id)}
                          disabled={grantingId === u.id}
                          className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-3 py-1.5 rounded text-xs font-semibold transition disabled:opacity-50"
                        >
                          {grantingId === u.id ? 'Granting...' : 'Grant'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;