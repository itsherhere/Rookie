'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

const GT: React.CSSProperties = { background: 'linear-gradient(135deg, #5046E4, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.cta-content > *', { opacity: 0, y: 40, stagger: 0.1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.cta-content', start: 'top 80%' } });
      gsap.from('.cta-float', { opacity: 0, scale: 0.8, stagger: 0.15, duration: 0.7, ease: 'back.out(1.5)', delay: 0.4, scrollTrigger: { trigger: '.cta-content', start: 'top 80%' } });
      gsap.to('.cta-f1', { y: -10, duration: 3.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.to('.cta-f2', { y: -8, duration: 4.2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-16 px-6" style={{ background: '#F7F8FF' }}>
      <div className="mx-auto max-w-4xl relative">
        {/* Large rounded card */}
        <div
          className="relative overflow-hidden rounded-3xl p-16"
          style={{
            background: 'radial-gradient(ellipse at top left, rgba(52,211,153,0.1), transparent 50%), radial-gradient(ellipse at top right, rgba(80,70,228,0.1), transparent 55%), linear-gradient(135deg, #F0EEFF, #E8F4FF)',
            border: '1px solid rgba(80,70,228,0.15)',
            boxShadow: '0 40px 80px rgba(80,70,228,0.1)',
          }}
        >
          {/* Decorative dots */}
          <svg className="absolute top-8 left-8" width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ color: 'rgba(80,70,228,0.2)' }}>
            <path d="M12 2v6M12 16v6M2 12h6M16 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <svg className="absolute bottom-8 right-12" width="20" height="20" viewBox="0 0 24 24" fill="#34D399" style={{ opacity: 0.5 }}>
            <circle cx="12" cy="12" r="6" />
          </svg>

          {/* Floating cards */}
          <div className="cta-float cta-f1 absolute left-[-20px] top-1/3 hidden lg:block" style={{ background: 'white', border: '1px solid #E8E6F8', borderRadius: 14, padding: '12px 14px', boxShadow: '0 8px 24px rgba(80,70,228,0.12)', width: 170 }}>
            <div style={{ fontSize: 9, color: '#6B6888', marginBottom: 6 }}>🎯 Match score</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0F0F1A' }}>Maya P.</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#34D399' }}>96%</div>
            </div>
          </div>

          <div className="cta-float cta-f2 absolute right-[-20px] top-1/3 hidden lg:block" style={{ background: '#0F0F1A', borderRadius: 14, padding: '12px 14px', boxShadow: '0 12px 30px rgba(0,0,0,0.15)', width: 180 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>📅 Interview · Today</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 6 }}>Alex Wong · 2:30 PM</div>
            <span style={{ fontSize: 9, background: 'rgba(52,211,153,0.2)', color: '#34D399', padding: '3px 8px', borderRadius: 20 }}>Confirmed</span>
          </div>

          {/* Content */}
          <div className="cta-content text-center relative">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase mb-6" style={{ background: 'rgba(80,70,228,0.08)', border: '1px solid rgba(80,70,228,0.15)', color: '#5046E4' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#34D399' }} />
              Ready when you are
            </span>

            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-[#0F0F1A] leading-tight mb-5" style={{ letterSpacing: '-0.02em' }}>
              Build your first team<br />with <span style={GT}>Rookie.</span>
            </h2>

            <p className="text-[#6B6888] text-lg max-w-lg mx-auto mb-8 leading-relaxed">
              From first job post to first payroll preview — keep every hiring step in one beautiful workspace.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/sign-up" className="inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-full text-base transition-all group" style={{ background: '#0F0F1A' }}>
                Start hiring <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/employer/dashboard" className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full text-base transition-all text-[#0F0F1A] bg-white" style={{ border: '1px solid #E8E6F8' }}>
                <Play size={15} className="text-[#5046E4]" /> View demo
              </Link>
            </div>

            <p className="mt-5 text-sm text-[#6B6888]">Free forever plan · No credit card required</p>
          </div>
        </div>
      </div>
    </section>
  );
}
