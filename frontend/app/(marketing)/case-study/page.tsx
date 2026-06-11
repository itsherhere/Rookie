import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function CaseStudyPage() {
  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} /> Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#5046E4] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="text-white/60 text-sm font-medium">Rookie</span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20">
        {/* Label */}
        <p className="text-xs font-semibold text-[#5046E4] tracking-widest uppercase mb-6">Case study</p>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
          How Nova Labs hired their first 10 engineers in 6 weeks
        </h1>

        {/* Intro */}
        <p className="text-lg text-white/50 leading-relaxed mb-12 border-l-2 border-[#5046E4] pl-5">
          Nova Labs, a fintech startup building infrastructure for embedded payments, needed to scale fast. Here's how Rookie helped them go from zero to a full engineering team without an HR department.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {[
            { v: '6 weeks', l: 'From first job post to 10 hires' },
            { v: '247', l: 'Applications received' },
            { v: '82%', l: 'Average match score on hired candidates' },
          ].map((s) => (
            <div key={s.l} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-[#5046E4] mb-2">{s.v}</p>
              <p className="text-xs text-white/40 leading-snug">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-12 text-white/60 text-base leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">The problem</h2>
            <p>Nova Labs had just closed their seed round and needed to hire fast. Their founding team of three had no recruiting experience, no HR tools, and no time to manually review hundreds of CVs. They tried a mix of spreadsheets, LinkedIn messages, and email threads — and quickly burned out.</p>
            <p className="mt-4">"We were spending 3–4 hours a day on recruiting admin. We needed to close a Series A, not manage inboxes," said their CTO, Kamran Hosseini.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Why they chose Rookie</h2>
            <p>Nova Labs evaluated three tools before landing on Rookie. The deciding factors were speed of setup (they were live in 20 minutes), the match scoring system, and the fact that candidates could track their own application status — which cut down on inbound "where are we?" emails by 90%.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4">How they used it</h2>
            <ul className="space-y-3">
              {[
                'Posted 8 job listings across backend, frontend, and DevOps roles in one afternoon',
                'Used match scoring to prioritize the top 20% of applicants — saving ~12 hours of manual review',
                'Scheduled 34 interviews directly from the platform — no back-and-forth email scheduling',
                'Moved hired engineers into the Employees module on day one — payroll ready from week 1',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check size={16} className="text-[#5046E4] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4">The outcome</h2>
            <p>Six weeks after posting their first job, Nova Labs had hired 10 engineers, onboarded them in Rookie, and set up their first payroll run. The team now uses Rookie daily for attendance, leave management, and candidate messaging.</p>
            <blockquote className="mt-6 border-l-2 border-[#5046E4] pl-5">
              <p className="text-white/80 italic">"Rookie felt like it was built specifically for us. We went from chaos to clarity in a week. If you're a startup trying to hire without an HR team, this is the tool."</p>
              <p className="text-white/40 text-sm mt-3">— Kamran Hosseini, CTO, Nova Labs</p>
            </blockquote>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 p-8 bg-white/5 border border-white/10 rounded-2xl text-center">
          <h3 className="text-xl font-bold text-white mb-3">Ready to hire like Nova Labs?</h3>
          <p className="text-white/40 text-sm mb-6">Get started for free — no credit card required.</p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-[#5046E4] hover:bg-[#3D34C4] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all"
          >
            Start free <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
