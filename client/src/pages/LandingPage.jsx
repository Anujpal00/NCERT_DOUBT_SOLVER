import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LandingPage = ({ onAuth, isLogin = false }) => {
  const [mode, setMode] = useState(isLogin ? 'login' : 'signup');
  const [form, setForm] = useState({ name: '', email: '', password: '', classLevel: '8', subjects: 'Math' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = mode === 'login' ? `${API_BASE_URL}/api/auth/login` : `${API_BASE_URL}/api/auth/signup`;
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, classLevel: Number(form.classLevel), subjects: [form.subjects] };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Auth failed');

      localStorage.setItem('token', data.token);
      onAuth(data.user);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-16">
      <section className="max-w-2xl rounded-[2rem] border border-orange-200/80 bg-white/80 p-8 shadow-2xl shadow-orange-100">
        <p className="mb-3 inline-flex rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">Joyful learning, one question at a time</p>
        <h1 className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl">Ask your doubts and learn with a bright, encouraging teacher by your side.</h1>
        <p className="mt-5 text-lg text-slate-600">AI Doubt Solver helps students from Class 5 to 12 get simple explanations, hear them aloud, and see a friendly avatar speak along with the answer.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => setMode('signup')} className={`rounded-full px-4 py-2 font-semibold ${mode === 'signup' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-700'}`}>Create account</button>
          <button onClick={() => setMode('login')} className={`rounded-full px-4 py-2 font-semibold ${mode === 'login' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-700'}`}>Log in</button>
        </div>
      </section>

      <section className="w-full max-w-lg rounded-[2rem] border border-orange-200/80 bg-white/90 p-6 shadow-2xl shadow-orange-100">
        <h2 className="text-2xl font-bold text-slate-900">{mode === 'login' ? 'Welcome back' : 'Start learning today'}</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'signup' && (
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-orange-200 px-4 py-3 outline-none ring-0" placeholder="Your name" required />
          )}
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-2xl border border-orange-200 px-4 py-3 outline-none ring-0" placeholder="Email address" required />
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-2xl border border-orange-200 px-4 py-3 outline-none ring-0" placeholder="Password" required />
          {mode === 'signup' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <select value={form.classLevel} onChange={(e) => setForm({ ...form, classLevel: e.target.value })} className="w-full rounded-2xl border border-orange-200 px-4 py-3 outline-none ring-0">
                {[5,6,7,8,9,10,11,12].map((level) => <option key={level} value={level}>Class {level}</option>)}
              </select>
              <select value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} className="w-full rounded-2xl border border-orange-200 px-4 py-3 outline-none ring-0">
                {['Math','Science','English','Social Science','Hindi'].map((subject) => <option key={subject} value={subject}>{subject}</option>)}
              </select>
            </div>
          )}
          <button disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-semibold text-white shadow-lg disabled:opacity-70">{loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}</button>
        </form>
        {message && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{message}</p>}
      </section>
    </main>
  );
};

export default LandingPage;
