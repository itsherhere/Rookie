'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Umbrella, Check, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface LeaveRequest {
  id: string;
  type: string;
  start_date: string;
  end_date: string;
  reason?: string;
  status: string;
  employees: { full_name: string; role: string };
}

export default function LeavePage() {
  const { getToken } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await api.get<LeaveRequest[]>('/leave', token!);
        setRequests(res.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [getToken]);

  const respond = async (id: string, status: 'approved' | 'rejected') => {
    setResponding(id);
    try {
      const token = await getToken();
      await api.patch(`/leave/${id}/respond`, { status }, token!);
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    } catch (err) { console.error(err); }
    finally { setResponding(null); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;

  const pending = requests.filter((r) => r.status === 'pending');
  const others = requests.filter((r) => r.status !== 'pending');

  return (
    <div className="p-8">
      <PageHeader
        title="Leave requests"
        description={`${pending.length} pending · ${requests.length} total`}
      />

      {requests.length === 0 ? (
        <EmptyState icon={Umbrella} title="No leave requests" description="Leave requests from employees will appear here." />
      ) : (
        <div className="space-y-3">
          {[...pending, ...others].map((req) => (
            <div key={req.id} className="bg-white border border-[#E8E6F8] rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#0F0F1A]">{req.employees?.full_name}</p>
                  <p className="text-xs text-[#6B6888] mt-0.5">{req.employees?.role}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-[#6B6888]">
                    <span className="capitalize font-medium text-[#5046E4]">{req.type} leave</span>
                    <span>{formatDate(req.start_date)} → {formatDate(req.end_date)}</span>
                  </div>
                  {req.reason && (
                    <p className="text-xs text-[#6B6888] mt-1.5 italic">"{req.reason}"</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <StatusBadge status={req.status as any} />
                  {req.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => respond(req.id, 'rejected')}
                        disabled={responding === req.id}
                        className="flex items-center gap-1 px-3 py-1.5 border border-[#E8E6F8] text-xs text-[#6B6888] hover:text-red-500 hover:border-red-200 rounded-lg transition-colors"
                      >
                        <X size={13} /> Reject
                      </button>
                      <button
                        onClick={() => respond(req.id, 'approved')}
                        disabled={responding === req.id}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-lg transition-colors disabled:opacity-60"
                      >
                        {responding === req.id ? <LoadingSpinner size="sm" /> : <Check size={13} />}
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
