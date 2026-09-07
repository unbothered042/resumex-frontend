import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const displayFont = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/accounts/forgot-password/', { email });
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
      <Navbar />
      <div className="flex items-center justify-center px-6 py-16">
        <div className="bg-[#0D121B] border border-[#2A303C] p-8 rounded-xl w-full max-w-md">
          <h2 className="text-3xl mb-2 text-center" style={displayFont}>Forgot Password</h2>
          <p className="text-[#9AA1B2] text-center mb-8">
            Enter your email and we'll send you a reset code
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0A0E14] border border-[#2A303C] rounded-lg px-4 py-3 text-[#E7E5DF] placeholder-[#5C6272] focus:outline-none focus:border-[#D4A657]"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>

          <p className="text-center text-[#9AA1B2] mt-6">
            Remembered your password?{' '}
            <Link to="/login" className="text-[#D4A657] hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;