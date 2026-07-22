import { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import ApplicationForm from '@/components/ApplicationForm';
import AdminLogin from '@/components/AdminLogin';
import AdminPanel from '@/components/AdminPanel';

type Page = 'landing' | 'apply' | 'admin-login' | 'admin';

export default function App() {
  const [page, setPage] = useState<Page>('landing');

  const handleLogout = () => {
    sessionStorage.removeItem('lp_admin');
    setPage('landing');
  };

  useEffect(() => {
    if (sessionStorage.getItem('lp_admin') === 'true' && page === 'landing') {
      // stay on landing; admin only when navigated explicitly
    }
  }, [page]);

  if (page === 'apply') return <ApplicationForm onBack={() => setPage('landing')} />;
  if (page === 'admin-login') return <AdminLogin onSuccess={() => setPage('admin')} onBack={() => setPage('landing')} />;
  if (page === 'admin') return <AdminPanel onLogout={handleLogout} />;

  return <LandingPage onApply={() => setPage('apply')} onAdmin={() => setPage('admin-login')} />;
}
