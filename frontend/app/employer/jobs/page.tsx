'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Briefcase, Plus, Users, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { ROUTES } from '@/constants';
import type { Job } from '@/types';

type JobWithCount = Job & { applications: { count: number }[] };

export default function JobsPage() {
  const { getToken } = useAuth();
  const [jobs, setJobs] = useState<JobWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await api.get<JobWithCount[]>('/jobs/employer', token!);
        setJobs(res.data || []);
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

  return (
    <div className="p-8">
      <PageHeader
        title="Jobs"
        description={`${jobs.length} ${jobs.length === 1 ? 'listing' : 'listings'}`}
        action={
          <Link
            href={ROUTES.EMPLOYER.JOBS_NEW}
            className="flex items-center gap-2 bg-[#5046E4] hover:bg-[#3D34C4] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Post a job
          </Link>
        }
      />

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          description="Post your first job listing to start receiving applications."
          action={
            <Link
              href={ROUTES.EMPLOYER.JOBS_NEW}
              className="flex items-center gap-2 bg-[#5046E4] hover:bg-[#3D34C4] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Post your first job
            </Link>
          }
        />
      ) : (
        <div className="bg-white border border-[#E8E6F8] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E6F8]">
                <th className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">Role</th>
                <th className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">Status</th>
                <th className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">Applications</th>
                <th className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">Posted</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6F8]">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-[#F7F7FF] transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-[#0F0F1A]">{job.title}</p>
                    {job.location && (
                      <p className="text-xs text-[#6B6888] mt-0.5">{job.location}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 text-sm text-[#6B6888]">
                      <Users size={13} />
                      {job.applications?.[0]?.count ?? 0}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#6B6888]">
                    {formatRelativeTime(job.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={ROUTES.EMPLOYER.JOB(job.id)}
                      className="flex items-center gap-1 text-sm text-[#5046E4] hover:text-[#3D34C4] font-medium transition-colors"
                    >
                      Manage <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
