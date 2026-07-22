import { useState } from 'react';
import { BrainCircuit, BarChart3, Code2, MessageSquareText, PenTool, Clock, Award, Users, Sparkles, ArrowRight, CheckCircle2, Calendar, Rocket, Mail, ShieldCheck, FolderGit2, GraduationCap, Lock } from 'lucide-react';
import { TRACKS } from '@/types';

const iconMap: Record<string, typeof BrainCircuit> = {
  BrainCircuit,
  BarChart3,
  Code2,
  MessageSquareText,
  PenTool,
};

const benefits = [
  { icon: CheckCircle2, title: 'Hands-on, Project-Based Learning', desc: 'Work on real-world projects that build practical skills.' },
  { icon: GraduationCap, title: 'Internship Certificate', desc: 'Earn a recognized certificate upon successful completion.' },
  { icon: FolderGit2, title: 'Structured Learning Resources', desc: 'Guided tasks and curated materials keep you on track.' },
  { icon: Calendar, title: 'Learn at Your Own Pace', desc: 'A flexible schedule designed for students and professionals.' },
  { icon: FolderGit2, title: 'Build a Professional Portfolio', desc: 'Walk away with real-world projects to showcase.' },
  { icon: Users, title: 'Join a Growing Community', desc: 'Connect with ambitious learners across Pakistan.' },
  { icon: Award, title: 'Outstanding Contributor Award', desc: 'Top performers receive special recognition and awards.' },
  { icon: Rocket, title: 'Completely Sponsored', desc: 'No cost to participate — invest your time, not your money.' },
];

const steps = [
  { num: '01', title: 'Choose Your Track', desc: 'Select from 5 in-demand tech tracks that match your interest.' },
  { num: '02', title: 'Apply Online', desc: 'Fill out the application form and upload your resume.' },
  { num: '03', title: 'Get Reviewed', desc: 'Our team reviews your application and reaches out.' },
  { num: '04', title: 'Start Building', desc: 'Begin your journey and work on real-world projects.' },
];

export default function LandingPage({ onApply, onAdmin }: { onApply: () => void; onAdmin: () => void }) {
  const [activeTab, setActiveTab] = useState<'tracks' | 'benefits'>('tracks');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5c518] to-[#e6a800] flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <span className="text-black font-black text-lg">LP</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">Live Pakistan</span>
              <p className="text-[10px] text-yellow-400/80 tracking-[0.2em] uppercase -mt-0.5">Internship Program</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#tracks" className="hover:text-white transition-colors">Tracks</a>
            <a href="#why" className="hover:text-white transition-colors">Why Join</a>
            <a href="#how" className="hover:text-white transition-colors">How to Apply</a>
          </div>
          <button
            onClick={onApply}
            className="bg-[#f5c518] hover:bg-[#ffd633] text-black font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-yellow-500/30 active:scale-95 text-sm"
          >
            Apply Now
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium mb-8 animate-[fadeIn_0.6s_ease]">
              <Sparkles className="w-4 h-4" />
              Applications Now Open
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Kickstart Your Career with<br />
              <span className="bg-gradient-to-r from-[#f5c518] via-yellow-400 to-[#f5c518] bg-clip-text text-transparent">Real-World Experience</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The Live Pakistan Internship Program is now accepting applications. Whether you're a student, fresh graduate, or someone looking to upskill — no prior experience required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onApply}
                className="group bg-[#f5c518] hover:bg-[#ffd633] text-black font-bold px-8 py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-yellow-500/30 active:scale-95 flex items-center gap-2 text-base"
              >
                Apply Now — It's Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#tracks"
                className="px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-base font-medium"
              >
                Explore Tracks
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-12 text-sm text-gray-500">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-yellow-400" /> 2 Weeks or 1 Month</span>
              <span className="flex items-center gap-2"><Users className="w-4 h-4 text-yellow-400" /> 5 In-Demand Tracks</span>
              <span className="flex items-center gap-2"><Award className="w-4 h-4 text-yellow-400" /> Certificate + Awards</span>
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-yellow-400" /> No Experience Needed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section id="tracks" className="py-24 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-yellow-400 font-semibold text-sm tracking-[0.2em] uppercase mb-3">Choose Your Path</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Available Tracks</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Five specialized tracks designed to give you the most in-demand skills in today's tech industry.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRACKS.map((track, idx) => {
              const Icon = iconMap[track.icon] || Code2;
              return (
                <div
                  key={track.value}
                  className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.06] hover:border-yellow-500/30 transition-all duration-300 cursor-pointer animate-[fadeIn_0.5s_ease_backwards]"
                  style={{ animationDelay: `${idx * 80}ms` }}
                  onClick={onApply}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">{track.label}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{track.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm text-yellow-400 font-medium group-hover:gap-2.5 transition-all">
                    Apply for this track <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              );
            })}
            <div className="group relative bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center animate-[fadeIn_0.5s_ease_backwards]" style={{ animationDelay: '400ms' }}>
              <Rocket className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Not Sure Yet?</h3>
              <p className="text-gray-400 text-sm mb-6">All tracks welcome beginners. Apply and choose later.</p>
              <button onClick={onApply} className="text-yellow-400 font-semibold text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                Start Application <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section id="why" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-yellow-400 font-semibold text-sm tracking-[0.2em] uppercase mb-3">Benefits</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Why Join Live Pakistan?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to launch your tech career — at zero cost.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:border-yellow-500/20 hover:bg-white/[0.05] transition-all duration-300 animate-[fadeIn_0.4s_ease_backwards]"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="w-11 h-11 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="font-semibold mb-2 text-sm">{b.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section id="how" className="py-24 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-yellow-400 font-semibold text-sm tracking-[0.2em] uppercase mb-3">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">How to Apply</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Four simple steps stand between you and your tech career.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative animate-[fadeIn_0.5s_ease_backwards]" style={{ animationDelay: `${idx * 100}ms` }}>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-full h-[2px] bg-gradient-to-r from-yellow-500/30 to-transparent" />
                )}
                <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f5c518] to-[#e6a800] flex items-center justify-center mb-6 font-black text-black text-lg shadow-lg shadow-yellow-500/20">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Sign In */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm mb-5">Are you an administrator?</p>
          <button
            onClick={onAdmin}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#f5c518] hover:bg-[#ffd633] text-black font-bold transition-all hover:shadow-xl hover:shadow-yellow-500/30 active:scale-95 text-base"
          >
            <Lock className="w-5 h-5" />
            Admin Sign In
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border border-yellow-500/20 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px]" />
            </div>
            <div className="relative">
              <Rocket className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-5xl font-black mb-4">Ready to Get Started?</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                Limited seats available. Completely sponsored. Your future in tech starts here.
              </p>
              <button
                onClick={onApply}
                className="group bg-[#f5c518] hover:bg-[#ffd633] text-black font-bold px-8 py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-yellow-500/30 active:scale-95 inline-flex items-center gap-2 text-base"
              >
                Apply Now — It's Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#f5c518] to-[#e6a800] flex items-center justify-center">
                <span className="text-black font-black text-sm">LP</span>
              </div>
              <div>
                <span className="font-bold text-sm">Live Pakistan</span>
                <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Learn. Build. Grow. Succeed.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              <span>livepakistan@careergpt.site</span>
            </div>
            <button onClick={onAdmin} className="text-xs text-gray-700 hover:text-gray-500 transition-colors">Admin</button>
            <p className="text-xs text-gray-600">© 2025 Live Pakistan. All rights reserved.</p>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-gray-600 max-w-3xl mx-auto">
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-yellow-500/50" />
              Important: Please ignore any messages or comments that are not from the official Live Pakistan page. Beware of fake accounts and impersonators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
