'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import Link from 'next/link';

const GT: React.CSSProperties = { background: 'linear-gradient(135deg, #5046E4, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };

const plans = [
  { name: 'Starter', price: '$0', sub: '/month', badge: null, features: ['1 active job', 'Up to 50 applications', 'Basic reporting', 'Candidate portal', 'Email notifications'], cta: 'Start free', href: '/sign-up', dark: false },
  { name: 'Growth', price: '$29', sub: '/month', badge: '🔥 Most Popular', features: ['Unlimited jobs', 'AI match scores', 'Interview scheduling', 'Team messaging', 'Employee & payroll', 'Attendance & leave', 'Priority support'], cta: 'Start hiring', href: '/sign-up', dark: true },
  { name: 'Scale', price: '$79', sub: '/month', badge: null, features: ['Everything in Growth', 'Advanced analytics', 'Payroll & attendance', 'Dedicated support', 'SLA guarantee'], cta: 'Talk to sales', href: 'mailto:hi@rookie.so', dark: false },
];

export function Pricing() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.pr-head', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.pr-head', start: 'top 85%' } });
      gsap.from('.pr-card', { opacity: 0, y: 50, scale: 0.97, stagger: 0.15, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.pr-grid', start: 'top 80%' } });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} style={{ background: '#F7F8FF' }} className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#5046E4]">Pricing</span>
          <h2 className="pr-head mt-4 text-4xl md:text-5xl font-black tracking-tight text-[#0F0F1A]" style={{ letterSpacing: '-0.02em' }}>
            Simple, <span style={GT}>transparent</span> pricing.
          </h2>
          <p className="mt-3 text-[#6B6888] text-lg">Start free, upgrade when your team grows. No hidden fees.</p>
        </div>
        <div className="pr-grid grid md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.name} className="pr-card relative rounded-2xl flex flex-col" style={plan.dark ? { background: '#0F0F1A', boxShadow: '0 25px 50px rgba(80,70,228,0.25)' } : { background: 'white', border: '1px solid #E8E6F8', boxShadow: '0 1px 3px rgba(15,15,26,0.04)' }}>
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-bold px-4 py-1.5 rounded-full" style={{ background: '#34D399', color: '#0F0F1A' }}>{plan.badge}</span>
                </div>
              )}
              <div className="p-8 flex flex-col flex-1">
                <p className="text-sm font-semibold mb-4" style={{ color: plan.dark ? 'rgba(255,255,255,0.5)' : '#6B6888' }}>{plan.name}</p>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-5xl font-black" style={{ letterSpacing: '-0.02em', color: plan.dark ? 'white' : '#0F0F1A' }}>{plan.price}</span>
                  <span className="text-sm mb-2" style={{ color: plan.dark ? 'rgba(255,255,255,0.4)' : '#6B6888' }}>{plan.sub}</span>
                </div>
                <div className="h-px mb-6" style={{ background: plan.dark ? 'rgba(255,255,255,0.1)' : '#E8E6F8' }} />
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: plan.dark ? '#34D399' : '#5046E4' }} />
                      <span className="text-sm" style={{ color: plan.dark ? 'rgba(255,255,255,0.7)' : '#6B6888' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="block text-center py-3.5 rounded-full text-sm font-semibold transition-all" style={plan.dark ? { background: '#34D399', color: '#0F0F1A' } : { background: '#0F0F1A', color: 'white' }}>
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-[#6B6888] text-sm mt-8">Free forever plan available · No credit card required</p>
      </div>
    </section>
  );
}
