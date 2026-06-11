'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const GT: React.CSSProperties = {
  background: 'linear-gradient(135deg, #5046E4, #22D3EE)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const metrics = [
  { end: 12,  label: 'Applications organized', fmt: (n: number) => `${Math.round(n)}K+` },
  { end: 2.5, label: 'Candidates tracked',     fmt: (n: number) => `${(Math.round(n * 10) / 10).toFixed(1)}K+` },
  { end: 480, label: 'Interviews scheduled',   fmt: (n: number) => `${Math.round(n)}+` },
  { end: 94,  label: 'Less hiring chaos',       fmt: (n: number) => `${Math.round(n)}%` },
];

export function MetricsSection() {
  const ref = useRef<HTMLElement>(null);
  const [vals, setVals] = useState(metrics.map(() => 0));

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.met-heading', {
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: '.met-heading', start: 'top 80%' },
      });
      gsap.from('.met-card', {
        opacity: 0, y: 30, stagger: 0.12, duration: 0.6, ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: '.met-grid', start: 'top 80%' },
      });

      // Counter animation
      metrics.forEach((m, i) => {
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: '.met-grid',
          start: 'top 80%',
          once: true,
          onEnter: () => gsap.to(obj, {
            val: m.end,
            duration: 1.6,
            ease: 'power2.out',
            delay: i * 0.1,
            onUpdate: () => setVals(p => {
              const n = [...p];
              n[i] = obj.val;
              return n;
            }),
          }),
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} style={{ background: '#F7F8FF' }} className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#34D399]">Built for startup teams</span>
          <h2 className="met-heading mt-4 text-4xl md:text-5xl font-black tracking-tight text-[#0F0F1A] leading-tight" style={{ letterSpacing: '-0.02em' }}>
            Rookie helps early teams hire, manage,
            <br />and grow <span style={GT}>faster.</span>
          </h2>
        </div>

        <div className="met-grid grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {metrics.map((m, i) => (
            <div key={m.label} className="met-card text-center">
              <p className="text-4xl md:text-5xl font-black text-[#0F0F1A] tabular-nums" style={{ letterSpacing: '-0.02em' }}>
                {m.fmt(vals[i])}
              </p>
              <p className="mt-2 text-sm text-[#6B6888]">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/employer/dashboard" className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full text-sm text-white group" style={{ background: '#0F0F1A' }}>
            View demo dashboard <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
