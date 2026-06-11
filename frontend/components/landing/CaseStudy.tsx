'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const GT: React.CSSProperties = { background: 'linear-gradient(135deg, #5046E4, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };
const caseStats = [{ v: 12, s: '', l: 'Employees hired' }, { v: 25, s: '', l: 'Days to fill role avg.' }, { v: 40, s: '%', l: 'Faster than before' }];

export function CaseStudy() {
  const ref = useRef<HTMLElement>(null);
  const [counts, setCounts] = useState(caseStats.map(() => 0));
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.cs-label, .cs-title', { opacity: 0, y: 40, stagger: 0.15, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.cs-title', start: 'top 80%' } });
      gsap.from('.cs-stat', { opacity: 0, y: 30, scale: 0.95, stagger: 0.15, duration: 0.7, ease: 'back.out(1.3)', scrollTrigger: { trigger: '.cs-stats', start: 'top 80%' } });
      gsap.from('.cs-quote', { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.cs-quote', start: 'top 80%' } });
      caseStats.forEach((stat, i) => {
        const obj = { val: 0 };
        ScrollTrigger.create({ trigger: '.cs-stats', start: 'top 80%', once: true, onEnter: () => gsap.to(obj, { val: stat.v, duration: 1.8, ease: 'power2.out', delay: i * 0.15, onUpdate: () => setCounts(p => { const n = [...p]; n[i] = Math.round(obj.val); return n; }) }) });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative py-28 overflow-hidden" style={{ background: '#0D0F1A' }}>
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'rgba(80,70,228,0.35)', filter: 'blur(100px)', opacity: 0.5 }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'rgba(52,211,153,0.2)', filter: 'blur(80px)', opacity: 0.4 }} />
      <div className="relative mx-auto max-w-6xl px-6">
        <span className="cs-label text-xs font-semibold uppercase tracking-widest text-emerald-400">Case Study · Nova Labs</span>
        <h2 className="cs-title mt-4 text-4xl md:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl" style={{ letterSpacing: '-0.02em' }}>
          Nova Labs hired their first <span style={GT}>12 employees</span> with Rookie.
        </h2>
        <div className="cs-stats mt-14 grid md:grid-cols-3 gap-6 max-w-xl">
          {caseStats.map((stat, i) => (
            <div key={stat.l} className="cs-stat rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
              <div className="text-5xl font-black text-white tabular-nums" style={{ letterSpacing: '-0.02em' }}>{counts[i]}{stat.s}</div>
              <div className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.l}</div>
            </div>
          ))}
        </div>
        <div className="cs-quote mt-14 max-w-3xl">
          <div className="text-4xl text-emerald-400 mb-4">"</div>
          <p className="text-2xl md:text-3xl leading-relaxed font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Rookie helped us go from 0 to 12 team members without the chaos. Everything we needed was finally in one clean workspace.
          </p>
          <div className="mt-8 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: '#f9a8d4', color: '#0F0F1A' }}>SL</div>
              <div><div className="font-semibold text-white">Sarah Lin</div><div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Co-founder at Nova Labs</div></div>
            </div>
            <Link href="/case-study" className="flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
              Read full case study <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
