import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const displayFont = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };

const LEVELS = [
  { key: 'entry', label: 'Entry Level' },
  { key: 'mid', label: 'Mid Level' },
  { key: 'senior', label: 'Senior Level' },
  { key: 'executive', label: 'Executive' },
];

const STEPS = [
  'Personal', 'Summary', 'Experience', 'Education', 'Skills',
  'Projects', 'Certifications', 'Achievements', 'Reference & Level', 'Review',
];

const emptyJob = { title: '', company: '', start_date: '', end_date: '', location: '', bullets: [''] };
const emptyEducation = { degree: '', institution: '', start_date: '', end_date: '', details: '' };
const emptySkill = { category: '', items: [''] };
const emptyProject = { name: '', description: '' };
const emptyCertification = { name: '', issuer: '', date: '' };

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 15V3m0 0 4 4m-4-4L8 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12.5 9.5 18 20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Small shared input styling so every field across every step looks identical.
const inputClass = "w-full bg-[#0A0E14] border border-[#2A303C] rounded-lg px-4 py-2.5 text-[#E7E5DF] placeholder-[#5C6272] focus:outline-none focus:border-[#D4A657]";
const labelClass = "block text-[#9AA1B2] text-sm mb-1.5";

function Field({ label, ...props }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input className={inputClass} {...props} />
    </div>
  );
}

function TextAreaField({ label, ...props }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea className={inputClass + " resize-none"} {...props} />
    </div>
  );
}

function EntryCard({ title, onRemove, children }) {
  return (
    <div className="bg-[#0D121B] border border-[#2A303C] rounded-xl p-5 mb-4">
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold text-[#D4A657]">{title}</p>
        <button type="button" onClick={onRemove} className="text-[#9AA1B2] hover:text-[#E88A93] text-sm transition">
          Remove
        </button>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function AddButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-dashed border-[#2A303C] hover:border-[#D4A657] hover:text-[#D4A657] text-[#9AA1B2] rounded-xl py-3 w-full transition text-sm font-semibold"
    >
      + {children}
    </button>
  );
}

const DRAFT_KEY = 'cvx_create_draft';

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function CreateCV() {
  const existingDraft = loadDraft();

  const [step, setStep] = useState(existingDraft?.step || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requiresPurchase, setRequiresPurchase] = useState(false);
  const [requiresUpgrade, setRequiresUpgrade] = useState(false);
  const [profile, setProfile] = useState(null);
  const [result, setResult] = useState(null);
  const [referenceFile, setReferenceFile] = useState(null);
  const [level, setLevel] = useState(existingDraft?.level || 'entry');
  const [draftRestored, setDraftRestored] = useState(!!existingDraft);

  const [personal, setPersonal] = useState(existingDraft?.personal || { full_name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' });
  const [summary, setSummary] = useState(existingDraft?.summary || '');
  const [workExperience, setWorkExperience] = useState(existingDraft?.workExperience || [{ ...emptyJob, bullets: [''] }]);
  const [education, setEducation] = useState(existingDraft?.education || [{ ...emptyEducation }]);
  const [skills, setSkills] = useState(existingDraft?.skills || [{ ...emptySkill, items: [''] }]);
  const [projects, setProjects] = useState(existingDraft?.projects || []);
  const [certifications, setCertifications] = useState(existingDraft?.certifications || []);
  const [achievements, setAchievements] = useState(existingDraft?.achievements || ['']);

  const token = localStorage.getItem('access_token');
  const unlockedLevels = profile?.unlocked_levels || [];

  useEffect(() => {
    if (token) fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save a draft on every change, so a refresh or accidental close
  // doesn't lose progress. The reference file itself can't be persisted
  // (browsers can't serialize File objects), so it's excluded on purpose.
  useEffect(() => {
    const draft = { step, level, personal, summary, workExperience, education, skills, projects, certifications, achievements };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (err) {
      // Storage full or unavailable — not worth interrupting the user for.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, level, personal, summary, workExperience, education, skills, projects, certifications, achievements]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

  const startOver = () => {
    clearDraft();
    setStep(0);
    setLevel('entry');
    setPersonal({ full_name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' });
    setSummary('');
    setWorkExperience([{ ...emptyJob, bullets: [''] }]);
    setEducation([{ ...emptyEducation }]);
    setSkills([{ ...emptySkill, items: [''] }]);
    setProjects([]);
    setCertifications([]);
    setAchievements(['']);
    setReferenceFile(null);
    setDraftRestored(false);
  };

  const fetchProfile = async () => {
    try {
      const res = await API.get('/accounts/me/');
      setProfile(res.data);
    } catch (err) {
      // Non-fatal — form still works, just without the live credit display.
    }
  };

  // --- Generic list helpers, reused across work experience / education / etc. ---
  const addItem = (setter, template) => setter((prev) => [...prev, { ...template }]);
  const removeItem = (setter, index) => setter((prev) => prev.filter((_, i) => i !== index));
  const updateItem = (setter, index, field, value) =>
    setter((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const addBullet = (jobIndex) =>
    setWorkExperience((prev) => prev.map((j, i) => (i === jobIndex ? { ...j, bullets: [...j.bullets, ''] } : j)));
  const removeBullet = (jobIndex, bulletIndex) =>
    setWorkExperience((prev) => prev.map((j, i) => (i === jobIndex ? { ...j, bullets: j.bullets.filter((_, bi) => bi !== bulletIndex) } : j)));
  const updateBullet = (jobIndex, bulletIndex, value) =>
    setWorkExperience((prev) => prev.map((j, i) => (i === jobIndex ? { ...j, bullets: j.bullets.map((b, bi) => (bi === bulletIndex ? value : b)) } : j)));

  const addSkillItem = (skillIndex) =>
    setSkills((prev) => prev.map((s, i) => (i === skillIndex ? { ...s, items: [...s.items, ''] } : s)));
  const removeSkillItem = (skillIndex, itemIndex) =>
    setSkills((prev) => prev.map((s, i) => (i === skillIndex ? { ...s, items: s.items.filter((_, ii) => ii !== itemIndex) } : s)));
  const updateSkillItem = (skillIndex, itemIndex, value) =>
    setSkills((prev) => prev.map((s, i) => (i === skillIndex ? { ...s, items: s.items.map((it, ii) => (ii === itemIndex ? value : it)) } : s)));

  const addAchievement = () => setAchievements((prev) => [...prev, '']);
  const removeAchievement = (index) => setAchievements((prev) => prev.filter((_, i) => i !== index));
  const updateAchievement = (index, value) => setAchievements((prev) => prev.map((a, i) => (i === index ? value : a)));

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const buildPayload = () => ({
    ...personal,
    professional_summary: summary,
    work_experience: workExperience
      .filter((j) => j.title || j.company)
      .map((j) => ({ ...j, bullets: j.bullets.map((b) => b.trim()).filter(Boolean) })),
    education: education.filter((e) => e.degree || e.institution),
    skills: skills
      .filter((s) => s.category)
      .map((s) => ({ ...s, items: s.items.map((it) => it.trim()).filter(Boolean) })),
    projects: projects.filter((p) => p.name),
    certifications: certifications.filter((c) => c.name),
    achievements: achievements.map((a) => a.trim()).filter(Boolean),
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setRequiresPurchase(false);
    setRequiresUpgrade(false);

    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(buildPayload()));
      formData.append('level', level);
      if (referenceFile) formData.append('reference_cv_file', referenceFile);

      const res = await API.post('/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(res.data);
      setProfile((prev) => (prev ? { ...prev, analysis_credits: res.data.analysis_credits } : prev));
      clearDraft();
    } catch (err) {
      if (err.response?.data?.requires_purchase) {
        setRequiresPurchase(true);
        setError(err.response.data.error);
      } else if (err.response?.data?.requires_upgrade) {
        setRequiresUpgrade(true);
        setError(err.response.data.error);
      } else {
        setError(err.response?.data?.error || 'CV creation failed. Please check your details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await API.get(`/create/${result.id}/download/`, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', 'CVX_New_CV.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download PDF.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl mb-4" style={displayFont}>Create a CV From Scratch</h1>
          <p className="text-[#9AA1B2] mb-8">Create a free account to build a polished CV step by step.</p>
          <div className="flex justify-center gap-3">
            <Link to="/register" className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-6 py-3 rounded-lg font-semibold transition">
              Create Free Account
            </Link>
            <Link to="/login" className="border border-[#2A303C] hover:border-[#D4A657] hover:text-[#D4A657] px-6 py-3 rounded-lg font-semibold transition">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl mb-4" style={displayFont}>Your CV Is Ready</h1>
          <p className="text-[#9AA1B2] mb-8">Your new, polished CV has been generated and is ready to download.</p>
          <div className="flex justify-center gap-3">
            <button onClick={handleDownload} className="bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-6 py-3 rounded-lg font-semibold transition">
              Download CV (PDF)
            </button>
            <Link to="/dashboard" className="border border-[#2A303C] hover:border-[#D4A657] hover:text-[#D4A657] px-6 py-3 rounded-lg font-semibold transition">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E14] text-[#E7E5DF]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="flex items-start justify-between mb-2 gap-4">
          <h1 className="text-4xl" style={displayFont}>Create a CV From Scratch</h1>
          {profile && (
            <div className="text-right shrink-0">
              <p className="text-sm text-[#9AA1B2]">{profile.analysis_credits} credits</p>
              <Link to="/plans" className="text-xs text-[#D4A657] hover:underline">Buy more credits</Link>
            </div>
          )}
        </div>
        <p className="text-[#9AA1B2] mb-8">Answer a few questions and CVX will build a polished, professional CV for you.</p>

        {draftRestored && (
          <div className="bg-[#0D121B] border border-[#2A303C] text-[#9AA1B2] px-4 py-3 rounded-lg mb-6 text-sm flex items-center justify-between gap-4">
            <span>We restored your saved draft.</span>
            <button type="button" onClick={startOver} className="text-[#D4A657] hover:underline shrink-0">
              Start Over Instead
            </button>
          </div>
        )}

        {/* Progress indicator */}
        <div className="flex items-center justify-between gap-2 mb-10 flex-wrap">
          <div className="flex items-center gap-1 flex-wrap">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`text-xs px-2.5 py-1 rounded-full border ${
                  i === step
                    ? 'bg-[#D4A657] text-[#0A0E14] border-[#D4A657] font-semibold'
                    : i < step
                    ? 'border-[#D4A657]/50 text-[#D4A657]'
                    : 'border-[#2A303C] text-[#6C7386]'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          {!draftRestored && (
            <button type="button" onClick={startOver} className="text-xs text-[#6C7386] hover:text-[#D4A657] transition shrink-0">
              Clear draft
            </button>
          )}
        </div>

        {error && (
          <div className="bg-[#3A1418] border border-[#7A2C33] text-[#E88A93] px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        {requiresPurchase && (
          <div className="bg-[#1A1710] border border-[#D4A657]/40 text-[#E7E5DF] px-4 py-4 rounded mb-6">
            <p className="font-semibold mb-2">You're out of credits.</p>
            <p className="text-sm text-[#9AA1B2] mb-4">Top up a plan to generate your CV.</p>
            <Link to="/plans" className="inline-block bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-4 py-2 rounded text-sm font-semibold transition">
              View Plans
            </Link>
          </div>
        )}

        {requiresUpgrade && (
          <div className="bg-[#1A1710] border border-[#D4A657]/40 text-[#E7E5DF] px-4 py-4 rounded mb-6">
            <p className="font-semibold mb-2">This level isn't included in your plan.</p>
            <p className="text-sm text-[#9AA1B2] mb-4">Upgrade to unlock this seniority level.</p>
            <Link to="/plans" className="inline-block bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] px-4 py-2 rounded text-sm font-semibold transition">
              View Plans
            </Link>
          </div>
        )}

        {/* --- Step 0: Personal Details --- */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <Field label="Full Name" value={personal.full_name} onChange={(e) => setPersonal({ ...personal, full_name: e.target.value })} placeholder="Jane Doe" required />
            <Field label="Email" type="email" value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} placeholder="jane@example.com" required />
            <Field label="Phone" value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} placeholder="+234 800 000 0000" />
            <Field label="Location" value={personal.location} onChange={(e) => setPersonal({ ...personal, location: e.target.value })} placeholder="Lagos, Nigeria" />
            <Field label="LinkedIn" value={personal.linkedin} onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })} placeholder="linkedin.com/in/janedoe" />
            <Field label="Portfolio / Website" value={personal.portfolio} onChange={(e) => setPersonal({ ...personal, portfolio: e.target.value })} placeholder="janedoe.dev" />
          </div>
        )}

        {/* --- Step 1: Professional Summary --- */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <TextAreaField
              label="Professional Summary (optional — leave blank and CVX will write one for you)"
              rows={6}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A short paragraph about your background and strengths..."
            />
          </div>
        )}

        {/* --- Step 2: Work Experience --- */}
        {step === 2 && (
          <div>
            {workExperience.map((job, i) => (
              <EntryCard key={i} title={`Role ${i + 1}`} onRemove={() => removeItem(setWorkExperience, i)}>
                <Field label="Job Title" value={job.title} onChange={(e) => updateItem(setWorkExperience, i, 'title', e.target.value)} placeholder="Marketing Coordinator" />
                <Field label="Company" value={job.company} onChange={(e) => updateItem(setWorkExperience, i, 'company', e.target.value)} placeholder="Acme Co" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Start Date" value={job.start_date} onChange={(e) => updateItem(setWorkExperience, i, 'start_date', e.target.value)} placeholder="2023" />
                  <Field label="End Date" value={job.end_date} onChange={(e) => updateItem(setWorkExperience, i, 'end_date', e.target.value)} placeholder="Present" />
                </div>
                <Field label="Location" value={job.location} onChange={(e) => updateItem(setWorkExperience, i, 'location', e.target.value)} placeholder="Lagos, Nigeria" />
                <div>
                  <label className={labelClass}>Key Achievements</label>
                  {job.bullets.map((b, bi) => (
                    <div key={bi} className="flex gap-2 mb-2">
                      <input className={inputClass} value={b} onChange={(e) => updateBullet(i, bi, e.target.value)} placeholder="Grew engagement by 40%" />
                      {job.bullets.length > 1 && (
                        <button type="button" onClick={() => removeBullet(i, bi)} className="text-[#9AA1B2] hover:text-[#E88A93] px-2">✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addBullet(i)} className="text-xs text-[#D4A657] hover:underline">+ Add achievement</button>
                </div>
              </EntryCard>
            ))}
            <AddButton onClick={() => addItem(setWorkExperience, { ...emptyJob, bullets: [''] })}>Add another role</AddButton>
          </div>
        )}

        {/* --- Step 3: Education --- */}
        {step === 3 && (
          <div>
            {education.map((edu, i) => (
              <EntryCard key={i} title={`Education ${i + 1}`} onRemove={() => removeItem(setEducation, i)}>
                <Field label="Degree / Certificate" value={edu.degree} onChange={(e) => updateItem(setEducation, i, 'degree', e.target.value)} placeholder="BSc Marketing" />
                <Field label="Institution" value={edu.institution} onChange={(e) => updateItem(setEducation, i, 'institution', e.target.value)} placeholder="University of Lagos" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Start Date" value={edu.start_date} onChange={(e) => updateItem(setEducation, i, 'start_date', e.target.value)} placeholder="2019" />
                  <Field label="End Date" value={edu.end_date} onChange={(e) => updateItem(setEducation, i, 'end_date', e.target.value)} placeholder="2023" />
                </div>
                <Field label="Details (optional)" value={edu.details} onChange={(e) => updateItem(setEducation, i, 'details', e.target.value)} placeholder="First Class Honours" />
              </EntryCard>
            ))}
            <AddButton onClick={() => addItem(setEducation, { ...emptyEducation })}>Add another qualification</AddButton>
          </div>
        )}

        {/* --- Step 4: Skills --- */}
        {step === 4 && (
          <div>
            {skills.map((skill, i) => (
              <EntryCard key={i} title={`Skill Category ${i + 1}`} onRemove={() => removeItem(setSkills, i)}>
                <Field label="Category Name" value={skill.category} onChange={(e) => updateItem(setSkills, i, 'category', e.target.value)} placeholder="Marketing Tools" />
                <div>
                  <label className={labelClass}>Skills in this category</label>
                  {skill.items.map((it, ii) => (
                    <div key={ii} className="flex gap-2 mb-2">
                      <input className={inputClass} value={it} onChange={(e) => updateSkillItem(i, ii, e.target.value)} placeholder="Google Analytics" />
                      {skill.items.length > 1 && (
                        <button type="button" onClick={() => removeSkillItem(i, ii)} className="text-[#9AA1B2] hover:text-[#E88A93] px-2">✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addSkillItem(i)} className="text-xs text-[#D4A657] hover:underline">+ Add skill</button>
                </div>
              </EntryCard>
            ))}
            <AddButton onClick={() => addItem(setSkills, { ...emptySkill, items: [''] })}>Add another skill category</AddButton>
          </div>
        )}

        {/* --- Step 5: Projects --- */}
        {step === 5 && (
          <div>
            {projects.map((p, i) => (
              <EntryCard key={i} title={`Project ${i + 1}`} onRemove={() => removeItem(setProjects, i)}>
                <Field label="Project Name" value={p.name} onChange={(e) => updateItem(setProjects, i, 'name', e.target.value)} placeholder="StatFort" />
                <TextAreaField label="Description" rows={3} value={p.description} onChange={(e) => updateItem(setProjects, i, 'description', e.target.value)} placeholder="What it is and what you built" />
              </EntryCard>
            ))}
            <AddButton onClick={() => addItem(setProjects, { ...emptyProject })}>Add a project</AddButton>
            {projects.length === 0 && <p className="text-[#6C7386] text-sm mt-2">Optional — skip if not relevant.</p>}
          </div>
        )}

        {/* --- Step 6: Certifications --- */}
        {step === 6 && (
          <div>
            {certifications.map((c, i) => (
              <EntryCard key={i} title={`Certification ${i + 1}`} onRemove={() => removeItem(setCertifications, i)}>
                <Field label="Certification Name" value={c.name} onChange={(e) => updateItem(setCertifications, i, 'name', e.target.value)} placeholder="Google Digital Marketing" />
                <Field label="Issuer" value={c.issuer} onChange={(e) => updateItem(setCertifications, i, 'issuer', e.target.value)} placeholder="Google" />
                <Field label="Date" value={c.date} onChange={(e) => updateItem(setCertifications, i, 'date', e.target.value)} placeholder="2022" />
              </EntryCard>
            ))}
            <AddButton onClick={() => addItem(setCertifications, { ...emptyCertification })}>Add a certification</AddButton>
            {certifications.length === 0 && <p className="text-[#6C7386] text-sm mt-2">Optional — skip if not relevant.</p>}
          </div>
        )}

        {/* --- Step 7: Achievements --- */}
        {step === 7 && (
          <div>
            <label className={labelClass}>Achievements / Awards (optional)</label>
            {achievements.map((a, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input className={inputClass} value={a} onChange={(e) => updateAchievement(i, e.target.value)} placeholder="Employee of the Month, March 2024" />
                {achievements.length > 1 && (
                  <button type="button" onClick={() => removeAchievement(i)} className="text-[#9AA1B2] hover:text-[#E88A93] px-2">✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addAchievement} className="text-xs text-[#D4A657] hover:underline">+ Add achievement</button>
          </div>
        )}

        {/* --- Step 8: Reference CV + Level --- */}
        {step === 8 && (
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-[#E7E5DF] font-semibold mb-2">Existing CV as a style reference (optional)</label>
              <div className="border-2 border-dashed border-[#2A303C] rounded-xl p-6 text-center hover:border-[#D4A657] transition">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setReferenceFile(e.target.files[0])}
                  className="hidden"
                  id="reference-upload"
                />
                <label htmlFor="reference-upload" className="cursor-pointer">
                  {referenceFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[#D4A657]"><CheckIcon /></span>
                      <p className="text-[#E7E5DF] font-semibold">{referenceFile.name}</p>
                      <p className="text-[#6C7386] text-sm">Click to change file</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#6C7386]">
                      <UploadIcon />
                      <p className="text-[#E7E5DF] font-semibold text-sm">Click to upload (optional)</p>
                      <p className="text-xs">Used only as a tone/style reference, never copied</p>
                    </div>
                  )}
                </label>
              </div>
              {draftRestored && !referenceFile && (
                <p className="text-xs text-[#6C7386] mt-2">
                  File uploads aren't saved in your draft — re-upload here if you had one selected before.
                </p>
              )}
            </div>

            <div className="bg-[#0D121B] border border-[#2A303C] rounded-xl px-4 py-4">
              <label className="block text-[#E7E5DF] font-semibold mb-2">Seniority Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-[#0A0E14] border border-[#2A303C] rounded-lg px-4 py-2.5 text-[#E7E5DF] focus:outline-none focus:border-[#D4A657]"
              >
                {LEVELS.map((l) => (
                  <option key={l.key} value={l.key} disabled={profile && !unlockedLevels.includes(l.key)}>
                    {l.label}{profile && !unlockedLevels.includes(l.key) ? ' (upgrade to unlock)' : ''}
                  </option>
                ))}
              </select>
              {profile && !unlockedLevels.includes(level) && (
                <p className="text-xs text-[#D4A657] mt-2">
                  Your current plan doesn't include this level. <Link to="/plans" className="underline">Upgrade here</Link>.
                </p>
              )}
            </div>
          </div>
        )}

        {/* --- Step 9: Review --- */}
        {step === 9 && (
          <div className="bg-[#0D121B] border border-[#2A303C] rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-[#D4A657]">Review</h2>
            <div className="text-sm text-[#C7CAD4] space-y-2">
              <p><span className="text-[#9AA1B2]">Name:</span> {personal.full_name || '—'}</p>
              <p><span className="text-[#9AA1B2]">Email:</span> {personal.email || '—'}</p>
              <p><span className="text-[#9AA1B2]">Roles added:</span> {workExperience.filter((j) => j.title || j.company).length}</p>
              <p><span className="text-[#9AA1B2]">Education entries:</span> {education.filter((e) => e.degree || e.institution).length}</p>
              <p><span className="text-[#9AA1B2]">Skill categories:</span> {skills.filter((s) => s.category).length}</p>
              <p><span className="text-[#9AA1B2]">Projects:</span> {projects.filter((p) => p.name).length}</p>
              <p><span className="text-[#9AA1B2]">Certifications:</span> {certifications.filter((c) => c.name).length}</p>
              <p><span className="text-[#9AA1B2]">Achievements:</span> {achievements.filter((a) => a.trim()).length}</p>
              <p><span className="text-[#9AA1B2]">Level:</span> {LEVELS.find((l) => l.key === level)?.label}</p>
              <p><span className="text-[#9AA1B2]">Reference CV:</span> {referenceFile ? referenceFile.name : 'None'}</p>
            </div>
            <p className="text-xs text-[#6C7386] mt-4">This will use 1 credit. You currently have {profile?.analysis_credits ?? '—'}.</p>
          </div>
        )}

        {/* --- Navigation --- */}
        <div className="flex gap-4 mt-8">
          {step > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="flex-1 border border-[#2A303C] hover:border-[#D4A657] hover:text-[#D4A657] py-3.5 rounded-xl font-semibold transition"
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={step === 0 && (!personal.full_name || !personal.email)}
              className="flex-1 bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] py-3.5 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Next <ArrowIcon />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-[#D4A657] text-[#0A0E14] hover:bg-[#e0b86e] py-3.5 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Building your CV. This may take a moment.' : 'Generate My CV'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateCV;