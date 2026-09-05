import { useEffect, useMemo, useRef, useState } from 'react';
import AvatarPanel from '../components/AvatarPanel';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DashboardPage = ({ user, setUser }) => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/doubt/history`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((res) => res.json())
      .then((data) => setHistory(data || []));
  }, []);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newMessage = { role: 'user', content: question.trim() };
    setMessages((prev) => [...prev, newMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/doubt/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ question: newMessage.content })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to get answer');

      const answerMessage = { role: 'assistant', content: data.answerText, audioBase64: data.audioBase64 };
      setMessages((prev) => [...prev, answerMessage]);
      setHistory((prev) => [{ question: newMessage.content, answer: data.answerText, createdAt: new Date().toISOString() }, ...prev].slice(0, 10));

      if (data.audioBase64) {
        const audioData = `data:audio/wav;base64,${data.audioBase64}`;
        if (audioRef.current) {
          audioRef.current.src = audioData;
          audioRef.current.play().catch(() => {});
        }
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  const subjectLabel = useMemo(() => (user?.subjects?.[0] || 'Science'), [user]);

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
      <section className="rounded-[2rem] border border-orange-200/80 bg-white/85 p-5 shadow-2xl shadow-orange-100">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-600">Doubt-solving studio</p>
            <h2 className="text-2xl font-black text-slate-900">Ask away, {user?.name?.split(' ')[0] || 'student'}</h2>
          </div>
          <div className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">Class {user?.classLevel || 8} • {subjectLabel}</div>
        </div>

        <div className="mb-5 rounded-[1.5rem] border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-4">
          <form onSubmit={handleAsk} className="flex flex-col gap-3 sm:flex-row">
            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Type your question here..." className="flex-1 rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none" />
            <button disabled={loading} className="rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-lg disabled:opacity-70">{loading ? 'Thinking...' : 'Ask'}</button>
          </form>
        </div>

        <div className="space-y-3 overflow-auto rounded-[1.5rem] border border-orange-100 bg-slate-50/80 p-4" style={{ maxHeight: '420px' }}>
          {messages.length === 0 && <p className="text-sm text-slate-500">Your conversation will appear here. Ask a question to begin.</p>}
          {messages.map((message, index) => (
            <div key={index} className={`rounded-2xl p-3 ${message.role === 'user' ? 'ml-auto max-w-[85%] bg-orange-500 text-white' : 'mr-auto max-w-[85%] border border-orange-100 bg-white text-slate-700'}`}>
              <p className="text-sm leading-6">{message.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <AvatarPanel audioElement={audioRef} />
        <audio ref={audioRef} className="hidden" />
        <div className="rounded-[2rem] border border-orange-200/80 bg-white/85 p-5 shadow-2xl shadow-orange-100">
          <h3 className="text-lg font-bold text-slate-900">Recent history</h3>
          <div className="mt-4 space-y-3">
            {history.length === 0 && <p className="text-sm text-slate-500">Your saved questions will show up here after you ask one.</p>}
            {history.map((item, index) => (
              <div key={index} className="rounded-2xl border border-orange-100 bg-orange-50/70 p-3">
                <p className="text-sm font-semibold text-slate-800">{item.question}</p>
                <p className="mt-1 text-sm text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
