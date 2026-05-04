import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Landing() {
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  useEffect(() => {
    setToken(localStorage.getItem('access_token'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl font-bold mb-6">
          Land Your Dream Job with <span className="text-blue-400">CVX</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-10">
          Upload your CV, paste the job description, and get an AI-powered analysis
          with match score, skill gaps, improvement tips, and a rewritten CV — in seconds.
        </p>
        <div className="flex gap-4">
          {token ? (
            <Link
              to="/dashboard"
              className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="border border-gray-500 hover:border-blue-400 px-8 py-4 rounded-lg text-lg font-semibold transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-16 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-12">What CVX Does</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Match Score</h3>
            <p className="text-gray-400">See exactly how well your CV matches the job description with a percentage score.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Skill Gap Analysis</h3>
            <p className="text-gray-400">Know exactly which skills you have and which ones you're missing for the role.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-xl font-semibold mb-2">CV Rewrite</h3>
            <p className="text-gray-400">Get an AI-rewritten CV tailored to the job downloadable as a PDF.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-3xl font-bold mb-4">Ready to get hired?</h2>
        <p className="text-gray-400 mb-8">Join thousands of job seekers using CVX to land interviews faster.</p>
        <Link
          to={token ? "/dashboard" : "/register"}
          className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition"
        >
          {token ? "Go to Dashboard" : "Analyze My CV Now"}
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-600 py-6 border-t border-gray-800">
        © 2026 CVX. | Created by Paul Iheabunike | All rights reserved. | <a href="/privacy" className="hover:underline">Privacy Policy</a> | <a href="/terms" className="hover:underline">Terms of Service</a>
      </footer>
    </div>
  );
}

export default Landing;