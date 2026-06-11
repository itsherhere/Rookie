'use client';
import { useState } from 'react';
import Link from 'next/link';

const cols = {
  Rookie: [{ l: 'Product overview', h: '/' }, { l: 'Demo dashboard', h: '/employer/dashboard' }, { l: 'Case study', h: '/case-study' }, { l: 'Pricing', h: '/#pricing' }, { l: 'Roadmap', h: '/' }],
  Platform: [{ l: 'Hiring pipeline', h: '/' }, { l: 'Candidate profiles', h: '/' }, { l: 'Interview scheduling', h: '/' }, { l: 'Messaging', h: '/' }, { l: 'Employee management', h: '/' }, { l: 'Attendance', h: '/' }, { l: 'Payroll preview', h: '/' }, { l: 'Admin analytics', h: '/' }],
  'Use cases': [{ l: 'Startups', h: '/' }, { l: 'Remote teams', h: '/' }, { l: 'Founders', h: '/' }, { l: 'HR managers', h: '/' }, { l: 'Small businesses', h: '/' }, { l: 'First-time hiring teams', h: '/' }],
  Resources: [{ l: 'Blog', h: '/' }, { l: 'Hiring guides', h: '/' }, { l: 'Templates', h: '/' }, { l: 'Help center', h: '/' }, { l: 'API docs', h: '/api/docs' }, { l: 'Changelog', h: '/' }],
  Company: [{ l: 'About', h: '/' }, { l: 'Careers', h: '/' }, { l: 'Contact', h: '/' }, { l: 'Security', h: '/' }, { l: 'Privacy', h: '/' }, { l: 'Terms', h: '/' }],
};

export function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer style={{ background: '#0D0F1A' }}>
      {/* Newsletter */}
      <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', padding: '48px 24px' }}>
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Get hiring insights for <span style={{ color: '#34D399' }}>startup teams.</span></h3>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Weekly tips on hiring, candidate experience, and building your first team.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="What's your email?"
              className="flex-1 md:w-64 px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            />
            <button
              className="px-5 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: '#5046E4', color: 'white' }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-7 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-sm" style={{ background: '#5046E4' }}>R</div>
              <span className="text-white font-bold text-base">Rookie</span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
              The HR OS for startup teams. Hire, manage, and grow your first team in one clean workspace.
            </p>
            <div className="flex gap-2">
              {['𝕏', 'in', '⬡', '⬤'].map((icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(cols).map(([col, items]) => (
            <div key={col}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>{col}</p>
              <div className="space-y-2.5">
                {items.map(item => (
                  <Link key={item.l} href={item.h} className="block text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.28)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}>
                    {item.l}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>© {new Date().getFullYear()} Rookie Labs Inc. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#34D399' }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>All systems operational</span>
          </div>
          <div className="flex items-center gap-5 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {['Privacy', 'Terms', 'Security'].map(l => (
              <a key={l} href="#" className="transition-colors" style={{ color: 'rgba(255,255,255,0.2)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
