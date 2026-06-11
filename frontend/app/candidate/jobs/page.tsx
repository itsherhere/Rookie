'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Search, MapPin, DollarSign, Briefcase, Clock, Zap } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  salary_min: number;
  salary_max: number;
  skills_required: string[];
  created_at: string;
  employer?: { company_name: string };
  match_score?: number;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  full_time: { label: 'Full-time', color: '#5046E4', bg: '#EEF0FF' },
  part_time: { label: 'Part-time', color: '#F59E0B', bg: '#FFF7ED' },
  contract:  { label: 'Contract',  color: '#10B981', bg: '#ECFDF5' },
  remote:    { label: 'Remote',    color: '#0EA5E9', bg: '#F0F9FF' },
};

export default function CandidateJobsPage() {
  const { getToken } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filtered, setFiltered] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) { const d = await res.json(); setJobs(d); setFiltered(d); }
      } finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(jobs.filter(j =>
      !q || j.title.toLowerCase().includes(q) ||
      j.employer?.company_name?.toLowerCase().includes(q) ||
      j.skills_required?.some(s => s.toLowerCase().includes(q))
    ));
  }, [search, jobs]);

  async function apply(jobId: string) {
    setApplying(jobId);
    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ job_id: jobId, cover_letter: '' }),
      });
      setApplied(prev => new Set([...prev, jobId]));
    } finally { setApplying(null); }
  }

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F0F1A] mb-1">Browse Jobs</h1>
        <p className="text-[#6B6888] text-sm">
          {loading ? 'Loading...' : `${filtered.length} open positions`}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6888]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search jobs, skills, or companies..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E8E6F8] bg-white text-sm text-[#0F0F1A] focus:outline-none focus:border-[#5046E4] focus:ring-2 focus:ring-[#5046E4]/10 transition-all"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white border border-[#E8E6F8] rounded-2xl p-5 animate-pulse">
              <div className="flex justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-[#F7F7FF] rounded w-1/3" />
                  <div className="h-3 bg-[#F7F7FF] rounded w-1/4" />
                </div>
                <div className="h-9 w-20 bg-[#F7F7FF] rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E6F8]">
          <div className="w-12 h-12 rounded-2xl bg-[#F7F7FF] flex items-center justify-center mx-auto mb-4">
            <Briefcase size={22} className="text-[#E8E6F8]" />
          </div>
          <p className="font-semibold text-[#0F0F1A] mb-1">No jobs found</p>
          <p className="text-sm text-[#6B6888]">Try a different search term</p>
        </div>
      )}

      {/* Job cards */}
      {!loading && filtered.length > 0 && (
        <div className="grid gap-4">
          {filtered.map(job => {
            const cfg = TYPE_CONFIG[job.job_type] || TYPE_CONFIG.full_time;
            const isApplied = applied.has(job.id);
            const score = job.match_score;
            const initials = job.employer?.company_name?.slice(0, 2).toUpperCase() || 'CO';

            return (
              <div
                key={job.id}
                className="group bg-white border border-[#E8E6F8] rounded-2xl p-5 hover:border-[#5046E4]/40 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Company avatar */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #EEF0FF, #F0EEFF)', color: '#5046E4' }}
                  >
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-[#0F0F1A]">{job.title}</h3>
                          {score && score >= 70 && (
                            <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ background: '#ECFDF5', color: '#10B981' }}>
                              <Zap size={10} fill="currentColor" /> {score}% match
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#6B6888] mt-0.5">
                          {job.employer?.company_name || 'Company'}
                        </p>
                      </div>

                      <button
                        onClick={() => !isApplied && apply(job.id)}
                        disabled={isApplied || applying === job.id}
                        className="flex-shrink-0 px-5 py-2 rounded-xl text-sm font-semibold transition-all"
                        style={isApplied
                          ? { background: '#ECFDF5', color: '#10B981' }
                          : { background: '#5046E4', color: 'white' }
                        }
                      >
                        {applying === job.id ? '...' : isApplied ? '✓ Applied' : 'Apply now'}
                      </button>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 mt-3 mb-3 text-xs text-[#6B6888]">
                      <span className="flex items-center gap-1 font-semibold px-2.5 py-1 rounded-lg"
                        style={{ background: cfg.bg, color: cfg.color }}>
                        <Briefcase size={11} /> {cfg.label}
                      </span>
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={11} /> {job.location}
                        </span>
                      )}
                      {(job.salary_min || job.salary_max) && (
                        <span className="flex items-center gap-1">
                          <DollarSign size={11} />
                          {job.salary_min && job.salary_max
                            ? `$${(job.salary_min/1000).toFixed(0)}k – $${(job.salary_max/1000).toFixed(0)}k`
                            : job.salary_min ? `From $${(job.salary_min/1000).toFixed(0)}k` : `Up to $${(job.salary_max!/1000).toFixed(0)}k`}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Skills */}
                    {job.skills_required?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills_required.slice(0, 6).map(skill => (
                          <span key={skill} className="text-xs px-2.5 py-1 rounded-lg bg-[#F7F7FF] border border-[#E8E6F8] text-[#6B6888]">
                            {skill}
                          </span>
                        ))}
                        {job.skills_required.length > 6 && (
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-[#F7F7FF] border border-[#E8E6F8] text-[#6B6888]">
                            +{job.skills_required.length - 6} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
