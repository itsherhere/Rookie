'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  {
    label: 'Products',
    items: [
      { title: 'Hiring Pipeline',      desc: 'Post jobs and manage candidates' },
      { title: 'Interview Scheduling', desc: 'Book and track interviews' },
      { title: 'Employee Management',  desc: 'Manage your growing team' },
      { title: 'Payroll Preview',      desc: 'Forecast pay runs' },
    ],
  },
  {
    label: 'Features',
    items: [
      { title: 'AI Match Score',     desc: 'Auto-rank candidates by fit' },
      { title: 'Candidate Portal',   desc: 'Self-serve application tracking' },
      { title: 'Attendance & Leave', desc: 'Track time and approvals' },
      { title: 'Analytics',          desc: 'Real-time hiring insights' },
    ],
  },
  { label: 'Resources',   items: null },
  { label: 'Pricing',     items: null },
  { label: 'Case Study',  items: null },
];

export function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-50 bg-white" style={{ borderBottom: '1px solid #E5E7EB' }}>
      <div className="mx-auto max-w-7xl px-6 h-[62px] flex items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 mr-10">
          <div className="relative w-8 h-8 rounded-[9px] flex items-center justify-center" style={{ background: '#5046E4' }}>
            <span className="text-white text-sm font-bold leading-none">R</span>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: '#34D399' }} />
          </div>
          <span className="text-[15px] font-semibold text-gray-900 tracking-tight">Rookie</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-0.5">
          {NAV.map(item => (
            <div key={item.label} className="relative">
              <button
                onClick={() => setActive(active === item.label ? null : item.label)}
                className={cn(
                  'flex items-center gap-[3px] h-9 px-3.5 rounded-lg text-[13.5px] font-medium transition-colors',
                  active === item.label ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                {item.label}
                {item.items && (
                  <ChevronDown
                    size={13}
                    className={cn('text-gray-400 mt-px transition-transform duration-150', active === item.label && 'rotate-180')}
                  />
                )}
              </button>

              {item.items && active === item.label && (
                <div className="absolute top-[calc(100%+6px)] left-0 w-64 rounded-xl bg-white py-1.5 z-50" style={{ border: '1px solid #E5E7EB', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
                  {item.items.map(sub => (
                    <Link key={sub.title} href="/" onClick={() => setActive(null)} className="block px-4 py-2.5 hover:bg-gray-50 transition-colors">
                      <p className="text-sm font-medium text-gray-900">{sub.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{sub.desc}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <Link href="/sign-in" className="hidden lg:block h-9 px-4 rounded-lg text-[13.5px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors leading-9">
            Log in
          </Link>
          <Link href="/sign-up" className="hidden lg:flex items-center gap-1.5 h-9 px-4 rounded-lg text-[13.5px] font-semibold text-white transition-colors" style={{ background: '#111827' }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#1F2937')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#111827')}
          >
            Get started <ArrowRight size={13} />
          </Link>
          <button onClick={() => setMobile(v => !v)} className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            {mobile ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobile && (
        <div className="lg:hidden bg-white" style={{ borderTop: '1px solid #E5E7EB' }}>
          <div className="max-w-7xl mx-auto px-6 py-3 space-y-0.5">
            {NAV.map(item => (
              <button key={item.label} className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                {item.label}
                {item.items && <ChevronDown size={13} className="text-gray-400" />}
              </button>
            ))}
            <div className="pt-3 space-y-2 pb-1">
              <Link href="/sign-in" className="block w-full text-center py-2.5 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50">Log in</Link>
              <Link href="/sign-up" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: '#111827' }}>
                Get started <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
