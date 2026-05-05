import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function Dashboard() {
  const navigate = useNavigate();
  const [cvFile, setCvFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [cvRewriteRequested, setCvRewriteRequested] = useState(false);
  const [coverLetterRequested, setCoverLetterRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requiresAuth, setRequiresAuth] = useState(false);

  const token = localStorage.getItem('access_token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRequiresAuth(false);

    try {
      const formData = new FormData();
      formData.append('cv_file', cvFile);
      formData.append('job_description', jobDescription);
      formData.append('cv_rewrite_requested', cvRewriteRequested.toString());
      formData.append('cover_letter_requested', coverLetterRequested.toString());

      const res = await API.post('/analyze/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/results', { state: { analysis: res.data } });
    } catch (err) {
      if (err.response?.data?.requires_auth) {
        setRequiresAuth(true);
        setError('');
      } else {
        setError('Analysis failed. Please check your CV and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Analyze Your CV</h1>
        <p className="text-gray-400 mb-10">Start with a free CV analysis, no account required. Sign up to unlock tailored rewrites and cover letters</p>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {requiresAuth && (
          <div className="bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-300 px-4 py-4 rounded-lg mb-6">
            <p className="font-semibold mb-2">Create a free account to unlock this feature.</p>
            <p className="text-sm mb-4">Create a free CVX account to unlock tailored CV rewrites, cover letters and saved results.</p>
            <div className="flex gap-3">
              <Link to="/register" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold transition">Create Free Account</Link>
              <Link to="/login" className="border border-blue-500 hover:bg-blue-500 hover:bg-opacity-20 px-4 py-2 rounded-lg text-sm font-semibold transition">Login</Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-gray-300 font-semibold mb-2">Upload CV (PDF)</label>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 transition">
              <input type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files[0])} required className="hidden" id="cv-upload" />
              <label htmlFor="cv-upload" className="cursor-pointer">
                {cvFile ? (
                  <div>
                    <p className="text-green-400 font-semibold text-lg">✓ {cvFile.name}</p>
                    <p className="text-gray-500 text-sm mt-1">Click to change file</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-4xl mb-3">📄</p>
                    <p className="text-gray-300 font-semibold">Click to upload your CV</p>
                    <p className="text-gray-500 text-sm mt-1">PDF files only</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2">Job Description</label>
            <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} required rows={8} placeholder="Paste the full job description here..." className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 resize-none" />
          </div>

          <div className={`flex items-center gap-3 rounded-xl px-4 py-4 border ${token ? 'bg-gray-900 border-gray-700' : 'bg-gray-900 border-gray-800 opacity-60'}`}>
            <input type="checkbox" id="rewrite" checked={cvRewriteRequested} onChange={(e) => setCvRewriteRequested(e.target.checked)} className="w-5 h-5 accent-blue-500" />
            <label htmlFor="rewrite" className="cursor-pointer flex-1">
              <p className="font-semibold">Generate Rewritten CV {!token && <span className="text-blue-400 text-xs ml-2">Requires account</span>}</p>
              <p className="text-gray-400 text-sm">Get a new CV to better match this job, downloadable as PDF</p>
            </label>
          </div>

          <div className={`flex items-center gap-3 rounded-xl px-4 py-4 border ${token ? 'bg-gray-900 border-gray-700' : 'bg-gray-900 border-gray-800 opacity-60'}`}>
            <input type="checkbox" id="cover-letter" checked={coverLetterRequested} onChange={(e) => setCoverLetterRequested(e.target.checked)} className="w-5 h-5 accent-blue-500" />
            <label htmlFor="cover-letter" className="cursor-pointer flex-1">
              <p className="font-semibold">Generate Cover Letter {!token && <span className="text-blue-400 text-xs ml-2">Requires account</span>}</p>
              <p className="text-gray-400 text-sm">Get a new tailored cover letter for this role, downloadable as PDF</p>
            </label>
          </div>

          <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600 py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50">
            {loading ? 'Analyzing your CV... This may take a moment ⏳' : 'Analyze My CV →'}
          </button>

          {!token && (
            <p className="text-center text-gray-500 text-sm">
              <Link to="/register" className="text-blue-400 hover:underline">Create a free account</Link> to unlock CV rewrite, cover letter, and analysis history.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Dashboard;