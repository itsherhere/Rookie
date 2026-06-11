'use client';
// DashboardPreview
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';

const gradientText: React.CSSProperties = { background: 'linear-gradient(135deg, #5046E4, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };

const benefits = ['Real-time hiring overview', 'Actionable candidate insights', 'Everything organized, zero tabs', 'Built for founders and early teams'];

export function DashboardPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.dp-text > *', { opacity: 0, x: -40, stagger: 0.12, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.dp-text', start: 'top 80%' } });
      gsap.from('.dp-main', { opacity: 0, y: 60, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.dp-area', start: 'top 75%' } });
      gsap.from('.dp-float', { opacity: 0, scale: 0.8, stagger: 0.15, duration: 0.7, ease: 'back.out(1.5)', delay: 0.4, scrollTrigger: { trigger: '.dp-area', start: 'top 75%' } });
      gsap.to('.dp-f1', { y: -10, duration: 3.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.to('.dp-f2', { y: -8, duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.7 });
      gsap.to('.dp-f3', { y: -12, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.2 });
      gsap.to('.dp-f4', { y: -8, duration: 4.5, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.3 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F7F7FF] py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="dp-text">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#5046E4]">Workspace</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-[#0F0F1A]" style={{ fontFamily: 'var(--font-display, system-ui)' }}>
              A workspace that keeps everything <span style={gradientText}>synced.</span>
            </h2>
            <p className="mt-5 text-[#6B6888] text-lg leading-relaxed">From the first application to the first paycheck — Rookie connects every piece of your hiring and team workflow.</p>
            <ul className="mt-7 space-y-3.5">
              {benefits.map(b => (
                <li key={b} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#EEF0FF] flex items-center justify-center flex-shrink-0"><Check size={11} className="text-[#5046E4]" /></div>
                  <span className="text-[#0F0F1A] font-medium">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="dp-area relative h-[480px] flex items-center justify-center">
            <div className="dp-main bg-white border border-[#E8E6F8] rounded-2xl shadow-xl p-5 w-full max-w-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#5046E4] rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xs">R</span></div>
                <p className="text-sm font-semibold text-[#0F0F1A]">Candidate pipeline</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['Applied', 'Screened', 'Offer'].map((col, i) => (
                  <div key={col}>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? '#5046E4' : i === 1 ? '#22D3EE' : '#34D399' }} />
                      <span className="text-[#6B6888]">{col}</span>
                    </div>
                    {['Maya P.', 'Sara K.', ...(i === 0 ? ['Alex W.', '+12'] : i === 1 ? ['+6'] : ['Jordan L.'])].map(n => (
                      <div key={n} className="bg-[#F7F7FF] border border-[#E8E6F8] rounded-lg px-2 py-1.5 mb-1 text-[#0F0F1A]">{n}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="dp-float dp-f1 absolute -left-4 top-16 bg-white border border-[#E8E6F8] rounded-2xl shadow-lg p-3.5 w-48">
              <div className="flex items-center gap-1.5 mb-2"><span>🎯</span><span className="text-xs text-[#6B6888]">Match score</span></div>
              <div className="flex items-center justify-between">
                <div><p className="text-xs font-bold text-[#0F0F1A]">Maya Patel</p><p className="text-xs text-[#6B6888]">Product Designer</p></div>
                <p className="text-lg font-black text-emerald-500">96%</p>
              </div>
            </div>
            <div className="dp-float dp-f2 absolute -right-4 top-20 rounded-2xl shadow-xl p-4 w-52" style={{ background: '#0F0F1A' }}>
              <div className="flex items-center gap-2 mb-2"><span>📅</span><span className="text-xs text-white/50">Interview · Today</span></div>
              <p className="text-sm font-bold text-white mb-0.5">Alex Wong</p>
              <p className="text-xs text-white/40">Backend Eng. · 2:30 PM</p>
              <div className="flex gap-2 mt-2.5">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,211,238,0.2)', color: '#22D3EE' }}>Zoom</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.2)', color: '#34D399' }}>Confirmed</span>
              </div>
            </div>
            <div className="dp-float dp-f3 absolute -right-2 bottom-24 bg-white border border-[#E8E6F8] rounded-2xl shadow-lg p-4 w-44">
              <div className="flex justify-between mb-2"><span className="text-xs text-[#6B6888]">Payroll preview</span><span className="text-xs text-[#6B6888]">Jun</span></div>
              <p className="text-2xl font-black text-[#0F0F1A]">$48,210</p>
              <div className="flex items-end gap-0.5 mt-2 h-6">
                {[40, 55, 45, 60, 52, 65, 58].map((h, i) => <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 6 ? '#5046E4' : '#E8E6F8' }} />)}
              </div>
            </div>
            <div className="dp-float dp-f4 absolute -left-2 bottom-20 rounded-2xl shadow-lg p-3.5 w-44" style={{ background: '#34D399' }}>
              <p className="text-xs text-[#0F0F1A]/70 mb-1">Offer accepted 🎉</p>
              <p className="text-sm font-bold text-[#0F0F1A]">+1 hire this week</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
