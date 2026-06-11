'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, X } from 'lucide-react';
import Link from 'next/link';

const GT: React.CSSProperties = { background: 'linear-gradient(135deg, #5046E4, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };

const faqs = [
  { q: 'What is Rookie?', a: 'Rookie is an HR OS for startup teams. It helps companies post jobs, manage applicants, schedule interviews, message candidates, organize employees, track attendance, preview payroll, and view hiring insights from one clean workspace.' },
  { q: 'Who is Rookie built for?', a: 'Rookie is built for early-stage startup teams — founders, CTOs, and first-time hiring managers who need to move fast without a dedicated HR department.' },
  { q: 'Can candidates create their own profiles?', a: 'Yes. Candidates create a free account when applying. This lets them track their application status, receive email updates, and respond to interview invitations.' },
  { q: 'Does Rookie include applicant tracking?', a: 'Yes. Full pipeline: Applied, Reviewed, Shortlisted, Interview, Rejected, and Hired. Candidates get automatic email notifications on status changes.' },
  { q: 'How does the skill match score work?', a: 'When a candidate applies, Rookie compares their skills against job requirements. The score shows the percentage of required skills matched — transparent and instant.' },
  { q: 'Can I schedule interviews inside Rookie?', a: 'Yes. Schedule online, onsite, or phone interviews from the candidate\'s profile. They get an email invite and can accept or decline in one click.' },
  { q: 'Does Rookie support employee management?', a: 'Yes. Once hired, add them as an employee with attendance tracking, leave management, and monthly payroll preview — all from the same workspace.' },
  { q: 'Is payroll fully automated?', a: 'Rookie\'s payroll module provides a preview: it auto-calculates gross, estimated tax (15% flat), and net pay from salary data. Full automated payroll runs are coming in the next release.' },
  { q: 'Does Rookie integrate with other tools?', a: 'Currently Rookie handles the full workflow internally. API access is available on the Scale plan for custom integrations.' },
  { q: 'Is my hiring data secure?', a: 'All data is stored in Supabase with row-level security. Authentication is handled by Clerk. We never sell your data or use it for advertising.' },
  { q: 'Can I use Rookie without signing up?', a: 'You can browse the public job listings without an account. To apply, post jobs, or access the dashboard, you\'ll need to create a free account.' },
  { q: 'Is Rookie production-ready?', a: 'Yes. Next.js 14 on Vercel, Express/Node.js on Railway, Supabase PostgreSQL, Clerk auth, Resend for email. Rate limiting, Zod validation, and OpenAPI docs included.' },
];

function Item({ q, a, first }: { q: string; a: string; first?: boolean }) {
  const [open, setOpen] = useState(first || false);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!contentRef.current) return;
    if (open) gsap.fromTo(contentRef.current, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.32, ease: 'power2.out' });
    else gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.28, ease: 'power2.in' });
  }, [open]);
  return (
    <div className="rounded-2xl overflow-hidden transition-colors" style={{ border: open ? '1px solid rgba(80,70,228,0.25)' : '1px solid #E8E6F8', background: open ? 'rgba(80,70,228,0.03)' : 'white' }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-6 py-5 text-left">
        <span className="text-sm font-semibold text-[#0F0F1A] pr-4">{q}</span>
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all" style={{ background: open ? '#5046E4' : '#F7F8FF', color: open ? 'white' : '#6B6888' }}>
          {open ? <X size={13} /> : <Plus size={13} />}
        </div>
      </button>
      <div ref={contentRef} style={{ overflow: 'hidden', height: first ? 'auto' : 0, opacity: first ? 1 : 0 }}>
        <p className="px-6 pb-5 text-sm text-[#6B6888] leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export function FAQ() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.faq-head', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.faq-head', start: 'top 85%' } });
      gsap.from('.faq-item', { opacity: 0, y: 20, stagger: 0.05, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: '.faq-list', start: 'top 85%' } });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={ref} className="py-24 bg-white" style={{ borderTop: '1px solid #E8E6F8' }}>
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#5046E4]">FAQ</span>
          <h2 className="faq-head mt-4 text-4xl md:text-5xl font-black tracking-tight text-[#0F0F1A]" style={{ letterSpacing: '-0.02em' }}>
            Questions before you start <span style={GT}>hiring?</span>
          </h2>
          <p className="mt-3 text-[#6B6888]">Everything startup teams need to know before building their first hiring workspace with Rookie.</p>
        </div>
        <div className="faq-list space-y-2 mb-10">
          {faqs.map((item, i) => <div key={item.q} className="faq-item"><Item q={item.q} a={item.a} first={i === 0} /></div>)}
        </div>
        <p className="text-center text-sm text-[#6B6888]">Still have questions? <Link href="mailto:hi@rookie.so" className="text-[#5046E4] font-semibold hover:underline">Talk to our team →</Link></p>
      </div>
    </section>
  );
}
