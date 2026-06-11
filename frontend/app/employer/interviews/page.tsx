'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Calendar, Plus, X } from 'lucide-react';
import { INTERVIEW_TYPES } from '@/constants';

interface Interview {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  meeting_link?: string;
  status: string;
  candidate_name: string;
  applications: { jobs: { title: string } };
}

interface ApplicationOption {
  id: string;
  candidate_id: string;
  candidate_name: string;
  jobs: { title: string };
}

const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-[#E8E6F8] bg-white text-[#0F0F1A] placeholder:text-[#6B6888] focus:outline-none focus:border-[#5046E4] focus:ring-2 focus:ring-[#5046E4]/10 text-sm transition-colors';

export default function EmployerInterviewsPage() {
  const { getToken } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [applications, setApplications] = useState<ApplicationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    application_id: '',
    candidate_id: '',
    title: '',
    date: '',
    time: '',
    type: 'online',
    meeting_link: '',
  });

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const [intRes, appRes] = await Promise.all([
          api.get<Interview[]>('/interviews/employer', token!),
          api.get<ApplicationOption[]>('/interviews/employer/applications', token!),
        ]);
        setInterviews(intRes.data || []);
        setApplications(appRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  const handleApplicationSelect = (appId: string) => {
    const app = applications.find((a) => a.id === appId);
    setForm((f) => ({
      ...f,
      application_id: appId,
      candidate_id: app?.candidate_id || '',
      title: app ? `Interview — ${app.jobs?.title}` : '',
    }));
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.application_id || !form.title || !form.date || !form.time) {
      setError('Please fill in all required fields');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const token = await getToken();
      const res = await api.post<Interview>('/interviews', form, token!);
      if (res.data) setInterviews((prev) => [res.data!, ...prev]);
      setShowForm(false);
      setForm({ application_id: '', candidate_id: '', title: '', date: '', time: '', type: 'online', meeting_link: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to schedule');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Interviews"
        description={`${interviews.length} scheduled`}
        action={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#5046E4] hover:bg-[#3D34C4] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Schedule interview
          </button>
        }
      />

      {/* Schedule form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-[#0F0F1A]">Schedule interview</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6B6888] hover:text-[#0F0F1A]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Candidate *</label>
                <select
                  value={form.application_id}
                  onChange={(e) => handleApplicationSelect(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select candidate</option>
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.candidate_name} — {app.jobs?.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Interview title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Frontend Developer — Round 1" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Date *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Time *</label>
                  <input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Format</label>
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className={inputClass}>
                  {INTERVIEW_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {form.type === 'online' && (
                <div>
                  <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">Meeting link</label>
                  <input type="url" value={form.meeting_link} onChange={(e) => setForm((f) => ({ ...f, meeting_link: e.target.value }))} placeholder="https://meet.google.com/..." className={inputClass} />
                </div>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button type="submit" disabled={saving} className="w-full py-2.5 bg-[#5046E4] hover:bg-[#3D34C4] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {saving && <LoadingSpinner size="sm" />}
                {saving ? 'Scheduling...' : 'Schedule interview'}
              </button>
            </form>
          </div>
        </div>
      )}

      {interviews.length === 0 ? (
        <EmptyState icon={Calendar} title="No interviews scheduled" description="Schedule an interview with a shortlisted candidate." />
      ) : (
        <div className="bg-white border border-[#E8E6F8] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E6F8]">
                <th className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">Candidate</th>
                <th className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">Role</th>
                <th className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">Date & time</th>
                <th className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">Format</th>
                <th className="text-left text-xs font-medium text-[#6B6888] px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6F8]">
              {interviews.map((interview) => (
                <tr key={interview.id} className="hover:bg-[#F7F7FF] transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-[#0F0F1A]">{interview.candidate_name}</td>
                  <td className="px-5 py-4 text-sm text-[#6B6888]">{interview.applications?.jobs?.title}</td>
                  <td className="px-5 py-4 text-sm text-[#0F0F1A]">
                    {new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {interview.time}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#6B6888] capitalize">{interview.type}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={interview.status as any} />
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
