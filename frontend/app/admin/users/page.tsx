'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Users } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface User { id: string; email: string; role: string; created_at: string }

export default function AdminUsersPage() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await api.get<User[]>('/admin/users', token!);
        setUsers(res.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [getToken]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="p-8">
      <PageHeader title="Users" description={`${users.length} registered`} />
      {users.length === 0 ? (
        <EmptyState icon={Users} title="No users yet" description="Users appear here once people sign up." />
      ) : (
        <div className="bg-white border border-[#E8E6F8] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E6F8]">
                {['Email', 'Role', 'Joined'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6F8]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#F7F7FF] transition-colors">
                  <td className="px-5 py-4 text-sm text-[#0F0F1A]">{u.email}</td>
                  <td className="px-5 py-4"><StatusBadge status={u.role as any} /></td>
                  <td className="px-5 py-4 text-sm text-[#6B6888]">{formatRelativeTime(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
