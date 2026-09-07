import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const displayFont = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await API.post('/accounts/verify-otp/', { email, code });
      navigate('/login', { state: { verified: true } });
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setMessage('');
    try {
      await API.post('/accounts/resend-otp/', { email });
      setMessage('A new code has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
      <Navbar />
      <div className="flex items-center justify-center px-6 py-16">
        <div className="bg-[#0D121B] border border-[#2A303C] p-8 rounded-xl w-full max-w-md">
          <h2 className="text-3xl mb-2 text-center" style={displayFont}>Verify Your Email</h2>
          <p className="text-[#9AA1B2] text-center mb-8">
            Enter the 6-digit code sent to <span className="text-[#E7E5DF]">{email}</span>
          </p>

          {error && (
            <div className="bg-[#3A1418] border border-[#7A2C33] text-[#E88A93] px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-[#132A1E] border border-[#2C7A4B] text-[#8AE8A0] px-4 py-3 rounded-lg mb-6 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="code"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              inputMode="numeric"
              className="w-full bg-[#0A0E14] border border-[#2A303C] rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] text-[#E7E5DF] placeholder-[#5C6272] focus:outline-none focus:border-[#D4A657]"
            />
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <p className="text-center text-[#9AA1B2] mt-6">
            Didn't get a code?{' '}
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-[#D4A657] hover:underline disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend code'}
            </button>
          </p>
          <p className="text-center text-[#9AA1B2] mt-2">
            <Link to="/login" className="text-[#D4A657] hover:underline">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;