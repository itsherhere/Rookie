'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
  Briefcase, Users, Calendar, UserCheck, DollarSign, Clock,
  Plus, ArrowRight, Building2, ChevronRight, TrendingUp,
  CheckCircle2, Circle, Sparkles, Upload, Globe, MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { api } from '@/lib/api';
import { MOCK_MODE, mockEmployerStats, mockJobs, mockIncomingApplications, mockInterviews } from '@/lib/mock-data';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';
import type { EmployerStats, Job, Interview } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSalary(min?: number, max?: number) {
  if (!min && !max) return null;
  const fmt = (n: number) => `$${Math.round(n / 1000)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return min ? `from ${fmt(min)}` : `up to ${fmt(max!)}`;
}

// ─── Company Setup (no company yet) ──────────────────────────────────────────

function SetupView() {
  const { getToken } = useAuth();
  const [values, setValues] = useState({ name: '', industry: '', size: '', website: '', description: '' });
  const [saving, setSaving] = useState(false);

  const checklist = [
    { label: 'Add company name',      done: !!values.name },
    { label: 'Add industry',          done: !!values.industry },
    { label: 'Add company size',      done: !!values.size },
    { label: 'Add website',           done: !!values.website },
    { label: 'Add short description', done: !!values.description },
  ];

  const inputCls = 'w-full h-10 rounded-lg border border-brand-border bg-brand-bg px-3.5 text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all';

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!values.name) return;
    setSaving(true);
    try {
      const token = await getToken();
      await api.put('/employers/company', values, token!);
      window.location.reload();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text tracking-tight">Welcome to Rookie</h1>
        <p className="text-sm text-brand-muted mt-1">A couple of steps to unlock your hiring workspace.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
          <div className="relative px-8 py-6 border-b border-brand-border" style={{ background: 'linear-gradient(135deg, rgba(80,70,228,0.07), white 60%, rgba(34,211,238,0.05))' }}>
            <div className="absolute right-6 top-6 h-11 w-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Building2 className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-lg font-semibold text-brand-text">Set up your company profile</h2>
            <p className="text-sm text-brand-muted mt-1 max-w-md">
              Share a few details about your company before posting jobs. This is what candidates will see.
            </p>
          </div>

          <form onSubmit={handleSave} className="p-8 space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-brand-border hover:border-accent/40 transition-colors cursor-pointer">
              <div className="h-12 w-12 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center flex-shrink-0">
                <Upload className="h-4 w-4 text-brand-muted" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-brand-text">Upload logo</p>
                <p className="text-xs text-brand-muted">PNG or SVG, up to 2 MB</p>
              </div>
              <Button type="button" variant="outline" size="sm">Browse</Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { key: 'name' as const,     label: 'Company name *', placeholder: 'Acme Inc.' },
                { key: 'industry' as const, label: 'Industry',       placeholder: 'Software · SaaS' },
                { key: 'size' as const,     label: 'Company size',   placeholder: '11–50' },
                { key: 'website' as const,  label: 'Website',        placeholder: 'https://acme.com' },
              ].map(f => (
                <label key={f.key} className="block">
                  <span className="block text-xs font-medium text-brand-text mb-1.5">{f.label}</span>
                  <input placeholder={f.placeholder} value={values[f.key]}
                    onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                    className={inputCls} />
                </label>
              ))}
            </div>

            <label className="block">
              <span className="block text-xs font-medium text-brand-text mb-1.5">Short description</span>
              <textarea rows={3} value={values.description}
                onChange={e => setValues(v => ({ ...v, description: e.target.value }))}
                placeholder="What does your company do?"
                className={`${inputCls} h-auto py-2.5 resize-none`} />
            </label>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-brand-muted">You can edit any of this later.</p>
              <Button type="submit" disabled={!values.name || saving}>
                {saving ? 'Saving...' : 'Create company profile'}
                {!saving && <ArrowRight className="h-4 w-4 ml-1.5" />}
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-brand-text mb-3">Setup checklist</h3>
            <ul className="space-y-2.5">
              {checklist.map(item => (
                <li key={item.label} className="flex items-center gap-2.5">
                  {item.done
                    ? <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                    : <Circle className="h-4 w-4 text-brand-muted/40 flex-shrink-0" />}
                  <span className={cn('text-sm', item.done ? 'text-brand-muted line-through' : 'text-brand-text')}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-text">Stand out from day one</p>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  Companies with a complete profile receive 2.4× more quality applicants in their first week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pipeline ─────────────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  { label: 'Applied',     status: 'applied',     color: '#6366F1' },
  { label: 'Reviewed',    status: 'reviewed',    color: '#8B5CF6' },
  { label: 'Shortlisted', status: 'shortlisted', color: '#A855F7' },
  { label: 'Interview',   status: 'interview',   color: '#22D3EE' },
  { label: 'Hired',       status: 'hired',       color: '#10B981' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExtendedStats extends EmployerStats {
  totalInterviews?: number;
  totalEmployees?: number;
  pendingLeave?: number;
  pendingPayroll?: number;
}

interface AppRow {
  id: string;
  candidateName: string;
  jobTitle: string;
  status: string;
  matchScore?: number;
  appliedAt: string;
}

// ─── Stats Dashboard ──────────────────────────────────────────────────────────

function StatsView({ stats, jobs, applications, interviews }: {
  stats: ExtendedStats;
  jobs: Job[];
  applications: AppRow[];
  interviews: Interview[];
}) {
  const { user } = useUser();
  const companyName = stats.company?.name || user?.firstName || 'there';

  const statCards = [
    { label: 'Active jobs',     value: stats.publishedJobs,        icon: Briefcase,   bg: 'bg-accent/10',     text: 'text-accent' },
    { label: 'Applications',    value: stats.totalApplications,    icon: Users,       bg: 'bg-cyan-light',    text: 'text-cyan-pop' },
    { label: 'Interviews',      value: stats.totalInterviews ?? 0, icon: Calendar,    bg: 'bg-success-light', text: 'text-success-text' },
    { label: 'Employees',       value: stats.totalEmployees ?? 0,  icon: UserCheck,   bg: 'bg-warning-light', text: 'text-warning-text' },
    { label: 'Pending leave',   value: stats.pendingLeave ?? 0,    icon: Clock,       bg: 'bg-danger-light',  text: 'text-danger-text' },
    { label: 'Pending payroll', value: stats.pendingPayroll ?? 0,  icon: DollarSign,  bg: 'bg-accent/10',     text: 'text-accent' },
  ];

  const pipelineCounts: Record<string, number> = {};
  applications.forEach(a => { pipelineCounts[a.status] = (pipelineCounts[a.status] || 0) + 1; });
  const totalPipeline = Object.values(pipelineCounts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-text tracking-tight">Welcome back, {companyName}</h1>
          <p className="text-sm text-brand-muted mt-0.5">Here's what's happening with your hiring today.</p>
        </div>
        <Link href={ROUTES.EMPLOYER.JOBS_NEW}>
          <Button><Plus className="h-4 w-4 mr-1.5" /> Post a job</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-6">
          {/* Pipeline */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5">
            <h2 className="font-semibold text-brand-text mb-4">Hiring pipeline</h2>
            <div className="flex rounded-lg overflow-hidden h-3 mb-4">
              {PIPELINE_STAGES.map(s => {
                const count = pipelineCounts[s.status] || 0;
                const pct = (count / totalPipeline) * 100;
                return pct > 0 ? (
                  <div key={s.status} className="h-full transition-all" style={{ width: `${pct}%`, background: s.color }} />
                ) : null;
              })}
            </div>
            <div className="flex flex-wrap gap-3">
              {PIPELINE_STAGES.map(s => (
                <div key={s.status} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-xs text-brand-muted">{s.label}</span>
                  <span className="text-xs font-semibold text-brand-text">{pipelineCounts[s.status] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active jobs */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <h2 className="font-semibold text-brand-text">Active jobs</h2>
              <Link href={ROUTES.EMPLOYER.JOBS} className="text-xs font-semibold text-accent hover:underline">View all</Link>
            </div>
            {jobs.length === 0 ? (
              <EmptyState icon={Briefcase} title="No jobs posted yet"
                description="Create your first job post and start receiving applications."
                action={<Link href={ROUTES.EMPLOYER.JOBS_NEW}><Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />Post a job</Button></Link>}
                className="py-12" />
            ) : (
              <div className="divide-y divide-brand-border">
                {jobs.slice(0, 4).map(job => (
                  <div key={job.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-brand-bg transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-brand-text truncate">{job.title}</p>
                        <StatusBadge status={job.status} />
                      </div>
                      <p className="text-xs text-brand-muted mt-0.5">
                        {job.department && `${job.department} · `}{job.location}
                        {job.salary_min && ` · ${formatSalary(job.salary_min, job.salary_max)}`}
                      </p>
                    </div>
                    <Link href={ROUTES.EMPLOYER.JOB(job.id)} className="ml-4 flex-shrink-0">
                      <Button variant="outline" size="sm">Manage</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent applications */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <h2 className="font-semibold text-brand-text">Recent applications</h2>
              <Link href={ROUTES.EMPLOYER.APPLICATIONS} className="text-xs font-semibold text-accent hover:underline">View all</Link>
            </div>
            {applications.length === 0 ? (
              <EmptyState icon={Users} title="No applications yet" description="Applications will appear here once candidates apply." className="py-10" />
            ) : (
              <div className="divide-y divide-brand-border">
                {applications.slice(0, 5).map(app => (
                  <div key={app.id} className="flex items-center gap-3 px-5 py-3 hover:bg-brand-bg transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent text-xs font-bold">
                      {app.candidateName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-text truncate">{app.candidateName}</p>
                      <p className="text-xs text-brand-muted truncate">{app.jobTitle}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {app.matchScore && <span className="text-xs font-semibold text-success">{app.matchScore}%</span>}
                      <StatusBadge status={app.status as any} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Upcoming interviews */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <h2 className="font-semibold text-brand-text">Upcoming interviews</h2>
              <Link href={ROUTES.EMPLOYER.INTERVIEWS} className="text-xs font-semibold text-accent hover:underline">All</Link>
            </div>
            {interviews.length === 0 ? (
              <EmptyState icon={Calendar} title="No interviews scheduled" className="py-8" />
            ) : (
              <div className="divide-y divide-brand-border">
                {interviews.filter(i => ['pending', 'accepted'].includes(i.status)).slice(0, 4).map(int => (
                  <div key={int.id} className="flex items-center gap-3 px-5 py-3 hover:bg-brand-bg transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-cyan-light flex items-center justify-center flex-shrink-0">
                      <Calendar size={14} className="text-cyan-pop" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-text truncate">{int.title}</p>
                      <p className="text-xs text-brand-muted">{int.date} at {int.time?.slice(0, 5)}</p>
                    </div>
                    <StatusBadge status={int.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* HR snapshot */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5">
            <h2 className="font-semibold text-brand-text mb-4">HR snapshot</h2>
            <div className="space-y-3">
              {[
                { label: 'Employees',       value: stats.totalEmployees ?? 0, icon: UserCheck,  href: ROUTES.EMPLOYER.EMPLOYEES, color: 'text-accent' },
                { label: 'Pending leave',   value: stats.pendingLeave ?? 0,   icon: Clock,      href: ROUTES.EMPLOYER.LEAVE,     color: 'text-warning-text' },
                { label: 'Pending payroll', value: stats.pendingPayroll ?? 0, icon: DollarSign, href: ROUTES.EMPLOYER.PAYROLL,   color: 'text-success-text' },
                { label: 'Interviews today', value: interviews.filter(i => i.date === new Date().toISOString().split('T')[0]).length, icon: Calendar, href: ROUTES.EMPLOYER.INTERVIEWS, color: 'text-cyan-pop' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <Link key={item.label} href={item.href}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-brand-bg transition-colors group">
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={item.color} />
                      <span className="text-sm text-brand-text">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-brand-text">{item.value}</span>
                      <ChevronRight size={14} className="text-brand-muted group-hover:text-accent transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5">
            <h2 className="font-semibold text-brand-text mb-3">Quick actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Post a new job',    href: ROUTES.EMPLOYER.JOBS_NEW,     icon: Plus },
                { label: 'View applications', href: ROUTES.EMPLOYER.APPLICATIONS, icon: Users },
                { label: 'Manage employees',  href: ROUTES.EMPLOYER.EMPLOYEES,    icon: UserCheck },
                { label: 'Run payroll',       href: ROUTES.EMPLOYER.PAYROLL,      icon: DollarSign },
              ].map(qa => {
                const Icon = qa.icon;
                return (
                  <Link key={qa.href} href={qa.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-brand-bg transition-colors group text-sm text-brand-muted hover:text-brand-text">
                    <Icon size={14} className="text-brand-muted group-hover:text-accent transition-colors" />
                    {qa.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployerDashboardPage() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<ExtendedStats | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<AppRow[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (MOCK_MODE) {
      setStats(mockEmployerStats);
      setJobs(mockJobs);
      setApplications(mockIncomingApplications);
      setInterviews(mockInterviews);
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const token = await getToken();

        const [statsRes, jobsRes, interviewsRes, appsRes] = await Promise.allSettled([
          api.get<ExtendedStats>('/employers/stats', token!),
          api.get<Job[]>('/jobs/employer', token!),
          api.get<Interview[]>('/interviews/employer', token!),
          api.get<any[]>('/employers/recent-applications', token!),
        ]);

        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data || null);
        if (jobsRes.status === 'fulfilled')  setJobs(jobsRes.value.data || []);
        if (interviewsRes.status === 'fulfilled') setInterviews(interviewsRes.value.data || []);

        if (appsRes.status === 'fulfilled' && appsRes.value.data) {
          setApplications(appsRes.value.data.map((a: any) => ({
            id: a.id,
            candidateName: a.candidate_profiles?.full_name ?? 'Candidate',
            jobTitle: a.jobs?.title ?? '',
            status: a.status,
            matchScore: a.match_score,
            appliedAt: a.created_at,
          })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
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

  if (!stats?.company) return <SetupView />;
  return <StatsView stats={stats} jobs={jobs} applications={applications} interviews={interviews} />;
}