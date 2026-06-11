'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';

const GT: React.CSSProperties = { background: 'linear-gradient(135deg, #5046E4, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };
const benefits = ['Real-time overview', 'Actionable candidate insights', 'Everything organized', 'Built for startups'];

export function WorkspaceOverview() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.wo-text > *', { opacity: 0, x: -40, stagger: 0.12, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.wo-text', start: 'top 80%' } });
      gsap.from('.wo-card', { opacity: 0, y: 40, scale: 0.95, stagger: 0.12, duration: 0.7, ease: 'back.out(1.3)', scrollTrigger: { trigger: '.wo-area', start: 'top 75%' } });
      gsap.to('.wo-f1', { y: -10, duration: 3.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.to('.wo-f2', { y: -8, duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.7 });
      gsap.to('.wo-f3', { y: -12, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.2 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="wo-text">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#5046E4]">Workspace</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-[#0F0F1A] leading-tight" style={{ letterSpacing: '-0.02em' }}>
              A workspace that keeps everything <span style={GT}>synced.</span>
            </h2>
            <p className="mt-5 text-[#6B6888] text-lg leading-relaxed">From the first application to the first paycheck — Rookie connects every piece of your hiring and team workflow.</p>
            <ul className="mt-6 space-y-3">
              {benefits.map(b => (
                <li key={b} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#EEF0FF] flex items-center justify-center flex-shrink-0"><Check size={11} className="text-[#5046E4]" /></div>
                  <span className="text-[#0F0F1A] font-medium">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="wo-area relative h-[420px] flex items-center justify-center">
            <div className="wo-card wo-f1 absolute" style={{ background: 'white', border: '1px solid #E8E6F8', borderRadius: 16, padding: 16, boxShadow: '0 20px 40px rgba(80,70,228,0.12)', width: 280, top: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 22, height: 22, background: '#5046E4', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white' }}>R</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#0F0F1A' }}>Candidate pipeline</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, fontSize: 9 }}>
                {[['Applied', ['Maya P.', 'Sara K.', '+12']], ['Screened', ['Liam O.', '+6']], ['Offer', ['Jordan L.']]].map(([label, names]) => (
                  <div key={label as string}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: label === 'Applied' ? '#5046E4' : label === 'Screened' ? '#22D3EE' : '#34D399' }} />
                      <span style={{ color: '#6B6888', fontWeight: 500 }}>{label as string}</span>
                    </div>
                    {(names as string[]).map(n => <div key={n} style={{ background: '#F7F8FF', border: '1px solid #E8E6F8', borderRadius: 6, padding: '4px 6px', marginBottom: 3, color: '#0F0F1A' }}>{n}</div>)}
                  </div>
                ))}
              </div>
            </div>
            <div className="wo-card wo-f2 absolute" style={{ background: 'white', border: '1px solid #E8E6F8', borderRadius: 14, padding: '12px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', width: 180, bottom: 120, right: -20 }}>
              <div style={{ fontSize: 9, color: '#6B6888', marginBottom: 8 }}>🎯 Match score</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontSize: 11, fontWeight: 700, color: '#0F0F1A' }}>Maya Patel</div><div style={{ fontSize: 9, color: '#6B6888' }}>Product Designer</div></div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#34D399' }}>96%</div>
              </div>
            </div>
            <div className="wo-card wo-f3 absolute" style={{ background: '#0F0F1A', borderRadius: 14, padding: '12px 14px', boxShadow: '0 12px 30px rgba(0,0,0,0.2)', width: 200, top: 100, right: -30 }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>📅 Interview · Today</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 2 }}>Alex Wong</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Backend Eng. · 2:30 PM</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ fontSize: 9, background: 'rgba(34,211,238,0.2)', color: '#22D3EE', padding: '3px 8px', borderRadius: 20 }}>Zoom</span>
                <span style={{ fontSize: 9, background: 'rgba(52,211,153,0.2)', color: '#34D399', padding: '3px 8px', borderRadius: 20 }}>Confirmed</span>
              </div>
            </div>
            <div className="wo-card absolute" style={{ background: 'white', border: '1px solid #E8E6F8', borderRadius: 14, padding: '12px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', width: 170, bottom: 40, left: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ fontSize: 9, color: '#6B6888' }}>Payroll preview</span><span style={{ fontSize: 9, color: '#6B6888' }}>Jun</span></div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#0F0F1A', marginBottom: 8 }}>$48,210</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 24 }}>
                {[35, 50, 42, 58, 48, 62, 55].map((h, i) => <div key={i} style={{ flex: 1, borderRadius: 3, height: `${h}%`, background: i === 6 ? '#5046E4' : '#E8E6F8' }} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
