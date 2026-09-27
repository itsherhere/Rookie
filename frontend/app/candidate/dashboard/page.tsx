'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
  FileText, TrendingUp, Calendar, Bookmark, User,
  ArrowRight, ChevronRight, CheckCircle2, Circle, Zap,
  Briefcase, MapPin, DollarSign, Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { api } from '@/lib/api';
import { MOCK_MODE, mockApplications, mockInterviews, mockJobs, mockCandidateProfile } from '@/lib/mock-data';
import { formatRelativeTime } from '@/lib/utils';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';
import type { Application, Interview, Job, CandidateProfile } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ['#5046E4','#7C3AED','#0284C7','#059669','#D97706','#DC2626','#0891B2'];
function avatarBg(s: string) {
  let h = 0; for (const c of s) h = c.charCodeAt(0) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function salaryRange(min?: number, max?: number) {
  if (!min && !max) return null;
  const fmt = (n: number) => `$${Math.round(n / 1000)}k`;
  return min && max ? `${fmt(min)}–${fmt(max)}` : min ? `from ${fmt(min)}` : null;
}

// ─── Profile completion widget ────────────────────────────────────────────────

const PROFILE_STEPS = [
  { label: 'Upload resume',        key: 'resume_url' as const },
  { label: 'Add skills',           key: 'skills' as const },
  { label: 'Add work experience',  key: 'current_title' as const },
  { label: 'Add portfolio / links', key: 'portfolio_url' as const },
  { label: 'Add education',        key: 'bio' as const },
];

function profilePct(profile: CandidateProfile | null) {
  if (!profile) return 0;
  const done = PROFILE_STEPS.filter(s => {
    const v = profile[s.key];
    return Array.isArray(v) ? v.length > 0 : !!v;
  }).length;
  return Math.round((done / PROFILE_STEPS.length) * 100);
}

// ─── Job match card ───────────────────────────────────────────────────────────

function JobMatchCard({ job }: { job: Job }) {
  const salary = salaryRange(job.salary_min, job.salary_max);
  return (
    <div className="bg-brand-surface border border-brand-border rounded-xl p-4 hover:border-accent/40 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
          style={{ background: avatarBg(job.companies?.name || job.title) }}>
          {(job.companies?.name || job.title)[0]}
        </div>
        <button className="p-1.5 rounded-lg hover:bg-brand-bg text-brand-muted hover:text-accent transition-colors">
          <Bookmark size={14} />
        </button>
      </div>
      <p className="text-sm font-semibold text-brand-text group-hover:text-accent transition-colors truncate">{job.title}</p>
      <p className="text-xs text-brand-muted mt-0.5 truncate">{job.companies?.name}</p>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {job.location && (
          <span className="flex items-center gap-1 text-[11px] text-brand-muted">
            <MapPin size={10} />{job.location}
          </span>
        )}
        {salary && (
          <span className="flex items-center gap-1 text-[11px] text-brand-muted">
            <DollarSign size={10} />{salary}
          </span>
        )}
      </div>
      <div className="flex gap-2 mt-3">
        <Link href={ROUTES.APPLY(job.id)} className="flex-1">
          <Button size="sm" className="w-full h-7 text-xs">Apply</Button>
        </Link>
        <Link href={ROUTES.PUBLIC_JOB(job.id)}>
          <Button size="sm" variant="outline" className="h-7 text-xs px-3">View</Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CandidateDashboardPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (MOCK_MODE) {
      setApplications(mockApplications);
      setInterviews(mockInterviews);
      setJobs(mockJobs);
      setProfile(mockCandidateProfile);
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const token = await getToken();
        const [appsRes, interviewsRes, jobsRes, profileRes] = await Promise.allSettled([
          api.get<Application[]>('/applications/my/list', token!),
          api.get<Interview[]>('/interviews/my', token!),
          api.get<Job[]>('/jobs?status=published&limit=6', token!),
          api.get<CandidateProfile>('/candidates/profile', token!),
        ]);

        if (appsRes.status === 'fulfilled')      setApplications(appsRes.value.data || []);
        if (interviewsRes.status === 'fulfilled') setInterviews(interviewsRes.value.data || []);
        if (jobsRes.status === 'fulfilled')       setJobs(jobsRes.value.data || []);
        if (profileRes.status === 'fulfilled')    setProfile(profileRes.value.data || null);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const firstName = user?.firstName || profile?.full_name?.split(' ')[0] || 'there';
  const activeCount  = applications.filter(a => !['rejected', 'hired'].includes(a.status)).length;
  const interviewCount = applications.filter(a => a.status === 'interview').length;
  const upcomingInterviews = interviews.filter(i => ['pending', 'accepted'].includes(i.status));
  const pct = profilePct(profile);
  const completedSteps = PROFILE_STEPS.filter(s => profile && (Array.isArray(profile[s.key]) ? (profile[s.key] as string[]).length > 0 : !!profile[s.key]));

  const statCards = [
    { label: 'Total applications', value: applications.length, icon: FileText,   bg: 'bg-accent/10',     text: 'text-accent' },
    { label: 'Active',             value: activeCount,          icon: TrendingUp,  bg: 'bg-cyan-light',    text: 'text-cyan-pop' },
    { label: 'Interviews',         value: interviewCount,       icon: Calendar,    bg: 'bg-success-light', text: 'text-success-text' },
    { label: 'Saved jobs',         value: 0,                    icon: Bookmark,    bg: 'bg-warning-light', text: 'text-warning-text' },
    { label: 'Profile',            value: `${pct}%`,            icon: User,        bg: 'bg-accent/10',     text: 'text-accent' },
  ];

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text tracking-tight">Welcome back, {firstName}</h1>
          <p className="text-sm text-brand-muted mt-0.5">
            Track your applications, discover job matches, and stay on top of your interviews.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Link href={ROUTES.CANDIDATE.PROFILE}>
            <Button variant="outline" size="sm">Complete profile</Button>
          </Link>
          <Link href="/candidate/jobs">
            <Button size="sm">Browse jobs <ArrowRight className="h-3.5 w-3.5 ml-1.5" /></Button>
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-brand-surface border border-brand-border rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', card.bg)}>
                <Icon size={15} className={card.text} />
              </div>
              <p className="text-2xl font-black text-brand-text" style={{ letterSpacing: '-0.02em' }}>{card.value}</p>
              <p className="text-[11px] text-brand-muted mt-0.5 font-medium">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Left */}
        <div className="space-y-6">
          {/* Recent applications */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <div>
                <h2 className="font-semibold text-brand-text">Recent applications</h2>
                <p className="text-xs text-brand-muted mt-0.5">Latest updates on jobs you've applied for.</p>
              </div>
              <Link href={ROUTES.CANDIDATE.APPLICATIONS} className="text-xs font-semibold text-accent hover:underline">View all</Link>
            </div>

            {applications.length === 0 ? (
              <EmptyState icon={Briefcase} title="No applications yet"
                description="Start applying to jobs to track them here."
                action={<Link href="/candidate/jobs"><Button size="sm" variant="outline">Browse jobs</Button></Link>}
                className="py-12"
              />
            ) : (
              <div className="overflow-x-auto">
                {/* Header */}
                <div className="grid px-5 py-2.5 text-[11px] font-semibold text-brand-muted uppercase tracking-wide border-b border-brand-border bg-brand-bg"
                  style={{ gridTemplateColumns: '1fr 120px 110px 90px 50px' }}>
                  <span>Role</span><span>Location</span><span>Status</span><span>Applied</span><span />
                </div>
                {/* Rows */}
                <div className="divide-y divide-brand-border">
                  {applications.slice(0, 7).map(app => {
                    const company = app.jobs?.companies?.name || 'Company';
                    const bg = avatarBg(company);
                    return (
                      <div key={app.id} className="grid items-center px-5 py-3 hover:bg-brand-bg transition-colors"
                        style={{ gridTemplateColumns: '1fr 120px 110px 90px 50px' }}>
                        <div className="flex items-center gap-2.5 min-w-0 pr-3">
                          <div className="w-7 h-7 rounded-md flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                            style={{ background: bg }}>{company[0]?.toUpperCase()}</div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-brand-text truncate">{app.jobs?.title}</p>
                            <p className="text-xs text-brand-muted truncate">{company}</p>
                          </div>
                        </div>
                        <span className="text-xs text-brand-muted truncate">{app.jobs?.location ?? 'Remote'}</span>
                        <div><StatusBadge status={app.status} /></div>
                        <span className="text-xs text-brand-muted">{formatRelativeTime(app.created_at)}</span>
                        <Link href={ROUTES.CANDIDATE.APPLICATIONS} className="text-xs font-semibold text-accent hover:underline text-right">View</Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Job matches */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star size={15} className="text-accent" />
                <h2 className="font-semibold text-brand-text">Recommended jobs</h2>
              </div>
              <Link href="/candidate/jobs" className="text-xs font-semibold text-accent hover:underline">Browse all</Link>
            </div>

            {jobs.length === 0 ? (
              <EmptyState icon={Briefcase} title="No job matches yet" description="Complete your profile to unlock personalized matches." className="bg-brand-surface border border-brand-border rounded-2xl py-10" />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {jobs.slice(0, 3).map(job => <JobMatchCard key={job.id} job={job} />)}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          {/* Profile completion */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-brand-text">Profile completion</h3>
              <span className="text-xl font-black text-accent">{pct}%</span>
            </div>
            <p className="text-xs text-brand-muted mb-3">Stand out to recruiters by completing your profile.</p>
            <div className="h-1.5 bg-brand-bg rounded-full overflow-hidden mb-4">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #5046E4, #22D3EE)' }} />
            </div>
            <ul className="space-y-2 mb-4">
              {PROFILE_STEPS.map(step => {
                const done = completedSteps.some(s => s.key === step.key);
                return (
                  <li key={step.key} className="flex items-center gap-2">
                    {done
                      ? <CheckCircle2 size={14} className="text-accent flex-shrink-0" />
                      : <Circle size={14} className="text-brand-muted/40 flex-shrink-0" />}
                    <span className={cn('text-sm', done ? 'text-brand-muted line-through' : 'text-brand-text')}>{step.label}</span>
                  </li>
                );
              })}
            </ul>
            <Link href={ROUTES.CANDIDATE.PROFILE}>
              <Button className="w-full" size="sm">Improve profile</Button>
            </Link>
          </div>

          {/* Upcoming interviews */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <h3 className="font-semibold text-brand-text">Upcoming interviews</h3>
              <Link href={ROUTES.CANDIDATE.INTERVIEWS} className="text-xs font-semibold text-accent hover:underline">All</Link>
            </div>
            {upcomingInterviews.length === 0 ? (
              <EmptyState icon={Calendar} title="No interviews yet" description="They'll appear here once scheduled." className="py-8" />
            ) : (
              <div className="divide-y divide-brand-border">
                {upcomingInterviews.slice(0, 3).map(int => (
                  <div key={int.id} className="flex items-center gap-3 px-5 py-3 hover:bg-brand-bg transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-cyan-light flex items-center justify-center flex-shrink-0">
                      <Calendar size={14} className="text-cyan-pop" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-text truncate">{int.title}</p>
                      <p className="text-xs text-brand-muted">{int.date} at {int.time?.slice(0, 5)}</p>
                    </div>
                    <ChevronRight size={14} className="text-brand-muted flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Next best action */}
          <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #5046E4, #4338CA)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={15} className="text-yellow-300" />
              <span className="text-white font-semibold text-sm">Next best action</span>
            </div>
            <p className="text-white/70 text-xs mb-4 leading-relaxed">
              {pct < 100
                ? `Complete your profile (${pct}% done) to unlock skill-based job recommendations.`
                : 'Your profile is complete! Browse recommended jobs tailored to your skills.'}
            </p>
            <Link href={pct < 100 ? ROUTES.CANDIDATE.PROFILE : '/candidate/jobs'}
              className="flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/80 transition-colors">
              {pct < 100 ? 'Complete profile' : 'Browse matches'}
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
