import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const displayFont = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };

function ScoreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 19V13M11 19V7M18 19V10" strokeLinecap="round" />
    </svg>
  );
}

function ImproveIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 8h16M4 12.5h9M4 17h13" strokeLinecap="round" />
      <path d="M15.5 10.8 17.7 8l2.2 2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RewriteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 20h4.2L18.8 9.4a1.5 1.5 0 0 0 0-2.1l-2.1-2.1a1.5 1.5 0 0 0-2.1 0L4 15.8V20Z" strokeLinejoin="round" />
      <path d="M13.5 6.2 17.8 10.5" />
    </svg>
  );
}

function CreateIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z" strokeLinejoin="round" />
    </svg>
  );
}

function RebuildIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 21v-5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ApplyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 13.5v5a1.6 1.6 0 0 0 1.6 1.6h12.8A1.6 1.6 0 0 0 20 18.5v-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 13.5h4.3l1.3 1.8h4.8l1.3-1.8H20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3v8M9 8.2 12 11l3-2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const WORKFLOW = [
  {
    n: '01',
    Icon: ScoreIcon,
    title: 'Analyze',
    copy: 'Upload your CV and a job description. Get a precise match score and a full breakdown of which required skills are present, and which are missing.',
  },
  {
    n: '02',
    Icon: ImproveIcon,
    title: 'Improve',
    copy: 'Get specific, actionable recommendations pulled from the actual job description, not generic CV advice.',
  },
  {
    n: '03',
    Icon: RewriteIcon,
    title: 'Rewrite',
    copy: 'Generate a role-tailored version of your CV that keeps your real experience but aligns it to what the job is asking for.',
  },
  {
    n: '04',
    Icon: CreateIcon,
    title: 'Create',
    copy: "No CV yet? Answer a few guided questions and CVX builds a professional one for you from scratch.",
  },
  {
    n: '05',
    Icon: RebuildIcon,
    title: 'Rebuild',
    copy: 'Upload an old or messy CV and get back a polished, professional version, no job description needed.',
    to: '/rebuild',
  },
  {
    n: '06',
    Icon: ApplyIcon,
    title: 'Apply',
    copy: 'Generate a tailored cover letter and keep every application you send organized in one place.',
  },
];

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
          in seconds instead of days.
        </p>
        <div className="flex flex-wrap justify-center gap-4" style={fadeIn(240)}>
          <Link
            to="/dashboard"
            className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-7 py-3.5 rounded font-semibold transition"
          >
            {token ? 'Go to Dashboard' : 'Analyze My CV'}
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

      {/* Workflow */}
      <div className="border-t border-[#161B24] bg-[#0D121B] px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl mb-4" style={displayFont}>
              Everything you need to apply smarter.
            </h2>
            <p className="text-[#9AA1B2] max-w-md mx-auto">
              CVX isn't a CV checker. It's the whole workflow, from a first
              upload to a finished application.
            </p>
          </div>

          <div className="divide-y divide-[#161B24]">
            {WORKFLOW.map(({ n, Icon, title, copy, to }) => {
              const row = (
                <div className="flex items-start gap-6 py-8">
                  <span
                    className="text-[#3A4150] text-2xl tabular-nums shrink-0 w-10"
                    style={displayFont}
                  >
                    {n}
                  </span>
                  <div className="text-[#D4A657] mt-1.5 shrink-0">
                    <Icon />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1.5" style={{ fontFamily: "'Fraunces', serif" }}>
                      {title}
                    </h3>
                    <p className="text-[#9AA1B2] text-sm leading-relaxed max-w-md">{copy}</p>
                  </div>
                </div>
              );

              return to ? (
                <Link key={title} to={to} className="block hover:bg-[#11161f] transition -mx-6 px-6">
                  {row}
                </Link>
              ) : (
                <div key={title}>{row}</div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 py-24 text-center border-t border-[#161B24]">
        <h2 className="text-3xl md:text-4xl mb-4" style={displayFont}>
          Stop guessing why you're not hearing back.
        </h2>
        <p className="text-[#9AA1B2] mb-9 max-w-md mx-auto">
          Run your first analysis in under a minute.
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
        © 2026 CVX, Built by Sylva Groups·{' '}
        <a href="/privacy" className="hover:text-[#D4A657] transition">Privacy Policy</a>{' '}
        ·{' '}
        <a href="/terms" className="hover:text-[#D4A657] transition">Terms of Service</a>{' '}
        ·{' '}
        <a href="mailto:cvxsupport@gmail.com" className="hover:text-[#D4A657] transition">Contact Support</a>
      </footer>
    </div>
  );
}

export default Landing;