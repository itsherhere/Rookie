'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Briefcase, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface Application {
  id: string; status: string; created_at: string;
  job: { id: string; title: string; location: string; job_type: string; employer?: { company_name: string } };
}

const STATUS: Record<string, { label: string; color: string; bg: string; step: number }> = {
  applied:     { label: 'Applied',     color: '#5046E4', bg: '#EEF0FF', step: 1 },
  reviewed:    { label: 'Reviewed',    color: '#F59E0B', bg: '#FFF7ED', step: 2 },
  shortlisted: { label: 'Shortlisted', color: '#0EA5E9', bg: '#F0F9FF', step: 3 },
  interview:   { label: 'Interview',   color: '#8B5CF6', bg: '#F5F3FF', step: 4 },
  rejected:    { label: 'Rejected',    color: '#F43F5E', bg: '#FFF1F2', step: 0 },
  hired:       { label: 'Hired 🎉',   color: '#10B981', bg: '#ECFDF5', step: 5 },
};

const STEPS = ['applied','reviewed','shortlisted','interview','hired'];

export default function CandidateApplicationsPage() {
  const { getToken } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setApps(await res.json());
      } finally { setLoading(false); }
    })();
  }, []);

  const counts = apps.reduce((a, c) => ({ ...a, [c.status]: (a[c.status]||0)+1 }), {} as Record<string,number>);
  const active = apps.filter(a => !['rejected','hired'].includes(a.status)).length;
  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 rounded-full border-2 border-[#5046E4] border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F0F1A] mb-1">My Applications</h1>
        <p className="text-sm text-[#6B6888]">Track all your job applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: apps.length, color: '#5046E4', bg: '#EEF0FF' },
          { label: 'Active', value: active, color: '#0EA5E9', bg: '#F0F9FF' },
          { label: 'Hired', value: counts.hired||0, color: '#10B981', bg: '#ECFDF5' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#E8E6F8] rounded-2xl p-4 text-center">
            <p className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-medium text-[#6B6888]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={() => setFilter('all')}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
          style={filter==='all' ? {background:'#0F0F1A',color:'white'} : {background:'white',color:'#6B6888',border:'1px solid #E8E6F8'}}>
          All ({apps.length})
        </button>
        {Object.entries(STATUS).map(([key, cfg]) => counts[key] ? (
          <button key={key} onClick={() => setFilter(key)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={filter===key ? {background:cfg.color,color:'white'} : {background:cfg.bg,color:cfg.color}}>
            {cfg.label} ({counts[key]})
          </button>
        ) : null)}
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E6F8]">
          <div className="w-12 h-12 rounded-2xl bg-[#F7F7FF] flex items-center justify-center mx-auto mb-4">
            <Briefcase size={22} className="text-[#E8E6F8]" />
          </div>
          <p className="font-semibold text-[#0F0F1A] mb-1">No applications yet</p>
          <p className="text-sm text-[#6B6888] mb-4">Start applying to jobs to see them here</p>
          <Link href="/candidate/jobs" className="text-sm font-semibold text-[#5046E4] hover:underline">
            Browse open jobs →
          </Link>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {filtered.map(app => {
          const cfg = STATUS[app.status] || STATUS.applied;
          const isRejected = app.status === 'rejected';
          const step = isRejected ? -1 : cfg.step;
          const initials = app.job?.employer?.company_name?.slice(0,2).toUpperCase() || 'CO';

          return (
            <div key={app.id} className="bg-white border border-[#E8E6F8] rounded-2xl p-5 hover:border-[#5046E4]/30 hover:shadow-sm transition-all">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #EEF0FF, #F0EEFF)', color: '#5046E4' }}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-[#0F0F1A] leading-tight">{app.job?.title}</h3>
                      <p className="text-sm text-[#6B6888] mt-0.5">
                        {app.job?.employer?.company_name}
                        {app.job?.location && ` · ${app.job.location}`}
                      </p>
                    </div>
                    <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-[#6B6888]">
                    <Clock size={10} />
                    {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Progress track */}
              {!isRejected ? (
                <div className="flex items-center gap-1">
                  {STEPS.map((s, i) => (
                    <div key={s} className="flex items-center flex-1">
                      <div className="flex-1 h-1.5 rounded-full transition-all"
                        style={{ background: i < step ? cfg.color : i === step - 1 ? cfg.color : '#F7F7FF' }} />
                      {i < STEPS.length - 1 && <div className="w-0.5" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-1.5 rounded-full bg-[#FEE2E2]" />
              )}
              <div className="flex justify-between text-[10px] text-[#6B6888] mt-1 px-0.5">
                {STEPS.map(s => <span key={s} className="capitalize">{s}</span>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
