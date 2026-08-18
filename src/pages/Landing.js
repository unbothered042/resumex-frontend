import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const displayFont = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };

function ScoreIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 19V13M11 19V7M18 19V10" strokeLinecap="round" />
    </svg>
  );
}

function GapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}

function RewriteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 20h4.2L18.8 9.4a1.5 1.5 0 0 0 0-2.1l-2.1-2.1a1.5 1.5 0 0 0-2.1 0L4 15.8V20Z" strokeLinejoin="round" />
      <path d="M13.5 6.2 17.8 10.5" />
    </svg>
  );
}

function Landing() {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem('access_token'));
    setMounted(true);
  }, []);

  const fadeIn = (delayMs) => ({
    transitionProperty: 'opacity, transform',
    transitionDuration: '700ms',
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: `${delayMs}ms`,
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(14px)',
  });

  return (
    <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
      <Navbar />

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-28 text-center">
        <p
          className="motion-safe:transition-none text-xs tracking-[0.25em] uppercase text-[#D4A657] mb-6"
          style={fadeIn(0)}
        >
          CV Analysis, Read Like a Recruiter
        </p>
        <h1
          className="text-5xl md:text-6xl leading-[1.05] mb-6"
          style={{ ...displayFont, ...fadeIn(80) }}
        >
          Know exactly why your CV gets rejected.
        </h1>
        <p className="text-lg text-[#9AA1B2] max-w-xl mx-auto mb-10 leading-relaxed" style={fadeIn(160)}>
          Upload your CV and a job description. CVX marks what matches, flags
          what's missing, and rewrites the gaps, the way a recruiter would,
          in seconds instead of days. No account needed to try it.
        </p>
        <div className="flex flex-wrap justify-center gap-4" style={fadeIn(240)}>
          <Link
            to="/dashboard"
            className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-7 py-3.5 rounded font-semibold transition"
          >
            {token ? 'Go to Dashboard' : 'Analyze My CV, Free'}
          </Link>
          {!token && (
            <Link
              to="/login"
              className="border border-[#2A303C] hover:border-[#D4A657] hover:text-[#D4A657] px-7 py-3.5 rounded font-semibold transition"
            >
              Log In
            </Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-[#161B24] bg-[#0D121B] px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm tracking-[0.25em] uppercase text-[#6C7386] mb-12 text-center">
            What CVX Does
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#161B24]">
            {[
              {
                Icon: ScoreIcon,
                title: 'Match Score',
                copy: "A precise percentage showing how well your CV fits the role, not a guess, a measurement.",
              },
              {
                Icon: GapIcon,
                title: 'Skill Gap Analysis',
                copy: 'See exactly which required skills are present, and which ones are missing before a recruiter ever notices.',
              },
              {
                Icon: RewriteIcon,
                title: 'CV Rewrite',
                copy: 'A rewritten, role-tailored CV that keeps your real experience, ready to download as a polished PDF.',
              },
            ].map(({ Icon, title, copy }) => (
              <div key={title} className="bg-[#0D121B] p-8">
                <div className="text-[#D4A657] mb-5">
                  <Icon />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
                  {title}
                </h3>
                <p className="text-[#9AA1B2] text-sm leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 py-24 text-center border-t border-[#161B24]">
        <h2 className="text-3xl md:text-4xl mb-4" style={displayFont}>
          Stop guessing why you're not hearing back.
        </h2>
        <p className="text-[#9AA1B2] mb-9 max-w-md mx-auto">
          Run your first analysis in under a minute, free, no account required to start.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-8 py-4 rounded font-semibold transition"
        >
          {token ? 'Go to Dashboard' : 'Analyze My CV Now'}
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center text-[#5C6272] text-sm py-8 border-t border-[#161B24]">
        © 2026 CVX, Built by Paul Iheabunike ·{' '}
        <a href="/privacy" className="hover:text-[#D4A657] transition">Privacy Policy</a>{' '}
        ·{' '}
        <a href="/terms" className="hover:text-[#D4A657] transition">Terms of Service</a>
      </footer>
    </div>
  );
}

export default Landing;