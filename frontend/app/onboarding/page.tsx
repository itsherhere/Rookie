'use client';
import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Briefcase, Search, AlertCircle } from 'lucide-react';

export default function OnboardingPage() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoaded) return;

    async function checkRole() {
      try {
        const token = await getToken();
        if (!token) { window.location.href = '/sign-in'; return; }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const json = await res.json();
          const role = json?.data?.role ?? json?.role;
          if (role === 'employer')  { window.location.href = '/employer/dashboard'; return; }
          if (role === 'candidate') { window.location.href = '/candidate/dashboard'; return; }
          if (role === 'admin')     { window.location.href = '/admin/dashboard'; return; }
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }

    checkRole();
  }, [isLoaded]);

  async function selectRole(role: 'employer' | 'candidate') {
    setSaving(true);
    setError('');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    try {
      const token = await getToken();
      const email = user?.primaryEmailAddress?.emailAddress || '';

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role, email }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (res.ok) {
        window.location.href = role === 'employer'
          ? '/employer/dashboard'
          : '/candidate/dashboard';
        return;
      }

      const err = await res.json().catch(() => ({}));
      setError(err?.error || `Server error ${res.status}`);
    } catch (e: any) {
      clearTimeout(timer);
      if (e.name === 'AbortError') {
        setError('Request timed out. Is the backend running?');
      } else {
        setError(e.message || 'Network error. Check backend URL.');
      }
    }
    setSaving(false);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0EEFF' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-[#5046E4] flex items-center justify-center text-white font-bold">R</div>
        <div className="w-5 h-5 rounded-full border-2 border-[#5046E4] border-t-transparent animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#F0EEFF' }}>
      <div className="w-9 h-9 rounded-xl bg-[#5046E4] flex items-center justify-center text-white font-bold mb-8">R</div>
      <h1 className="text-3xl font-black text-[#0F0F1A] mb-2 text-center">Welcome to Rookie</h1>
      <p className="text-[#6B6888] mb-10 text-center">What brings you here?</p>

      <div className="grid sm:grid-cols-2 gap-4 w-full max-w-md">
        {[
          { role: 'employer'  as const, icon: Briefcase, title: "I'm hiring",           desc: 'Post jobs, review candidates, build my team', accent: '#5046E4', bg: '#EEF0FF' },
          { role: 'candidate' as const, icon: Search,    title: "I'm looking for a job", desc: 'Browse jobs, apply, track my applications',   accent: '#10B981', bg: '#ECFDF5' },
        ].map(opt => (
          <button
            key={opt.role}
            onClick={() => !saving && selectRole(opt.role)}
            disabled={saving}
            className="bg-white rounded-2xl p-6 text-left transition-all disabled:opacity-60 hover:shadow-lg"
            style={{ border: '2px solid #E8E6F8' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = opt.accent)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#E8E6F8')}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: opt.bg }}>
              <opt.icon size={20} style={{ color: opt.accent }} />
            </div>
            <p className="font-bold text-[#0F0F1A] mb-1">{opt.title}</p>
            <p className="text-sm text-[#6B6888]">{opt.desc}</p>
          </button>
        ))}
      </div>

      {saving && !error && (
        <div className="mt-6 flex items-center gap-2 text-sm text-[#6B6888]">
          <div className="w-4 h-4 rounded-full border-2 border-[#5046E4] border-t-transparent animate-spin" />
          Setting up your workspace...
        </div>
      )}

      {error && (
        <div className="mt-6 flex items-center gap-2 text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl max-w-md">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
