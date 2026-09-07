import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const displayFont = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By creating an account or using CVX, you agree to these Terms of Service. If you do not agree, please do not use the service.`,
  },
  {
    title: '2. Description of Service',
    body: `CVX analyzes your CV against a job description to generate a match score, skill gap analysis, and a rewritten, role-tailored CV. CVX can also rebuild an existing CV or help you create a new one from scratch.`,
  },
  {
    title: '3. Your Account',
    body: `You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You must provide accurate information when registering.`,
  },
  {
    title: '4. Your Content',
    body: `You retain ownership of the CVs, job descriptions, and other content you upload to CVX. By uploading content, you grant us permission to process it solely to provide the analysis, rewrite, and related features of the service.`,
  },
  {
    title: '5. Acceptable Use',
    body: `You agree not to misuse CVX, including attempting to disrupt the service, uploading unlawful content, or using the service to build a competing product without authorization.`,
  },
  {
    title: '6. Plans and Payment',
    body: `Some features of CVX are offered under paid plans. Fees, billing terms, and plan details are presented at the time of purchase and are subject to change with notice.`,
  },
  {
    title: '7. Disclaimer',
    body: `CVX provides analysis and suggestions to help improve your CV, but we do not guarantee interview invitations, job offers, or any specific hiring outcome.`,
  },
  {
    title: '8. Limitation of Liability',
    body: `To the fullest extent permitted by law, CVX and Sylva Groups are not liable for any indirect, incidental, or consequential damages arising from your use of the service.`,
  },
  {
    title: '9. Changes to These Terms',
    body: `We may update these Terms from time to time. Continued use of CVX after changes take effect constitutes acceptance of the revised Terms.`,
  },
  {
    title: '10. Contact Us',
    body: `If you have any questions about these Terms, reach out to us at cvxsupport@gmail.com.`,
  },
];

function Terms() {
  return (
    <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-20 pb-24">
        <p className="text-xs tracking-[0.25em] uppercase text-[#D4A657] mb-4 text-center">
          Legal
        </p>
        <h1 className="text-4xl md:text-5xl leading-[1.05] mb-4 text-center" style={displayFont}>
          Terms of Service
        </h1>
        <p className="text-[#6C7386] text-sm text-center mb-16">
          Last updated: September 2026
        </p>

        <div className="space-y-12">
          {SECTIONS.map(({ title, body }) => (
            <div key={title}>
              <h2
                className="text-lg font-semibold mb-3 text-[#E7E5DF]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {title}
              </h2>
              <p className="text-[#9AA1B2] text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-[#161B24] text-center">
          <Link to="/" className="text-sm text-[#9AA1B2] hover:text-[#D4A657] transition">
            ← Back to Home
          </Link>
        </div>
      </div>

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

export default Terms;