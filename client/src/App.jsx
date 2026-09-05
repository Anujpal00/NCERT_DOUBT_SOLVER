import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data._id) setUser(data);
        else localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-semibold">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 text-slate-800">
      <header className="border-b border-orange-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-black tracking-tight text-orange-600">AI Doubt Solver</Link>
          <nav className="flex items-center gap-3 text-sm font-medium">
            {user ? (
              <>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">Hi, {user.name}</span>
                <button onClick={() => { localStorage.removeItem('token'); setUser(null); }} className="rounded-full bg-slate-900 px-3 py-1.5 text-white">Logout</button>
              </>
            ) : (
              <Link to="/login" className="rounded-full bg-orange-500 px-3 py-1.5 text-white">Login</Link>
            )}
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage onAuth={setUser} />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LandingPage onAuth={setUser} isLogin />} />
        <Route path="/dashboard" element={user ? <DashboardPage user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
