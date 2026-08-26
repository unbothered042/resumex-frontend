import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const displayFont = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };

const LEVELS = [
  { key: 'entry', label: 'Entry Level' },
  { key: 'mid', label: 'Mid Level' },
  { key: 'senior', label: 'Senior Level' },
  { key: 'executive', label: 'Executive' },
];

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12.5 9.5 18 20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 15V3m0 0 4 4m-4-4L8 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cvFile, setCvFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [cvRewriteRequested, setCvRewriteRequested] = useState(false);
  const [coverLetterRequested, setCoverLetterRequested] = useState(false);
  const [level, setLevel] = useState('entry');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [requiresPurchase, setRequiresPurchase] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [profile, setProfile] = useState(null);

  const token = localStorage.getItem('access_token');
  const needsLevel = cvRewriteRequested || coverLetterRequested;
  const unlockedLevels = profile?.unlocked_levels || [];

  useEffect(() => {
    if (token) fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Paystack redirects back with ?reference=... — verify it once, then
  // strip the param so a page refresh doesn't try to re-verify.
  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    if (reference && token) {
      verifyPayment(reference);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/accounts/me/');
      setProfile(res.data);
    } catch (err) {
      // Non-fatal — form still works, just without the live credit display.
    }
  };

  const verifyPayment = async (reference) => {
    setVerifyingPayment(true);
    try {
      const res = await API.post('/payments/verify/', { reference });
      setPaymentMessage(res.data.message);
      await fetchProfile();
    } catch (err) {
      setPaymentMessage('Could not confirm your payment. If you were charged, contact support.');
    } finally {
      setVerifyingPayment(false);
      searchParams.delete('reference');
      searchParams.delete('trxref');
      searchParams.delete('payment');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRequiresAuth(false);
    setRequiresPurchase(false);

    try {
      const formData = new FormData();
      formData.append('cv_file', cvFile);
      formData.append('job_description', jobDescription);
      formData.append('cv_rewrite_requested', cvRewriteRequested.toString());
      formData.append('cover_letter_requested', coverLetterRequested.toString());
      if (needsLevel) formData.append('level', level);

      const res = await API.post('/analyze/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/results', { state: { analysis: res.data } });
    } catch (err) {
      if (err.response?.data?.requires_auth) {
        setRequiresAuth(true);
      } else if (err.response?.data?.requires_purchase || err.response?.data?.requires_upgrade) {
        setRequiresPurchase(true);
        setError(err.response.data.error);
      } else {
        setError('Analysis failed. Please check your CV and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="flex items-start justify-between mb-2 gap-4">
          <h1 className="text-4xl" style={displayFont}>Analyze Your CV</h1>
          {token && profile && (
            <div className="text-right shrink-0">
              <p className="text-sm text-[#9AA1B2]">
                {profile.free_analyses_remaining > 0
                  ? `${profile.free_analyses_remaining} free analyses left`
                  : `${profile.analysis_credits} credits`}
              </p>
              <Link to="/plans" className="text-xs text-[#D4A657] hover:underline">
                Buy more credits
              </Link>
            </div>
          )}
        </div>
        <p className="text-[#9AA1B2] mb-10">
          Start with a free CV analysis, no account required. Sign up to unlock tailored rewrites and cover letters.
        </p>

        {verifyingPayment && (
          <div className="bg-[#0D121B] border border-[#2A303C] text-[#9AA1B2] px-4 py-3 rounded mb-6 text-sm">
            Confirming your payment...
          </div>
        )}

        {paymentMessage && !verifyingPayment && (
          <div className="bg-[#0F1A12] border border-[#8FAE7D]/40 text-[#8FAE7D] px-4 py-3 rounded mb-6 text-sm">
            {paymentMessage}
          </div>
        )}

        {error && (
          <div className="bg-[#3A1418] border border-[#7A2C33] text-[#E88A93] px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        {requiresPurchase && (
          <div className="bg-[#1A1710] border border-[#D4A657]/40 text-[#E7E5DF] px-4 py-4 rounded mb-6">
            <p className="font-semibold mb-2">You're out of credits.</p>
            <p className="text-sm text-[#9AA1B2] mb-4">
              Top up a plan to keep analyzing, rewriting, and generating cover letters.
            </p>
            <Link
              to="/plans"
              className="inline-block bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-4 py-2 rounded text-sm font-semibold transition"
            >
              View Plans
            </Link>
          </div>
        )}

        {requiresAuth && (
          <div className="bg-[#1A1710] border border-[#D4A657]/40 text-[#E7E5DF] px-4 py-4 rounded mb-6">
            <p className="font-semibold mb-2">Create a free account to unlock this feature.</p>
            <p className="text-sm text-[#9AA1B2] mb-4">
              Create a free CVX account to unlock tailored CV rewrites, cover letters and saved results.
            </p>
            <div className="flex gap-3">
              <Link
                to="/register"
                className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-4 py-2 rounded text-sm font-semibold transition"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="border border-[#2A303C] hover:border-[#D4A657] hover:text-[#D4A657] px-4 py-2 rounded text-sm font-semibold transition"
              >
                Login
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-[#E7E5DF] font-semibold mb-2">Upload CV (PDF or Word)</label>
            <div className="border-2 border-dashed border-[#2A303C] rounded-xl p-8 text-center hover:border-[#D4A657] transition">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files[0])}
                required
                className="hidden"
                id="cv-upload"
              />
              <label htmlFor="cv-upload" className="cursor-pointer">
                {cvFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[#D4A657]"><CheckIcon /></span>
                    <p className="text-[#E7E5DF] font-semibold">{cvFile.name}</p>
                    <p className="text-[#6C7386] text-sm">Click to change file</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-[#6C7386]">
                    <UploadIcon />
                    <p className="text-[#E7E5DF] font-semibold">Click to upload your CV</p>
                    <p className="text-sm">PDF or Word documents</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[#E7E5DF] font-semibold mb-2">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
              rows={8}
              placeholder="Paste the full job description here..."
              className="w-full bg-[#0D121B] border border-[#2A303C] rounded-xl px-4 py-3 text-[#E7E5DF] placeholder-[#5C6272] focus:outline-none focus:border-[#D4A657] resize-none"
            />
          </div>

          <div className={`flex items-center gap-3 rounded-xl px-4 py-4 border transition ${token ? 'bg-[#0D121B] border-[#2A303C]' : 'bg-[#0D121B] border-[#161B24] opacity-60'}`}>
            <input
              type="checkbox"
              id="rewrite"
              checked={cvRewriteRequested}
              onChange={(e) => setCvRewriteRequested(e.target.checked)}
              disabled={!token}
              className="w-5 h-5 accent-[#D4A657]"
            />
            <label htmlFor="rewrite" className="cursor-pointer flex-1">
              <p className="font-semibold text-[#E7E5DF]">
                Generate Rewritten CV
                {!token && <span className="text-[#D4A657] text-xs ml-2">Requires account</span>}
              </p>
              <p className="text-[#9AA1B2] text-sm">Get a new CV to better match this job, downloadable as PDF (uses 1 credit)</p>
            </label>
          </div>

          <div className={`flex items-center gap-3 rounded-xl px-4 py-4 border transition ${token ? 'bg-[#0D121B] border-[#2A303C]' : 'bg-[#0D121B] border-[#161B24] opacity-60'}`}>
            <input
              type="checkbox"
              id="cover-letter"
              checked={coverLetterRequested}
              onChange={(e) => setCoverLetterRequested(e.target.checked)}
              disabled={!token}
              className="w-5 h-5 accent-[#D4A657]"
            />
            <label htmlFor="cover-letter" className="cursor-pointer flex-1">
              <p className="font-semibold text-[#E7E5DF]">
                Generate Cover Letter
                {!token && <span className="text-[#D4A657] text-xs ml-2">Requires account</span>}
              </p>
              <p className="text-[#9AA1B2] text-sm">Get a new tailored cover letter for this role, downloadable as PDF (uses 1 credit)</p>
            </label>
          </div>

          {needsLevel && token && (
            <div className="bg-[#0D121B] border border-[#2A303C] rounded-xl px-4 py-4">
              <label className="block text-[#E7E5DF] font-semibold mb-2">Seniority Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-[#0A0E14] border border-[#2A303C] rounded-lg px-4 py-2.5 text-[#E7E5DF] focus:outline-none focus:border-[#D4A657]"
              >
                {LEVELS.map((l) => (
                  <option key={l.key} value={l.key} disabled={profile && !unlockedLevels.includes(l.key)}>
                    {l.label}{profile && !unlockedLevels.includes(l.key) ? ' (upgrade to unlock)' : ''}
                  </option>
                ))}
              </select>
              {profile && !unlockedLevels.includes(level) && (
                <p className="text-xs text-[#D4A657] mt-2">
                  Your current plan doesn't include this level. <Link to="/plans" className="underline">Upgrade here</Link>.
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Analyzing your CV. This may take a moment.' : (
              <>
                Analyze My CV
                <ArrowIcon />
              </>
            )}
          </button>

          {!token && (
            <p className="text-center text-[#6C7386] text-sm">
              <Link to="/register" className="text-[#D4A657] hover:underline">Create a free account</Link>{' '}
              to unlock CV rewrite, cover letter, and analysis history.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Dashboard;