'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { ArrowRight, Play, Star } from 'lucide-react';

const GT: React.CSSProperties = {
  background: 'linear-gradient(135deg, #5046E4, #22D3EE)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

function DashboardMockup() {
  return (
    <div
      className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden"
      style={{
        boxShadow: '0 40px 80px rgba(80,70,228,0.2), 0 0 0 1px rgba(80,70,228,0.1)',
      }}
    >
      {/* Browser bar */}
      <div style={{ background: '#E8E6F8', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, background: 'white', borderRadius: 6, padding: '3px 12px', textAlign: 'center', fontSize: 11, color: '#6B6888', maxWidth: 280, margin: '0 auto' }}>
          app.rookie.so/employer/dashboard
        </div>
      </div>

      {/* Dashboard content */}
      <div style={{ display: 'flex', height: 360, background: '#F7F7FF' }}>
        {/* Sidebar */}
        <div style={{ width: 160, background: '#0F0F1A', padding: '16px 10px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '0 8px' }}>
            <div style={{ width: 24, height: 24, background: '#5046E4', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>R</div>
            <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>Rookie</span>
          </div>
          {[
            { label: 'Overview', active: true },
            { label: 'Jobs', active: false },
            { label: 'Applications', active: false },
            { label: 'Interviews', active: false },
            { label: 'Messages', active: false },
            { label: 'Employees', active: false },
            { label: 'Payroll', active: false },
          ].map(item => (
            <div
              key={item.label}
              style={{
                padding: '7px 10px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: item.active ? 600 : 400,
                color: item.active ? 'white' : 'rgba(255,255,255,0.35)',
                background: item.active ? '#5046E4' : 'transparent',
              }}
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: 16, overflow: 'hidden' }}>
          {/* Top stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
            {[
              { n: '12', l: 'Open jobs', c: '#5046E4' },
              { n: '248', l: 'Applications', c: '#5046E4' },
              { n: '18', l: 'Interviews', c: '#22D3EE' },
              { n: '7', l: 'Hired', c: '#34D399' },
            ].map(s => (
              <div key={s.l} style={{ background: 'white', border: '1px solid #E8E6F8', borderRadius: 10, padding: '8px 10px' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.c }}>{s.n}</div>
                <div style={{ fontSize: 9, color: '#6B6888', marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Pipeline + Candidates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {/* Pipeline */}
            <div style={{ background: 'white', border: '1px solid #E8E6F8', borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#0F0F1A', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>Hiring pipeline</span>
                <span style={{ color: '#5046E4', fontSize: 9 }}>Q2 · 2026</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4, fontSize: 9 }}>
                {['Applied\n124', 'Screen\n56', 'Interview\n24', 'Offer\n8'].map(col => {
                  const [label, count] = col.split('\n');
                  return (
                    <div key={label}>
                      <div style={{ color: '#6B6888', marginBottom: 4 }}>{label}</div>
                      <div style={{ fontWeight: 700, color: '#0F0F1A', fontSize: 13 }}>{count}</div>
                      <div style={{ height: 3, borderRadius: 2, marginTop: 4, background: '#5046E4', opacity: Number(count) / 130 }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 10, padding: '5px 8px', background: '#FFF7ED', borderRadius: 6, fontSize: 9, color: '#6B6888' }}>
                Payroll preview · <span style={{ color: '#F59E0B', fontWeight: 600 }}>$48,210</span>
              </div>
            </div>

            {/* Top candidates */}
            <div style={{ background: 'white', border: '1px solid #E8E6F8', borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#0F0F1A', marginBottom: 8 }}>Top candidates</div>
              {[
                { name: 'Maya Patel', role: 'Product Designer', score: 96 },
                { name: 'Jordan Lee', role: 'Frontend Engineer', score: 92 },
                { name: 'Sara Kim', role: 'Growth Lead', score: 88 },
              ].map(c => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg,#5046E4,#22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: 'white' }}>{c.name[0]}</div>
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 600, color: '#0F0F1A' }}>{c.name}</div>
                      <div style={{ fontSize: 8, color: '#6B6888' }}>{c.role}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#34D399' }}>{c.score}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interviews */}
          <div style={{ marginTop: 8, background: 'white', border: '1px solid #E8E6F8', borderRadius: 10, padding: '8px 10px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#0F0F1A', marginBottom: 6 }}>Upcoming interviews</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { name: 'Alex Wong', role: 'Backend Eng.', time: 'Today · 2:30 PM', ok: true },
                { name: 'Priya Shah', role: 'PM', time: 'Tomorrow · 11AM', ok: false },
              ].map(i => (
                <div key={i.name} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: '#EEF0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>📅</div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: '#0F0F1A' }}>{i.name}</div>
                    <div style={{ fontSize: 8, color: '#6B6888' }}>{i.role} · <span style={{ color: i.ok ? '#5046E4' : '#6B6888' }}>{i.time}</span></div>
                  </div>
                  {i.ok && <div style={{ marginLeft: 'auto', fontSize: 8, background: '#ECFDF5', color: '#10B981', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>✓</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  useEffect(() => {
    gsap.fromTo('.hero-content > *',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out', delay: 0.2 }
    );
    gsap.fromTo('.hero-mockup',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.6 }
    );
    gsap.fromTo('.hero-float',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, stagger: 0.15, duration: 0.6, ease: 'back.out(1.5)', delay: 1 }
    );
    gsap.to('.float-1', { y: -8, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true });
    gsap.to('.float-2', { y: -6, duration: 3.5, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.5 });
  }, []);

  return (
    <section
      className="relative overflow-hidden pt-28 pb-16"
      style={{
        background: 'radial-gradient(ellipse at top left, rgba(52,211,153,0.12) 0%, transparent 50%), radial-gradient(ellipse at top right, rgba(80,70,228,0.1) 0%, transparent 55%), linear-gradient(180deg, #F7F8FF 0%, #F0EEFF 100%)',
      }}
    >
      {/* Decorative SVGs */}
      <svg className="absolute top-36 left-12 hidden md:block" width="36" height="36" viewBox="0 0 24 24" fill="none" style={{ color: 'rgba(80,70,228,0.25)' }}>
        <path d="M12 2v6M12 16v6M2 12h6M16 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg className="absolute top-48 right-16 hidden md:block" width="28" height="28" viewBox="0 0 24 24" fill="#34D399" style={{ opacity: 0.6 }}>
        <circle cx="12" cy="12" r="6" />
      </svg>
      <svg className="absolute top-40 right-1/3 hidden md:block" width="20" height="20" viewBox="0 0 24 24" fill="#F97316" style={{ opacity: 0.5 }}>
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6L12 2z" />
      </svg>

      <div className="hero-content mx-auto max-w-5xl px-6 text-center">
        {/* Pill label */}
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase mb-6"
          style={{ background: 'rgba(80,70,228,0.08)', border: '1px solid rgba(80,70,228,0.15)', color: '#5046E4' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#34D399' }} />
          HR OS for Startup Teams
        </span>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-[#0F0F1A] mb-6"
          style={{ letterSpacing: '-0.02em' }}
        >
          Hiring your first team
          <br />
          shouldn't feel like{' '}
          <span className="relative inline-block">
            <span style={GT}>managing chaos</span>
            <svg className="absolute -right-5 -top-3 hidden md:block" width="22" height="22" viewBox="0 0 24 24" fill="#F97316" style={{ opacity: 0.7 }}>
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6L12 2z" />
            </svg>
          </span>
          .
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-[#6B6888] max-w-2xl mx-auto mb-8 leading-relaxed">
          Rookie gives startups one clean workspace to post jobs, track applicants, schedule interviews, manage employees, and grow their first team.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-full text-base transition-all group"
            style={{ background: '#0F0F1A' }}
          >
            Start hiring
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/employer/dashboard"
            className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full text-base transition-all text-[#0F0F1A] bg-white"
            style={{ border: '1px solid #E8E6F8' }}
          >
            <Play size={15} className="text-[#5046E4]" /> View demo
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-[#6B6888]">
          <div className="flex -space-x-2">
            {['#C4B5FD', '#6EE7B7', '#FCA5A5', '#93C5FD'].map((c, i) => (
              <div key={i} className="w-7 h-7 rounded-full ring-2 ring-white" style={{ background: c }} />
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex text-orange-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
            </div>
            <span className="font-semibold text-[#0F0F1A]">4.9/5</span>
            <span>· Loved by 200+ early-stage teams</span>
          </div>
        </div>
      </div>

      {/* Dashboard mockup */}
      <div className="hero-mockup mx-auto max-w-5xl px-6 mt-14 relative">
        <DashboardMockup />

        {/* Floating cards */}
        <div
          className="hero-float float-1 absolute -left-4 top-24 hidden lg:block"
          style={{ background: 'white', border: '1px solid #E8E6F8', borderRadius: 14, padding: '12px 14px', boxShadow: '0 8px 24px rgba(80,70,228,0.12)', width: 180 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: 14 }}>🎯</span>
            <span style={{ fontSize: 10, color: '#6B6888' }}>Match score</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0F0F1A' }}>Maya P.</div>
              <div style={{ fontSize: 9, color: '#6B6888' }}>Product Designer</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#34D399' }}>96%</div>
          </div>
        </div>

        <div
          className="hero-float float-2 absolute -right-4 bottom-24 hidden lg:block"
          style={{ background: '#0F0F1A', borderRadius: 14, padding: '12px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', width: 190 }}
        >
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Offer accepted 🎉</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>+1 hire this week</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <div style={{ width: 20, height: 20, background: '#5046E4', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: 'white', fontWeight: 700 }}>K</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>Team · <span style={{ color: '#34D399' }}>+1 hired</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
