import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const displayFont = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    code: '',
    new_password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'code' ? value.replace(/\D/g, '').slice(0, 6) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/accounts/reset-password/', formData);
      navigate('/login', { state: { resetSuccess: true } });
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
      <Navbar />
      <div className="flex items-center justify-center px-6 py-16">
        <div className="bg-[#0D121B] border border-[#2A303C] p-8 rounded-xl w-full max-w-md">
          <h2 className="text-3xl mb-2 text-center" style={displayFont}>Reset Password</h2>
          <p className="text-[#9AA1B2] text-center mb-8">
            Enter the code sent to your email and choose a new password
          </p>

          {error && (
            <div className="bg-[#3A1418] border border-[#7A2C33] text-[#E88A93] px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-[#0A0E14] border border-[#2A303C] rounded-lg px-4 py-3 text-[#E7E5DF] placeholder-[#5C6272] focus:outline-none focus:border-[#D4A657]"
            />
            <input
              type="text"
              name="code"
              placeholder="6-digit code"
              value={formData.code}
              onChange={handleChange}
              required
              maxLength={6}
              inputMode="numeric"
              className="w-full bg-[#0A0E14] border border-[#2A303C] rounded-lg px-4 py-3 text-center tracking-[0.4em] text-[#E7E5DF] placeholder-[#5C6272] focus:outline-none focus:border-[#D4A657]"
            />
            <input
              type="password"
              name="new_password"
              placeholder="New Password"
              value={formData.new_password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full bg-[#0A0E14] border border-[#2A303C] rounded-lg px-4 py-3 text-[#E7E5DF] placeholder-[#5C6272] focus:outline-none focus:border-[#D4A657]"
            />
            <button
              type="submit"
              disabled={loading || formData.code.length !== 6}
              className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <p className="text-center text-[#9AA1B2] mt-6">
            <Link to="/forgot-password" className="text-[#D4A657] hover:underline">Didn't get a code? Request again</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;