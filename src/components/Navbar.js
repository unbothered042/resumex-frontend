import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cvxMark from '../assets/cvx-mark.png';

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function RebuildIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M21 12a9 9 0 1 1-2.64-6.36" strokeLinecap="round" />
      <path d="M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CreateIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function PlansIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 7h18M3 12h18M3 17h10" strokeLinecap="round" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3 4 6v6c0 4.5 3 7.5 8 9 5-1.5 8-4.5 8-9V6z" strokeLinejoin="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const isStaff = storedUser?.is_staff;

  useEffect(() => {
    setToken(localStorage.getItem('access_token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setToken(null);
    navigate('/login');
  };

  return (
    <nav className="bg-[#0A0E14] text-[#E7E5DF] px-4 sm:px-6 py-4 flex justify-between items-center border-b border-[#161B24]">
      <Link to="/">
        <img src={cvxMark} alt="CVX" className="h-8 w-auto" />
      </Link>
      <div className="flex gap-3 sm:gap-4 items-center">
        {token ? (
          <>
            <Link
              to="/dashboard"
              title="Dashboard"
              className="flex items-center gap-1.5 text-sm text-[#9AA1B2] hover:text-[#D4A657] transition"
            >
              <DashboardIcon />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              to="/rebuild"
              title="Rebuild"
              className="flex items-center gap-1.5 text-sm text-[#9AA1B2] hover:text-[#D4A657] transition"
            >
              <RebuildIcon />
              <span className="hidden sm:inline">Rebuild</span>
            </Link>
            <Link
              to="/create"
              title="Create"
              className="flex items-center gap-1.5 text-sm text-[#9AA1B2] hover:text-[#D4A657] transition"
            >
              <CreateIcon />
              <span className="hidden sm:inline">Create</span>
            </Link>
            <Link
              to="/history"
              title="History"
              className="text-[#9AA1B2] hover:text-[#D4A657] transition"
            >
              <HistoryIcon />
            </Link>
            <Link
              to="/plans"
              title="Plans"
              className="flex items-center gap-1.5 text-sm text-[#9AA1B2] hover:text-[#D4A657] transition"
            >
              <PlansIcon />
              <span className="hidden sm:inline">Plans</span>
            </Link>
            {isStaff && (
              <Link
                to="/admin/users"
                title="Admin"
                className="text-[#9AA1B2] hover:text-[#D4A657] transition"
              >
                <AdminIcon />
              </Link>
            )}
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-[#9AA1B2] hover:text-[#D4A657] border border-[#2A303C] hover:border-[#D4A657] p-2 rounded transition"
            >
              <LogoutIcon />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-[#9AA1B2] hover:text-[#D4A657] transition">
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-4 py-2 rounded font-semibold transition"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;