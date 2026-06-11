'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Users, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { ROUTES } from '@/constants';
import type { Application } from '@/types';

type ApplicationWithDetails = Application & {
  jobs: { title: string };
  candidate_profiles: { full_name: string; current_title?: string } | null;
};

export default function EmployerApplicationsPage() {
  const { getToken } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await api.get<ApplicationWithDetails[]>('/applications/employer/all', token!);
        setApplications(res.data || []);
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
        title="Applications"
        description={`${applications.length} total across all jobs`}
      />

      {applications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applications yet"
          description="Publish a job listing to start receiving applications."
        />
      ) : (
        <div className="bg-white border border-[#E8E6F8] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E6F8]">
                <th className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">Candidate</th>
                <th className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">Job</th>
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
                  <td className="px-5 py-4 text-sm text-[#6B6888]">
                    {app.jobs?.title}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-sm font-semibold ${
                        (app.match_score || 0) >= 70
                          ? 'text-emerald-600'
                          : (app.match_score || 0) >= 40
                          ? 'text-amber-600'
                          : 'text-[#6B6888]'
                      }`}
                    >
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
  );
}
