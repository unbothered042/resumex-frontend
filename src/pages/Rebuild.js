import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const displayFont = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };

const LEVELS = [
  { key: 'entry', label: 'Entry Level' },
  { key: 'mid', label: 'Mid Level' },
  { key: 'senior', label: 'Senior Level' },
  { key: 'executive', label: 'Executive' },
];

function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 15V3m0 0 4 4m-4-4L8 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12.5 9.5 18 20 6" strokeLinecap="round" strokeLinejoin="round" />
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

function Rebuild() {
  const [cvFile, setCvFile] = useState(null);
  const [level, setLevel] = useState('entry');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requiresPurchase, setRequiresPurchase] = useState(false);
  const [requiresUpgrade, setRequiresUpgrade] = useState(false);
  const [profile, setProfile] = useState(null);
  const [result, setResult] = useState(null);

  const token = localStorage.getItem('access_token');
  const unlockedLevels = profile?.unlocked_levels || [];

  useEffect(() => {
    if (token) fetchProfile();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRequiresPurchase(false);
    setRequiresUpgrade(false);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('cv_file', cvFile);
      formData.append('level', level);

      const res = await API.post('/rebuild/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(res.data);
      setProfile((prev) => (prev ? { ...prev, analysis_credits: res.data.analysis_credits } : prev));
    } catch (err) {
      if (err.response?.data?.requires_purchase) {
        setRequiresPurchase(true);
        setError(err.response.data.error);
      } else if (err.response?.data?.requires_upgrade) {
        setRequiresUpgrade(true);
        setError(err.response.data.error);
      } else {
        setError('Rebuild failed. Please check your CV and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await API.get(`/rebuild/${result.id}/download/`, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', 'CVX_Rebuilt_CV.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download PDF.');
    }
  };

  const resetForm = () => {
    setCvFile(null);
    setResult(null);
    setError('');
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl mb-4" style={displayFont}>Rebuild Your CV</h1>
          <p className="text-[#9AA1B2] mb-8">Create a free account to turn your old CV into a polished, professional one.</p>
          <div className="flex justify-center gap-3">
            <Link to="/register" className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-6 py-3 rounded-lg font-semibold transition">
              Create Free Account
            </Link>
            <Link to="/login" className="border border-[#2A303C] hover:border-[#D4A657] hover:text-[#D4A657] px-6 py-3 rounded-lg font-semibold transition">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="flex items-start justify-between mb-2 gap-4">
          <h1 className="text-4xl" style={displayFont}>Rebuild Your CV</h1>
          {profile && (
            <div className="text-right shrink-0">
              <p className="text-sm text-[#9AA1B2]">{profile.analysis_credits} credits</p>
              <Link to="/plans" className="text-xs text-[#D4A657] hover:underline">
                Buy more credits
              </Link>
            </div>
          )}
        </div>
        <p className="text-[#9AA1B2] mb-10">
          Upload your current CV and get back a polished, professional version, no job description needed.
        </p>

        {error && (
          <div className="bg-[#3A1418] border border-[#7A2C33] text-[#E88A93] px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        {requiresPurchase && (
          <div className="bg-[#1A1710] border border-[#D4A657]/40 text-[#E7E5DF] px-4 py-4 rounded mb-6">
            <p className="font-semibold mb-2">You're out of credits.</p>
            <p className="text-sm text-[#9AA1B2] mb-4">Top up a plan to rebuild your CV.</p>
            <Link to="/plans" className="inline-block bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-4 py-2 rounded text-sm font-semibold transition">
              View Plans
            </Link>
          </div>
        )}

        {requiresUpgrade && (
          <div className="bg-[#1A1710] border border-[#D4A657]/40 text-[#E7E5DF] px-4 py-4 rounded mb-6">
            <p className="font-semibold mb-2">This level isn't included in your plan.</p>
            <p className="text-sm text-[#9AA1B2] mb-4">Upgrade to unlock this seniority level.</p>
            <Link to="/plans" className="inline-block bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-4 py-2 rounded text-sm font-semibold transition">
              View Plans
            </Link>
          </div>
        )}

        {result ? (
          <div className="bg-[#0D121B] border border-[#D4A657]/40 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-3 text-[#D4A657]">Your Rebuilt CV Is Ready</h2>
            <p className="text-[#9AA1B2] mb-4">A polished, professional version of your CV is ready to download.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-6 py-3 rounded-lg font-semibold transition"
              >
                Download New CV (PDF)
              </button>
              <button
                onClick={resetForm}
                className="border border-[#2A303C] hover:border-[#D4A657] hover:text-[#D4A657] px-6 py-3 rounded-lg font-semibold transition"
              >
                Rebuild Another CV
              </button>
            </div>
          </div>
        ) : (
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
                  id="rebuild-cv-upload"
                />
                <label htmlFor="rebuild-cv-upload" className="cursor-pointer">
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

            <button
              type="submit"
              disabled={loading}
              className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Rebuilding your CV. This may take a moment.' : (
                <>
                  Rebuild My CV
                  <ArrowIcon />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Rebuild;