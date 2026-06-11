'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const gradientText: React.CSSProperties = { background: 'linear-gradient(135deg, #5046E4, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.cta-content > *', { opacity: 0, y: 40, stagger: 0.12, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.cta-content', start: 'top 80%' } });
      gsap.from('.cta-card', { opacity: 0, scale: 0.85, stagger: 0.2, duration: 0.7, ease: 'back.out(1.5)', delay: 0.4, scrollTrigger: { trigger: '.cta-content', start: 'top 80%' } });
      gsap.to('.cta-f1', { y: -10, duration: 3.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.to('.cta-f2', { y: -8, duration: 4.2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={sectionRef} className="relative overflow-hidden py-32" style={{ background: 'radial-gradient(ellipse at top left, rgba(52,211,153,0.12), transparent 50%), radial-gradient(ellipse at top right, rgba(80,70,228,0.1), transparent 55%), linear-gradient(180deg, #F7F7FF, #F0EFF8)' }}>
      <svg className="absolute top-16 left-10 hidden md:block" width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ color: 'rgba(80,70,228,0.3)' }}>
        <path d="M12 2v6M12 16v6M2 12h6M16 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg className="absolute bottom-20 right-16 hidden md:block" width="24" height="24" viewBox="0 0 24 24" fill="#34D399">
        <circle cx="12" cy="12" r="6" />
      </svg>
      <svg className="absolute top-1/2 right-12 hidden md:block" width="22" height="22" viewBox="0 0 24 24" fill="#F97316">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6L12 2z" />
      </svg>
      <div className="cta-card cta-f1 absolute left-[8%] top-1/3 hidden lg:block">
        <div className="bg-white border border-[#E8E6F8] rounded-2xl shadow-xl p-4 w-52">
          <div className="flex items-center gap-2 mb-2"><span>🎯</span><span className="text-xs text-[#6B6888]">Match score</span></div>
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-bold text-[#0F0F1A]">Maya P.</p><p className="text-xs text-[#6B6888]">96% match</p></div>
            <p className="text-lg font-black text-emerald-500">96%</p>
          </div>
        </div>
      </div>
      <div className="cta-card cta-f2 absolute right-[8%] top-1/3 hidden lg:block">
        <div className="rounded-2xl shadow-xl p-4 w-52" style={{ background: '#0F0F1A' }}>
          <p className="text-xs text-white/50 mb-1">📅 Interview · Today</p>
          <p className="text-sm font-bold text-white mb-0.5">Alex Wong</p>
          <p className="text-xs text-white/40">Backend Eng. · 2:30 PM</p>
          <div className="flex gap-2 mt-2.5">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,211,238,0.2)', color: '#22D3EE' }}>Zoom</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.2)', color: '#34D399' }}>Confirmed</span>
          </div>
        </div>
      </div>
      <div className="cta-content relative mx-auto max-w-3xl px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E6F8] bg-white px-3 py-1 text-[11px] font-semibold tracking-widest uppercase text-[#5046E4] shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />Ready when you are
        </span>
        <h2 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight text-[#0F0F1A] leading-[1.05]" style={{ fontFamily: 'var(--font-display, system-ui)' }}>
          Build your first team<br />with <span style={gradientText}>Rookie.</span>
        </h2>
        <p className="mt-5 text-[#6B6888] text-lg max-w-xl mx-auto leading-relaxed">
          From first job post to first payroll preview — keep every hiring step in one beautiful workspace.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/sign-up" className="inline-flex items-center gap-2 bg-[#0F0F1A] hover:bg-[#1a1a2e] text-white px-7 py-3.5 rounded-full font-semibold text-base transition-all group">
            Start hiring <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="/employer/dashboard" className="inline-flex items-center gap-2 border border-[#E8E6F8] hover:border-[#5046E4]/40 text-[#0F0F1A] px-7 py-3.5 rounded-full font-semibold text-base transition-all bg-white">
            View demo
          </Link>
        </div>
        <p className="mt-5 text-sm text-[#6B6888]">Free forever plan · No credit card required</p>
      </div>
    </section>
  );
}
