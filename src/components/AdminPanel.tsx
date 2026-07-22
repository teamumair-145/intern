import { useState, useEffect, useMemo } from 'react';
import { LogOut, Search, Download, FileText, Mail, Phone, GraduationCap, Calendar, Filter, Inbox, CheckCircle2, Clock, XCircle, Eye, Trash2, TrendingUp, Users, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TRACK_LABELS, DURATION_LABELS, STATUS_LABELS, STATUS_COLORS, type Application } from '@/types';

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trackFilter, setTrackFilter] = useState('all');
  const [selected, setSelected] = useState<Application | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [view, setView] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setApplications((data || []) as Application[]);
    }
    setLoading(false);
  };

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchSearch = !search ||
        app.full_name.toLowerCase().includes(search.toLowerCase()) ||
        app.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchTrack = trackFilter === 'all' || app.track === trackFilter;
      return matchSearch && matchStatus && matchTrack;
    });
  }, [applications, search, statusFilter, trackFilter]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      reviewed: applications.filter(a => a.status === 'reviewed').length,
      accepted: applications.filter(a => a.status === 'accepted').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
    };
  }, [applications]);

  const trackStats = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach(a => { counts[a.track] = (counts[a.track] || 0) + 1; });
    return counts;
  }, [applications]);

  const openDetail = async (app: Application) => {
    setSelected(app);
    setView('detail');
    setResumeUrl(null);
    if (app.resume_url) {
      setResumeLoading(true);
      const { data } = await supabase.storage.from('resumes').createSignedUrl(app.resume_url, 3600);
      if (data) setResumeUrl(data.signedUrl);
      setResumeLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingStatus(true);
    const { error } = await supabase.from('applications').update({ status }).eq('id', id);
    if (!error) {
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: status as Application['status'] } : a));
      if (selected) setSelected({ ...selected, status: status as Application['status'] });
    }
    setUpdatingStatus(false);
  };

  const deleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application? This cannot be undone.')) return;
    const { error } = await supabase.from('applications').delete().eq('id', id);
    if (!error) {
      setApplications(prev => prev.filter(a => a.id !== id));
      if (selected?.id === id) {
        setSelected(null);
        setView('list');
      }
    }
  };

  const exportCSV = () => {
    const headers = ['Full Name', 'Email', 'Phone', 'Education', 'Track', 'Duration', 'Status', 'Motivation', 'Submitted At'];
    const rows = filtered.map(a => [
      a.full_name, a.email, a.phone || '', a.education || '',
      TRACK_LABELS[a.track] || a.track, DURATION_LABELS[a.duration] || a.duration,
      STATUS_LABELS[a.status] || a.status, (a.motivation || '').replace(/"/g, '""'),
      new Date(a.created_at).toLocaleString()
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (view === 'detail' && selected) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => setView('list')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
              ← Back to list
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f5c518] to-[#e6a800] flex items-center justify-center">
                <span className="text-black font-black text-sm">LP</span>
              </div>
              <span className="font-bold text-sm">Admin Dashboard</span>
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black mb-2">{selected.full_name}</h1>
              <p className="text-gray-400 text-sm">Applied on {new Date(selected.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${STATUS_COLORS[selected.status]} flex-shrink-0`}>
              {STATUS_LABELS[selected.status]}
            </span>
          </div>

          {/* Status Actions */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Update Status</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['pending', 'reviewed', 'accepted', 'rejected'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected.id, s)}
                  disabled={updatingStatus || selected.status === s}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all disabled:opacity-50 ${
                    selected.status === s
                      ? STATUS_COLORS[s] + ' ring-1 ring-white/20'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-300'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><Mail className="w-4 h-4" /> Email</div>
              <p className="text-sm font-medium break-all">{selected.email}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><Phone className="w-4 h-4" /> Phone</div>
              <p className="text-sm font-medium">{selected.phone || 'Not provided'}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><GraduationCap className="w-4 h-4" /> Education</div>
              <p className="text-sm font-medium">{selected.education || 'Not provided'}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><Calendar className="w-4 h-4" /> Duration</div>
              <p className="text-sm font-medium">{DURATION_LABELS[selected.duration] || selected.duration}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><TrendingUp className="w-4 h-4" /> Track</div>
              <p className="text-sm font-medium">{TRACK_LABELS[selected.track] || selected.track}</p>
            </div>
          </div>

          {/* Motivation */}
          {selected.motivation && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Motivation</h3>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{selected.motivation}</p>
            </div>
          )}

          {/* Resume */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">{selected.resume_filename || 'Resume'}</p>
                  <p className="text-xs text-gray-500">Uploaded resume</p>
                </div>
              </div>
              {resumeLoading ? (
                <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
              ) : resumeUrl ? (
                <div className="flex items-center gap-3">
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition-all text-sm font-medium">
                    <Eye className="w-4 h-4" /> View
                  </a>
                  <a href={resumeUrl} download={selected.resume_filename || 'resume'} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium">
                    <Download className="w-4 h-4" /> Download
                  </a>
                </div>
              ) : (
                <p className="text-xs text-gray-500">No resume uploaded</p>
              )}
            </div>
          </div>

          {/* Delete */}
          <button
            onClick={() => deleteApplication(selected.id)}
            className="flex items-center gap-2 text-sm text-red-400/80 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f5c518] to-[#e6a800] flex items-center justify-center">
              <span className="text-black font-black text-sm">LP</span>
            </div>
            <span className="font-bold text-sm">Admin Dashboard</span>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-black">{stats.total}</span>
            </div>
            <p className="text-xs text-gray-500">Total Applications</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span className="text-2xl font-black">{stats.pending}</span>
            </div>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-black">{stats.reviewed}</span>
            </div>
            <p className="text-xs text-gray-500">Reviewed</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-2xl font-black">{stats.accepted}</span>
            </div>
            <p className="text-xs text-gray-500">Accepted</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-2xl font-black">{stats.rejected}</span>
            </div>
            <p className="text-xs text-gray-500">Rejected</p>
          </div>
        </div>

        {/* Track distribution */}
        {Object.keys(trackStats).length > 0 && (
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-8">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Applications by Track</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(trackStats).map(([track, count]) => (
                <div key={track} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs">
                  <span className="text-gray-400">{TRACK_LABELS[track] || track}</span>
                  <span className="font-bold text-yellow-400">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 transition-all"
          >
            <option value="all">All Tracks</option>
            <option value="machine-learning">Machine Learning</option>
            <option value="data-analytics">Data Analytics</option>
            <option value="frontend-dev">Front-End Web Dev</option>
            <option value="nlp">NLP</option>
            <option value="ui-ux">UI/UX Design</option>
          </select>
          <button
            onClick={exportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition-all text-sm font-medium"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Inbox className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No applications found</p>
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Track</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resume</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium">{app.full_name}</p>
                      <p className="text-xs text-gray-500">{app.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-300">{TRACK_LABELS[app.track] || app.track}</td>
                    <td className="px-5 py-4 text-sm text-gray-300">{DURATION_LABELS[app.duration] || app.duration}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${STATUS_COLORS[app.status]}`}>
                        {STATUS_LABELS[app.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {app.resume_url ? (
                        <FileText className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <span className="text-xs text-gray-600">None</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">
                      {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => openDetail(app)}
                        className="flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
