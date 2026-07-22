import { useState, useRef } from 'react';
import { ArrowLeft, Upload, CheckCircle2, Loader2, FileText, X, AlertCircle, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TRACKS, DURATIONS, TRACK_LABELS, DURATION_LABELS } from '@/types';

type Page = 'landing' | 'apply' | 'success';

export default function ApplicationForm({ onBack }: { onBack: () => void }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [education, setEducation] = useState('');
  const [track, setTrack] = useState('');
  const [duration, setDuration] = useState('');
  const [motivation, setMotivation] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document');
      return;
    }

    setError('');
    setResumeFile(file);
    setResumeName(file.name);
  };

  const removeFile = () => {
    setResumeFile(null);
    setResumeName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !track || !duration) {
      setError('Please fill in all required fields');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!resumeFile) {
      setError('Please upload your resume');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);

    try {
      // Upload resume to storage
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, resumeFile);

      if (uploadError) throw new Error('Failed to upload resume. Please try again.');

      // Insert application record
      const { error: insertError } = await supabase
        .from('applications')
        .insert({
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          education: education.trim() || null,
          track,
          duration,
          motivation: motivation.trim() || null,
          resume_url: filePath,
          resume_filename: resumeFile.name,
          status: 'pending',
        });

      if (insertError) throw new Error('Failed to submit application. Please try again.');

      // Send confirmation email via edge function
      try {
        const funcUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-confirmation`;
        await fetch(funcUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ full_name: fullName.trim(), email: email.trim(), track, duration }),
        });
      } catch {
        // Email is best-effort; application already saved
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const goToPage = (page: Page) => {
    if (page === 'landing') onBack();
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8 animate-[scaleIn_0.5s_ease]">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black mb-4">Application Submitted!</h1>
          <p className="text-gray-400 mb-2">
            Thank you, <span className="text-yellow-400 font-semibold">{fullName}</span>.
          </p>
          <p className="text-gray-400 mb-8 leading-relaxed">
            We've received your application for the <span className="text-white font-medium">{TRACK_LABELS[track]}</span> track
            ({DURATION_LABELS[duration]}). A confirmation email has been sent to <span className="text-white font-medium">{email}</span>.
          </p>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
              <Send className="w-4 h-4 text-yellow-400" /> What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> Our team will review your application</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> You'll be contacted with next steps</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> Check your email for the confirmation</li>
            </ul>
          </div>
          <button
            onClick={() => goToPage('landing')}
            className="bg-[#f5c518] hover:bg-[#ffd633] text-black font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-yellow-500/30 active:scale-95"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/70 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f5c518] to-[#e6a800] flex items-center justify-center">
              <span className="text-black font-black text-sm">LP</span>
            </div>
            <span className="font-bold text-sm">Live Pakistan</span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-yellow-400 font-semibold text-sm tracking-[0.2em] uppercase mb-3">Application Form</p>
          <h1 className="text-4xl font-black mb-3">Apply for the Internship</h1>
          <p className="text-gray-400">Fill in your details below. Fields marked with <span className="text-yellow-400">*</span> are required.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-[fadeIn_0.3s_ease]">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 text-sm font-bold">1</span>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/[0.05] transition-all disabled:opacity-50"
                  placeholder="e.g. Ahmed Khan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/[0.05] transition-all disabled:opacity-50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={submitting}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/[0.05] transition-all disabled:opacity-50"
                  placeholder="+92 3XX XXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Education / Current Status</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  disabled={submitting}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/[0.05] transition-all disabled:opacity-50"
                  placeholder="e.g. BS Computer Science, 3rd Year"
                />
              </div>
            </div>
          </div>

          {/* Track & Duration */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 text-sm font-bold">2</span>
              Track & Duration
            </h2>

            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Your Track <span className="text-yellow-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {TRACKS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTrack(t.value)}
                  disabled={submitting}
                  className={`text-left p-4 rounded-xl border transition-all disabled:opacity-50 ${
                    track === t.value
                      ? 'bg-yellow-500/10 border-yellow-500/50 ring-1 ring-yellow-500/30'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm mb-1">{t.label}</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{t.desc}</p>
                    </div>
                    {track === t.value && <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0" />}
                  </div>
                </button>
              ))}
            </div>

            <label className="block text-sm font-medium text-gray-300 mb-3">
              Program Duration <span className="text-yellow-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDuration(d.value)}
                  disabled={submitting}
                  className={`p-4 rounded-xl border transition-all disabled:opacity-50 ${
                    duration === d.value
                      ? 'bg-yellow-500/10 border-yellow-500/50 ring-1 ring-yellow-500/30'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <p className="font-semibold text-sm">{d.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Motivation & Resume */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 text-sm font-bold">3</span>
              Tell Us More
            </h2>

            <label className="block text-sm font-medium text-gray-300 mb-2">Why do you want to join?</label>
            <textarea
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              rows={4}
              disabled={submitting}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/[0.05] transition-all disabled:opacity-50 resize-none"
              placeholder="Tell us about your interests, goals, and what you hope to achieve..."
            />

            <label className="block text-sm font-medium text-gray-300 mb-2 mt-6">
              Upload Resume <span className="text-yellow-400">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">PDF or Word document, max 10MB</p>
            {!resumeName ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={submitting}
                className="w-full border-2 border-dashed border-white/15 rounded-xl p-8 hover:border-yellow-500/30 hover:bg-yellow-500/[0.03] transition-all flex flex-col items-center gap-3 disabled:opacity-50"
              >
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Click to upload your resume</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX</p>
                </div>
              </button>
            ) : (
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{resumeName}</p>
                    <p className="text-xs text-gray-500">{resumeFile ? `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB` : ''}</p>
                  </div>
                </div>
                <button type="button" onClick={removeFile} disabled={submitting} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
              disabled={submitting}
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-gray-500 text-center sm:text-left">
              By submitting, you agree to be contacted by Live Pakistan regarding your application.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-[#f5c518] hover:bg-[#ffd633] text-black font-bold px-10 py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-yellow-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  Submit Application <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
