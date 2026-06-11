'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SkillTag } from '@/components/shared/SkillTag';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { Users, Globe, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { ROUTES } from '@/constants';
import type { Job, Application } from '@/types';

type ApplicationWithProfile = Application & {
  candidate_profiles: {
    full_name: string;
    current_title?: string;
    skills: string[];
    location?: string;
  } | null;
};

export default function JobDetailPage() {
  const params = useParams();
  const { getToken } = useAuth();
  const id = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<ApplicationWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();

        // Load job — if this fails, show error
        const jobRes = await api.get<Job>(`/jobs/${id}`, token!);
        setJob(jobRes.data || null);

        // Load applications separately — if this fails, just show empty
        try {
          const appsRes = await api.get<ApplicationWithProfile[]>(
            `/applications/job/${id}`,
            token!
          );
          setApplications(appsRes.data || []);
        } catch {
          setApplications([]);
        }
      } catch (err) {
        console.error('[JobDetailPage] load error:', err);
        setError('Could not load job details.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, getToken]);

  const toggleStatus = async () => {
    if (!job) return;
    const newStatus = job.status === 'published' ? 'closed' : 'published';
    setPublishing(true);
    try {
      const token = await getToken();
      await api.put(`/jobs/${id}`, { ...job, status: newStatus }, token!);
      setJob((j) => (j ? { ...j, status: newStatus } : j));
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-8">
        <p className="text-[#6B6888] mb-2">{error || 'Job not found.'}</p>
        <Link href={ROUTES.EMPLOYER.JOBS} className="text-[#5046E4] text-sm">
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <PageHeader
        title={job.title}
        description={[job.location, job.type].filter(Boolean).join(' · ') || 'No details'}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status={job.status} />
            <button
              onClick={toggleStatus}
              disabled={publishing}
              className="flex items-center gap-2 px-4 py-2 border border-[#E8E6F8] text-sm font-medium rounded-lg hover:border-[#5046E4]/40 transition-colors text-[#0F0F1A] disabled:opacity-50"
            >
              {publishing && <LoadingSpinner size="sm" />}
              {job.status === 'published' ? 'Close job' : 'Publish job'}
            </button>
            <Link
              href={`/jobs/${job.id}`}
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-[#E8E6F8] text-[#6B6888] hover:text-[#0F0F1A] transition-colors"
            >
              <Globe size={14} />
              Preview
            </Link>
          </div>
        }
      />

      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {job.skills.map((s) => <SkillTag key={s} skill={s} />)}
        </div>
      )}

      <div>
        <h2 className="text-base font-semibold text-[#0F0F1A] mb-4">
          Applications
          <span className="ml-2 text-sm font-normal text-[#6B6888]">({applications.length})</span>
        </h2>

        {applications.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No applications yet"
            description="Share this job to start receiving applications."
          />
        ) : (
          <div className="bg-white border border-[#E8E6F8] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E6F8]">
                  <th className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">Candidate</th>
                  <th className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">Match</th>
                  <th className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">Status</th>
                  <th className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">Applied</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6F8]">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#F7F7FF] transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#0F0F1A]">
                        {app.candidate_profiles?.full_name || 'Unknown'}
                      </p>
                      {app.candidate_profiles?.current_title && (
                        <p className="text-xs text-[#6B6888] mt-0.5">
                          {app.candidate_profiles.current_title}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-semibold ${
                        (app.match_score || 0) >= 70 ? 'text-emerald-600' :
                        (app.match_score || 0) >= 40 ? 'text-amber-600' : 'text-[#6B6888]'
                      }`}>
                        {app.match_score ?? 0}%
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-[#6B6888]">
                      {formatRelativeTime(app.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={ROUTES.EMPLOYER.APPLICATION(app.id)}
                        className="flex items-center gap-1 text-sm text-[#5046E4] hover:text-[#3D34C4] font-medium"
                      >
                        View <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}