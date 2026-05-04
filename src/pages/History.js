import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function History() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this analysis?')) return;
    try {
      await API.delete(`/history/${id}/`);
      setAnalyses(analyses.filter((a) => a.id !== id));
    } catch (err) {
      alert('Failed to delete analysis.');
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await API.get(`/history/${id}/download/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ResumeX_CV_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('No rewritten CV available for this analysis.');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <p className="text-gray-400 text-xl">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Analysis History</h1>
        <p className="text-gray-400 mb-10">All your past CV analyses in one place.</p>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {analyses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-400 text-xl mb-6">No analyses yet.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition"
            >
              Analyze Your First CV
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {new Date(analysis.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`text-3xl font-bold ${getScoreColor(analysis.match_score)}`}>
                    {analysis.match_score}%
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Matched Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matched_skills.split(',').slice(0, 4).map((skill, i) => (
                      <span key={i} className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-2 py-1 rounded-full text-xs">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Missing Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing_skills.split(',').slice(0, 4).map((skill, i) => (
                      <span key={i} className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-2 py-1 rounded-full text-xs">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-6 line-clamp-2">{analysis.summary}</p>

                <div className="flex gap-3">
                  {analysis.cv_rewrite_requested && analysis.rewritten_cv && (
                    <button
                      onClick={() => handleDownload(analysis.id)}
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Download PDF
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(analysis.id)}
                    className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;