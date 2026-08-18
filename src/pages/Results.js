import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const displayFont = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12.5 9.5 18 20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const SCORE_GOOD = '#8FAE7D';
const SCORE_MID = '#D4A657';
const SCORE_LOW = '#B0524B';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;
  const token = localStorage.getItem('access_token');

  if (!analysis) {
    navigate('/dashboard');
    return null;
  }

  const handleDownload = async (type) => {
    try {
      const url = type === 'cv' ? `/history/${analysis.id}/download/` : `/history/${analysis.id}/download-cover-letter/`;
      const filename = type === 'cv' ? 'CVX_Rewritten_CV.pdf' : 'CVX_Cover_Letter.pdf';
      const res = await API.get(url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download PDF.');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return SCORE_GOOD;
    if (score >= 50) return SCORE_MID;
    return SCORE_LOW;
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl mb-2" style={displayFont}>Analysis Results</h1>
        <p className="text-[#9AA1B2] mb-10">Here's how your CV matches the job description.</p>

        <div className="bg-[#0D121B] border border-[#2A303C] rounded-xl p-8 mb-6 text-center">
          <p className="text-[#9AA1B2] mb-2 text-sm tracking-[0.15em] uppercase">Match Score</p>
          <p className="text-7xl font-semibold mb-4" style={{ color: getScoreColor(analysis.match_score), ...displayFont }}>
            {analysis.match_score}%
          </p>
          <div className="w-full bg-[#161B24] rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${analysis.match_score}%`, backgroundColor: getScoreColor(analysis.match_score) }}
            />
          </div>
        </div>

        <div className="bg-[#0D121B] border border-[#2A303C] rounded-xl p-6 mb-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4" style={{ color: SCORE_GOOD }}>
            <CheckIcon /> Matched Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {analysis.matched_skills.split(',').map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm border"
                style={{ backgroundColor: `${SCORE_GOOD}1A`, borderColor: `${SCORE_GOOD}66`, color: SCORE_GOOD }}
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#0D121B] border border-[#2A303C] rounded-xl p-6 mb-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4" style={{ color: SCORE_LOW }}>
            <XIcon /> Missing Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {analysis.missing_skills.split(',').map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm border"
                style={{ backgroundColor: `${SCORE_LOW}1A`, borderColor: `${SCORE_LOW}66`, color: SCORE_LOW }}
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#0D121B] border border-[#2A303C] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-[#D4A657]">Improvement Tips</h2>
          <p className="text-[#C7CAD4] leading-relaxed">{analysis.improvement_tips}</p>
        </div>

        <div className="bg-[#0D121B] border border-[#2A303C] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-[#D4A657]">Summary</h2>
          <p className="text-[#C7CAD4] leading-relaxed">{analysis.summary}</p>
        </div>

        {analysis.cv_rewrite_requested && analysis.rewritten_cv && (
          <div className="bg-[#0D121B] border border-[#D4A657]/40 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-3 text-[#D4A657]">New CV Ready</h2>
            <p className="text-[#9AA1B2] mb-4">Your newly written CV tailored to this role is ready.</p>
            <button
              onClick={() => handleDownload('cv')}
              className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-6 py-3 rounded-lg font-semibold transition"
            >
              Download New CV (PDF)
            </button>
          </div>
        )}

        {analysis.cover_letter_requested && analysis.cover_letter && (
          <div className="bg-[#0D121B] border border-[#D4A657]/40 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-3 text-[#D4A657]">Cover Letter Ready</h2>
            <p className="text-[#9AA1B2] mb-4">Your newly generated cover letter for this role is ready.</p>
            <button
              onClick={() => handleDownload('cover-letter')}
              className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-6 py-3 rounded-lg font-semibold transition"
            >
              Download Cover Letter (PDF)
            </button>
          </div>
        )}

        {analysis.guest && (
          <div className="bg-[#0D121B] border border-[#2A303C] rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-3 text-[#D4A657]">Want more from CVX?</h2>
            <p className="text-[#9AA1B2] mb-4">Create a free account to unlock:</p>
            <ul className="text-[#C7CAD4] text-sm mb-5 space-y-2">
              <li>A new CV tailored to this job (PDF)</li>
              <li>A new cover letter for this role (PDF)</li>
              <li>Analysis history and access to all past analyses</li>
            </ul>
            <div className="flex gap-3">
              <Link
                to="/register"
                className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-6 py-3 rounded-lg font-semibold transition"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="border border-[#2A303C] hover:border-[#D4A657] hover:text-[#D4A657] px-6 py-3 rounded-lg font-semibold transition"
              >
                Login
              </Link>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-4">
          <Link
            to="/dashboard"
            className="flex-1 text-center border border-[#2A303C] hover:border-[#D4A657] hover:text-[#D4A657] py-3 rounded-xl font-semibold transition"
          >
            Analyze Another CV
          </Link>
          {token && (
            <Link
              to="/history"
              className="flex-1 text-center border border-[#2A303C] hover:border-[#D4A657] hover:text-[#D4A657] py-3 rounded-xl font-semibold transition"
            >
              View History
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Results;