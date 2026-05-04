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

  const handleDownload = async () => {
    try {
      const res = await API.get(`/history/${analysis.id}/download/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ResumeX_CV.pdf');
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

        {/* Match Score */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 mb-6 text-center">
          <p className="text-gray-400 mb-2 text-lg">Match Score</p>
          <p className={`text-7xl font-bold mb-4 ${getScoreColor(analysis.match_score)}`}>
            {analysis.match_score}%
          </p>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${getScoreBg(analysis.match_score)} transition-all`}
              style={{ width: `${analysis.match_score}%` }}
            />
          </div>
        </div>

        {/* Matched Skills */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-400">✓ Matched Skills</h2>
          <div className="flex flex-wrap gap-2">
            {analysis.matched_skills.split(',').map((skill, i) => (
              <span key={i} className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-3 py-1 rounded-full text-sm">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-red-400">✗ Missing Skills</h2>
          <div className="flex flex-wrap gap-2">
            {analysis.missing_skills.split(',').map((skill, i) => (
              <span key={i} className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-3 py-1 rounded-full text-sm">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Improvement Tips */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">💡 Improvement Tips</h2>
          <p className="text-gray-300 leading-relaxed">{analysis.improvement_tips}</p>
        </div>

        {/* Summary */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">📋 Summary</h2>
          <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
        </div>

        {/* Rewritten CV */}
        {analysis.cv_rewrite_requested && analysis.rewritten_cv && (
          <div className="bg-gray-900 border border-blue-500 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">✍️ Rewritten CV Ready</h2>
            <p className="text-gray-400 mb-4">Your AI-rewritten CV is ready for download.</p>
            <button
              onClick={handleDownload}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition"
            >
              Download Rewritten CV (PDF)
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 mt-4">
          <Link
            to="/dashboard"
            className="flex-1 text-center bg-gray-800 hover:bg-gray-700 py-3 rounded-xl font-semibold transition"
          >
            Analyze Another CV
          </Link>
          <Link
            to="/history"
            className="flex-1 text-center bg-gray-800 hover:bg-gray-700 py-3 rounded-xl font-semibold transition"
          >
            View History
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Results;