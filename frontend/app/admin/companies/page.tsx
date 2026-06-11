'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Building2 } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface Company {
  id: string;
  name: string;
  industry?: string;
  size?: string;
  website?: string;
  created_at: string;
  users: { email: string };
}

export default function AdminCompaniesPage() {
  const { getToken } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await api.get<Company[]>('/admin/companies', token!);
        setCompanies(res.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [getToken]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="p-8">
      <PageHeader title="Companies" description={`${companies.length} registered`} />
      {companies.length === 0 ? (
        <EmptyState icon={Building2} title="No companies yet" description="Companies will appear here once employers sign up." />
      ) : (
        <div className="bg-white border border-[#E8E6F8] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E6F8]">
                {['Company', 'Owner', 'Industry', 'Size', 'Joined'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6F8]">
              {companies.map((c) => (
                <tr key={c.id} className="hover:bg-[#F7F7FF] transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-[#0F0F1A]">{c.name}</p>
                    {c.website && <a href={c.website} target="_blank" rel="noreferrer" className="text-xs text-[#5046E4] hover:underline">{c.website}</a>}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#6B6888]">{c.users?.email}</td>
                  <td className="px-5 py-4 text-sm text-[#6B6888]">{c.industry || '—'}</td>
                  <td className="px-5 py-4 text-sm text-[#6B6888]">{c.size || '—'}</td>
                  <td className="px-5 py-4 text-sm text-[#6B6888]">{formatRelativeTime(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
