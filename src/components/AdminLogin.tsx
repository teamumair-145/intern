import { useState } from 'react';
import { Lock, Loader2, ArrowLeft, ShieldAlert, User } from 'lucide-react';

export default function AdminLogin({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (username.trim() === 'admin' && password === 'admin999') {
        sessionStorage.setItem('lp_admin', 'true');
        onSuccess();
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px]" />
      <div className="relative max-w-md w-full">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#f5c518] to-[#e6a800] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
              <Lock className="w-7 h-7 text-black" />
            </div>
            <h1 className="text-2xl font-black mb-2">Admin Sign In</h1>
            <p className="text-sm text-gray-400">Sign in to manage applications</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/[0.05] transition-all disabled:opacity-50"
                  placeholder="admin"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/[0.05] transition-all disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f5c518] hover:bg-[#ffd633] text-black font-bold px-6 py-3.5 rounded-lg transition-all hover:shadow-lg hover:shadow-yellow-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
