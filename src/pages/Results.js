import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;

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
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Analysis Results</h1>
        <p className="text-gray-400 mb-10">Here's how your CV matches the job description.</p>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 mb-6 text-center">
          <p className="text-gray-400 mb-2 text-lg">Match Score</p>
          <p className={`text-7xl font-bold mb-4 ${getScoreColor(analysis.match_score)}`}>{analysis.match_score}%</p>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div className={`h-3 rounded-full ${getScoreBg(analysis.match_score)} transition-all`} style={{ width: `${analysis.match_score}%` }} />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-400">✓ Matched Skills</h2>
          <div className="flex flex-wrap gap-2">
            {analysis.matched_skills.split(',').map((skill, i) => (
              <span key={i} className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-3 py-1 rounded-full text-sm">{skill.trim()}</span>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-red-400">✗ Missing Skills</h2>
          <div className="flex flex-wrap gap-2">
            {analysis.missing_skills.split(',').map((skill, i) => (
              <span key={i} className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-3 py-1 rounded-full text-sm">{skill.trim()}</span>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">Improvement Tips</h2>
          <p className="text-gray-300 leading-relaxed">{analysis.improvement_tips}</p>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">📋 Summary</h2>
          <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
        </div>

        {analysis.cv_rewrite_requested && analysis.rewritten_cv && (
          <div className="bg-gray-900 border border-blue-500 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">New CV Ready</h2>
            <p className="text-gray-400 mb-4">Your AI-rewritten CV tailored to this role is ready.</p>
            <button onClick={() => handleDownload('cv')} className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition">
              Download New CV (PDF)
            </button>
          </div>
        )}

        {analysis.cover_letter_requested && analysis.cover_letter && (
          <div className="bg-gray-900 border border-purple-500 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">📝 Cover Letter Ready</h2>
            <p className="text-gray-400 mb-4">Your new cover letter for this role is ready.</p>
            <button onClick={() => handleDownload('cover-letter')} className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold transition">
              Download Cover Letter (PDF)
            </button>
          </div>
        )}

        <div className="flex gap-4 mt-4">
          <Link to="/dashboard" className="flex-1 text-center bg-gray-800 hover:bg-gray-700 py-3 rounded-xl font-semibold transition">Analyze Another CV</Link>
          <Link to="/history" className="flex-1 text-center bg-gray-800 hover:bg-gray-700 py-3 rounded-xl font-semibold transition">View History</Link>
        </div>
      </div>
    </div>
  );
}

export default Results;