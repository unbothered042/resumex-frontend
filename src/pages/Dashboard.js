import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

function Dashboard() {
  const navigate = useNavigate();
  const [cvFile, setCvFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [cvRewriteRequested, setCvRewriteRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('cv_file', cvFile);
      formData.append('job_description', jobDescription);
      formData.append('cv_rewrite_requested', cvRewriteRequested.toString());

      const res = await API.post('/analyze/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/results', { state: { analysis: res.data } });
    } catch (err) {
      setError('Analysis failed. Please check your CV and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Analyze Your CV</h1>
        <p className="text-gray-400 mb-10">Upload your CV and paste the job description to get started.</p>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* CV Upload */}
          <div>
            <label className="block text-gray-300 font-semibold mb-2">Upload CV (PDF)</label>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 transition">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setCvFile(e.target.files[0])}
                required
                className="hidden"
                id="cv-upload"
              />
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

          {/* Job Description */}
          <div>
            <label className="block text-gray-300 font-semibold mb-2">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
              rows={8}
              placeholder="Paste the full job description here..."
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* CV Rewrite Option */}
          <div className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-xl px-4 py-4">
            <input
              type="checkbox"
              id="rewrite"
              checked={cvRewriteRequested}
              onChange={(e) => setCvRewriteRequested(e.target.checked)}
              className="w-5 h-5 accent-blue-500"
            />
            <label htmlFor="rewrite" className="cursor-pointer">
              <p className="font-semibold">Generate Rewritten CV</p>
              <p className="text-gray-400 text-sm">AI will rewrite your CV to better match this job — downloadable as PDF</p>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50"
          >
            {loading ? 'Analyzing your CV... This may take a moment ⏳' : 'Analyze My CV →'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;