'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const GT: React.CSSProperties = {
  background: 'linear-gradient(135deg, #5046E4, #22D3EE)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const features = [
  { icon: '📋', title: 'Job posting', desc: 'Publish polished job listings in minutes.' },
  { icon: '👤', title: 'Candidate profiles', desc: 'All applicant info in one beautiful view.' },
  { icon: '🎯', title: 'Skill match score', desc: 'AI-ranked candidates so you focus on the best.' },
  { icon: '📅', title: 'Interview scheduling', desc: 'Book interviews without the back-and-forth.' },
  { icon: '💬', title: 'Messaging', desc: 'Talk to applicants right from Rookie.' },
  { icon: '👥', title: 'Employee management', desc: 'Keep your growing team organized.' },
  { icon: '⏰', title: 'Attendance', desc: 'Effortless check-ins and time tracking.' },
  { icon: '🏖️', title: 'Leave management', desc: 'Approve time off in one click.' },
  { icon: '💰', title: 'Payroll preview', desc: 'Forecast pay runs before they happen.' },
  { icon: '📊', title: 'Admin analytics', desc: 'Real-time insights for founders.' },
];

export function FeaturesGrid() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.fg-head', {
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: '.fg-head', start: 'top 80%' },
      });
      // Animate only y (no opacity) so cards are always visible
      gsap.from('.fg-card', {
        y: 40, stagger: 0.05, duration: 0.5, ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: { trigger: '.fg-grid', start: 'top 85%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} style={{ background: '#F7F8FF' }} className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#5046E4]">Features</span>
          <h2
            className="fg-head mt-4 text-4xl md:text-5xl font-black tracking-tight text-[#0F0F1A]"
            style={{ letterSpacing: '-0.02em' }}
          >
            Built for <span style={GT}>startup teams</span>
          </h2>
          <p className="mt-3 text-[#6B6888] text-lg max-w-md mx-auto">
            Every tool you need to hire and run your first team — no spreadsheets required.
          </p>
        </div>

        <div className="fg-grid grid grid-cols-2 md:grid-cols-5 gap-4">
          {features.map(f => (
            <div
              key={f.title}
              className="fg-card bg-white rounded-2xl p-5"
              style={{
                border: '1px solid #E8E6F8',
                boxShadow: '0 1px 3px rgba(15,15,26,0.04)',
                transition: 'all 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.boxShadow = '0 8px 24px rgba(80,70,228,0.12)';
                el.style.borderColor = 'rgba(80,70,228,0.3)';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.boxShadow = '0 1px 3px rgba(15,15,26,0.04)';
                el.style.borderColor = '#E8E6F8';
                el.style.transform = 'translateY(0)';
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3"
                style={{ background: '#F7F8FF' }}
              >
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-[#0F0F1A] mb-1">{f.title}</h3>
              <p className="text-xs text-[#6B6888] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
