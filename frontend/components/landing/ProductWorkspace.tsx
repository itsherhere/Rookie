'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight } from 'lucide-react';

const GT: React.CSSProperties = {
  background: 'linear-gradient(135deg, #5046E4, #22D3EE)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const CARD: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(8px)',
  borderRadius: 16,
  padding: 20,
};

const tabs = [
  {
    icon: '📋', label: 'Hiring',
    title: 'For teams posting their first roles',
    desc: 'Create jobs, publish openings, and manage every application from one clean hiring pipeline.',
    points: ['Create and publish jobs', 'Track applications by status', 'Move candidates through stages'],
    preview: () => (
      <div style={CARD}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>Hiring pipeline</span>
          <span style={{ fontSize: 10, background: 'rgba(52,211,153,0.15)', color: '#34D399', padding: '3px 8px', borderRadius: 20 }}>● Live sync</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, fontSize: 10 }}>
          {[['Applied', '124'], ['Reviewed', '56'], ['Shortlisted', '24'], ['Interview', '8']].map(([col, count]) => (
            <div key={col}>
              <div style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{col}</div>
              <div style={{ fontWeight: 800, color: 'white', fontSize: 18, marginBottom: 4 }}>{count}</div>
              {['Maya P.', 'Sara K.', 'Alex W.'].slice(0, Number(count) > 20 ? 3 : Number(count) > 10 ? 2 : 1).map(n => (
                <div key={n} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '5px 8px', marginBottom: 4, color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{n}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ background: 'rgba(80,70,228,0.2)', color: '#A5B4FC', fontSize: 9, padding: '3px 8px', borderRadius: 20 }}>AI assisted</span>
        </div>
      </div>
    ),
  },
  {
    icon: '🎯', label: 'Candidates',
    title: 'Find the right fit, faster',
    desc: 'AI-powered match scoring ranks candidates by skill overlap. See who fits best at a glance.',
    points: ['Automatic skill match scoring', 'Full candidate profiles', 'Filter by score or skill'],
    preview: () => (
      <div style={CARD}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'white', marginBottom: 14 }}>Top candidates</div>
        {[{ n: 'Maya Patel', r: 'Product Designer', s: 96 }, { n: 'Jordan Lee', r: 'Frontend Engineer', s: 92 }, { n: 'Sara Kim', r: 'Growth Lead', s: 88 }].map(c => (
          <div key={c.n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#5046E4,#22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>{c.n[0]}</div>
              <div><div style={{ fontSize: 11, fontWeight: 600, color: 'white' }}>{c.n}</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{c.r}</div></div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#34D399' }}>{c.s}%</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: '📅', label: 'Interviews',
    title: 'Schedule without the back-and-forth',
    desc: 'Send interview invites from the platform. Candidates accept or decline with one click.',
    points: ['Online, onsite, or phone', 'Accept from email', 'Auto-update status'],
    preview: () => (
      <div style={CARD}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'white', marginBottom: 14 }}>Upcoming interviews</div>
        {[{ n: 'Alex Wong', r: 'Backend Eng.', t: 'Today · 2:30 PM', ok: true }, { n: 'Priya Shah', r: 'PM', t: 'Tomorrow · 11 AM', ok: false }].map(i => (
          <div key={i.n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📅</div>
              <div><div style={{ fontSize: 11, fontWeight: 600, color: 'white' }}>{i.n}</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{i.r} · {i.t}</div></div>
            </div>
            <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: i.ok ? 'rgba(52,211,153,0.15)' : 'rgba(249,115,22,0.15)', color: i.ok ? '#34D399' : '#F97316', fontWeight: 600 }}>
              {i.ok ? 'Confirmed' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: '💬', label: 'Messages',
    title: 'Chat with candidates directly',
    desc: 'Message candidates without leaving the platform. Conversations tied to their application.',
    points: ['Threaded conversations', 'Tied to applications', 'Instant notifications'],
    preview: () => (
      <div style={CARD}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'white', marginBottom: 14 }}>Messages</div>
        {[{ n: 'Maya Patel', msg: 'Looking forward to the interview!', t: '2m ago' }, { n: 'Jordan Lee', msg: 'Can we reschedule to Thursday?', t: '1h ago' }].map(m => (
          <div key={m.n} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#5046E4,#22D3EE)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>{m.n[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'white' }}>{m.n}</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{m.t}</span>
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{m.msg}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: '👥', label: 'Employees',
    title: 'Keep your growing team organized',
    desc: 'Store roles, salaries, start dates. Your single HR source of truth.',
    points: ['Full employee profiles', 'Attendance & leave', 'Monthly payroll preview'],
    preview: () => (
      <div style={CARD}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'white', marginBottom: 14 }}>Team</div>
        {[{ n: 'Maya Patel', r: 'Product Designer', s: '$4,200' }, { n: 'Alex Wong', r: 'Backend Engineer', s: '$5,100' }, { n: 'Sara Kim', r: 'Growth Lead', s: '$4,500' }].map(e => (
          <div key={e.n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(80,70,228,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#A5B4FC' }}>{e.n[0]}</div>
              <div><div style={{ fontSize: 11, fontWeight: 600, color: 'white' }}>{e.n}</div><div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>{e.r}</div></div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#34D399' }}>{e.s}</span>
          </div>
        ))}
      </div>
    ),
  },
  { icon: '⏰', label: 'Attendance', title: 'Track hours effortlessly', desc: 'Log clock-in and clock-out per employee. Filter by date or status.', points: ['Daily clock-in/out', 'Filter by employee', 'Status tracking'], preview: () => <div style={CARD}><div style={{ fontSize: 12, fontWeight: 600, color: 'white', marginBottom: 14 }}>Attendance</div>{[{ n: 'Maya Patel', s: 'Present', t: '9:02 AM' }, { n: 'Alex Wong', s: 'Late', t: '10:15 AM' }, { n: 'Sara Kim', s: 'Present', t: '8:55 AM' }].map(e => <div key={e.n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}><div style={{ fontSize: 11, color: 'white' }}>{e.n}</div><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>{e.t}</span><span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: e.s === 'Present' ? 'rgba(52,211,153,0.15)' : 'rgba(249,115,22,0.15)', color: e.s === 'Present' ? '#34D399' : '#F97316', fontWeight: 600 }}>{e.s}</span></div></div>)}</div> },
  { icon: '💰', label: 'Payroll', title: 'Forecast pay runs before they happen', desc: 'Auto-calculate gross, tax, and net from employee salaries.', points: ['Monthly calculations', 'Tax estimates', 'Export-ready'], preview: () => <div style={CARD}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}><span style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>Payroll preview</span><span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Jun 2026</span></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>{[{ l: 'Gross', v: '$48,210', c: 'white' }, { l: 'Tax', v: '−$7,232', c: '#F97316' }, { l: 'Net', v: '$40,978', c: '#34D399' }].map(s => <div key={s.l} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 10, textAlign: 'center' }}><div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{s.l}</div><div style={{ fontSize: 12, fontWeight: 700, color: s.c }}>{s.v}</div></div>)}</div><div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40 }}>{[30, 45, 38, 52, 48, 55, 48].map((h, i) => <div key={i} style={{ flex: 1, borderRadius: 4, height: `${h}%`, background: i === 6 ? '#5046E4' : 'rgba(255,255,255,0.08)' }} />)}</div></div> },
  { icon: '📊', label: 'Analytics', title: 'Real-time hiring insights', desc: 'Track your pipeline performance, time-to-hire, and team growth.', points: ['Pipeline metrics', 'Time-to-hire', 'Team growth tracking'], preview: () => <div style={CARD}><div style={{ fontSize: 12, fontWeight: 600, color: 'white', marginBottom: 14 }}>Analytics</div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>{[{ l: 'Avg time-to-hire', v: '18 days', c: '#22D3EE' }, { l: 'Offer acceptance', v: '87%', c: '#34D399' }, { l: 'Active pipelines', v: '12', c: '#5046E4' }, { l: 'Interviews/week', v: '8', c: '#F97316' }].map(s => <div key={s.l} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 10 }}><div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{s.l}</div><div style={{ fontSize: 18, fontWeight: 800, color: s.c }}>{s.v}</div></div>)}</div></div> },
];

export function ProductWorkspace() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.pw-heading', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.pw-heading', start: 'top 85%' } });
    }, ref);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    gsap.fromTo('.pw-panel', { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' });
  }, [active]);

  const Preview = tabs[active].preview;

  return (
    <section ref={ref} className="relative py-28 overflow-hidden" style={{ background: '#0D0F1A' }}>
      {/* Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'rgba(80,70,228,0.3)', filter: 'blur(100px)', opacity: 0.4 }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'rgba(34,211,238,0.15)', filter: 'blur(80px)', opacity: 0.4 }} />

      <div className="relative mx-auto max-w-6xl px-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#22D3EE]">Product needs</span>
        <h2 className="pw-heading mt-4 text-4xl md:text-5xl font-black tracking-tight text-white leading-tight max-w-2xl" style={{ letterSpacing: '-0.02em' }}>
          One workspace for every stage of{' '}
          <span style={GT}>building your team.</span>
        </h2>
        <p className="mt-4 text-lg max-w-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
          From posting your first job to running payroll — every part of Rookie connects to the next.
        </p>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap gap-1 rounded-2xl p-1.5 mb-10" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActive(i)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={active === i ? { background: 'white', color: '#0F0F1A' } : { color: 'rgba(255,255,255,0.45)' }}
            >
              <span>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>

        <div className="pw-panel grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4" style={{ letterSpacing: '-0.01em' }}>{tabs[active].title}</h3>
            <p className="mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{tabs[active].desc}</p>
            <ul className="space-y-3 mb-6">
              {tabs[active].points.map(p => (
                <li key={p} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(52,211,153,0.2)' }}>
                    <Check size={11} className="text-emerald-400" />
                  </div>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{p}</span>
                </li>
              ))}
            </ul>
            <button className="flex items-center gap-2 text-sm font-semibold text-[#22D3EE] hover:text-white transition-colors">
              Explore {tabs[active].label.toLowerCase()} tools <ArrowRight size={14} />
            </button>
          </div>
          <div><Preview /></div>
        </div>
      </div>
    </section>
  );
}
