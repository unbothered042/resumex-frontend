import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const displayFont = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };

const SCORE_GOOD = '#8FAE7D';
const SCORE_MID = '#D4A657';
const SCORE_LOW = '#B0524B';

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12.5 9.5 18 20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M3 9.5 6 4h12l3 5.5M3 9.5v8a1.5 1.5 0 0 0 1.5 1.5h15A1.5 1.5 0 0 0 21 17.5v-8M3 9.5h5.5a.5.5 0 0 1 .5.5v1a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-1a.5.5 0 0 1 .5-.5H21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function History() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get('/history/');
      setAnalyses(res.data);
    } catch (err) {
      setError('Failed to load history.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await API.get(`/history/${id}/`);
      setSelectedAnalysis(res.data);
    } catch (err) {
      alert('Failed to load analysis.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this analysis?')) return;
    try {
      await API.delete(`/history/${id}/`);
      setAnalyses(analyses.filter((a) => a.id !== id));
      if (selectedAnalysis?.id === id) setSelectedAnalysis(null);
    } catch (err) {
      alert('Failed to delete analysis.');
    }
  };

  const handleDownload = async (id, type) => {
    try {
      const url = type === 'cv' ? `/history/${id}/download/` : `/history/${id}/download-cover-letter/`;
      const filename = type === 'cv' ? `CVX_CV_${id}.pdf` : `CVX_CoverLetter_${id}.pdf`;
      const res = await API.get(url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('No document available for this analysis.');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return SCORE_GOOD;
    if (score >= 50) return SCORE_MID;
    return SCORE_LOW;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <p className="text-[#9AA1B2] text-lg">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl mb-2" style={displayFont}>Analysis History</h1>
        <p className="text-[#9AA1B2] mb-10">All your past CV analyses in one place.</p>

        {error && (
          <div className="bg-[#3A1418] border border-[#7A2C33] text-[#E88A93] px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {analyses.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex justify-center text-[#5C6272] mb-4">
              <EmptyIcon />
            </div>
            <p className="text-[#9AA1B2] text-lg mb-6">No analyses yet.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-6 py-3 rounded-lg font-semibold transition"
            >
              Analyze Your First CV
            </button>
          </div>
        ) : (
          <div className={`grid ${selectedAnalysis ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
            <div className="flex flex-col gap-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="bg-[#0D121B] border rounded-xl p-6 cursor-pointer transition"
                  style={{ borderColor: selectedAnalysis?.id === analysis.id ? '#D4A657' : '#2A303C' }}
                  onClick={() => handleView(analysis.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-[#6C7386] text-sm">
                      {new Date(analysis.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <span className="text-2xl font-semibold" style={{ color: getScoreColor(analysis.match_score), ...displayFont }}>
                      {analysis.match_score}%
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {analysis.matched_skills.split(',').slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full text-xs border"
                        style={{ backgroundColor: `${SCORE_GOOD}1A`, borderColor: `${SCORE_GOOD}66`, color: SCORE_GOOD }}
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>

                  <p className="text-[#9AA1B2] text-sm mb-4 line-clamp-2">{analysis.summary}</p>

                  <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleView(analysis.id)}
                      className="border border-[#D4A657]/50 text-[#D4A657] hover:bg-[#D4A657]/10 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      View Details
                    </button>
                    {analysis.cv_rewrite_requested && analysis.rewritten_cv && (
                      <button
                        onClick={() => handleDownload(analysis.id, 'cv')}
                        className="border border-[#2A303C] hover:border-[#D4A657] px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      >
                        Download CV
                      </button>
                    )}
                    {analysis.cover_letter_requested && analysis.cover_letter && (
                      <button
                        onClick={() => handleDownload(analysis.id, 'cover-letter')}
                        className="border border-[#2A303C] hover:border-[#D4A657] px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      >
                        Download Cover Letter
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(analysis.id)}
                      className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      style={{ backgroundColor: `${SCORE_LOW}1A`, border: `1px solid ${SCORE_LOW}66`, color: SCORE_LOW }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedAnalysis && (
              <div className="bg-[#0D121B] border border-[#2A303C] rounded-xl p-6 h-fit sticky top-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold" style={displayFont}>Analysis Details</h2>
                  <button
                    onClick={() => setSelectedAnalysis(null)}
                    className="text-[#6C7386] hover:text-[#E7E5DF] transition"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div className="text-center mb-6">
                  <p className="text-5xl font-semibold" style={{ color: getScoreColor(selectedAnalysis.match_score), ...displayFont }}>
                    {selectedAnalysis.match_score}%
                  </p>
                  <p className="text-[#6C7386] text-sm mt-1">Match Score</p>
                </div>

                <div className="mb-4">
                  <p className="flex items-center gap-2 font-semibold mb-2" style={{ color: SCORE_GOOD }}>
                    <CheckIcon /> Matched Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnalysis.matched_skills.split(',').map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full text-xs border"
                        style={{ backgroundColor: `${SCORE_GOOD}1A`, borderColor: `${SCORE_GOOD}66`, color: SCORE_GOOD }}
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="flex items-center gap-2 font-semibold mb-2" style={{ color: SCORE_LOW }}>
                    <XIcon /> Missing Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnalysis.missing_skills.split(',').map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full text-xs border"
                        style={{ backgroundColor: `${SCORE_LOW}1A`, borderColor: `${SCORE_LOW}66`, color: SCORE_LOW }}
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="font-semibold mb-2 text-[#D4A657]">Improvement Tips</p>
                  <p className="text-[#C7CAD4] text-sm leading-relaxed">{selectedAnalysis.improvement_tips}</p>
                </div>

                <div className="mb-6">
                  <p className="font-semibold mb-2 text-[#D4A657]">Summary</p>
                  <p className="text-[#C7CAD4] text-sm leading-relaxed">{selectedAnalysis.summary}</p>
                </div>

                <div className="flex flex-col gap-2">
                  {selectedAnalysis.cv_rewrite_requested && selectedAnalysis.rewritten_cv && (
                    <button
                      onClick={() => handleDownload(selectedAnalysis.id, 'cv')}
                      className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Download New CV (PDF)
                    </button>
                  )}
                  {selectedAnalysis.cover_letter_requested && selectedAnalysis.cover_letter && (
                    <button
                      onClick={() => handleDownload(selectedAnalysis.id, 'cover-letter')}
                      className="border border-[#D4A657] text-[#D4A657] hover:bg-[#D4A657]/10 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Download Cover Letter (PDF)
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;