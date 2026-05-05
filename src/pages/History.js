import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

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
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Analysis History</h1>
        <p className="text-gray-400 mb-10">All your past CV analyses in one place.</p>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">{error}</div>
        )}

        {analyses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-400 text-xl mb-6">No analyses yet.</p>
            <button onClick={() => navigate('/dashboard')} className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition">Analyze Your First CV</button>
          </div>
        ) : (
          <div className={`grid ${selectedAnalysis ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
            <div className="flex flex-col gap-4">
              {analyses.map((analysis) => (
                <div key={analysis.id} className={`bg-gray-900 border rounded-xl p-6 cursor-pointer transition ${selectedAnalysis?.id === analysis.id ? 'border-blue-500' : 'border-gray-700 hover:border-gray-500'}`} onClick={() => handleView(analysis.id)}>
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-gray-400 text-sm">
                      {new Date(analysis.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <span className={`text-2xl font-bold ${getScoreColor(analysis.match_score)}`}>{analysis.match_score}%</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {analysis.matched_skills.split(',').slice(0, 3).map((skill, i) => (
                      <span key={i} className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-2 py-1 rounded-full text-xs">{skill.trim()}</span>
                    ))}
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{analysis.summary}</p>

                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => handleView(analysis.id)} className="bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-xs font-semibold transition">View Details</button>
                    {analysis.cv_rewrite_requested && analysis.rewritten_cv && (
                      <button onClick={() => handleDownload(analysis.id, 'cv')} className="bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition">Download CV</button>
                    )}
                    {analysis.cover_letter_requested && analysis.cover_letter && (
                      <button onClick={() => handleDownload(analysis.id, 'cover-letter')} className="bg-purple-500 bg-opacity-20 border border-purple-500 text-purple-400 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-xs font-semibold transition">Download Cover Letter</button>
                    )}
                    <button onClick={() => handleDelete(analysis.id)} className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 hover:bg-opacity-30 px-3 py-1.5 rounded-lg text-xs font-semibold transition ml-auto">Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {selectedAnalysis && (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 h-fit sticky top-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Analysis Details</h2>
                  <button onClick={() => setSelectedAnalysis(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
                </div>

                <div className="text-center mb-6">
                  <p className={`text-5xl font-bold ${getScoreColor(selectedAnalysis.match_score)}`}>{selectedAnalysis.match_score}%</p>
                  <p className="text-gray-400 text-sm mt-1">Match Score</p>
                </div>

                <div className="mb-4">
                  <p className="text-green-400 font-semibold mb-2">✓ Matched Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnalysis.matched_skills.split(',').map((skill, i) => (
                      <span key={i} className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-2 py-1 rounded-full text-xs">{skill.trim()}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-red-400 font-semibold mb-2">✗ Missing Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnalysis.missing_skills.split(',').map((skill, i) => (
                      <span key={i} className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-2 py-1 rounded-full text-xs">{skill.trim()}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-blue-400 font-semibold mb-2"> Improvement Tips</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedAnalysis.improvement_tips}</p>
                </div>

                <div className="mb-6">
                  <p className="text-yellow-400 font-semibold mb-2">📋 Summary</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedAnalysis.summary}</p>
                </div>

                <div className="flex flex-col gap-2">
                  {selectedAnalysis.cv_rewrite_requested && selectedAnalysis.rewritten_cv && (
                    <button onClick={() => handleDownload(selectedAnalysis.id, 'cv')} className="bg-blue-500 hover:bg-blue-600 py-2 rounded-lg text-sm font-semibold transition">Download New CV (PDF)</button>
                  )}
                  {selectedAnalysis.cover_letter_requested && selectedAnalysis.cover_letter && (
                    <button onClick={() => handleDownload(selectedAnalysis.id, 'cover-letter')} className="bg-purple-500 hover:bg-purple-600 py-2 rounded-lg text-sm font-semibold transition">Download Cover Letter (PDF)</button>
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