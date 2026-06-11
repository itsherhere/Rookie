'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const chips = [
  { icon: '📋', label: 'Spreadsheets everywhere' },
  { icon: '📁', label: 'Lost resumes & files' },
  { icon: '📧', label: 'Scattered emails & follow-ups' },
  { icon: '👁️', label: 'No candidate visibility' },
  { icon: '👥', label: 'Hard to manage early employees' },
];

const GT: React.CSSProperties = {
  background: 'linear-gradient(135deg, #5046E4, #22D3EE)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export function ProblemSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.prob-head', {
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: '.prob-head', start: 'top 80%' },
      });
      gsap.from('.prob-chip', {
        opacity: 0, y: 24, scale: 0.9, stagger: 0.08, duration: 0.5, ease: 'back.out(1.5)',
        immediateRender: false,
        scrollTrigger: { trigger: '.pills-wrap', start: 'top 75%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#5046E4]">The problem</span>
          <h2 className="prob-head mt-4 text-4xl md:text-5xl font-black tracking-tight text-[#0F0F1A] leading-tight" style={{ letterSpacing: '-0.02em' }}>
            Early hiring is <span style={GT}>messy.</span>
          </h2>
          <p className="mt-4 text-[#6B6888] text-lg max-w-lg mx-auto">
            Not because you're doing it wrong — because no tool was built for teams this early.
          </p>
        </div>
        <div className="pills-wrap flex flex-wrap justify-center gap-3">
          {chips.map(chip => (
            <div
              key={chip.label}
              className="prob-chip flex items-center gap-2.5 text-sm font-medium px-5 py-3 rounded-full"
              style={{ background: 'white', border: '1px solid #E8E6F8', color: '#0F0F1A', boxShadow: '0 2px 8px rgba(15,15,26,0.06)' }}
            >
              <span className="text-base">{chip.icon}</span>
              {chip.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
