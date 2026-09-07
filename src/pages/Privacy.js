import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const displayFont = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `When you use CVX, we collect the information you provide directly, including your name, email address, and the CVs and job descriptions you upload for analysis. We also collect basic usage data, such as pages visited and features used, to help us improve the product.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `We use your information to run CV analyses, generate match scores and rewrites, manage your account, and provide customer support. We may also use aggregated, anonymized data to improve our matching and rewriting models.`,
  },
  {
    title: '3. CV and Document Data',
    body: `CVs and job descriptions you upload are processed to generate your analysis, skill gap report, and rewritten documents. We retain this content only as long as needed to provide the service and allow you to access your history, unless you delete it or close your account.`,
  },
  {
    title: '4. Sharing of Information',
    body: `We do not sell your personal information. We may share data with service providers who help us operate CVX (such as hosting and AI processing providers), and only to the extent necessary for them to perform those services on our behalf.`,
  },
  {
    title: '5. Data Security',
    body: `We use reasonable technical and organizational measures to protect your information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.`,
  },
  {
    title: '6. Your Choices',
    body: `You can access, update, or delete your account information at any time from your dashboard. You may also contact us to request deletion of your data or to ask questions about how it is used.`,
  },
  {
    title: '7. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. If we make material changes, we will notify you by updating the date below or through the app.`,
  },
  {
    title: '8. Contact Us',
    body: `If you have any questions about this Privacy Policy, reach out to us at cvxsupport@gmail.com.`,
  },
];

function Privacy() {
  return (
    <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-20 pb-24">
        <p className="text-xs tracking-[0.25em] uppercase text-[#D4A657] mb-4 text-center">
          Legal
        </p>
        <h1 className="text-4xl md:text-5xl leading-[1.05] mb-4 text-center" style={displayFont}>
          Privacy Policy
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

export default Privacy;