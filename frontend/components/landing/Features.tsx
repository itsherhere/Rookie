'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';

const gradientText: React.CSSProperties = { background: 'linear-gradient(135deg, #5046E4, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };

const cardStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' };

const tabs = [
  {
    label: 'Hiring', icon: '📋', title: 'For teams posting their first roles',
    desc: 'Create jobs, publish openings, and manage every application from one clean hiring pipeline.',
    points: ['Create and publish jobs in minutes', 'Track applications by status', 'Move candidates through stages'],
    preview: (
      <div className="rounded-2xl p-5" style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-white">Hiring pipeline</p>
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399' }}>● Live sync</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {['Applied', 'Reviewed', 'Shortlisted', 'Interview'].map((col, i) => (
            <div key={col}>
              <p className="text-white/50 font-medium mb-2">{col}</p>
              {['Maya P.', 'Jordan L.', ...(i < 2 ? ['Sara K.', 'Alex W.'] : ['Sara K.'])].map(n => (
                <div key={n} className="rounded-lg px-2 py-1.5 mb-1 text-white/80 text-xs" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>{n}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    label: 'Candidates', icon: '🎯', title: 'Find the right fit, faster',
    desc: 'AI-powered match scoring ranks candidates by skill overlap. See who fits best at a glance.',
    points: ['Automatic skill match scoring', 'Full candidate profiles in one view', 'Filter by score, status, or skill'],
    preview: (
      <div className="rounded-2xl p-5" style={cardStyle}>
        <p className="text-sm font-semibold text-white mb-4">Top candidates</p>
        {[{ name: 'Maya Patel', role: 'Product Designer', score: 96 }, { name: 'Jordan Lee', role: 'Frontend Engineer', score: 92 }, { name: 'Sara Kim', role: 'Growth Lead', score: 88 }].map(c => (
          <div key={c.name} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #5046E4, #22D3EE)' }}>{c.name[0]}</div>
              <div><p className="text-sm font-medium text-white">{c.name}</p><p className="text-xs text-white/50">{c.role}</p></div>
            </div>
            <span className="text-sm font-bold" style={{ color: '#34D399' }}>{c.score}%</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: 'Interviews', icon: '📅', title: 'Schedule without the back-and-forth',
    desc: 'Send interview invites from the platform. Candidates accept or decline with one click.',
    points: ['Online, onsite, or phone interviews', 'Candidates respond from email', 'Auto-updates application status'],
    preview: (
      <div className="rounded-2xl p-5" style={cardStyle}>
        <p className="text-sm font-semibold text-white mb-4">Upcoming interviews</p>
        {[{ name: 'Alex Wong', role: 'Backend Eng.', time: 'Today · 2:30 PM', ok: true }, { name: 'Priya Shah', role: 'PM', time: 'Tomorrow · 11 AM', ok: false }].map(i => (
          <div key={i.name} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>📅</div>
              <div><p className="text-sm font-medium text-white">{i.name}</p><p className="text-xs text-white/50">{i.role} · {i.time}</p></div>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={i.ok ? { background: 'rgba(52,211,153,0.15)', color: '#34D399' } : { background: 'rgba(249,115,22,0.15)', color: '#F97316' }}>
              {i.ok ? 'Confirmed' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: 'Employees', icon: '👥', title: 'Keep your growing team organized',
    desc: 'Store roles, salaries, and start dates. Your single HR source of truth.',
    points: ['Full employee profiles & contracts', 'Attendance and leave tracking', 'Monthly payroll preview'],
    preview: (
      <div className="rounded-2xl p-5" style={cardStyle}>
        <p className="text-sm font-semibold text-white mb-4">Team</p>
        {[{ name: 'Maya Patel', role: 'Product Designer', salary: '$4,200' }, { name: 'Alex Wong', role: 'Backend Engineer', salary: '$5,100' }, { name: 'Sara Kim', role: 'Growth Lead', salary: '$4,500' }].map(e => (
          <div key={e.name} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(80,70,228,0.3)', color: '#A5B4FC' }}>{e.name[0]}</div>
              <div><p className="text-xs font-medium text-white">{e.name}</p><p className="text-xs text-white/50">{e.role}</p></div>
            </div>
            <p className="text-xs font-semibold" style={{ color: '#34D399' }}>{e.salary}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: 'Payroll', icon: '💰', title: 'Forecast pay runs before they happen',
    desc: 'Auto-calculate gross, estimated tax, and net pay. Export-ready monthly reports.',
    points: ['Monthly gross & net calculation', 'Estimated tax breakdown', 'Export-ready payroll reports'],
    preview: (
      <div className="rounded-2xl p-5" style={cardStyle}>
        <div className="flex items-center justify-between mb-4"><p className="text-sm font-semibold text-white">Payroll preview</p><p className="text-xs text-white/50">Jun 2026</p></div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[{ label: 'Gross', v: '$48,210', c: 'text-white' }, { label: 'Tax est.', v: '−$7,232', c: 'text-orange-400' }, { label: 'Net', v: '$40,978', c: 'text-emerald-400' }].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs text-white/50 mb-1">{s.label}</p><p className={`text-sm font-bold ${s.c}`}>{s.v}</p>
            </div>
          ))}
        </div>
        <div className="h-10 flex items-end gap-1">
          {[30, 45, 38, 52, 48, 55, 48].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 6 ? '#5046E4' : 'rgba(255,255,255,0.08)' }} />
          ))}
        </div>
      </div>
    ),
  },
];

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.feat-heading', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.feat-heading', start: 'top 85%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    gsap.fromTo('.feat-panel', { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' });
  }, [active]);

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden" style={{ background: '#0F0F1A' }}>
      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'rgba(80,70,228,0.3)', filter: 'blur(80px)', animation: 'pulse 8s ease-in-out infinite' }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'rgba(34,211,238,0.15)', filter: 'blur(80px)', animation: 'pulse 8s ease-in-out infinite', animationDelay: '3s' }} />

      <div className="relative mx-auto max-w-6xl px-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#22D3EE]">Product needs</span>
        <h2 className="feat-heading mt-4 text-4xl md:text-5xl font-bold leading-tight text-white max-w-2xl" style={{ fontFamily: 'var(--font-display, system-ui)' }}>
          One workspace for every stage of{' '}
          <span style={gradientText}>building your team.</span>
        </h2>
        <p className="mt-4 text-white/50 text-lg max-w-lg">From posting your first job to running payroll — every part of Rookie connects to the next.</p>

        <div className="mt-10 flex flex-wrap gap-1 mb-10 rounded-2xl p-1.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {tabs.map((tab, i) => (
            <button key={tab.label} onClick={() => setActive(i)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all" style={active === i ? { background: 'white', color: '#0F0F1A' } : { color: 'rgba(255,255,255,0.5)' }}>
              <span>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>

        <div className="feat-panel grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display, system-ui)' }}>{tabs[active].title}</h3>
            <p className="text-white/50 mb-6 leading-relaxed">{tabs[active].desc}</p>
            <ul className="space-y-3">
              {tabs[active].points.map(p => (
                <li key={p} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(52,211,153,0.2)' }}>
                    <Check size={11} className="text-emerald-400" />
                  </div>
                  <span className="text-sm text-white/70">{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>{tabs[active].preview}</div>
        </div>
      </div>
    </section>
  );
}
