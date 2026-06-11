'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const GT: React.CSSProperties = { background: 'linear-gradient(135deg, #5046E4, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };

const steps = [
  { n: 'STEP 01', icon: '📋', title: 'Post a job', desc: 'Create and publish jobs in minutes.', accent: '#5046E4', bg: 'rgba(80,70,228,0.08)' },
  { n: 'STEP 02', icon: '🎯', title: 'Review candidates', desc: 'See AI match scores and shortlist the best.', accent: '#34D399', bg: 'rgba(52,211,153,0.08)' },
  { n: 'STEP 03', icon: '📅', title: 'Schedule interviews', desc: 'Book interviews and keep everyone in sync.', accent: '#22D3EE', bg: 'rgba(34,211,238,0.08)' },
  { n: 'STEP 04', icon: '👥', title: 'Manage your team', desc: 'Onboard, manage, and grow your team.', accent: '#F97316', bg: 'rgba(249,115,22,0.08)' },
];

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.how-head', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.how-head', start: 'top 85%' } });
      gsap.from('.how-step', { opacity: 0, y: 50, stagger: 0.18, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.how-grid', start: 'top 80%' } });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#5046E4]">How it works</span>
          <h2 className="how-head mt-4 text-4xl md:text-5xl font-black tracking-tight text-[#0F0F1A] leading-tight" style={{ letterSpacing: '-0.02em' }}>
            Everything you need to hire and manage<br />your team, in <span style={GT}>one place.</span>
          </h2>
        </div>
        <div className="how-grid grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.n} className="how-step relative">
              {i < steps.length - 1 && <div className="hidden md:block absolute h-px top-7" style={{ left: '60px', right: '-24px', background: `repeating-linear-gradient(90deg, ${step.accent}50 0, ${step.accent}50 5px, transparent 5px, transparent 11px)` }} />}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5" style={{ background: step.bg }}>{step.icon}</div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: step.accent }}>{step.n}</p>
              <h3 className="text-lg font-bold text-[#0F0F1A] mb-2">{step.title}</h3>
              <p className="text-sm text-[#6B6888] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
