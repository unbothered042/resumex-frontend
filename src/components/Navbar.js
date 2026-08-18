import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('access_token'));

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
    <nav className="bg-[#0A0E14] text-[#E7E5DF] px-6 py-4 flex justify-between items-center border-b border-[#161B24]">
      <Link
        to="/"
        className="text-2xl font-semibold tracking-tight"
        style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif" }}
      >
        CV<span className="text-[#D4A657]">X</span>
      </Link>
      <div className="flex gap-6 items-center">
        {token ? (
          <>
            <Link to="/dashboard" className="text-sm text-[#9AA1B2] hover:text-[#D4A657] transition">
              Dashboard
            </Link>
            <Link to="/history" className="text-sm text-[#9AA1B2] hover:text-[#D4A657] transition">
              History
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm border border-[#2A303C] hover:border-[#D4A657] hover:text-[#D4A657] px-4 py-2 rounded transition"
            >
              Logout
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